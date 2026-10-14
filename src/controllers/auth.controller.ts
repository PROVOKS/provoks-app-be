import type { CookieOptions, Request, Response } from "express";

import { env } from "../config/env";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setSessionCookie(res: Response, token: string) {
  res.cookie(env.COOKIE_NAME, token, cookieOptions);
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.register(req.body);
    setSessionCookie(res, token);
    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: { user },
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.login(req.body);
    setSessionCookie(res, token);
    res.json({ success: true, message: "Login berhasil", data: { user } });
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie(env.COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
    res.json({ success: true, message: "Logout berhasil", data: null });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.sub);
    res.json({ success: true, message: "OK", data: { user } });
  }),
};
