import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";

type SilabusItem = {
  id: string;
  coursePartId: string;
  title: string;
  slug: string;
  type: string;
  durationMinutes: number;
  order: number;
  blocks: {
    id: string;
    type: string;
    order: number;
    content: unknown;
    questions: {
      id: string;
      question: string;
      options: unknown;
      points: number;
      order: number;
      answerIndex: number;
    }[];
  }[];
};

/**
 * Aturan akses siswa:
 * 1. Silabus part tanpa blok konten → terkunci (materi belum tersedia)
 * 2. Silabus part terbuka hanya jika semua silabus part sebelumnya selesai
 *    (urutan flatten: course part → silabus part)
 */
function withLockState(
  items: SilabusItem[],
  progress: Map<string, boolean>,
  quizPassed: Map<string, boolean>,
) {
  let allPrevCompleted = true;

  return items.map((item) => {
    const hasContent = item.blocks.length > 0;
    const completed = progress.get(item.id) ?? false;
    const unlocked = hasContent && allPrevCompleted;
    const hasQuiz = item.blocks.some((block) => block.type === "QUIZ");

    const result = {
      ...item,
      hasContent,
      hasQuiz,
      completed,
      quizPassed: hasQuiz ? (quizPassed.get(item.id) ?? false) : false,
      unlocked,
      lockedReason: !hasContent
        ? "Materi belum tersedia"
        : !unlocked
          ? "Selesaikan materi sebelumnya dulu"
          : null,
    };

    allPrevCompleted = allPrevCompleted && completed;
    return result;
  });
}

function stripQuizAnswers<T extends { questions: { answerIndex: number }[] }>(
  block: T,
) {
  if (block.questions.length === 0) return block;
  return {
    ...block,
    questions: block.questions.map(
      ({ answerIndex: _answerIndex, ...question }) => question,
    ),
  };
}

export const learningService = {
  /** Detail course untuk siswa + status kunci & progres */
  async getCourse(slug: string, userId: string) {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        path: true,
        tags: { include: { tag: true } },
        parts: {
          orderBy: { order: "asc" },
          include: {
            silabusParts: {
              orderBy: { order: "asc" },
              include: {
                blocks: {
                  orderBy: { order: "asc" },
                  include: { questions: { orderBy: { order: "asc" } } },
                },
              },
            },
          },
        },
      },
    });

    if (!course || course.status !== "PUBLISHED") {
      throw ApiError.notFound("Course tidak ditemukan");
    }

    // course yang terikat path hanya bisa diakses siswa yang sudah APPROVED di path tsb
    if (course.pathId) {
      const pathEnrollment = await prisma.pathEnrollment.findUnique({
        where: { userId_pathId: { userId, pathId: course.pathId } },
      });
      if (!pathEnrollment || pathEnrollment.status !== "APPROVED") {
        throw ApiError.forbidden(
          "Kamu belum terdaftar di path course ini. Masukkan kode akses dari admin.",
        );
      }
    }

    // prasyarat: course hanya terbuka setelah course "blocked by" selesai 100%
    if (course.blockedByCourseId) {
      const prerequisite = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId: course.blockedByCourseId },
        },
        select: { progressPercent: true },
      });
      if (!prerequisite || prerequisite.progressPercent < 100) {
        throw ApiError.forbidden(
          "Course ini terkunci. Selesaikan course prasyaratnya dulu.",
        );
      }
    }

    // auto-enroll
    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId: course.id } },
      update: {},
      create: { userId, courseId: course.id },
    });

    const silabusIds = course.parts.flatMap((part) =>
      part.silabusParts.map((item) => item.id),
    );

    const [progressRows, attempts] = await Promise.all([
      prisma.silabusProgress.findMany({
        where: { userId, silabusPartId: { in: silabusIds } },
      }),
      prisma.quizAttempt.findMany({
        where: { userId, contentBlockId: { in: course.parts.flatMap((p) => p.silabusParts.flatMap((s) => s.blocks.filter((b) => b.type === "QUIZ").map((b) => b.id))) } },
        orderBy: { submittedAt: "desc" },
      }),
    ]);

    const progress = new Map(progressRows.map((row) => [row.silabusPartId, row.completed]));

    const quizPassed = new Map<string, boolean>();
    const attemptByBlock = new Map<string, { id: string; score: number; passed: boolean; submittedAt: Date }>();
    for (const attempt of attempts) {
      if (!attemptByBlock.has(attempt.contentBlockId)) {
        attemptByBlock.set(attempt.contentBlockId, {
          id: attempt.id,
          score: attempt.score,
          passed: attempt.passed,
          submittedAt: attempt.submittedAt,
        });
      }
    }

    // hitung status lulus quiz per silabus part
    for (const part of course.parts) {
      for (const item of part.silabusParts) {
        const quizBlock = item.blocks.find((block) => block.type === "QUIZ");
        if (quizBlock) {
          quizPassed.set(
            item.id,
            attemptByBlock.get(quizBlock.id)?.passed ?? false,
          );
        }
      }
    }

    // gating dihitung lintas part (urutan flatten: course part → silabus part)
    const flatItems = course.parts.flatMap(
      (part) => part.silabusParts as unknown as SilabusItem[],
    );
    const lockMap = new Map(
      withLockState(flatItems, progress, quizPassed).map((item) => [
        item.id,
        item,
      ]),
    );

    const parts = course.parts.map((part) => ({
      ...part,
      silabusParts: part.silabusParts.map((raw) => {
        const item = lockMap.get(raw.id)!;
        return {
          ...item,
          blocks: item.blocks.map((block) => ({
            ...stripQuizAnswers(block),
            attempt: attemptByBlock.get(block.id) ?? null,
          })),
        };
      }),
    }));

    const flat = parts.flatMap((part) => part.silabusParts);
    const total = flat.filter((item) => item.hasContent).length;
    const done = flat.filter((item) => item.completed).length;
    const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    if (progressPercent !== enrollment.progressPercent) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { progressPercent },
      });
    }

    const { tags, ...rest } = course;

    return {
      course: {
        ...rest,
        parts,
        tags: tags.map((item) => item.tag),
      },
      enrollment: { ...enrollment, progressPercent },
      summary: { total, done, progressPercent },
    };
  },

  /** Toggle selesai untuk satu silabus part (dengan validasi gating) */
  async updateProgress(
    userId: string,
    silabusPartId: string,
    completed: boolean,
  ) {
    const item = await prisma.silabusPart.findUnique({
      where: { id: silabusPartId },
      include: {
        coursePart: true,
        blocks: { orderBy: { order: "asc" } },
      },
    });
    if (!item) throw ApiError.notFound("Silabus part tidak ditemukan");

    const courseId = item.coursePart.courseId;

    // course dengan prasyarat hanya bisa dipelajari setelah prasyarat selesai
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { blockedByCourseId: true },
    });
    if (course?.blockedByCourseId) {
      const prerequisite = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId: course.blockedByCourseId },
        },
        select: { progressPercent: true },
      });
      if (!prerequisite || prerequisite.progressPercent < 100) {
        throw ApiError.forbidden(
          "Course ini terkunci. Selesaikan course prasyaratnya dulu.",
        );
      }
    }

    if (completed) {
      const flat = await this.flattenItems(courseId);
      const index = flat.findIndex((entry) => entry.id === silabusPartId);

      if (index < 0) throw ApiError.notFound("Silabus part tidak ditemukan");
      if (flat[index].blocks.length === 0) {
        throw ApiError.badRequest("Materi belum tersedia");
      }

      const previous = flat.slice(0, index);
      const progressRows = await prisma.silabusProgress.findMany({
        where: { userId, silabusPartId: { in: previous.map((entry) => entry.id) } },
      });
      const progressMap = new Map(
        progressRows.map((row) => [row.silabusPartId, row.completed]),
      );

      const blocked = previous.find(
        (entry) => entry.blocks.length > 0 && !progressMap.get(entry.id),
      );
      if (blocked) {
        throw ApiError.badRequest(
          `Selesaikan "${blocked.title}" terlebih dahulu`,
        );
      }

      // kalau punya quiz, wajib lulus dulu
      const quizBlock = flat[index].blocks.find((block) => block.type === "QUIZ");
      if (quizBlock) {
        const attempt = await prisma.quizAttempt.findFirst({
          where: { userId, contentBlockId: quizBlock.id, passed: true },
        });
        if (!attempt) {
          throw ApiError.badRequest("Selesaikan kuis terlebih dahulu");
        }
      }
    }

    await prisma.silabusProgress.upsert({
      where: { userId_silabusPartId: { userId, silabusPartId } },
      update: { completed, completedAt: completed ? new Date() : null },
      create: {
        userId,
        silabusPartId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    await this.recalculateEnrollment(userId, courseId);

    return { silabusPartId, completed };
  },

  async flattenItems(courseId: string) {
    const parts = await prisma.coursePart.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      include: {
        silabusParts: {
          orderBy: { order: "asc" },
          include: { blocks: { orderBy: { order: "asc" } } },
        },
      },
    });

    return parts.flatMap((part) =>
      part.silabusParts.map((item) => ({
        id: item.id,
        title: item.title,
        coursePartId: part.id,
        blocks: item.blocks,
      })),
    );
  },

  async recalculateEnrollment(userId: string, courseId: string) {
    const flat = await this.flattenItems(courseId);
    const withContent = flat.filter((item) => item.blocks.length > 0);
    const progressRows = await prisma.silabusProgress.findMany({
      where: { userId, silabusPartId: { in: withContent.map((item) => item.id) } },
    });
    const done = progressRows.filter((row) => row.completed).length;
    const progressPercent =
      withContent.length > 0 ? Math.round((done / withContent.length) * 100) : 0;

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { progressPercent },
      create: { userId, courseId, progressPercent },
    });

    return progressPercent;
  },

  /**
   * Daftar course yang bisa diakses siswa: semua course pada path yang sudah
   * di-join (APPROVED) + course tanpa path. Course muncul walau belum dibuka.
   */
  async myCourses(userId: string) {
    const courses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { pathId: null },
          {
            path: {
              pathEnrollments: { some: { userId, status: "APPROVED" } },
            },
          },
        ],
      },
      orderBy: [{ pathId: "asc" }, { createdAt: "asc" }],
      include: {
        path: true,
        tags: { include: { tag: true } },
        parts: { include: { silabusParts: true } },
        blockedBy: { select: { id: true, title: true, slug: true } },
        enrollments: {
          where: { userId },
          select: { progressPercent: true, enrolledAt: true },
        },
      },
    });

    // progres course prasyarat (untuk menentukan locked)
    const prerequisiteIds = courses
      .map((course) => course.blockedBy?.id)
      .filter((id): id is string => Boolean(id));

    const prerequisiteProgress = prerequisiteIds.length
      ? await prisma.enrollment.findMany({
          where: { userId, courseId: { in: prerequisiteIds } },
          select: { courseId: true, progressPercent: true },
        })
      : [];
    const progressByCourse = new Map(
      prerequisiteProgress.map((row) => [row.courseId, row.progressPercent]),
    );

    return courses.map((course) => {
      const silabusCount = course.parts.reduce(
        (total, part) => total + part.silabusParts.length,
        0,
      );
      const minutes = course.parts.reduce(
        (total, part) =>
          total +
          part.silabusParts.reduce((sum, item) => sum + item.durationMinutes, 0),
        0,
      );

      const enrollment = course.enrollments[0];
      const prerequisiteProgressPercent = course.blockedBy
        ? (progressByCourse.get(course.blockedBy.id) ?? 0)
        : null;

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        thumbnailUrl: course.thumbnailUrl,
        status: course.status,
        path: course.path,
        tags: course.tags.map((item) => item.tag),
        progressPercent: enrollment?.progressPercent ?? 0,
        silabusCount,
        durationMinutes: minutes,
        enrolledAt: enrollment?.enrolledAt ?? null,
        locked:
          course.blockedBy !== null &&
          (prerequisiteProgressPercent ?? 0) < 100,
        blockedBy: course.blockedBy
          ? {
              id: course.blockedBy.id,
              title: course.blockedBy.title,
              slug: course.blockedBy.slug,
              progressPercent: prerequisiteProgressPercent ?? 0,
            }
          : null,
      };
    });
  },

  /** Soal kuis untuk siswa (tanpa kunci jawaban) */
  async getQuiz(blockId: string, userId: string) {
    const block = await prisma.contentBlock.findUnique({
      where: { id: blockId },
      include: {
        questions: { orderBy: { order: "asc" } },
        silabusPart: { include: { coursePart: true } },
      },
    });

    if (!block || block.type !== "QUIZ") {
      throw ApiError.notFound("Kuis tidak ditemukan");
    }

    const flat = await this.flattenItems(block.silabusPart.coursePart.courseId);
    const index = flat.findIndex((item) => item.id === block.silabusPartId);
    const progressRows = await prisma.silabusProgress.findMany({
      where: {
        userId,
        silabusPartId: { in: flat.slice(0, Math.max(index, 0)).map((item) => item.id) },
      },
    });
    const progressMap = new Map(
      progressRows.map((row) => [row.silabusPartId, row.completed]),
    );
    const blocked = flat
      .slice(0, Math.max(index, 0))
      .find((item) => item.blocks.length > 0 && !progressMap.get(item.id));

    if (blocked) {
      throw ApiError.badRequest(`Selesaikan "${blocked.title}" terlebih dahulu`);
    }

    const [attempt, course] = await Promise.all([
      prisma.quizAttempt.findFirst({
        where: { userId, contentBlockId: blockId },
        orderBy: { submittedAt: "desc" },
      }),
      prisma.course.findUnique({
        where: { id: block.silabusPart.coursePart.courseId },
        select: { passingGrade: true },
      }),
    ]);

    return {
      id: block.id,
      silabusPartId: block.silabusPartId,
      title: (block.content as { title?: string } | null)?.title ?? "Kuis",
      passingGrade: course?.passingGrade ?? 70,
      questions: block.questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
        points: question.points,
        order: question.order,
      })),
      lastAttempt: attempt
        ? { id: attempt.id, score: attempt.score, passed: attempt.passed }
        : null,
    };
  },

  /** Nilai jawaban kuis, simpan attempt, auto-selesaikan silabus part */
  async submitQuiz(
    blockId: string,
    userId: string,
    answers: Record<string, number>,
  ) {
    const block = await prisma.contentBlock.findUnique({
      where: { id: blockId },
      include: {
        questions: { orderBy: { order: "asc" } },
        silabusPart: { include: { coursePart: true } },
      },
    });
    if (!block || block.type !== "QUIZ") {
      throw ApiError.notFound("Kuis tidak ditemukan");
    }
    if (block.questions.length === 0) {
      throw ApiError.badRequest("Kuis belum punya soal");
    }

    const courseId = block.silabusPart.coursePart.courseId;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { passingGrade: true },
    });

    let earned = 0;
    let totalPoints = 0;
    const review = block.questions.map((question) => {
      totalPoints += question.points;
      const chosen = answers[question.id];
      const correct = chosen === question.answerIndex;
      if (correct) earned += question.points;
      return {
        questionId: question.id,
        question: question.question,
        options: question.options,
        answerIndex: question.answerIndex,
        chosenIndex: chosen ?? null,
        correct,
        points: question.points,
      };
    });

    const score =
      totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0;
    const passingGrade = course?.passingGrade ?? 70;
    const passed = score >= passingGrade;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        contentBlockId: blockId,
        answers: answers as never,
        score,
        totalPoints,
        passed,
      },
    });

    if (passed) {
      await prisma.silabusProgress.upsert({
        where: {
          userId_silabusPartId: {
            userId,
            silabusPartId: block.silabusPartId,
          },
        },
        update: { completed: true, completedAt: new Date() },
        create: {
          userId,
          silabusPartId: block.silabusPartId,
          completed: true,
          completedAt: new Date(),
        },
      });
      await this.recalculateEnrollment(userId, courseId);
    }

    return {
      attemptId: attempt.id,
      score,
      passed,
      passingGrade,
      totalPoints,
      earned,
      review,
    };
  },

  /** Hasil attempt (kunci jawaban boleh dibuka setelah submit) */
  async getAttempt(attemptId: string, userId: string) {
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        contentBlock: {
          include: {
            questions: { orderBy: { order: "asc" } },
            silabusPart: { include: { coursePart: true } },
          },
        },
      },
    });

    if (!attempt || attempt.userId !== userId) {
      throw ApiError.notFound("Hasil kuis tidak ditemukan");
    }

    const courseId = attempt.contentBlock.silabusPart.coursePart.courseId;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { passingGrade: true, title: true },
    });

    const answers = (attempt.answers ?? {}) as Record<string, number>;
    const review = attempt.contentBlock.questions.map((question) => ({
      questionId: question.id,
      question: question.question,
      options: question.options,
      answerIndex: question.answerIndex,
      chosenIndex: answers[question.id] ?? null,
      correct: answers[question.id] === question.answerIndex,
      points: question.points,
    }));

    return {
      attemptId: attempt.id,
      score: attempt.score,
      passed: attempt.passed,
      passingGrade: course?.passingGrade ?? 70,
      courseTitle: course?.title ?? "",
      quizTitle:
        (attempt.contentBlock.content as { title?: string } | null)?.title ??
        "Kuis",
      silabusPartId: attempt.contentBlock.silabusPartId,
      submittedAt: attempt.submittedAt,
      review,
    };
  },

  /** Daftar path + status keanggotaan siswa (untuk katalog & pengajuan) */
  async myPaths(userId: string) {
    const paths = await prisma.path.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { courses: { where: { status: "PUBLISHED" } } } },
        pathEnrollments: { where: { userId } },
      },
    });

    return paths.map((path) => {
      const enrollment = path.pathEnrollments[0];
      const approved = enrollment?.status === "APPROVED";
      return {
        id: path.id,
        name: path.name,
        slug: path.slug,
        description: path.description,
        isFastTrack: path.isFastTrack,
        courseCount: path._count.courses,
        status: enrollment?.status ?? null,
        joined: approved,
        enrollmentId: enrollment?.id ?? null,
      };
    });
  },
};
