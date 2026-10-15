import crypto from "node:crypto";

import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

const MAX_BYTES = 25 * 1024 * 1024; // 25MB

const ALLOWED_MIME = [
  "image/",
  "video/",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
];

export type UploadResult = {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  resourceType: string;
  originalName: string;
};

/**
 * Cloudinary menghitung tanda tangan dari parameter yang diurutkan alfabetis,
 * digabung dengan "&", lalu API secret ditempel di belakang. Urutan di sini
 * harus sama persis dengan urutan field yang dikirim ke Cloudinary: folder,
 * timestamp.
 */
function signParams(folder: string, timestamp: number) {
  return crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`)
    .digest("hex");
}

export const uploadService = {
  isConfigured() {
    return Boolean(
      env.CLOUDINARY_CLOUD_NAME &&
        (env.CLOUDINARY_API_SECRET || env.CLOUDINARY_UPLOAD_PRESET),
    );
  },

  /**
   * Data untuk upload langsung dari browser ke Cloudinary.
   * Browser memakai ini supaya file tidak perlu melewati server — penting di
   * lingkungan serverless yang membatasi ukuran body request.
   */
  signUpload() {
    if (!this.isConfigured()) {
      throw ApiError.badRequest(
        "Cloudinary belum dikonfigurasi (isi CLOUDINARY_API_SECRET atau CLOUDINARY_UPLOAD_PRESET)",
      );
    }
    if (!env.CLOUDINARY_API_SECRET) {
      throw ApiError.badRequest(
        "Upload langsung butuh CLOUDINARY_API_SECRET (preset unsigned tidak dipakai di jalur ini)",
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);

    return {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      folder: env.CLOUDINARY_FOLDER,
      timestamp,
      signature: signParams(env.CLOUDINARY_FOLDER, timestamp),
      maxBytes: MAX_BYTES,
      allowedMime: ALLOWED_MIME,
    };
  },

  async upload(file: Express.Multer.File): Promise<UploadResult> {
    if (!file) throw ApiError.badRequest("File wajib diisi");
    if (!this.isConfigured()) {
      throw ApiError.badRequest(
        "Cloudinary belum dikonfigurasi (isi CLOUDINARY_API_SECRET atau CLOUDINARY_UPLOAD_PRESET)",
      );
    }
    if (file.size > MAX_BYTES) {
      throw ApiError.badRequest("Ukuran file maksimal 25MB");
    }

    const mime = file.mimetype ?? "";
    if (!ALLOWED_MIME.some((allowed) => mime.startsWith(allowed))) {
      throw ApiError.badRequest(`Tipe file tidak didukung: ${mime || "unknown"}`);
    }

    const form = new FormData();
    form.append(
      "file",
      new Blob([new Uint8Array(file.buffer)], { type: mime }),
      file.originalname,
    );
    form.append("folder", env.CLOUDINARY_FOLDER);

    if (env.CLOUDINARY_API_SECRET) {
      // signed upload
      const timestamp = Math.floor(Date.now() / 1000);

      form.append("api_key", env.CLOUDINARY_API_KEY);
      form.append("timestamp", String(timestamp));
      form.append("signature", signParams(env.CLOUDINARY_FOLDER, timestamp));
    } else {
      // unsigned upload (butuh preset "unsigned" di Cloudinary)
      form.append("upload_preset", env.CLOUDINARY_UPLOAD_PRESET);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: "POST", body: form },
    );

    const payload = (await response.json()) as {
      secure_url?: string;
      public_id?: string;
      format?: string;
      bytes?: number;
      resource_type?: string;
      error?: { message?: string };
    };

    if (!response.ok || !payload.secure_url) {
      const detail = payload.error?.message ?? `HTTP ${response.status}`;
      throw ApiError.badRequest(
        `Upload ke Cloudinary gagal: ${detail}. ` +
          "Pastikan upload preset bersifat unsigned atau isi CLOUDINARY_API_SECRET.",
      );
    }

    return {
      url: payload.secure_url,
      publicId: payload.public_id ?? "",
      format: payload.format ?? "",
      bytes: payload.bytes ?? file.size,
      resourceType: payload.resource_type ?? "auto",
      originalName: file.originalname,
    };
  },
};
