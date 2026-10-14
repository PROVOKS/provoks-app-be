import { z } from "zod";

export const importCsvSchema = z.object({
  csv: z.string().min(1, "File CSV kosong"),
});

const roleEnum = z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]);

export const listUserQuerySchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  search: z.string().optional(),
  pathId: z.string().optional(),
  role: z.enum(["ADMIN", "INSTRUCTOR", "STUDENT", "ALL"]).optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: roleEnum.default("STUDENT"),
  nim: z.string().max(30).optional(),
  prodi: z.string().max(120).optional(),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  /// opsional: langsung daftarkan siswa ke path (status APPROVED)
  pathId: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").optional(),
  email: z.string().email("Format email tidak valid").optional(),
  role: roleEnum.optional(),
  nim: z.string().max(30).optional(),
  prodi: z.string().max(120).optional(),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
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

export const userIdParamSchema = z.object({ id: z.string().min(1) });
