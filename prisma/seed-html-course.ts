/**
 * Seed course "Belajar HTML: Dari Nol sampai Mahir" (versi mendalam).
 *
 * Jalankan: npm run seed:html
 */
import { prisma } from "../src/db/prisma";
import { upsertCourseContent } from "./content/helpers";
import { HTML_PARTS_1_3 } from "./content/html/parts-1-3";
import { HTML_PARTS_4_6 } from "./content/html/parts-4-6";

async function main() {
  await upsertCourseContent({
    slug: "belajar-html-dari-nol-sampai-mahir",
    title: "Belajar HTML: Dari Nol sampai Mahir",
    description:
      "Kursus HTML lengkap dan mendalam untuk pemula: struktur dokumen, seluruh tag teks dan format, list & tautan, gambar & media, tabel, form dan semua tag input, semantic HTML, meta & SEO, aksesibilitas, serta tiga proyek praktik. Setiap materi dipecah per sub-konsep dengan beberapa contoh kode dan studi kasus.",
    defaultStatus: "PUBLISHED",
    tags: [
      { name: "HTML", slug: "html", category: "Language" },
      { name: "Frontend", slug: "frontend", category: "Frontend" },
    ],
    parts: [...HTML_PARTS_1_3, ...HTML_PARTS_4_6],
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
