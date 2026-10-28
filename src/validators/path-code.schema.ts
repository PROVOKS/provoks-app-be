import { z } from "zod";

export const generateJoinCodeSchema = z.object({
  /// ISO date string; kosong/null = permanen
  expiresAt: z.string().max(40).optional().nullable(),
});

export const redeemJoinCodeSchema = z.object({
  code: z.string().min(1, "Kode wajib diisi").max(40),
});

export const pathCodeParamSchema = z.object({
  id: z.string().min(1),
  codeId: z.string().min(1),
});
