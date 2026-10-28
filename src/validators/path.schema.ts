import { z } from "zod";

const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createPathSchema = z.object({
  name: z.string().min(2, "Nama path minimal 2 karakter"),
  slug: z.string().optional(),
  description: z.string().optional(),
  /// false = Reguler, true = Fast Track
  isFastTrack: z.coerce.boolean().default(false),
  status: statusEnum.default("DRAFT"),
});

/**
 * `partial()` TIDAK menghapus `.default()`. Tanpa override ini, update parsial
 * (mis. hanya ganti nama) akan menimpa `isFastTrack` jadi false dan `status`
 * jadi DRAFT.
 */
export const updatePathSchema = createPathSchema.partial().extend({
  isFastTrack: z.coerce.boolean().optional(),
  status: statusEnum.optional(),
});

export const listPathQuerySchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  search: z.string().optional(),
  status: statusEnum.optional(),
  isFastTrack: z.coerce.boolean().optional(),
});

export const idParamSchema = z.object({ id: z.string().min(1) });
