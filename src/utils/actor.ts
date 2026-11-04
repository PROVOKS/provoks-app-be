import type { Request } from "express";

import type { Actor } from "./access";

/** Ambil aktor dari request (undefined untuk pengunjung tanpa login). */
export function actorOf(req: Request): Actor | undefined {
  if (!req.user) return undefined;
  return {
    id: req.user.sub,
    role: req.user.role as Actor["role"],
  };
}
