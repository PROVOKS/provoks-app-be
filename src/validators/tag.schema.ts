import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "Nama tag wajib diisi"),
  slug: z.string().optional(),
  category: z.string().optional(),
});

export const updateTagSchema = createTagSchema.partial();

export const listTagQuerySchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
});
