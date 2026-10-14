import type { Request } from "express";

/**
 * Express 5 mengetik `req.params` sebagai `string | string[]`.
 * Helper ini menormalkan nilai param menjadi string tunggal.
 */
export function param(req: Request, key: string): string {
  const value = req.params[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
