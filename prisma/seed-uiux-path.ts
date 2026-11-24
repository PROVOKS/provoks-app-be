/**
 * Seed 3 course UI/UX Design ke path "ui-ux-pm".
 *
 * Jalankan: npm run seed:uiux
 * Tidak ada kuis pada seed awal; kuis ditambahkan setelah materi mentor siap.
 */
import { prisma } from "../src/db/prisma";
import { upsertCourseContent } from "./content/helpers";
import { UIUX_INFORMATION_ARCHITECTURE_PARTS } from "./content/ui-ux-pm/information-architecture/parts";
import { UIUX_HIGH_FIDELITY_PARTS } from "./content/ui-ux-pm/high-fidelity-figma/parts";
import { UIUX_WEBSITE_PENDEV_PARTS } from "./content/ui-ux-pm/website-pen-dev/parts";

const tags = {
  uiux: { name: "UI/UX", slug: "ui-ux", category: "Design" },
  figma: { name: "Figma", slug: "figma", category: "Design" },
  pendev: { name: "Pen.dev", slug: "pen-dev", category: "Design" },
};

async function main() {
  await upsertCourseContent({
    slug: "belajar-ui-ux-information-architecture-user-flow-low-fidelity",
    title: "Belajar UI/UX: Information Architecture, User Flow & Low-Fidelity",
    description:
      "Course UI/UX dasar: peran UI/UX, perbedaan UI dan UX, fitur dan komponen umum, Information Architecture, user flow, serta wireframe low-fidelity. Praktik memakai Figma dengan file latihan berkelanjutan.",
    defaultStatus: "PUBLISHED",
    pathSlug: "ui-ux-pm",
    publishPath: true,
    matchBySlugOnly: true,
    tags: [tags.uiux, tags.figma],
    parts: UIUX_INFORMATION_ARCHITECTURE_PARTS,
  });

  await upsertCourseContent({
    slug: "belajar-ui-ux-high-fidelity-figma",
    title: "Belajar UI/UX: High-Fidelity di Figma",
    description:
      "Course UI/UX lanjutan: mengubah wireframe menjadi high-fidelity dengan warna, tipografi, spasi, ikon, gambar, style guide, dan prototype di Figma. Ditutup dengan checklist review dan tugas akhir.",
    defaultStatus: "PUBLISHED",
    pathSlug: "ui-ux-pm",
    publishPath: true,
    matchBySlugOnly: true,
    tags: [tags.uiux, tags.figma],
    parts: UIUX_HIGH_FIDELITY_PARTS,
  });

  await upsertCourseContent({
    slug: "belajar-ui-ux-website-pen-dev",
    title: "Belajar UI/UX: Website dari Nol dengan Pen.dev",
    description:
      "Course UI/UX berbasis AI: membangun fondasi desain sebelum membuat halaman, mengumpulkan referensi, membuat design system foundation, homepage, varian mobile, dan reusable components dengan Pen.dev.",
    defaultStatus: "PUBLISHED",
    pathSlug: "ui-ux-pm",
    publishPath: true,
    matchBySlugOnly: true,
    tags: [tags.uiux, tags.pendev],
    parts: UIUX_WEBSITE_PENDEV_PARTS,
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
