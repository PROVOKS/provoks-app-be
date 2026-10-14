import type { Request, Response } from "express";
import multer from "multer";

import { env } from "../config/env";
import { uploadService } from "../services/upload.service";
import { asyncHandler } from "../utils/async-handler";

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

export const uploadController = {
  config: asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: "OK",
      data: {
        configured: uploadService.isConfigured(),
        cloudName: env.CLOUDINARY_CLOUD_NAME,
        folder: env.CLOUDINARY_FOLDER,
        mode: env.CLOUDINARY_API_SECRET ? "signed" : "unsigned-preset",
        maxBytes: 25 * 1024 * 1024,
      },
    });
  }),

  single: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: "File wajib diisi" });
      return;
    }
    const data = await uploadService.upload(req.file);
    res
      .status(201)
      .json({ success: true, message: "File berhasil diunggah", data });
  }),
};
