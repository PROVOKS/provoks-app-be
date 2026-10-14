import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";
import { slugify } from "../utils/slug";

export const silabusService = {
  // ---------- course_parts ----------
  async createCoursePart(input: {
    courseId: string;
    name: string;
    description?: string;
    durationMinutes?: number;
    order?: number;
  }) {
    const course = await prisma.course.findUnique({ where: { id: input.courseId } });
    if (!course) throw ApiError.notFound("Course tidak ditemukan");
    return prisma.coursePart.create({ data: input });
  },

  async updateCoursePart(id: string, input: Record<string, unknown>) {
    const part = await prisma.coursePart.findUnique({ where: { id } });
    if (!part) throw ApiError.notFound("Course part tidak ditemukan");
    return prisma.coursePart.update({ where: { id }, data: input });
  },

  async removeCoursePart(id: string) {
    const part = await prisma.coursePart.findUnique({ where: { id } });
    if (!part) throw ApiError.notFound("Course part tidak ditemukan");
    await prisma.coursePart.delete({ where: { id } });
    return { id };
  },

  // ---------- silabus_parts ----------
  async createSilabusPart(input: {
    coursePartId: string;
    title: string;
    slug?: string;
    type?: "VIDEO" | "ARTICLE" | "QUIZ";
    durationMinutes?: number;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    order?: number;
  }) {
    const part = await prisma.coursePart.findUnique({
      where: { id: input.coursePartId },
    });
    if (!part) throw ApiError.notFound("Course part tidak ditemukan");

    return prisma.silabusPart.create({
      data: { ...input, slug: input.slug ?? slugify(input.title) },
    });
  },

  async updateSilabusPart(id: string, input: Record<string, unknown>) {
    const item = await prisma.silabusPart.findUnique({ where: { id } });
    if (!item) throw ApiError.notFound("Silabus part tidak ditemukan");

    const data = { ...input } as Record<string, unknown>;
    if (typeof input.title === "string" && !input.slug) {
      data.slug = slugify(input.title);
    }
    return prisma.silabusPart.update({ where: { id }, data });
  },

  async removeSilabusPart(id: string) {
    const item = await prisma.silabusPart.findUnique({ where: { id } });
    if (!item) throw ApiError.notFound("Silabus part tidak ditemukan");
    await prisma.silabusPart.delete({ where: { id } });
    return { id };
  },

  // ---------- reorder ----------
  async reorder(items: { id: string; order: number }[]) {
    await prisma.$transaction(
      items.map((item) =>
        prisma.silabusPart.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { updated: items.length };
  },
};
