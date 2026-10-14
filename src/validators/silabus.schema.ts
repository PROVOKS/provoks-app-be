import { z } from "zod";

const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
const silabusTypeEnum = z.enum(["VIDEO", "ARTICLE", "QUIZ"]);

export const createCoursePartSchema = z.object({
  courseId: z.string().min(1, "courseId wajib diisi"),
  name: z.string().min(1, "Nama part wajib diisi"),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().min(0).default(0),
  order: z.coerce.number().default(0),
});

export const updateCoursePartSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().min(0).optional(),
  order: z.coerce.number().optional(),
});

export const createSilabusPartSchema = z.object({
  coursePartId: z.string().min(1, "coursePartId wajib diisi"),
  title: z.string().min(1, "Judul silabus part wajib diisi"),
  slug: z.string().optional(),
  type: silabusTypeEnum.default("VIDEO"),
  durationMinutes: z.coerce.number().min(0).default(0),
  status: statusEnum.default("DRAFT"),
  order: z.coerce.number().default(0),
});

export const updateSilabusPartSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  type: silabusTypeEnum.optional(),
  durationMinutes: z.coerce.number().min(0).optional(),
  status: statusEnum.optional(),
  order: z.coerce.number().optional(),
});

export const reorderSchema = z.object({
  items: z.array(
    z.object({ id: z.string().min(1), order: z.coerce.number().min(0) }),
  ),
});

export const reorderCoursePartsSchema = reorderSchema;
