import type { Request, Response } from "express";

import { quizService } from "../services/quiz.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const quizController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await quizService.listByBlock(param(req, "blockId"));
    res.json({ success: true, message: "OK", data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await quizService.create(req.body);
    res.status(201).json({ success: true, message: "Soal dibuat", data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await quizService.update(param(req, "id"), req.body);
    res.json({ success: true, message: "Soal diperbarui", data });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const data = await quizService.remove(param(req, "id"));
    res.json({ success: true, message: "Soal dihapus", data });
  }),

  importJson: asyncHandler(async (req: Request, res: Response) => {
    const replace = req.query.replace !== "false";
    const data = await quizService.importJson(
      param(req, "blockId"),
      req.body,
      replace,
    );
    res.status(201).json({ success: true, message: "Soal berhasil diimport", data });
  }),
};
