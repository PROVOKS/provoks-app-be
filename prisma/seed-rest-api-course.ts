/**
 * Seed course "Belajar REST API: Dari Desain sampai Implementasi".
 *
 * Jalankan: npm run seed:rest-api
 * Course ini tidak punya prasyarat; bisa diakses semua siswa di path terkait.
 */
import { prisma } from "../src/db/prisma";
import { upsertCourseContent } from "./content/helpers";
import { REST_API_PARTS_1_2 } from "./content/web-development/rest-api/parts-1-2";

async function main() {
  await upsertCourseContent({
    slug: "belajar-rest-api-dari-desain-sampai-implementasi",
    title: "Belajar REST API: Dari Desain sampai Implementasi",
    description:
      "Kursus REST API backend dengan Express 5 + TypeScript + Prisma 7 + MySQL: HTTP method, routing, controller, service, Controller-Service Pattern, CRUD ke MySQL, validasi Zod, error handler, CORS, unit testing Vitest, integration testing Supertest, dan mini project. Setiap praktik dilengkapi briefing dependency dan perintah npm yang bisa dijalankan.",
    defaultStatus: "PUBLISHED",
    tags: [
      { name: "REST API", slug: "rest-api", category: "Backend" },
      { name: "Express", slug: "express", category: "Backend" },
      { name: "MySQL", slug: "mysql", category: "Database" },
      { name: "Node.js", slug: "node-js", category: "Backend" },
    ],
    parts: REST_API_PARTS_1_2,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
