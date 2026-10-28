import type { Request, Response } from "express";

import { pathService } from "../services/path.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const pathController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathService.list(req.validatedQuery ?? {});
    res.json({ success: true, message: "OK", data });
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathService.getById(param(req, "id"));
    res.json({ success: true, message: "OK", data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathService.create(req.body);
    res.status(201).json({ success: true, message: "Path dibuat", data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathService.update(param(req, "id"), req.body);
    res.json({ success: true, message: "Path diperbarui", data });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathService.remove(param(req, "id"));
    res.json({ success: true, message: "Path dihapus", data });
  }),

  bulk: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathService.bulk(req.body);
    res.json({ success: true, message: "Aksi massal selesai", data });
  }),
};
