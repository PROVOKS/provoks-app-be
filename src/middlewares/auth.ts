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

/** Ambil token dari httpOnly cookie, fallback ke header Authorization. */
export function extractToken(req: Request): string | null {
  const cookieToken = req.cookies?.[env.COOKIE_NAME];
  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }

  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);

  return null;
}

export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = extractToken(req);

  if (!token) {
    return next(ApiError.unauthorized("Sesi tidak ditemukan"));
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
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

/**
 * Aksi massal "delete" hanya untuk ADMIN, walau route-nya juga boleh
 * diakses INSTRUCTOR untuk aksi lain (mis. ubah status).
 */
export const bulkDeleteAdminOnly: RequestHandler = (req, _res, next) => {
  if (req.body?.action === "delete" && req.user?.role !== "ADMIN") {
    return next(ApiError.forbidden("Hanya admin yang bisa menghapus"));
  }
  return next();
};
