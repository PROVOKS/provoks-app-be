import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";
import { getPagination, paginated } from "../utils/pagination";
import { slugify } from "../utils/slug";

type ListQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFastTrack?: boolean;
};

export const pathService = {
  async list(query: ListQuery) {
    const { page, perPage, skip, take } = getPagination(query);

    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.isFastTrack !== undefined
        ? { isFastTrack: query.isFastTrack }
        : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: "insensitive" as const } }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.path.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { courses: true } } },
      }),
      prisma.path.count({ where }),
    ]);

    return paginated(
      items.map(({ _count, ...path }) => ({
        ...path,
        courseCount: _count.courses,
      })),
      total,
      page,
      perPage,
    );
  },

  async getById(id: string) {
    const path = await prisma.path.findUnique({
      where: { id },
      include: {
        courses: { orderBy: { createdAt: "desc" } },
        _count: { select: { courses: true } },
      },
    });
    if (!path) throw ApiError.notFound("Path tidak ditemukan");
    const { _count, ...rest } = path;
    return { ...rest, courseCount: _count.courses };
  },

  async create(input: {
    name: string;
    slug?: string;
    description?: string;
    isFastTrack?: boolean;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  }) {
    const slug = input.slug ?? slugify(input.name);
    const exists = await prisma.path.findUnique({ where: { slug } });
    if (exists) throw ApiError.conflict("Slug path sudah dipakai");

    return prisma.path.create({ data: { ...input, slug } });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    const data = { ...input } as Record<string, unknown>;
    if (typeof input.name === "string" && !input.slug) {
      data.slug = slugify(input.name);
    }

    // slug wajib unik — beri pesan yang jelas, bukan error mentah dari Prisma
    if (typeof data.slug === "string" && data.slug.length > 0) {
      const taken = await prisma.path.findUnique({ where: { slug: data.slug } });
      if (taken && taken.id !== id) {
        throw ApiError.conflict("Slug path sudah dipakai");
      }
    }

    return prisma.path.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.path.delete({ where: { id } });
    return { id };
  },
};
