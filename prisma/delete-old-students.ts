import { prisma } from "../src/db/prisma";

/**
 * Hapus mahasiswa lama hasil import sebelumnya (email masih
 * "<nim>@student.provoks.id"). Akun mahasiswa lain (mis. andi@provoks.id)
 * tidak disentuh.
 *
 *   npx tsx prisma/delete-old-students.ts --dry   (lihat dulu)
 *   npx tsx prisma/delete-old-students.ts         (hapus)
 */
const DRY = process.argv.includes("--dry");
const OLD_EMAIL_SUFFIX = "@student.provoks.id";

(async () => {
  const targets = await prisma.user.findMany({
    where: { role: "STUDENT", email: { endsWith: OLD_EMAIL_SUFFIX } },
    select: { nim: true, name: true, email: true },
    orderBy: { nim: "asc" },
  });

  const kept = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      NOT: { email: { endsWith: OLD_EMAIL_SUFFIX } },
    },
    select: { name: true, email: true },
    orderBy: { name: "asc" },
  });

  console.log(`mahasiswa lama (email ${OLD_EMAIL_SUFFIX}): ${targets.length}`);
  for (const item of targets.slice(0, 3)) {
    console.log(`   - ${item.nim}  ${item.name}  <${item.email}>`);
  }
  if (targets.length > 3) console.log(`   ... dan ${targets.length - 3} lainnya`);

  console.log(`\nmahasiswa yang DIPERTAHANKAN: ${kept.length}`);
  for (const item of kept) console.log(`   - ${item.name}  <${item.email}>`);

  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  console.log(`\ntotal mahasiswa sekarang: ${totalStudents}`);

  if (DRY) {
    console.log("\n(dry run — tidak ada yang dihapus)");
    return;
  }

  const deleted = await prisma.user.deleteMany({
    where: { role: "STUDENT", email: { endsWith: OLD_EMAIL_SUFFIX } },
  });

  const sisa = await prisma.user.count({ where: { role: "STUDENT" } });
  console.log(`\nterhapus: ${deleted.count} user`);
  console.log(`total mahasiswa sekarang: ${sisa}`);
})()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
