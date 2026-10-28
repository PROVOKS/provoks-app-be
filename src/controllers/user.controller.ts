import type { Request, Response } from "express";

import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.list(req.validatedQuery ?? {});
    res.json({ success: true, message: "OK", data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.create(req.body);
    res.status(201).json({ success: true, message: "User ditambahkan", data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.update(param(req, "id"), req.body);
    res.json({ success: true, message: "User diperbarui", data });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.remove(param(req, "id"), req.user!.sub);
    res.json({ success: true, message: "User dihapus", data });
  }),

  previewImport: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.preview(req.body.csv);
    res.json({ success: true, message: "Preview import", data });
  }),

  import: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.import(req.body.csv);
    res.json({ success: true, message: "Import siswa selesai", data });
  }),

  pathRequests: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.listPathRequests(req.validatedQuery ?? {});
    res.json({ success: true, message: "OK", data });
  }),

  reviewPathRequest: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.reviewPathRequest(
      param(req, "id"),
      req.body.status,
      req.user!.sub,
      req.body.note,
    );
    res.json({ success: true, message: "Permintaan diperbarui", data });
  }),

  bulk: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.bulk(req.body, req.user!.sub);
    res.json({ success: true, message: "Aksi massal selesai", data });
  }),

  bulkPathRequests: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.bulkPathRequests(req.body, req.user!.sub);
    res.json({ success: true, message: "Permintaan diperbarui", data });
  }),
};
