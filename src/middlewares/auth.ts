import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

export type AuthPayload = {
  sub: string;
  email: string;
  role: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
      /** hasil validasi zod untuk query string */
      validatedQuery?: Record<string, unknown>;
      /** hasil validasi zod untuk path params */
      validatedParams?: Record<string, string>;
    }
  }
}

export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Token tidak ditemukan"));
  }

  try {
    const payload = jwt.verify(
      header.slice(7),
      env.JWT_SECRET,
    ) as AuthPayload;
    req.user = payload;
    return next();
  } catch {
    return next(ApiError.unauthorized("Token tidak valid atau kedaluwarsa"));
  }
};

export const authorize =
  (...roles: string[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(ApiError.forbidden());
    }
    return next();
  };
