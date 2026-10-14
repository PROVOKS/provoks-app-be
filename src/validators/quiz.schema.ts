import { z } from "zod";

export const createQuestionSchema = z.object({
  contentBlockId: z.string().min(1, "contentBlockId wajib diisi"),
  question: z.string().min(1, "Pertanyaan wajib diisi"),
  options: z.array(z.string().min(1)).min(2, "Minimal 2 opsi jawaban"),
  answerIndex: z.coerce.number().min(0, "Index jawaban tidak valid"),
  points: z.coerce.number().min(1).default(1),
  order: z.coerce.number().default(0),
});

export const updateQuestionSchema = z.object({
  question: z.string().min(1).optional(),
  options: z.array(z.string().min(1)).min(2).optional(),
  answerIndex: z.coerce.number().min(0).optional(),
  points: z.coerce.number().min(1).optional(),
  order: z.coerce.number().optional(),
});

/** Format import JSON dari Quiz Builder */
export const importQuizSchema = z.object({
  title: z.string().optional(),
  passing: z.coerce.number().min(0).max(100).optional(),
  questions: z
    .array(
      z.object({
        q: z.string().min(1, "Pertanyaan tidak boleh kosong"),
        options: z.array(z.string().min(1)).min(2),
        answer: z.coerce.number().min(0),
        points: z.coerce.number().min(1).optional(),
      }),
    )
    .min(1, "Minimal 1 soal"),
});

export const blockIdParamSchema = z.object({
  blockId: z.string().min(1),
});
