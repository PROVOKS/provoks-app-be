/**
 * Seed course "Belajar JavaScript: Dari Nol sampai Async" (versi mendalam).
 *
 * Jalankan: npm run seed:js
 */
import { prisma } from "../src/db/prisma";
import { upsertCourseContent } from "./content/helpers";
import { JS_PARTS_1_4 } from "./content/js/parts-1-4";
import { JS_PARTS_5_8 } from "./content/js/parts-5-8";

async function main() {
  await upsertCourseContent({
    slug: "belajar-javascript-dari-nol-sampai-async",
    title: "Belajar JavaScript: Dari Nol sampai Async",
    description:
      "Kursus JavaScript lengkap dan mendalam: pengenalan, variabel dan tipe data, kontrol alur (if/else, switch, loop), fungsi & closure, array method & JSON, DOM & event, asynchronous (Promise & async/await), hingga latihan API eksternal dengan fetch. Setiap materi dilengkapi beberapa contoh kode bertahap dan studi kasus nyata.",
    defaultStatus: "PUBLISHED",
    tags: [{ name: "JavaScript", slug: "javascript", category: "Language" }],
    parts: [...JS_PARTS_1_4, ...JS_PARTS_5_8],
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
