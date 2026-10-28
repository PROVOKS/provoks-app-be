import type { Request, Response } from "express";

import { tagService } from "../services/tag.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const tagController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await tagService.list(req.validatedQuery ?? {});
    res.json({ success: true, message: "OK", data });
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const data = await tagService.getById(param(req, "id"));
    res.json({ success: true, message: "OK", data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await tagService.create(req.body);
    res.status(201).json({ success: true, message: "Tag dibuat", data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await tagService.update(param(req, "id"), req.body);
    res.json({ success: true, message: "Tag diperbarui", data });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const data = await tagService.remove(param(req, "id"));
    res.json({ success: true, message: "Tag dihapus", data });
  }),

  bulk: asyncHandler(async (req: Request, res: Response) => {
    const data = await tagService.bulk(req.body);
    res.json({ success: true, message: "Aksi massal selesai", data });
  }),
};
