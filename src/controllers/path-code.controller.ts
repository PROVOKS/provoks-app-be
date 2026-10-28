import type { Request, Response } from "express";

import { pathCodeService } from "../services/path-code.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const pathCodeController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathCodeService.list(param(req, "id"));
    res.json({ success: true, message: "OK", data });
  }),

  generate: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathCodeService.generate(
      param(req, "id"),
      { expiresAt: req.body.expiresAt ?? null },
      req.user!.sub,
    );
    res.status(201).json({ success: true, message: "Kode dibuat", data });
  }),

  revoke: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathCodeService.revoke(
      param(req, "id"),
      param(req, "codeId"),
    );
    res.json({ success: true, message: "Kode dicabut", data });
  }),

  redeem: asyncHandler(async (req: Request, res: Response) => {
    const data = await pathCodeService.redeem(req.user!.sub, req.body.code);
    res.json({
      success: true,
      message: data.alreadyJoined
        ? "Kamu sudah terdaftar di path ini"
        : "Berhasil bergabung ke path",
      data,
    });
  }),
};
