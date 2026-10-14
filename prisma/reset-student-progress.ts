import { prisma } from "../src/db/prisma";

(async () => {
  const user = await prisma.user.findUnique({
    where: { email: "andi@provoks.id" },
  });
  if (!user) {
    console.log("user tidak ditemukan");
    return;
  }
  const progress = await prisma.silabusProgress.deleteMany({
    where: { userId: user.id },
  });
  const attempts = await prisma.quizAttempt.deleteMany({
    where: { userId: user.id },
  });
  const enrollments = await prisma.enrollment.updateMany({
    where: { userId: user.id },
    data: { progressPercent: 0 },
  });
  console.log(
    `dihapus: progress=${progress.count} attempt=${attempts.count} enrollment=${enrollments.count}`,
  );
})()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
