import type { Request, Response } from "express";

import { pathMentorService } from "../services/path-mentor.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const pathMentorController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathMentorService.list(param(req, "id"));
    res.json({ success: true, message: "OK", data });
  }),

  add: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathMentorService.add(
      param(req, "id"),
      req.body.userId,
      req.user!.sub,
    );
    res.status(201).json({
      success: true,
      message: "Mentor dialokasikan",
      data,
    });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathMentorService.remove(
      param(req, "id"),
      param(req, "userId"),
    );
    res.json({ success: true, message: "Mentor dicabut", data });
  }),
};
