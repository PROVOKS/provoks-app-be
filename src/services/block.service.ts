import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";

export const blockService = {
  async listBySilabusPart(silabusPartId: string) {
    return prisma.contentBlock.findMany({
      where: { silabusPartId },
      orderBy: { order: "asc" },
      include: { questions: { orderBy: { order: "asc" } } },
    });
  },

  async create(input: {
    silabusPartId: string;
    type: string;
    order?: number;
    content?: Record<string, unknown>;
  }) {
    const part = await prisma.silabusPart.findUnique({
      where: { id: input.silabusPartId },
    });
    if (!part) throw ApiError.notFound("Silabus part tidak ditemukan");

    return prisma.contentBlock.create({
      data: {
        silabusPartId: input.silabusPartId,
        type: input.type as never,
        order: input.order ?? 0,
        content: (input.content ?? {}) as never,
      },
    });
  },

  async update(id: string, input: Record<string, unknown>) {
    const block = await prisma.contentBlock.findUnique({ where: { id } });
    if (!block) throw ApiError.notFound("Content block tidak ditemukan");
    return prisma.contentBlock.update({
      where: { id },
      data: input as never,
    });
  },

  async remove(id: string) {
    const block = await prisma.contentBlock.findUnique({ where: { id } });
    if (!block) throw ApiError.notFound("Content block tidak ditemukan");
    await prisma.contentBlock.delete({ where: { id } });
    return { id };
  },

  async reorder(items: { id: string; order: number }[]) {
    await prisma.$transaction(
      items.map((item) =>
        prisma.contentBlock.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { updated: items.length };
  },
};
