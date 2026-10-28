import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]).optional(),
});

export const loginSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const googleLoginSchema = z.object({
  /// ID token (JWT) dari Google Identity Services
  credential: z.string().min(20, "Token Google tidak valid"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
