import type { Request, Response } from "express";

import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";
import { param } from "../utils/param";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: result,
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.json({ success: true, message: "Login berhasil", data: result });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.sub);
    res.json({ success: true, message: "OK", data: user });
  }),
};
