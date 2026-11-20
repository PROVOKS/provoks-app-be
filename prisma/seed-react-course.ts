/**
 * Seed course "Belajar React.js & TypeScript: Dari Komponen sampai Aplikasi".
 *
 * Jalankan: npm run seed:react
 * Course ini tidak punya prasyarat; bisa diakses semua siswa di path terkait.
 */
import { prisma } from "../src/db/prisma";
import { upsertCourseContent } from "./content/helpers";
import { REACT_PARTS_1_4 } from "./content/react/parts-1-4";
import { REACT_PARTS_5_8 } from "./content/react/parts-5-8";

async function main() {
  await upsertCourseContent({
    slug: "belajar-react-js-typescript-dari-komponen-sampai-aplikasi",
    title: "Belajar React.js & TypeScript: Dari Komponen sampai Aplikasi",
    description:
      "Kursus React 19 + TypeScript + Vite: komponen & JSX, props, state, component life cycle, hooks, useEffect, data fetching, useReducer, Context, React Router, form, testing dengan Vitest & React Testing Library, build/deploy, dan proyek akhir. Praktik memakai satu proyek react-latihan berkelanjutan dengan briefing dependency dan perintah npm yang bisa dijalankan langsung.",
    defaultStatus: "PUBLISHED",
    tags: [
      { name: "React", slug: "react", category: "Frontend" },
      { name: "TypeScript", slug: "typescript", category: "Language" },
      { name: "Frontend", slug: "frontend", category: "Frontend" },
    ],
    parts: [...REACT_PARTS_1_4, ...REACT_PARTS_5_8],
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
