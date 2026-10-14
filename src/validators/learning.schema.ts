import { z } from "zod";

export const updateProgressSchema = z.object({
  silabusPartId: z.string().min(1, "silabusPartId wajib diisi"),
  completed: z.boolean().default(true),
});

export const submitQuizSchema = z.object({
  answers: z.record(z.string(), z.coerce.number().min(0)),
});

export const slugParamSchema = z.object({ slug: z.string().min(1) });
export const blockIdParamSchema = z.object({ blockId: z.string().min(1) });
export const attemptIdParamSchema = z.object({ id: z.string().min(1) });
