import { compare, hash } from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";
import type { LoginInput, RegisterInput } from "../validators/auth.schema";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  createdAt: true,
} as const;

function signToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );
}

let googleClient: OAuth2Client | null = null;

function getGoogleClient() {
  if (!env.GOOGLE_CLIENT_ID) {
    throw ApiError.badRequest(
      "Login Google belum dikonfigurasi (GOOGLE_CLIENT_ID kosong)",
    );
  }
  if (!googleClient) {
    googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }
  return googleClient;
}

async function findPublicUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
  if (!user) throw ApiError.notFound("User tidak ditemukan");
  return user;
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) throw ApiError.conflict("Email sudah terdaftar");

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: await hash(input.password, 10),
        role: input.role ?? "STUDENT",
      },
      select: publicUserSelect,
    });

    return { user, token: signToken(user) };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw ApiError.unauthorized("Email atau password salah");

    // akun Google-only tidak punya password
    if (!user.password) {
      throw ApiError.unauthorized(
        "Akun ini terdaftar lewat Google. Silakan masuk dengan Google.",
      );
    }

    const valid = await compare(input.password, user.password);
    if (!valid) throw ApiError.unauthorized("Email atau password salah");

    return { user: await findPublicUser(user.id), token: signToken(user) };
  },

  /**
   * Login lewat Google Identity Services.
   * - verifikasi ID token ke Google (tanda tangan, aud, exp)
   * - `googleId` sudah ada  -> langsung masuk (role tetap)
   * - email sudah ada       -> tautkan googleId (auto-link, role & NIM tetap)
   * - email belum ada       -> buat user baru dengan role STUDENT
   */
  async googleLogin(credential: string) {
    const client = getGoogleClient();

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      throw ApiError.unauthorized("Token Google tidak valid atau kedaluwarsa");
    }

    if (!payload?.sub || !payload.email) {
      throw ApiError.unauthorized("Data akun Google tidak lengkap");
    }
    if (!payload.email_verified) {
      throw ApiError.unauthorized("Email Google belum terverifikasi");
    }

    const email = payload.email.toLowerCase();

    let user = await prisma.user.findUnique({ where: { googleId: payload.sub } });

    if (!user) {
      const byEmail = await prisma.user.findUnique({ where: { email } });

      if (byEmail) {
        // auto-link: pertahankan role, NIM, prodi, dan password lama
        user = await prisma.user.update({
          where: { id: byEmail.id },
          data: {
            googleId: payload.sub,
            avatarUrl: byEmail.avatarUrl ?? payload.picture ?? null,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            name: payload.name?.trim() || email.split("@")[0],
            email,
            googleId: payload.sub,
            password: null,
            role: "STUDENT",
            avatarUrl: payload.picture ?? null,
          },
        });
      }
    }

    return { user: await findPublicUser(user.id), token: signToken(user) };
  },

  async me(userId: string) {
    return findPublicUser(userId);
  },
};
