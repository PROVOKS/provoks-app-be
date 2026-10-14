import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Express 5 sudah otomatis meneruskan promise yang reject ke error handler,
 * tapi helper ini membuat intent-nya eksplisit dan tetap kompatibel.
 */
export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
