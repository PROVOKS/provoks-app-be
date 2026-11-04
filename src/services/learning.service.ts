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

const QUIZ_SUBMIT_GRACE_SECONDS = 15;

type QuizSettings = {
  title: string;
  /** null = tanpa batas waktu */
  timeLimitMinutes: number | null;
  /** null = tanpa batas percobaan */
  maxAttempts: number | null;
};

/** Baca pengaturan kuis dari `ContentBlock.content` (JSON). */
function quizSettings(content: unknown): QuizSettings {
  const raw = (content ?? {}) as Record<string, unknown>;
  const positive = (value: unknown) => {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? Math.floor(num) : null;
  };

  return {
    title:
      typeof raw.title === "string" && raw.title.trim()
        ? raw.title.trim()
        : "Kuis",
    timeLimitMinutes: positive(raw.timeLimitMinutes),
    maxAttempts: positive(raw.maxAttempts),
  };
}

/** Batas waktu sebuah percobaan (null kalau tanpa batas). */
function attemptDeadline(startedAt: Date, timeLimitMinutes: number | null) {
  if (!timeLimitMinutes) return null;
  return new Date(startedAt.getTime() + timeLimitMinutes * 60_000);
}

/**
 * Tandai percobaan yang sudah lewat batas waktu sebagai EXPIRED.
 * Dipanggil saat membuka/memulai kuis supaya hitungan percobaan akurat.
 */
async function expireStaleAttempts(
  userId: string,
  blockId: string,
  timeLimitMinutes: number | null,
) {
  if (!timeLimitMinutes) return;

  const cutoff = new Date(
    Date.now() - (timeLimitMinutes * 60 + QUIZ_SUBMIT_GRACE_SECONDS) * 1000,
  );

  await prisma.quizAttempt.updateMany({
    where: {
      userId,
      contentBlockId: blockId,
      status: "IN_PROGRESS",
      startedAt: { lt: cutoff },
    },
    data: { status: "EXPIRED", timedOut: true, submittedAt: new Date() },
  });
}

function mapAttemptSummary(attempt: {
  id: string;
  attemptNumber: number;
  status: "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";
  score: number | null;
  passed: boolean;
  startedAt: Date;
  submittedAt: Date | null;
  durationSeconds: number | null;
  timedOut: boolean;
}) {
  return {
    id: attempt.id,
    attemptNumber: attempt.attemptNumber,
    status: attempt.status,
    score: attempt.score,
    passed: attempt.passed,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    durationSeconds: attempt.durationSeconds,
    timedOut: attempt.timedOut,
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
        where: {
          userId,
          contentBlockId: {
            in: course.parts.flatMap((p) =>
              p.silabusParts.flatMap((s) =>
                s.blocks.filter((b) => b.type === "QUIZ").map((b) => b.id),
              ),
            ),
          },
          status: { in: ["SUBMITTED", "EXPIRED"] },
        },
        orderBy: { submittedAt: "desc" },
      }),
    ]);

    const progress = new Map(progressRows.map((row) => [row.silabusPartId, row.completed]));

    const quizPassed = new Map<string, boolean>();
    const attemptByBlock = new Map<
      string,
      {
        id: string;
        score: number;
        passed: boolean;
        attemptNumber: number;
        submittedAt: Date | null;
      }
    >();
    for (const attempt of attempts) {
      if (!attemptByBlock.has(attempt.contentBlockId)) {
        attemptByBlock.set(attempt.contentBlockId, {
          id: attempt.id,
          score: attempt.score ?? 0,
          passed: attempt.passed,
          attemptNumber: attempt.attemptNumber,
          submittedAt: attempt.submittedAt,
        });
      }
    }

    const attemptsUsedByBlock = new Map<string, number>();
    for (const attempt of attempts) {
      attemptsUsedByBlock.set(
        attempt.contentBlockId,
        (attemptsUsedByBlock.get(attempt.contentBlockId) ?? 0) + 1,
      );
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
          blocks: item.blocks.map((block) => {
            const quizMeta =
              block.type === "QUIZ"
                ? (() => {
                    const settings = quizSettings(block.content);
                    const used = attemptsUsedByBlock.get(block.id) ?? 0;
                    const left =
                      settings.maxAttempts === null
                        ? null
                        : Math.max(0, settings.maxAttempts - used);
                    return {
                      attemptsUsed: used,
                      maxAttempts: settings.maxAttempts,
                      attemptsLeft: left,
                      timeLimitMinutes: settings.timeLimitMinutes,
                      canAttempt: left === null || left > 0,
                    };
                  })()
                : null;

            return {
              ...stripQuizAnswers(block),
              attempt: attemptByBlock.get(block.id) ?? null,
              quizMeta,
            };
          }),
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

  /** Soal kuis untuk siswa (tanpa kunci jawaban) + status percobaan */
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

    const settings = quizSettings(block.content);

    const flat = await this.flattenItems(block.silabusPart.coursePart.courseId);
    const index = flat.findIndex((item) => item.id === block.silabusPartId);
    const progressRows = await prisma.silabusProgress.findMany({
      where: {
        userId,
        silabusPartId: {
          in: flat.slice(0, Math.max(index, 0)).map((item) => item.id),
        },
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

    // percobaan yang telanjur lewat batas waktu ditutup dulu
    await expireStaleAttempts(userId, blockId, settings.timeLimitMinutes);

    const [attempts, course] = await Promise.all([
      prisma.quizAttempt.findMany({
        where: { userId, contentBlockId: blockId },
        orderBy: { attemptNumber: "desc" },
      }),
      prisma.course.findUnique({
        where: { id: block.silabusPart.coursePart.courseId },
        select: { passingGrade: true },
      }),
    ]);

    const active =
      attempts.find((item) => item.status === "IN_PROGRESS") ?? null;
    const attemptsUsed = attempts.filter(
      (item) => item.status !== "IN_PROGRESS",
    ).length;
    const attemptsLeft =
      settings.maxAttempts === null
        ? null
        : Math.max(0, settings.maxAttempts - attemptsUsed);
    const canAttempt =
      Boolean(active) || attemptsLeft === null || attemptsLeft > 0;
    const lastSubmitted = attempts.find(
      (item) => item.status !== "IN_PROGRESS",
    );

    return {
      id: block.id,
      silabusPartId: block.silabusPartId,
      title: settings.title,
      passingGrade: course?.passingGrade ?? 70,
      timeLimitMinutes: settings.timeLimitMinutes,
      maxAttempts: settings.maxAttempts,
      attemptsUsed,
      attemptsLeft,
      canAttempt,
      activeAttempt: active
        ? {
            id: active.id,
            attemptNumber: active.attemptNumber,
            startedAt: active.startedAt,
            expiresAt: attemptDeadline(
              active.startedAt,
              settings.timeLimitMinutes,
            ),
          }
        : null,
      attempts: attempts.map(mapAttemptSummary),
      questions: block.questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
        points: question.points,
        order: question.order,
      })),
      lastAttempt: lastSubmitted
        ? {
            id: lastSubmitted.id,
            score: lastSubmitted.score,
            passed: lastSubmitted.passed,
            attemptNumber: lastSubmitted.attemptNumber,
          }
        : null,
    };
  },

  /** Mulai percobaan baru, atau lanjutkan percobaan yang masih berjalan */
  async startQuiz(blockId: string, userId: string) {
    const quiz = await this.getQuiz(blockId, userId);

    if (quiz.questions.length === 0) {
      throw ApiError.badRequest("Kuis belum punya soal");
    }

    if (quiz.activeAttempt) {
      return {
        resumed: true,
        attemptId: quiz.activeAttempt.id,
        attemptNumber: quiz.activeAttempt.attemptNumber,
        startedAt: quiz.activeAttempt.startedAt,
        expiresAt: quiz.activeAttempt.expiresAt,
        timeLimitMinutes: quiz.timeLimitMinutes,
        maxAttempts: quiz.maxAttempts,
        attemptsUsed: quiz.attemptsUsed,
        attemptsLeft: quiz.attemptsLeft,
      };
    }

    if (!quiz.canAttempt) {
      throw ApiError.forbidden(
        `Kesempatan mengerjakan sudah habis (${quiz.attemptsUsed}/${quiz.maxAttempts})`,
      );
    }

    const last = await prisma.quizAttempt.findFirst({
      where: { userId, contentBlockId: blockId },
      orderBy: { attemptNumber: "desc" },
      select: { attemptNumber: true },
    });

    const created = await prisma.quizAttempt.create({
      data: {
        userId,
        contentBlockId: blockId,
        attemptNumber: (last?.attemptNumber ?? 0) + 1,
        status: "IN_PROGRESS",
        answers: {},
      },
    });

    return {
      resumed: false,
      attemptId: created.id,
      attemptNumber: created.attemptNumber,
      startedAt: created.startedAt,
      expiresAt: attemptDeadline(created.startedAt, quiz.timeLimitMinutes),
      timeLimitMinutes: quiz.timeLimitMinutes,
      maxAttempts: quiz.maxAttempts,
      attemptsUsed: quiz.attemptsUsed,
      attemptsLeft: quiz.attemptsLeft,
    };
  },

  /** Nilai jawaban kuis pada percobaan yang sedang berjalan */
  async submitQuiz(
    blockId: string,
    userId: string,
    attemptId: string,
    answers: Record<string, number>,
  ) {
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

    if (
      !attempt ||
      attempt.userId !== userId ||
      attempt.contentBlockId !== blockId ||
      attempt.contentBlock.type !== "QUIZ"
    ) {
      throw ApiError.notFound("Percobaan kuis tidak ditemukan");
    }

    if (attempt.status !== "IN_PROGRESS") {
      throw ApiError.badRequest("Percobaan ini sudah dikumpulkan");
    }

    const block = attempt.contentBlock;
    if (block.questions.length === 0) {
      throw ApiError.badRequest("Kuis belum punya soal");
    }

    const settings = quizSettings(block.content);
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

    const submittedAt = new Date();
    const durationSeconds = Math.max(
      0,
      Math.round((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000),
    );
    const timedOut =
      settings.timeLimitMinutes !== null &&
      durationSeconds >
        settings.timeLimitMinutes * 60 + QUIZ_SUBMIT_GRACE_SECONDS;

    const updated = await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        answers: answers as never,
        score,
        totalPoints,
        passed,
        submittedAt,
        durationSeconds,
        timedOut,
        status: timedOut ? "EXPIRED" : "SUBMITTED",
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
      attemptId: updated.id,
      attemptNumber: updated.attemptNumber,
      score,
      passed,
      passingGrade,
      totalPoints,
      earned,
      durationSeconds,
      timedOut,
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
      attemptNumber: attempt.attemptNumber,
      status: attempt.status,
      score: attempt.score ?? 0,
      passed: attempt.passed,
      passingGrade: course?.passingGrade ?? 70,
      courseTitle: course?.title ?? "",
      quizTitle:
        (attempt.contentBlock.content as { title?: string } | null)?.title ??
        "Kuis",
      silabusPartId: attempt.contentBlock.silabusPartId,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      durationSeconds: attempt.durationSeconds,
      timedOut: attempt.timedOut,
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
        courseCount: path._count.courses,
        status: enrollment?.status ?? null,
        joined: approved,
        enrollmentId: enrollment?.id ?? null,
      };
    });
  },
};
