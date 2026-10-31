import { z } from "zod";

const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createPathSchema = z.object({
  name: z.string().min(2, "Nama path minimal 2 karakter"),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: statusEnum.default("DRAFT"),
});

/**
 * `partial()` TIDAK menghapus `.default()`. Tanpa override ini, update parsial
 * (mis. hanya ganti nama) akan menimpa `status` jadi DRAFT.
 */
export const updatePathSchema = createPathSchema.partial().extend({
  status: statusEnum.optional(),
});

export const listPathQuerySchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  search: z.string().optional(),
  status: statusEnum.optional(),
});

export const idParamSchema = z.object({ id: z.string().min(1) });
