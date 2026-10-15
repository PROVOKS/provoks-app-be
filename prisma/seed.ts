import { hash } from "bcryptjs";

import { prisma } from "../src/db/prisma";
import { slugify } from "../src/utils/slug";

// ============================================================
// Users
// ============================================================
const USERS = [
  {
    name: "Admin Provoks",
    email: "admin@provoks.id",
    password: "secret123",
    role: "ADMIN" as const,
  },
  {
    name: "Rina Kartika",
    email: "rina@provoks.id",
    password: "secret123",
    role: "INSTRUCTOR" as const,
  },
  {
    name: "Andi Pratama",
    email: "andi@provoks.id",
    password: "secret123",
    role: "STUDENT" as const,
  },
];

// ============================================================
// Sample katalog
// ============================================================
const PATHS = [
  { name: "Web Dev", isFastTrack: false },
  { name: "UI/UX & PM", isFastTrack: false },
  { name: "IOT", isFastTrack: false },
  { name: "Game Dev", isFastTrack: false },
  { name: "Mobile", isFastTrack: false },
];

/// path lama dari seed versi awal (dirapikan karena sekarang pakai path dari data peserta)
const LEGACY_PATH_SLUGS = [
  "frontend-development",
  "backend-development",
  "full-stack-development",
  "uiux-design",
  "uiux-pm",
];

const TAGS = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Figma", category: "Design" },
  { name: "TypeScript", category: "Language" },
  { name: "Node.js", category: "Backend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "JavaScript", category: "Language" },
];

async function seedUsers() {
  for (const user of USERS) {
    const password = await hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role },
      create: {
        name: user.name,
        email: user.email,
        password,
        role: user.role,
      },
    });
    console.log(`  • user  ${user.email} (${user.role})`);
  }
}

async function seedPaths() {
  const map: Record<string, string> = {};
  for (const item of PATHS) {
    const path = await prisma.path.upsert({
      where: { slug: slugify(item.name) },
      update: { name: item.name, isFastTrack: item.isFastTrack },
      create: {
        name: item.name,
        slug: slugify(item.name),
        isFastTrack: item.isFastTrack,
        status: "PUBLISHED",
        description: `Learning path ${item.name}.`,
      },
    });
    map[item.name] = path.id;
    console.log(`  • path  ${item.name}`);
  }
  return map;
}

async function seedTags() {  const map: Record<string, string> = {};
  for (const item of TAGS) {
    const tag = await prisma.tag.upsert({
      where: { name: item.name },
      update: { category: item.category },
      create: {
        name: item.name,
        slug: slugify(item.name),
        category: item.category,
      },
    });
    map[item.name] = tag.id;
  }
  console.log(`  • tag   ${TAGS.length} tag`);
  return map;
}

async function seedCourse(pathIds: Record<string, string>, tagIds: Record<string, string>) {
  const slug = "full-stack-web-development";
  const course = await prisma.course.upsert({
    where: { slug },
    update: {},
    create: {
      title: "Full-Stack Web Development",
      slug,
      description:
        "Membangun aplikasi web production-ready dari nol: HTML, CSS, JavaScript, React, dan Node.js.",
      status: "PUBLISHED",
      passingGrade: 70,
      pathId: pathIds["Web Dev"],
      tags: {
        create: ["React", "Node.js", "Tailwind CSS"].map((name) => ({
          tagId: tagIds[name],
        })),
      },
    },
  });

  // reset struktur konten agar seed idempotent
  await prisma.coursePart.deleteMany({ where: { courseId: course.id } });

  const gettingStarted = await prisma.coursePart.create({
    data: {
      courseId: course.id,
      name: "Getting Started",
      description: "Persiapan sebelum mulai ngoding.",
      durationMinutes: 45,
      order: 0,
    },
  });

  const reactFundamentals = await prisma.coursePart.create({
    data: {
      courseId: course.id,
      name: "React Fundamentals",
      description: "Dasar-dasar React: komponen, props, dan state.",
      durationMinutes: 72,
      order: 1,
    },
  });

  const pengenalan = await prisma.silabusPart.create({
    data: {
      coursePartId: gettingStarted.id,
      title: "Pengenalan Kursus",
      slug: "pengenalan-kursus",
      type: "ARTICLE",
      durationMinutes: 8,
      status: "PUBLISHED",
      order: 0,
      blocks: {
        create: [
          {
            type: "HEADING",
            order: 0,
            content: { level: 2, text: "Selamat datang di Full-Stack Web Development" },
          },
          {
            type: "PARAGRAPH",
            order: 1,
            content: {
              text: "Course ini membahas frontend sampai backend dengan proyek nyata.",
            },
          },
        ],
      },
    },
  });

  await prisma.silabusPart.create({
    data: {
      coursePartId: gettingStarted.id,
      title: "Setup Environment",
      slug: "setup-environment",
      type: "VIDEO",
      durationMinutes: 12,
      status: "PUBLISHED",
      order: 1,
      blocks: {
        create: [
          {
            type: "VIDEO",
            order: 0,
            content: { url: "https://youtube.com/watch?v=xxxx", title: "Setup Environment" },
          },
          {
            type: "CALLOUT",
            order: 1,
            content: { variant: "info", text: "Gunakan Node.js versi LTS terbaru." },
          },
        ],
      },
    },
  });

  const komponenJsx = await prisma.silabusPart.create({
    data: {
      coursePartId: reactFundamentals.id,
      title: "Komponen & JSX",
      slug: "komponen-dan-jsx",
      type: "VIDEO",
      durationMinutes: 18,
      status: "PUBLISHED",
      order: 0,
      blocks: {
        create: [
          {
            type: "PARAGRAPH",
            order: 0,
            content: {
              text: "JSX memungkinkan kita menulis markup mirip HTML di dalam JavaScript.",
            },
          },
          {
            type: "CODE",
            order: 1,
            content: {
              language: "javascript",
              code: "const element = <h1>Hello, world!</h1>;",
            },
          },
          {
            type: "QUIZ",
            order: 2,
            content: { title: "Kuis: Dasar JSX" },
          },
        ],
      },
    },
  });

  // quiz questions untuk blok QUIZ
  const quizBlock = await prisma.contentBlock.findFirst({
    where: { silabusPartId: komponenJsx.id, type: "QUIZ" },
  });

  if (quizBlock) {
    await prisma.quizQuestion.deleteMany({
      where: { contentBlockId: quizBlock.id },
    });
    await prisma.quizQuestion.createMany({
      data: [
        {
          contentBlockId: quizBlock.id,
          question: "Apa kepanjangan dari JSX?",
          options: ["JavaScript XML", "Java Syntax", "JSON XML", "JavaScript Extension"],
          answerIndex: 0,
          points: 1,
          order: 0,
        },
        {
          contentBlockId: quizBlock.id,
          question: "Atribut class pada JSX adalah...",
          options: ["class", "className", "cssClass", "styleName"],
          answerIndex: 1,
          points: 1,
          order: 1,
        },
      ],
    });
  }

  console.log(`  • course ${course.title} (${slug})`);
  console.log(`  • silabus part ${pengenalan.slug}, setup-environment, komponen-dan-jsx`);
}

/// siswa demo (andi) otomatis APPROVED di path tempat course contoh berada
async function seedStudentPath() {
  const student = await prisma.user.findUnique({
    where: { email: "andi@provoks.id" },
  });
  const course = await prisma.course.findUnique({
    where: { slug: "full-stack-web-development" },
    select: { pathId: true },
  });

  if (!student || !course?.pathId) return;

  await prisma.pathEnrollment.upsert({
    where: { userId_pathId: { userId: student.id, pathId: course.pathId } },
    update: {},
    create: {
      userId: student.id,
      pathId: course.pathId,
      status: "APPROVED",
      note: "Seed demo",
    },
  });
  console.log("  • path enrollment siswa demo (andi)");
}

async function cleanupLegacyPaths() {  const result = await prisma.path.deleteMany({
    where: {
      slug: { in: LEGACY_PATH_SLUGS },
      courses: { none: {} },
    },
  });
  if (result.count > 0) {
    console.log(`  • hapus ${result.count} path lama (tidak terpakai)`);
  }
}

async function main() {
  console.log("🌱 Seeding Provoks LMS...\n");

  console.log("Users:");
  await seedUsers();

  console.log("\nKatalog:");
  const pathIds = await seedPaths();
  const tagIds = await seedTags();

  console.log("\nCourse:");
  await seedCourse(pathIds, tagIds);

  console.log("\nPath siswa demo:");
  await seedStudentPath();

  console.log("\nRapikan path lama:");
  await cleanupLegacyPaths();

  console.log("\n✅ Seed selesai.");
  console.log("\nAkun untuk login:");
  for (const user of USERS) {
    console.log(`  ${user.role.padEnd(10)} ${user.email}  /  ${user.password}`);
  }
}

main()
  .catch((error) => {
    console.error("❌ Seed gagal:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
