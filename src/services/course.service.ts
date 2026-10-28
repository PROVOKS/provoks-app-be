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

type PrereqRow = {
  id: string;
  pathId: string | null;
  blockedByCourseId: string | null;
};

/**
 * Validasi "blocked by": bukan diri sendiri, ada, satu path, dan tanpa siklus.
 */
async function assertValidPrerequisite(
  courseId: string | null,
  blockedById: string | null,
  pathId: string | null,
) {
  if (!blockedById) return;
  if (courseId && blockedById === courseId) {
    throw ApiError.badRequest(
      "Course tidak bisa menjadi prasyarat dirinya sendiri",
    );
  }

  const prerequisite: PrereqRow | null = await prisma.course.findUnique({
    where: { id: blockedById },
    select: { id: true, pathId: true, blockedByCourseId: true },
  });
  if (!prerequisite) throw ApiError.notFound("Course prasyarat tidak ditemukan");

  if ((prerequisite.pathId ?? null) !== (pathId ?? null)) {
    throw ApiError.badRequest("Prasyarat harus course dari path yang sama");
  }

  let cursor: PrereqRow | null = prerequisite;
  const seen = new Set<string>();
  while (cursor?.blockedByCourseId) {
    if (courseId && cursor.blockedByCourseId === courseId) {
      throw ApiError.badRequest("Prasyarat membentuk siklus");
    }
    if (seen.has(cursor.blockedByCourseId)) break;
    seen.add(cursor.blockedByCourseId);
    cursor = await prisma.course.findUnique({
      where: { id: cursor.blockedByCourseId },
      select: { id: true, pathId: true, blockedByCourseId: true },
    });
  }
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
    blockedByCourseId?: string | null;
    tagIds?: string[];
  }) {
    const { tagIds, ...data } = input;
    const slug = input.slug ?? slugify(input.title);
    const exists = await prisma.course.findUnique({ where: { slug } });
    if (exists) throw ApiError.conflict("Slug course sudah dipakai");

    if (input.blockedByCourseId) {
      await assertValidPrerequisite(
        null,
        input.blockedByCourseId,
        input.pathId ?? null,
      );
    }

    const course = await prisma.course.create({
      data: {
        ...data,
        blockedByCourseId: input.blockedByCourseId || null,
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

    if ("blockedByCourseId" in input) {
      const blockedById = (input.blockedByCourseId as string | null) || null;
      const current = await prisma.course.findUnique({
        where: { id },
        select: { pathId: true },
      });
      const nextPathId =
        "pathId" in input
          ? ((input.pathId as string | null) || null)
          : (current?.pathId ?? null);

      await assertValidPrerequisite(id, blockedById, nextPathId);
      data.blockedByCourseId = blockedById;
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
