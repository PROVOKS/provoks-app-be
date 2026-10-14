import { z } from "zod";

export const blockTypeEnum = z.enum([
  "HEADING",
  "PARAGRAPH",
  "IMAGE",
  "DIVIDER",
  "VIDEO",
  "CODE",
  "CALLOUT",
  "QUIZ",
]);

export const createBlockSchema = z.object({
  silabusPartId: z.string().min(1, "silabusPartId wajib diisi"),
  type: blockTypeEnum,
  order: z.coerce.number().default(0),
  content: z.record(z.string(), z.unknown()).default({}),
});

export const updateBlockSchema = z.object({
  type: blockTypeEnum.optional(),
  order: z.coerce.number().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

export const reorderBlocksSchema = z.object({
  items: z.array(
    z.object({ id: z.string().min(1), order: z.coerce.number().min(0) }),
  ),
});
