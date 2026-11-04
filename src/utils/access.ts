import { prisma } from "../db/prisma";
import { ApiError } from "./api-error";

export type ActorRole = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export type Actor = {
  id: string;
  role: ActorRole;
};

/**
 * Path yang boleh diakses seorang staff.
 * `null` berarti akses penuh (ADMIN).
 */
export async function assignedPathIds(
  actor: Actor,
): Promise<string[] | null> {
  if (actor.role === "ADMIN") return null;

  const rows = await prisma.pathMentor.findMany({
    where: { userId: actor.id },
    select: { pathId: true },
  });

  return rows.map((row) => row.pathId);
}

export async function assertPathAccess(actor: Actor, pathId: string) {
  const ids = await assignedPathIds(actor);
  if (ids === null) return;
  if (!ids.includes(pathId)) {
    throw ApiError.forbidden("Kamu tidak punya akses ke path ini");
  }
}

export async function assertCourseAccess(actor: Actor, courseId: string) {
  const ids = await assignedPathIds(actor);
  if (ids === null) return;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { pathId: true },
  });
  if (!course) throw ApiError.notFound("Course tidak ditemukan");

  if (!course.pathId || !ids.includes(course.pathId)) {
    throw ApiError.forbidden("Kamu tidak punya akses ke course ini");
  }
}
