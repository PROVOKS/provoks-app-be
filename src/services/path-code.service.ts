import crypto from "node:crypto";

import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";

/** Tanpa karakter ambigu (0/O, 1/I/L). */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MINUTES = 15;

function randomToken(length: number) {
  let token = "";
  for (let i = 0; i < length; i += 1) {
    token += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }
  return token;
}

function codePrefix(slug: string) {
  const clean = slug.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return (clean.slice(0, 6) || "PATH").padEnd(4, "X");
}

export type PathJoinCodeStatus = "ACTIVE" | "EXPIRED" | "REVOKED";

function statusOf(code: { expiresAt: Date | null; revokedAt: Date | null }): PathJoinCodeStatus {
  if (code.revokedAt) return "REVOKED";
  if (code.expiresAt && code.expiresAt.getTime() <= Date.now()) return "EXPIRED";
  return "ACTIVE";
}

function shapeCode(code: {
  id: string;
  code: string;
  expiresAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  createdBy: string | null;
}, usedCount: number) {
  return {
    id: code.id,
    code: code.code,
    status: statusOf(code),
    expiresAt: code.expiresAt,
    revokedAt: code.revokedAt,
    createdAt: code.createdAt,
    createdBy: code.createdBy,
    usedCount,
  };
}

export const pathCodeService = {
  /** Daftar kode untuk satu path (termasuk yang sudah kedaluwarsa/dicabut). */
  async list(pathId: string) {
    const codes = await prisma.pathJoinCode.findMany({
      where: { pathId },
      orderBy: { createdAt: "desc" },
    });

    if (codes.length === 0) return [];

    const usage = await prisma.pathJoinAttempt.groupBy({
      by: ["code"],
      where: { success: true, code: { in: codes.map((item) => item.code) } },
      _count: { _all: true },
    });
    const usageByCode = new Map(usage.map((row) => [row.code, row._count._all]));

    return codes.map((code) => shapeCode(code, usageByCode.get(code.code) ?? 0));
  },

  async generate(
    pathId: string,
    input: { expiresAt?: string | null },
    createdBy: string,
  ) {
    const path = await prisma.path.findUnique({ where: { id: pathId } });
    if (!path) throw ApiError.notFound("Path tidak ditemukan");

    let expiresAt: Date | null = null;
    if (input.expiresAt) {
      const parsed = new Date(input.expiresAt);
      if (Number.isNaN(parsed.getTime())) {
        throw ApiError.badRequest("Tanggal kedaluwarsa tidak valid");
      }
      if (parsed.getTime() <= Date.now()) {
        throw ApiError.badRequest("Tanggal kedaluwarsa harus di masa depan");
      }
      expiresAt = parsed;
    }

    // coba beberapa kali kalau kode kebetulan bentrok
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = `${codePrefix(path.slug)}-${randomToken(6)}`;
      try {
        const created = await prisma.pathJoinCode.create({
          data: { pathId, code, expiresAt, createdBy },
        });
        return shapeCode(created, 0);
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          (error as { code?: string }).code === "P2002"
        ) {
          continue;
        }
        throw error;
      }
    }

    throw ApiError.conflict("Gagal membuat kode unik, coba lagi");
  },

  async revoke(pathId: string, codeId: string) {
    const code = await prisma.pathJoinCode.findFirst({
      where: { id: codeId, pathId },
    });
    if (!code) throw ApiError.notFound("Kode tidak ditemukan");

    if (code.revokedAt) {
      return shapeCode(code, 0);
    }

    const updated = await prisma.pathJoinCode.update({
      where: { id: codeId },
      data: { revokedAt: new Date() },
    });
    return shapeCode(updated, 0);
  },

  /**
   * Pakai kode untuk bergabung ke path. Mengembalikan path + jumlah course.
   * Ada pembatasan percobaan gagal per user untuk mencegah brute force.
   */
  async redeem(userId: string, rawCode: string) {
    const code = String(rawCode ?? "").trim().toUpperCase();
    if (!code) throw ApiError.badRequest("Kode wajib diisi");

    const windowStart = new Date(
      Date.now() - ATTEMPT_WINDOW_MINUTES * 60 * 1000,
    );
    const failed = await prisma.pathJoinAttempt.count({
      where: { userId, success: false, createdAt: { gte: windowStart } },
    });
    if (failed >= MAX_FAILED_ATTEMPTS) {
      throw ApiError.tooManyRequests(
        `Terlalu banyak percobaan. Coba lagi dalam ${ATTEMPT_WINDOW_MINUTES} menit.`,
      );
    }

    const record = await prisma.pathJoinCode.findUnique({
      where: { code },
      include: { path: true },
    });

    const reject = async (message: string) => {
      await prisma.pathJoinAttempt.create({
        data: { userId, code, success: false },
      });
      throw ApiError.badRequest(message);
    };

    if (!record) return reject("Kode tidak dikenali");
    if (record.revokedAt) return reject("Kode sudah dicabut");
    if (record.expiresAt && record.expiresAt.getTime() <= Date.now()) {
      return reject("Kode sudah kedaluwarsa");
    }
    if (record.path.status !== "PUBLISHED") {
      return reject("Path ini belum dibuka");
    }

    const existing = await prisma.pathEnrollment.findUnique({
      where: { userId_pathId: { userId, pathId: record.pathId } },
    });

    if (existing?.status === "APPROVED") {
      await prisma.pathJoinAttempt.create({ data: { userId, code, success: true } });
      return {
        alreadyJoined: true,
        path: { id: record.path.id, name: record.path.name, slug: record.path.slug },
      };
    }

    const enrollment = existing
      ? await prisma.pathEnrollment.update({
          where: { id: existing.id },
          data: {
            status: "APPROVED",
            note: `Gabung lewat kode ${code}`,
            reviewedBy: null,
            reviewedAt: new Date(),
          },
        })
      : await prisma.pathEnrollment.create({
          data: {
            userId,
            pathId: record.pathId,
            status: "APPROVED",
            note: `Gabung lewat kode ${code}`,
            reviewedAt: new Date(),
          },
        });

    await prisma.pathJoinAttempt.create({ data: { userId, code, success: true } });

    return {
      alreadyJoined: false,
      enrollmentId: enrollment.id,
      path: { id: record.path.id, name: record.path.name, slug: record.path.slug },
    };
  },
};
