import { z } from "zod";

const levelEnum = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);
const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createPathSchema = z.object({
  name: z.string().min(2, "Nama path minimal 2 karakter"),
  slug: z.string().optional(),
  description: z.string().optional(),
  level: levelEnum.default("BEGINNER"),
  status: statusEnum.default("DRAFT"),
});

export const updatePathSchema = createPathSchema.partial();

export const listPathQuerySchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  search: z.string().optional(),
  status: statusEnum.optional(),
  level: levelEnum.optional(),
});

export const idParamSchema = z.object({ id: z.string().min(1) });
