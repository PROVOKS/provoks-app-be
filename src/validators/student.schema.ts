import { z } from "zod";

export const importCsvSchema = z.object({
  csv: z.string().min(1, "File CSV kosong"),
});

export const listStudentQuerySchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  search: z.string().optional(),
  pathId: z.string().optional(),
});

export const listPathRequestQuerySchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "ALL"]).optional(),
});

export const reviewPathRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().max(300).optional(),
});

export const requestPathSchema = z.object({
  pathId: z.string().min(1, "Path wajib dipilih"),
  note: z.string().max(300).optional(),
});

export const studentIdParamSchema = z.object({ id: z.string().min(1) });
