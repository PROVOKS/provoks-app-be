import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  API_PREFIX: z.string().default("/api/v1"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET minimal 8 karakter"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("provoks_token"),
  COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
  /// Domain cookie. Isi ".domainmu.id" kalau FE dan API beda subdomain,
  /// supaya cookie terbaca juga oleh middleware di domain FE.
  COOKIE_DOMAIN: z.string().default(""),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().default(""),
  CLOUDINARY_API_KEY: z.string().default(""),
  CLOUDINARY_API_SECRET: z.string().default(""),
  CLOUDINARY_UPLOAD_PRESET: z.string().default(""),
  CLOUDINARY_FOLDER: z.string().default("provoks"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
