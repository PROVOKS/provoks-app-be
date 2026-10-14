import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { ApiError } from "../utils/api-error";
import { isProduction } from "../config/env";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validasi gagal",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  // body JSON tidak valid (dari express.json())
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Body JSON tidak valid",
    });
  }

  const message =
    error instanceof Error ? error.message : "Terjadi kesalahan pada server";

  console.error("[error]", error);

  return res.status(500).json({
    success: false,
    message: isProduction ? "Terjadi kesalahan pada server" : message,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  return res.status(404).json({
    success: false,
    message: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
}
