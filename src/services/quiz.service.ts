import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";

function assertAnswerInRange(options: string[], answerIndex: number) {
  if (answerIndex < 0 || answerIndex >= options.length) {
    throw ApiError.badRequest("answerIndex di luar jangkauan opsi jawaban");
  }
}

export const quizService = {
  async listByBlock(contentBlockId: string) {
    const block = await prisma.contentBlock.findUnique({
      where: { id: contentBlockId },
    });
    if (!block) throw ApiError.notFound("Content block tidak ditemukan");

    return prisma.quizQuestion.findMany({
      where: { contentBlockId },
      orderBy: { order: "asc" },
    });
  },

  async create(input: {
    contentBlockId: string;
    question: string;
    options: string[];
    answerIndex: number;
    points?: number;
    order?: number;
  }) {
    const block = await prisma.contentBlock.findUnique({
      where: { id: input.contentBlockId },
    });
    if (!block) throw ApiError.notFound("Content block tidak ditemukan");

    assertAnswerInRange(input.options, input.answerIndex);

    return prisma.quizQuestion.create({
      data: {
        contentBlockId: input.contentBlockId,
        question: input.question,
        options: input.options as never,
        answerIndex: input.answerIndex,
        points: input.points ?? 1,
        order: input.order ?? 0,
      },
    });
  },

  async update(
    id: string,
    input: {
      question?: string;
      options?: string[];
      answerIndex?: number;
      points?: number;
      order?: number;
    },
  ) {
    const existing = await prisma.quizQuestion.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Soal tidak ditemukan");

    if (input.options && input.answerIndex !== undefined) {
      assertAnswerInRange(input.options, input.answerIndex);
    }

    return prisma.quizQuestion.update({
      where: { id },
      data: {
        ...input,
        ...(input.options ? { options: input.options as never } : {}),
      },
    });
  },

  async remove(id: string) {
    const existing = await prisma.quizQuestion.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Soal tidak ditemukan");
    await prisma.quizQuestion.delete({ where: { id } });
    return { id };
  },

  /**
   * Import soal dari JSON (mode "Import JSON" di Quiz Builder).
   * replace=true akan menghapus soal lama pada block tersebut.
   */
  async importJson(
    contentBlockId: string,
    payload: {
      questions: { q: string; options: string[]; answer: number; points?: number }[];
    },
    replace = true,
  ) {
    const block = await prisma.contentBlock.findUnique({
      where: { id: contentBlockId },
    });
    if (!block) throw ApiError.notFound("Content block tidak ditemukan");

    payload.questions.forEach((item) =>
      assertAnswerInRange(item.options, item.answer),
    );

    const rows = payload.questions.map((item, index) => ({
      contentBlockId,
      question: item.q,
      options: item.options as never,
      answerIndex: item.answer,
      points: item.points ?? 1,
      order: index,
    }));

    await prisma.$transaction(async (tx) => {
      if (replace) {
        await tx.quizQuestion.deleteMany({ where: { contentBlockId } });
      }
      await tx.quizQuestion.createMany({ data: rows });
    });

    return {
      imported: rows.length,
      replaced: replace,
    };
  },
};
