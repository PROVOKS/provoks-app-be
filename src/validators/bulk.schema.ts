import { z } from "zod";

const ids = z
  .array(z.string().min(1))
  .min(1, "Pilih minimal satu data")
  .max(100, "Maksimal 100 data per aksi");

const publishStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
const roleEnum = z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]);

export const bulkCourseSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("delete"), ids }),
  z.object({ action: z.literal("status"), ids, status: publishStatus }),
]);

export const bulkPathSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("delete"), ids }),
  z.object({ action: z.literal("status"), ids, status: publishStatus }),
]);

export const bulkTagSchema = z.object({
  action: z.literal("delete"),
  ids,
});

export const bulkUserSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("delete"), ids }),
  z.object({ action: z.literal("role"), ids, role: roleEnum }),
]);

export const bulkPathRequestSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED"]),
  ids,
  note: z.string().max(300).optional(),
});
