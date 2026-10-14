import type { Request, Response } from "express";

import { silabusService } from "../services/silabus.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const silabusController = {
  createCoursePart: asyncHandler(async (req: Request, res: Response) => {
    const data = await silabusService.createCoursePart(req.body);
    res.status(201).json({ success: true, message: "Course part dibuat", data });
  }),

  updateCoursePart: asyncHandler(async (req: Request, res: Response) => {
    const data = await silabusService.updateCoursePart(param(req, "id"), req.body);
    res.json({ success: true, message: "Course part diperbarui", data });
  }),

  removeCoursePart: asyncHandler(async (req: Request, res: Response) => {
    const data = await silabusService.removeCoursePart(param(req, "id"));
    res.json({ success: true, message: "Course part dihapus", data });
  }),

  reorderCourseParts: asyncHandler(async (req: Request, res: Response) => {
    const data = await silabusService.reorderCourseParts(req.body.items);
    res.json({ success: true, message: "Urutan course part diperbarui", data });
  }),

  createSilabusPart: asyncHandler(async (req: Request, res: Response) => {
    const data = await silabusService.createSilabusPart(req.body);
    res.status(201).json({ success: true, message: "Silabus part dibuat", data });
  }),

  updateSilabusPart: asyncHandler(async (req: Request, res: Response) => {
    const data = await silabusService.updateSilabusPart(param(req, "id"), req.body);
    res.json({ success: true, message: "Silabus part diperbarui", data });
  }),

  removeSilabusPart: asyncHandler(async (req: Request, res: Response) => {
    const data = await silabusService.removeSilabusPart(param(req, "id"));
    res.json({ success: true, message: "Silabus part dihapus", data });
  }),

  reorder: asyncHandler(async (req: Request, res: Response) => {
    const data = await silabusService.reorder(req.body.items);
    res.json({ success: true, message: "Urutan diperbarui", data });
  }),
};
