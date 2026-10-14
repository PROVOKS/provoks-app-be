import type { Request, Response } from "express";

import { courseService } from "../services/course.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const courseController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await courseService.list(req.validatedQuery ?? {});
    res.json({ success: true, message: "OK", data });
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const data = await courseService.getById(param(req, "id"));
    res.json({ success: true, message: "OK", data });
  }),

  detailBySlug: asyncHandler(async (req: Request, res: Response) => {
    const data = await courseService.getBySlug(param(req, "slug"));
    res.json({ success: true, message: "OK", data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await courseService.create(req.body);
    res.status(201).json({ success: true, message: "Course dibuat", data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await courseService.update(param(req, "id"), req.body);
    res.json({ success: true, message: "Course diperbarui", data });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const data = await courseService.remove(param(req, "id"));
    res.json({ success: true, message: "Course dihapus", data });
  }),
};
