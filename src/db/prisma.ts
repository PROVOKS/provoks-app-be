import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "../config/env";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  // Neon pooler (PgBouncer). max: 1 supaya satu instance serverless hanya
  // memegang satu koneksi — mencegah "too many connections" saat banyak
  // instance dibuat bersamaan.
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
    max: 1,
  });

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

// Di-cache TANPA syarat. Sebelumnya cache hanya aktif saat NODE_ENV != production,
// jadi di serverless setiap invocation membuat pool baru dan koneksi DB habis.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
