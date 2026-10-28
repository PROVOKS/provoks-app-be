import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";
import { getPagination, paginated } from "../utils/pagination";
import { slugify } from "../utils/slug";

type ListQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
};

export const tagService = {
  async list(query: ListQuery) {
    const { page, perPage, skip, take } = getPagination(query);

    const where = {
      ...(query.category ? { category: query.category } : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: "insensitive" as const } }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip,
        take,
        orderBy: { name: "asc" },
        include: { _count: { select: { courses: true } } },
      }),
      prisma.tag.count({ where }),
    ]);

    return paginated(
      items.map(({ _count, ...tag }) => ({ ...tag, courseCount: _count.courses })),
      total,
      page,
      perPage,
    );
  },

  async getById(id: string) {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: { _count: { select: { courses: true } } },
    });
    if (!tag) throw ApiError.notFound("Tag tidak ditemukan");
    const { _count, ...rest } = tag;
    return { ...rest, courseCount: _count.courses };
  },

  async create(input: { name: string; slug?: string; category?: string }) {
    const slug = input.slug ?? slugify(input.name);
    const exists = await prisma.tag.findUnique({ where: { slug } });
    if (exists) throw ApiError.conflict("Slug tag sudah dipakai");
    return prisma.tag.create({ data: { ...input, slug } });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    const data = { ...input } as Record<string, unknown>;
    if (typeof input.name === "string" && !input.slug) {
      data.slug = slugify(input.name);
    }

    // slug wajib unik — beri pesan jelas, bukan error mentah Prisma
    if (typeof data.slug === "string" && data.slug.length > 0) {
      const taken = await prisma.tag.findUnique({ where: { slug: data.slug } });
      if (taken && taken.id !== id) {
        throw ApiError.conflict("Slug tag sudah dipakai");
      }
    }

    return prisma.tag.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.tag.delete({ where: { id } });
    return { id };
  },

  async bulk(input: { ids: string[] }) {
    const result = await prisma.tag.deleteMany({
      where: { id: { in: input.ids } },
    });
    return { affected: result.count };
  },
};
