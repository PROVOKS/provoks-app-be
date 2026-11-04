import type { Request, Response } from "express";

import { learningService } from "../services/learning.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const learningController = {
  course: asyncHandler(async (req: Request, res: Response) => {
    const data = await learningService.getCourse(
      param(req, "slug"),
      req.user!.sub,
    );
    res.json({ success: true, message: "OK", data });
  }),

  myCourses: asyncHandler(async (req: Request, res: Response) => {
    const data = await learningService.myCourses(req.user!.sub);
    res.json({ success: true, message: "OK", data });
  }),

  updateProgress: asyncHandler(async (req: Request, res: Response) => {
    const data = await learningService.updateProgress(
      req.user!.sub,
      req.body.silabusPartId,
      req.body.completed,
    );
    res.json({ success: true, message: "Progres diperbarui", data });
  }),

  quiz: asyncHandler(async (req: Request, res: Response) => {
    const data = await learningService.getQuiz(
      param(req, "blockId"),
      req.user!.sub,
    );
    res.json({ success: true, message: "OK", data });
  }),

  startQuiz: asyncHandler(async (req: Request, res: Response) => {
    const data = await learningService.startQuiz(
      param(req, "blockId"),
      req.user!.sub,
    );
    res.status(201).json({
      success: true,
      message: data.resumed ? "Melanjutkan percobaan" : "Percobaan dimulai",
      data,
    });
  }),

  submitQuiz: asyncHandler(async (req: Request, res: Response) => {
    const data = await learningService.submitQuiz(
      param(req, "blockId"),
      req.user!.sub,
      req.body.attemptId,
      req.body.answers,
    );
    res.status(201).json({ success: true, message: "Kuis dikumpulkan", data });
  }),

  attempt: asyncHandler(async (req: Request, res: Response) => {
    const data = await learningService.getAttempt(
      param(req, "id"),
      req.user!.sub,
    );
    res.json({ success: true, message: "OK", data });
  }),

  myPaths: asyncHandler(async (req: Request, res: Response) => {
    const data = await learningService.myPaths(req.user!.sub);
    res.json({ success: true, message: "OK", data });
  }),

  path: asyncHandler(async (req: Request, res: Response) => {
    const data = await learningService.getPath(
      param(req, "slug"),
      req.user!.sub,
    );
    res.json({ success: true, message: "OK", data });
  }),
};
