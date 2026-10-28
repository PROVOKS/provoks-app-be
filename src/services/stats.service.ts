import { prisma } from "../db/prisma";

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
  async dashboard() {
    const now = new Date();
    const monthKeys = lastTwelveMonths(now);
    const since = new Date(now.getFullYear(), now.getMonth() - 11, 1);

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
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.course.count(),
      prisma.course.count({ where: { status: "PUBLISHED" } }),
      prisma.path.count(),
      prisma.tag.count(),
      prisma.enrollment.count(),
      prisma.pathEnrollment.count({ where: { status: "PENDING" } }),
      prisma.silabusProgress.findMany({
        where: { completed: true },
        select: { silabusPart: { select: { durationMinutes: true } } },
      }),
      prisma.enrollment.aggregate({ _avg: { progressPercent: true } }),
      prisma.enrollment.findMany({
        where: { enrolledAt: { gte: since } },
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
