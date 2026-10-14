import type { Request, Response } from "express";

import { studentService } from "../services/student.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const studentController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await studentService.list(req.validatedQuery ?? {});
    res.json({ success: true, message: "OK", data });
  }),

  previewImport: asyncHandler(async (req: Request, res: Response) => {
    const data = await studentService.preview(req.body.csv);
    res.json({ success: true, message: "Preview import", data });
  }),

  import: asyncHandler(async (req: Request, res: Response) => {
    const data = await studentService.import(req.body.csv);
    res.json({ success: true, message: "Import siswa selesai", data });
  }),

  pathRequests: asyncHandler(async (req: Request, res: Response) => {
    const data = await studentService.listPathRequests(req.validatedQuery ?? {});
    res.json({ success: true, message: "OK", data });
  }),

  reviewPathRequest: asyncHandler(async (req: Request, res: Response) => {
    const data = await studentService.reviewPathRequest(
      param(req, "id"),
      req.body.status,
      req.user!.sub,
      req.body.note,
    );
    res.json({ success: true, message: "Permintaan diperbarui", data });
  }),
};
