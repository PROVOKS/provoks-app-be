import { prisma } from "../../src/db/prisma";
import { Prisma } from "../../src/generated/prisma/client";
import { slugify } from "../../src/utils/slug";

export type QuizQuestionDef = {
  q: string;
  options: string[];
  answer: number;
};

export type Block =
  | { type: "HEADING"; content: { level: number; text: string } }
  | { type: "PARAGRAPH"; content: { html: string } }
  | { type: "CODE"; content: { language: string; code: string } }
  | { type: "CALLOUT"; content: { variant: string; text: string } }
  | { type: "DIVIDER"; content: Record<string, never> }
  | {
      type: "QUIZ";
      content: { title: string; timeLimitMinutes: number; maxAttempts: number };
      questions: QuizQuestionDef[];
    };

export type Lesson = {
  title: string;
  duration: number;
  type?: "ARTICLE" | "QUIZ";
  blocks: Block[];
};

export type CoursePartDef = {
  name: string;
  description: string;
  lessons: Lesson[];
};

export type CourseSeedDef = {
  slug: string;
  title: string;
  description: string;
  defaultStatus?: "DRAFT" | "PUBLISHED";
  tags: { name: string; slug: string; category: string }[];
  parts: CoursePartDef[];
};

export const h = (text: string, level = 2): Block => ({
  type: "HEADING",
  content: { level, text },
});

export const p = (html: string): Block => ({
  type: "PARAGRAPH",
  content: { html },
});

export const code = (src: string, language = "javascript"): Block => ({
  type: "CODE",
  content: { language, code: src.trim() },
});

export const htmlCode = (src: string): Block => code(src, "html");
export const cssCode = (src: string): Block => code(src, "css");
export const jsCode = (src: string): Block => code(src, "javascript");
export const bashCode = (src: string): Block => code(src, "bash");
export const jsonCode = (src: string): Block => code(src, "json");

export const callout = (
  variant: "info" | "success" | "warning" | "danger",
  text: string,
): Block => ({ type: "CALLOUT", content: { variant, text } });

export const divider = (): Block => ({ type: "DIVIDER", content: {} });

export const quiz = (
  title: string,
  questions: QuizQuestionDef[],
  settings: { timeLimitMinutes?: number; maxAttempts?: number } = {},
): Block => ({
  type: "QUIZ",
  content: {
    title,
    timeLimitMinutes: settings.timeLimitMinutes ?? 15,
    maxAttempts: settings.maxAttempts ?? 3,
  },
  questions,
});

/**
 * Sinkronisasi konten course tanpa menghapus SilabusProgress maupun QuizAttempt
 * milik siswa yang sudah berjalan.
 */
export async function upsertCourseContent(def: CourseSeedDef) {
  const tagRecords = [];
  for (const t of def.tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: { name: t.name, slug: t.slug, category: t.category },
    });
    tagRecords.push(tag);
  }

  const path =
    (await prisma.path.findUnique({ where: { slug: "web-development" } })) ??
    (await prisma.path.findFirst({ orderBy: { createdAt: "asc" } }));

  const existingCourse = await prisma.course.findUnique({
    where: { slug: def.slug },
  });

  const course = await prisma.course.upsert({
    where: { slug: def.slug },
    update: {
      title: def.title,
      description: def.description,
      pathId: path?.id ?? null,
    },
    create: {
      title: def.title,
      slug: def.slug,
      description: def.description,
      status: def.defaultStatus ?? "PUBLISHED",
      passingGrade: 70,
      isFastTrack: false,
      pathId: path?.id ?? null,
    },
  });

  // sinkronkan tag
  await prisma.courseTag.deleteMany({ where: { courseId: course.id } });
  if (tagRecords.length > 0) {
    await prisma.courseTag.createMany({
      data: tagRecords.map((t) => ({ courseId: course.id, tagId: t.id })),
    });
  }

  const existingParts = await prisma.coursePart.findMany({
    where: { courseId: course.id },
    include: {
      silabusParts: {
        include: {
          blocks: {
            include: { questions: true },
          },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  let lessonCount = 0;
  let blockCount = 0;
  let questionCount = 0;
  let codeBlockCount = 0;

  for (const [partIndex, partDef] of def.parts.entries()) {
    const durationMinutes = partDef.lessons.reduce(
      (total, l) => total + l.duration,
      0,
    );

    const matchedPart =
      existingParts.find((ep) => ep.name === partDef.name) ??
      existingParts.find((ep) => ep.order === partIndex);

    const coursePart = matchedPart
      ? await prisma.coursePart.update({
          where: { id: matchedPart.id },
          data: {
            name: partDef.name,
            description: partDef.description,
            durationMinutes,
            order: partIndex,
          },
        })
      : await prisma.coursePart.create({
          data: {
            courseId: course.id,
            name: partDef.name,
            description: partDef.description,
            durationMinutes,
            order: partIndex,
          },
        });

    const existingSilabusList = matchedPart?.silabusParts ?? [];

    for (const [lessonIndex, lesson] of partDef.lessons.entries()) {
      const lessonSlug = slugify(lesson.title);
      const matchedSilabus =
        existingSilabusList.find((es) => es.slug === lessonSlug) ??
        existingSilabusList.find((es) => es.order === lessonIndex);

      const silabus = matchedSilabus
        ? await prisma.silabusPart.update({
            where: { id: matchedSilabus.id },
            data: {
              title: lesson.title,
              slug: lessonSlug,
              type: lesson.type ?? "ARTICLE",
              durationMinutes: lesson.duration,
              status: "PUBLISHED",
              order: lessonIndex,
            },
          })
        : await prisma.silabusPart.create({
            data: {
              coursePartId: coursePart.id,
              title: lesson.title,
              slug: lessonSlug,
              type: lesson.type ?? "ARTICLE",
              durationMinutes: lesson.duration,
              status: "PUBLISHED",
              order: lessonIndex,
            },
          });

      lessonCount += 1;

      const hasQuizBlock = lesson.blocks.some((b) => b.type === "QUIZ");
      const existingQuizBlock = matchedSilabus?.blocks.find(
        (b) => b.type === "QUIZ",
      );

      // hapus blok non-QUIZ supaya bisa diisi materi baru yang lebih lengkap
      await prisma.contentBlock.deleteMany({
        where: {
          silabusPartId: silabus.id,
          type: { not: "QUIZ" },
        },
      });

      if (!hasQuizBlock) {
        // seluruh blok adalah materi biasa -> createMany sekaligus
        await prisma.contentBlock.createMany({
          data: lesson.blocks.map((block, blockIndex) => ({
            silabusPartId: silabus.id,
            type: block.type,
            order: blockIndex,
            content: block.content as Prisma.InputJsonValue,
          })),
        });
        blockCount += lesson.blocks.length;
        codeBlockCount += lesson.blocks.filter((b) => b.type === "CODE").length;
      } else {
        for (const [blockIndex, block] of lesson.blocks.entries()) {
          if (block.type === "CODE") codeBlockCount += 1;

          if (block.type === "QUIZ" && existingQuizBlock) {
            // pertahankan ID blok QUIZ & pengaturan custom yang sudah ada
            await prisma.contentBlock.update({
              where: { id: existingQuizBlock.id },
              data: { order: blockIndex },
            });
            blockCount += 1;
            questionCount += existingQuizBlock.questions.length;
          } else {
            const created = await prisma.contentBlock.create({
              data: {
                silabusPartId: silabus.id,
                type: block.type,
                order: blockIndex,
                content: block.content as Prisma.InputJsonValue,
              },
            });
            blockCount += 1;

            if (block.type === "QUIZ") {
              await prisma.quizQuestion.createMany({
                data: block.questions.map((question, qIndex) => ({
                  contentBlockId: created.id,
                  question: question.q,
                  options: question.options as Prisma.InputJsonValue,
                  answerIndex: question.answer,
                  points: 1,
                  order: qIndex,
                })),
              });
              questionCount += block.questions.length;
            }
          }
        }
      }
    }
  }

  console.log("Course     :", course.title);
  console.log("Slug       :", course.slug);
  console.log("Status     :", existingCourse?.status ?? course.status);
  console.log(
    `Ringkasan  : ${def.parts.length} part · ${lessonCount} silabus · ${blockCount} block (${codeBlockCount} code block) · ${questionCount} soal`,
  );
}
