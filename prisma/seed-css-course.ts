/**
 * Seed course "Belajar CSS & Tailwind" (versi mendalam).
 *
 * Jalankan: npm run seed:css
 */
import { prisma } from "../src/db/prisma";
import { upsertCourseContent } from "./content/helpers";
import { CSS_PARTS_1_3 } from "./content/css/parts-1-3";
import { CSS_PARTS_4_6 } from "./content/css/parts-4-6";

async function main() {
  await upsertCourseContent({
    slug: "belajar-css-tailwind-dari-dasar",
    title: "Belajar CSS & Tailwind: Dari Dasar sampai Siap Pakai",
    description:
      "Kursus CSS lengkap dan mendalam: pengenalan CSS, tiga cara memakai CSS klasik, cascade & specificity, contoh CSS nyata (warna, tipografi, box model, layout, flexbox), lalu beralih ke Tailwind via CDN, utility dasar, responsive, dark mode, dan tiga proyek praktik.",
    defaultStatus: "PUBLISHED",
    tags: [
      { name: "CSS", slug: "css", category: "Language" },
      { name: "Tailwind CSS", slug: "tailwind-css", category: "Frontend" },
    ],
    parts: [...CSS_PARTS_1_3, ...CSS_PARTS_4_6],
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
