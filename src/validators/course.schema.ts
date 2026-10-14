import { z } from "zod";

const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createCourseSchema = z.object({
  title: z.string().min(3, "Judul course minimal 3 karakter"),
  slug: z.string().optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  status: statusEnum.default("DRAFT"),
  passingGrade: z.coerce.number().min(0).max(100).default(70),
  pathId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const listCourseQuerySchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  search: z.string().optional(),
  status: statusEnum.optional(),
  pathId: z.string().optional(),
  tagId: z.string().optional(),
});
