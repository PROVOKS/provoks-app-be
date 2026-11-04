import { prisma } from "../db/prisma";
import { assignedPathIds, type Actor } from "../utils/access";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** 12 bulan terakhir, urut dari paling lama ke paling baru. */
function lastTwelveMonths(now: Date) {
  const keys: string[] = [];
  for (let i = 11; i >= 0; i -= 1) {
    keys.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  }
  return keys;
}

export const statsService = {
  async dashboard(actor?: Actor) {
    const now = new Date();
    const monthKeys = lastTwelveMonths(now);
    const since = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // null = admin (semua path)
    const pathIds = actor ? await assignedPathIds(actor) : null;
    const scoped = pathIds !== null;

    const courseWhere = scoped ? { pathId: { in: pathIds } } : {};
    const enrollmentWhere = scoped
      ? { course: { pathId: { in: pathIds } } }
      : {};
    const progressScope = scoped
      ? { silabusPart: { coursePart: { course: { pathId: { in: pathIds } } } } }
      : {};

    const [
      students,
      instructors,
      admins,
      courses,
      publishedCourses,
      paths,
      tags,
      enrollments,
      pendingPathRequests,
      completedParts,
      progressAgg,
      recentEnrollments,
    ] = await Promise.all([
      scoped
        ? prisma.enrollment
            .findMany({
              where: enrollmentWhere,
              distinct: ["userId"],
              select: { userId: true },
            })
            .then((rows) => rows.length)
        : prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.course.count({ where: courseWhere }),
      prisma.course.count({ where: { ...courseWhere, status: "PUBLISHED" } }),
      scoped
        ? Promise.resolve(pathIds.length)
        : prisma.path.count(),
      prisma.tag.count(),
      prisma.enrollment.count({ where: enrollmentWhere }),
      scoped
        ? prisma.pathEnrollment.count({
            where: { status: "PENDING", pathId: { in: pathIds } },
          })
        : prisma.pathEnrollment.count({ where: { status: "PENDING" } }),
      prisma.silabusProgress.findMany({
        where: { completed: true, ...progressScope },
        select: { silabusPart: { select: { durationMinutes: true } } },
      }),
      prisma.enrollment.aggregate({
        where: enrollmentWhere,
        _avg: { progressPercent: true },
      }),
      prisma.enrollment.findMany({
        where: { ...enrollmentWhere, enrolledAt: { gte: since } },
        select: { enrolledAt: true },
      }),
    ]);

    const learningMinutes = completedParts.reduce(
      (total, item) => total + (item.silabusPart?.durationMinutes ?? 0),
      0,
    );

    const bucket = new Map(monthKeys.map((key) => [key, 0]));
    for (const row of recentEnrollments) {
      const key = monthKey(row.enrolledAt);
      if (bucket.has(key)) bucket.set(key, (bucket.get(key) ?? 0) + 1);
    }

    return {
      students,
      instructors,
      admins,
      courses,
      publishedCourses,
      paths,
      tags,
      enrollments,
      pendingPathRequests,
      completionRate: Math.round(progressAgg._avg.progressPercent ?? 0),
      learningMinutes,
      enrollmentsPerMonth: monthKeys.map((month) => ({
        month,
        count: bucket.get(month) ?? 0,
      })),

      /// Entitas yang belum ada di sistem. FE menampilkan "Coming soon".
      assignments: null,
      certificates: null,
      payments: null,
    };
  },
};
