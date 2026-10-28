import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";
import { getPagination, paginated } from "../utils/pagination";
import { slugify } from "../utils/slug";

type ListQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  pathId?: string;
  tagId?: string;
};

const detailInclude = {
  path: true,
  tags: { include: { tag: true } },
  parts: {
    orderBy: { order: "asc" as const },
    include: {
      silabusParts: {
        orderBy: { order: "asc" as const },
        include: {
          blocks: {
            orderBy: { order: "asc" as const },
            include: { questions: { orderBy: { order: "asc" as const } } },
          },
        },
      },
    },
  },
  _count: { select: { enrollments: true } },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function shapeCourse(course: any) {
  const { tags, _count, ...rest } = course;
  return {
    ...rest,
    tags: (tags ?? []).map((item: { tag: unknown }) => item.tag),
    studentCount: _count?.enrollments ?? 0,
  };
}

export const courseService = {  async list(query: ListQuery) {
    const { page, perPage, skip, take } = getPagination(query);

    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.pathId ? { pathId: query.pathId } : {}),
      ...(query.tagId ? { tags: { some: { tagId: query.tagId } } } : {}),
      ...(query.search
        ? { title: { contains: query.search, mode: "insensitive" as const } }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          path: true,
          tags: { include: { tag: true } },
          _count: { select: { enrollments: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return paginated(
      items.map(({ tags, _count, ...course }) => ({
        ...course,
        tags: tags.map((t) => t.tag),
        studentCount: _count.enrollments,
      })),
      total,
      page,
      perPage,
    );
  },

  async getById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: detailInclude,
    });
    if (!course) throw ApiError.notFound("Course tidak ditemukan");
    return shapeCourse(course);
  },

  async getBySlug(slug: string) {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: detailInclude,
    });
    if (!course) throw ApiError.notFound("Course tidak ditemukan");
    return shapeCourse(course);
  },

  async create(input: {
    title: string;
    slug?: string;
    description?: string;
    thumbnailUrl?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    passingGrade?: number;
    pathId?: string;
    tagIds?: string[];
  }) {
    const { tagIds, ...data } = input;
    const slug = input.slug ?? slugify(input.title);
    const exists = await prisma.course.findUnique({ where: { slug } });
    if (exists) throw ApiError.conflict("Slug course sudah dipakai");

    const course = await prisma.course.create({
      data: {
        ...data,
        slug,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: detailInclude,
    });

    const { tags, _count, ...rest } = course;
    return { ...rest, tags: tags.map((t) => t.tag), studentCount: _count.enrollments };
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);

    const { tagIds, ...data } = input as {
      tagIds?: string[];
    } & Record<string, unknown>;

    if (typeof input.title === "string" && !input.slug) {
      data.slug = slugify(input.title);
    }

    if (tagIds) {
      await prisma.courseTag.deleteMany({ where: { courseId: id } });
      if (tagIds.length) {
        await prisma.courseTag.createMany({
          data: tagIds.map((tagId) => ({ courseId: id, tagId })),
        });
      }
    }

    return prisma.course.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.course.delete({ where: { id } });
    return { id };
  },

  async bulk(input: {
    action: "delete" | "status";
    ids: string[];
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  }) {
    if (input.action === "delete") {
      const result = await prisma.course.deleteMany({
        where: { id: { in: input.ids } },
      });
      return { affected: result.count };
    }

    if (!input.status) throw ApiError.badRequest("Status wajib diisi");
    const result = await prisma.course.updateMany({
      where: { id: { in: input.ids } },
      data: { status: input.status },
    });
    return { affected: result.count };
  },
};
