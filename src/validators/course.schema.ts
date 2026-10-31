import { z } from "zod";

const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createCourseSchema = z.object({
  title: z.string().min(3, "Judul course minimal 3 karakter"),
  slug: z.string().optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  status: statusEnum.default("DRAFT"),
  passingGrade: z.coerce.number().min(0).max(100).default(70),
  /// false = Reguler, true = Fast Track
  isFastTrack: z.coerce.boolean().default(false),
  pathId: z.string().optional(),
  /// course prasyarat; kosong/null = tidak ada prasyarat
  blockedByCourseId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

/**
 * `partial()` TIDAK menghapus `.default()`, jadi tanpa override ini setiap
 * update parsial akan menimpa status/passingGrade dengan nilai default.
 */
export const updateCourseSchema = createCourseSchema.partial().extend({
  status: statusEnum.optional(),
  passingGrade: z.coerce.number().min(0).max(100).optional(),
  isFastTrack: z.coerce.boolean().optional(),
});

export const listCourseQuerySchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  search: z.string().optional(),
  status: statusEnum.optional(),
  pathId: z.string().optional(),
  tagId: z.string().optional(),
});
