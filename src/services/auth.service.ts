import { compare, hash } from "bcryptjs";
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

    const valid = await compare(input.password, user.password);
    if (!valid) throw ApiError.unauthorized("Email atau password salah");

    const { password: _password, ...safeUser } = user;
    return { user: safeUser, token: signToken(user) };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: publicUserSelect,
    });
    if (!user) throw ApiError.notFound("User tidak ditemukan");
    return user;
  },
};
