import type { Request, Response } from "express";

import { blockService } from "../services/block.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const blockController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await blockService.listBySilabusPart(param(req, "silabusPartId"));
    res.json({ success: true, message: "OK", data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await blockService.create(req.body);
    res.status(201).json({ success: true, message: "Block dibuat", data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await blockService.update(param(req, "id"), req.body);
    res.json({ success: true, message: "Block diperbarui", data });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const data = await blockService.remove(param(req, "id"));
    res.json({ success: true, message: "Block dihapus", data });
  }),

  reorder: asyncHandler(async (req: Request, res: Response) => {
    const data = await blockService.reorder(req.body.items);
    res.json({ success: true, message: "Urutan block diperbarui", data });
  }),
};
