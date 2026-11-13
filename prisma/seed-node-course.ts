/**
 * Seed course "Belajar Node.js & TypeScript: Dari Runtime sampai Monorepo".
 *
 * Lanjutan dari course JavaScript. Jalankan: npm run seed:node
 * (course prasyarat harus sudah ada agar status terkunci terpasang).
 */
import { prisma } from "../src/db/prisma";
import { upsertCourseContent } from "./content/helpers";
import { NODE_PARTS_1_4 } from "./content/nodejs/parts-1-4";
import { NODE_PARTS_5_8 } from "./content/nodejs/parts-5-8";

async function main() {
  await upsertCourseContent({
    slug: "belajar-nodejs-typescript-dari-runtime-sampai-monorepo",
    title: "Belajar Node.js & TypeScript: Dari Runtime sampai Monorepo",
    description:
      "Kursus lanjutan setelah JavaScript Async: memahami Node.js vs browser, npm & library, TypeScript dari nol, modul inti (process, path, fs, event, stream), membangun server HTTP/REST, menata monorepo dengan npm workspaces, serta scaffolding proyek dan Git/GitHub. Ditutup dengan proyek akhir monorepo API TypeScript.",
    defaultStatus: "PUBLISHED",
    blockedBySlug: "belajar-javascript-dari-nol-sampai-async",
    tags: [
      { name: "Node.js", slug: "node-js", category: "Backend" },
      { name: "TypeScript", slug: "typescript", category: "Language" },
      { name: "npm", slug: "npm", category: "Tooling" },
    ],
    parts: [...NODE_PARTS_1_4, ...NODE_PARTS_5_8],
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
