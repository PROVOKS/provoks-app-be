import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";

const mentorSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
} as const;

export const pathMentorService = {
  /** Daftar mentor yang diampu pada satu path. */
  async list(pathId: string) {
    const path = await prisma.path.findUnique({
      where: { id: pathId },
      select: { id: true },
    });
    if (!path) throw ApiError.notFound("Path tidak ditemukan");

    const mentors = await prisma.pathMentor.findMany({
      where: { pathId },
      orderBy: { createdAt: "asc" },
      include: { user: { select: mentorSelect } },
    });

    return mentors.map((item) => ({
      ...item.user,
      assignedAt: item.createdAt,
    }));
  },

  /** Alokasikan satu instruktur menjadi mentor path. */
  async add(pathId: string, userId: string, assignedBy: string) {
    const [path, user] = await Promise.all([
      prisma.path.findUnique({ where: { id: pathId }, select: { id: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: mentorSelect }),
    ]);

    if (!path) throw ApiError.notFound("Path tidak ditemukan");
    if (!user) throw ApiError.notFound("User tidak ditemukan");
    if (user.role !== "INSTRUCTOR") {
      throw ApiError.badRequest("Mentor harus memiliki role INSTRUCTOR");
    }

    const existing = await prisma.pathMentor.findUnique({
      where: { pathId_userId: { pathId, userId } },
    });
    if (existing) {
      return { ...user, assignedAt: existing.createdAt };
    }

    const created = await prisma.pathMentor.create({
      data: { pathId, userId, assignedBy },
    });

    return { ...user, assignedAt: created.createdAt };
  },

  /** Cabut alokasi mentor dari path. */
  async remove(pathId: string, userId: string) {
    await prisma.pathMentor.deleteMany({ where: { pathId, userId } });
    return { pathId, userId };
  },
};
