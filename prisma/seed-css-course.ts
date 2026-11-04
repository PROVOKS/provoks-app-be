/**
 * Seed course "Belajar CSS & Tailwind: Dari Dasar sampai Siap Pakai".
 *
 * Jalankan: npm run seed:css
 *
 * Idempotent: course dengan slug yang sama akan dibangun ulang bagiannya
 * (course lain tidak disentuh).
 */
import { prisma } from "../src/db/prisma";
import { Prisma } from "../src/generated/prisma/client";
import { slugify } from "../src/utils/slug";

type QuizQuestionDef = { q: string; options: string[]; answer: number };

type Block =
  | { type: "HEADING"; content: { level: number; text: string } }
  | { type: "PARAGRAPH"; content: { html: string } }
  | { type: "CODE"; content: { language: string; code: string } }
  | { type: "CALLOUT"; content: { variant: string; text: string } }
  | { type: "DIVIDER"; content: Record<string, never> }
  | {
      type: "QUIZ";
      content: { title: string; timeLimitMinutes: number; maxAttempts: number };
      questions: QuizQuestionDef[];
    };

type Lesson = {
  title: string;
  duration: number;
  type?: "ARTICLE" | "QUIZ";
  blocks: Block[];
};

type CoursePartDef = {
  name: string;
  description: string;
  lessons: Lesson[];
};

const h = (text: string, level = 2): Block => ({
  type: "HEADING",
  content: { level, text },
});
const p = (html: string): Block => ({
  type: "PARAGRAPH",
  content: { html },
});
const code = (src: string, language = "css"): Block => ({
  type: "CODE",
  content: { language, code: src.trim() },
});
const callout = (
  variant: "info" | "success" | "warning" | "danger",
  text: string,
): Block => ({ type: "CALLOUT", content: { variant, text } });
const divider = (): Block => ({ type: "DIVIDER", content: {} });
const quiz = (
  title: string,
  questions: QuizQuestionDef[],
  settings: { timeLimitMinutes?: number; maxAttempts?: number } = {},
): Block => ({
  type: "QUIZ",
  content: {
    title,
    timeLimitMinutes: settings.timeLimitMinutes ?? 15,
    maxAttempts: settings.maxAttempts ?? 3,
  },
  questions,
});

const PARTS: CoursePartDef[] = [
  // ----------------------------------------------------------
  {
    name: "Pengenalan CSS",
    description:
      "Memahami peran CSS, anatomi aturan, dan selector yang dipakai sehari-hari.",
    lessons: [
      {
        title: "Apa Itu CSS & Perannya",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Setelah materi ini kamu bisa menjelaskan apa itu CSS dan bedanya dengan HTML.</p>",
          ),
          h("CSS itu apa?"),
          p(
            "<p><strong>CSS</strong> (Cascading Style Sheets) adalah bahasa untuk mengatur <em>tampilan</em> halaman: warna, ukuran, jarak, font, dan tata letak.</p><p>Pembagian tugasnya: <strong>HTML</strong> menyusun struktur, <strong>CSS</strong> mengatur tampilan, <strong>JavaScript</strong> menambah perilaku.</p>",
          ),
          code(`
<article class="kartu">
  <h2>Belajar CSS</h2>
  <p>CSS membuat halaman lebih nyaman dibaca.</p>
</article>

<style>
  .kartu {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 12px;
    background: #fafafa;
  }
</style>
`, "html"),
          callout(
            "info",
            "Tanpa CSS, semua halaman web akan tampil sebagai teks polos dengan susunan dari atas ke bawah.",
          ),
          divider(),
        ],
      },
      {
        title: "Anatomi Aturan CSS",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membaca dan menulis aturan CSS dengan benar: selector, property, dan value.</p>",
          ),
          code(`
selector {
  property: value;
  property: value;
}
`),
          p(
            "<ul><li><strong>Selector</strong> — elemen yang ingin diatur.</li><li><strong>Property</strong> — hal yang diubah (warna, ukuran, jarak).</li><li><strong>Value</strong> — nilai yang dipakai.</li><li>Tiap deklarasi diakhiri titik koma.</li></ul>",
          ),
          code(`
h1 {
  color: #e64a19;
  font-size: 28px;
  text-align: center;
}
`),
          callout(
            "warning",
            "Lupa titik koma pada deklarasi terakhir memang sering dimaafkan browser, tapi bisa membuat deklarasi berikutnya gagal. Biasakan selalu menutup dengan titik koma.",
          ),
          divider(),
        ],
      },
      {
        title: "Selector Dasar",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memakai selector tag, class, id, universal, grouping, dan turunan.</p>"),
          code(`
/* tag */
p { line-height: 1.6; }

/* class — dipakai berulang */
.card { padding: 16px; border-radius: 12px; }

/* id — unik, satu per halaman */
#hero { background: #111; color: white; }

/* universal */
* { box-sizing: border-box; }

/* grouping */
h1, h2, h3 { font-family: system-ui, sans-serif; }

/* turunan */
.card a { color: #e64a19; }
`),
          p(
            "<p>Aturan praktis: pakai <strong>class</strong> untuk styling yang berulang, gunakan <strong>id</strong> hanya untuk satu elemen khusus, dan hindari selector terlalu dalam.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Pengenalan CSS",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Pengenalan CSS"),
          p("<p>Uji pemahaman tentang peran CSS, aturan, dan selector.</p>"),
          quiz("Kuis Pengenalan CSS", [
            {
              q: "Kepanjangan CSS adalah...",
              options: [
                "Cascading Style Sheets",
                "Computer Style System",
                "Creative Style Sheet",
                "Cascading Sheet System",
              ],
              answer: 0,
            },
            {
              q: "Tugas utama CSS adalah...",
              options: [
                "Menyusun struktur halaman",
                "Mengatur tampilan halaman",
                "Menyimpan data",
                "Mengirim request ke server",
              ],
              answer: 1,
            },
            {
              q: "Bagian `color: red;` pada CSS disebut...",
              options: ["Selector", "Declaration", "Aturan", "Komentar"],
              answer: 1,
            },
            {
              q: "Selector untuk class bernama card adalah...",
              options: ["#card", ".card", "card", "*card"],
              answer: 1,
            },
            {
              q: "Selector yang paling tepat untuk banyak elemen serupa adalah...",
              options: ["id", "class", "inline style", "!important"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  {
    name: 'Cara Pakai CSS "Lama"',
    description:
      "Tiga cara menyisipkan CSS klasik, plus cara kerja cascade dan specificity.",
    lessons: [
      {
        title: "Inline Style",
        duration: 10,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengenal inline style dan kenapa sebaiknya tidak dipakai untuk proyek nyata.</p>"),
          code(`
<p style="color: red; font-size: 18px;">
  Teks ini diwarnai langsung di elemennya.
</p>
`, "html"),
          p(
            "<p>Kelebihan: cepat untuk uji coba. Kekurangan: tidak bisa dipakai ulang, susah dirawat, dan mengalahkan hampir semua aturan lain.</p>",
          ),
          callout(
            "warning",
            "Hindari inline style untuk kode produksi. Pakai class di file CSS supaya mudah diubah dan dipakai ulang.",
          ),
          divider(),
        ],
      },
      {
        title: "Internal Style",
        duration: 10,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menulis CSS di dalam tag <code>&lt;style&gt;</code> pada bagian <code>head</code>.</p>"),
          code(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Internal CSS</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 24px;
    }
    h1 { color: #e64a19; }
  </style>
</head>
<body>
  <h1>Halo CSS</h1>
</body>
</html>
`, "html"),
          p(
            "<p>Cocok untuk halaman tunggal atau latihan. Untuk situs dengan banyak halaman, CSS akan terduplikasi di setiap file.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "External CSS & Struktur Folder",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memisahkan CSS ke file terpisah dan menghubungkannya lewat <code>&lt;link&gt;</code>.</p>"),
          code(
            `
proyek/
├── index.html
├── tentang.html
├── css/
│   └── style.css
└── gambar/
    └── logo.png
`,
            "bash",
          ),
          code(`
<link rel="stylesheet" href="css/style.css">
`, "html"),
          code(`
/* css/style.css */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

.judul {
  color: #e64a19;
}
`),
          p(
            "<p>Satu file CSS bisa dipakai semua halaman. Ini cara yang dipakai di hampir semua proyek nyata.</p>",
          ),
          callout(
            "success",
            "Urutan tag <link> berpengaruh: file yang dimuat belakangan menimpa aturan yang sama.",
          ),
          divider(),
        ],
      },
      {
        title: "Cascade, Specificity & !important",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memahami kenapa satu aturan menang atas aturan lain.</p>"),
          code(`
p { color: black; }        /* selector tag */
.teks { color: blue; }     /* class (lebih kuat) */
#paragraf { color: red; }  /* id (lebih kuat lagi) */
`),
          p(
            "<p>Urutan kekuatan: <strong>inline style</strong> &gt; <strong>id</strong> &gt; <strong>class / atribut / pseudo-class</strong> &gt; <strong>tag</strong>. Kalau kekuatannya sama, aturan yang ditulis <em>terakhir</em> yang menang.</p>",
          ),
          code(`
.teks { color: blue; }
.teks { color: green; } /* menang karena ditulis terakhir */
`),
          callout(
            "warning",
            "Hindari !important sebisa mungkin. Kalau sampai butuh, biasanya struktur CSS-nya perlu dirapikan.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Cara Pakai CSS",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Cara Pakai CSS"),
          p("<p>Uji pemahaman tentang inline, internal, external, dan cascade.</p>"),
          quiz("Kuis Cara Pakai CSS", [
            {
              q: "Cara memakai CSS yang paling disarankan untuk proyek nyata adalah...",
              options: ["Inline style", "Internal style", "External CSS", "Atribut bgcolor"],
              answer: 2,
            },
            {
              q: "Tag untuk menghubungkan file CSS eksternal adalah...",
              options: ["<style>", "<link rel=\"stylesheet\">", "<script>", "<css>"],
              answer: 1,
            },
            {
              q: "Selector mana yang paling kuat?",
              options: ["p", ".teks", "#paragraf", "*"],
              answer: 2,
            },
            {
              q: "Kalau dua aturan punya kekuatan sama, yang menang adalah...",
              options: [
                "Yang ditulis lebih dulu",
                "Yang ditulis terakhir",
                "Yang lebih pendek",
                "Yang memakai !important",
              ],
              answer: 1,
            },
            {
              q: "Kekurangan inline style adalah...",
              options: [
                "Tidak bisa dijalankan browser",
                "Tidak bisa dipakai ulang dan susah dirawat",
                "Selalu kalah dari class",
                "Tidak mendukung warna",
              ],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  {
    name: "Contoh CSS Biasa",
    description:
      "Contoh nyata CSS klasik: warna, teks, box model, layout, dan flexbox.",
    lessons: [
      {
        title: "Warna & Background",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengatur warna teks, latar, dan gradien.</p>"),
          code(`
:root {
  --utama: #e64a19;
  --gelap: #1f2937;
}

body {
  color: var(--gelap);
  background-color: #f9fafb;
}

.tombol {
  color: white;
  background-color: var(--utama);
}

.gradien {
  background-image: linear-gradient(135deg, #e64a19, #f59e0b);
}
`),
          p(
            "<p>Warna bisa ditulis sebagai nama (<code>red</code>), hex (<code>#e64a19</code>), <code>rgb()</code>, atau <code>hsl()</code>. Variabel CSS memudahkan konsistensi.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Teks & Font",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengatur font, ukuran, ketebalan, jarak baris, dan perataan teks.</p>"),
          code(`
body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.teks-redup {
  color: #6b7280;
  text-align: center;
  text-transform: uppercase;
}
`),
          callout(
            "info",
            "Gunakan font-family dengan beberapa cadangan supaya tampilan tetap rapi kalau font utama tidak tersedia.",
          ),
          divider(),
        ],
      },
      {
        title: "Box Model",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memahami margin, padding, border, dan <code>box-sizing</code>.</p>"),
          code(`
.kotak {
  box-sizing: border-box;
  width: 300px;
  padding: 16px;
  border: 2px solid #e64a19;
  border-radius: 12px;
  margin: 24px auto;
  background: white;
}
`),
          p(
            "<ul><li><strong>Content</strong> — isi elemen.</li><li><strong>Padding</strong> — jarak dalam, antara isi dan border.</li><li><strong>Border</strong> — garis tepi.</li><li><strong>Margin</strong> — jarak luar antar elemen.</li></ul>",
          ),
          callout(
            "warning",
            "Tanpa <code>box-sizing: border-box</code>, width dihitung tanpa padding dan border sehingga elemen lebih lebar dari yang kamu kira.",
          ),
          divider(),
        ],
      },
      {
        title: "Display, Position & Float",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengenal layout klasik sebelum flexbox: display, position, dan float.</p>"),
          code(`
.inline { display: inline; }
.block { display: block; }
.tersembunyi { display: none; }

.kartu { position: relative; }
.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

.gambar-kiri { float: left; margin-right: 12px; }
.clear { clear: both; }
`),
          p(
            "<p><code>position: absolute</code> diposisikan relatif terhadap parent terdekat yang <code>position: relative</code>. <code>float</code> dulu dipakai untuk layout kolom, tapi sekarang lebih baik pakai flexbox atau grid.</p>",
          ),
          callout(
            "info",
            "Materi ini penting untuk membaca kode lama. Untuk proyek baru, langsung pakai flexbox/grid.",
          ),
          divider(),
        ],
      },
      {
        title: "Flexbox Dasar",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menyusun elemen satu baris atau satu kolom dengan flexbox.</p>"),
          code(`
.baris {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.kiri { flex: 1; min-width: 0; }
`),
          p(
            "<ul><li><code>display: flex</code> mengaktifkan flexbox pada container.</li><li><code>justify-content</code> mengatur sumbu utama.</li><li><code>align-items</code> mengatur sumbu silang.</li><li><code>gap</code> memberi jarak antar anak.</li><li><code>flex-wrap</code> membolehkan turun baris.</li></ul>",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis CSS Dasar",
        duration: 12,
        type: "QUIZ",
        blocks: [
          h("Kuis CSS Dasar"),
          p("<p>Uji pemahaman tentang warna, teks, box model, dan layout.</p>"),
          quiz("Kuis CSS Dasar", [
            {
              q: "Properti untuk memberi jarak di dalam elemen adalah...",
              options: ["margin", "padding", "border", "gap"],
              answer: 1,
            },
            {
              q: "Agar width sudah termasuk padding dan border, dipakai...",
              options: [
                "box-sizing: border-box",
                "box-sizing: content-box",
                "width: 100%",
                "overflow: hidden",
              ],
              answer: 0,
            },
            {
              q: "Properti untuk mengatur jarak antar anak pada flexbox adalah...",
              options: ["margin", "gap", "padding", "space-between"],
              answer: 1,
            },
            {
              q: "Position yang diposisikan relatif terhadap parent terdekat ber-position adalah...",
              options: ["static", "relative", "absolute", "fixed"],
              answer: 2,
            },
            {
              q: "Untuk membuat elemen turun baris saat ruang habis dipakai...",
              options: ["flex-wrap: wrap", "display: block", "overflow: auto", "float: none"],
              answer: 0,
            },
            {
              q: "Layout modern yang disarankan dibanding float adalah...",
              options: ["table", "flexbox/grid", "iframe", "position: static"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  {
    name: "Pengenalan Tailwind + CDN",
    description:
      "Beralih ke utility-first: kenapa Tailwind, cara pasang lewat CDN, dan cara membaca kelasnya.",
    lessons: [
      {
        title: "Kenapa Tailwind?",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memahami pendekatan utility-first dan bedanya dengan CSS biasa.</p>"),
          h("CSS biasa"),
          code(`
<div class="kartu">...</div>

<style>
  .kartu {
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: white;
  }
</style>
`, "html"),
          h("Tailwind"),
          code(`
<div class="p-4 rounded-xl border border-gray-200 bg-white">
  ...
</div>
`, "html"),
          p(
            "<p>Tailwind menyediakan kelas siap pakai untuk setiap properti. Tidak perlu menamai class sendiri, dan tampilan langsung terlihat dari markup. Kekurangannya: markup jadi lebih ramai.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Pasang Tailwind via CDN",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memakai Tailwind langsung di file HTML tanpa build tool.</p>"),
          code(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind via CDN</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-6">
  <h1 class="text-2xl font-bold text-orange-600">
    Halo Tailwind
  </h1>
  <p class="mt-2 text-gray-600">
    Tailwind aktif lewat CDN.
  </p>
</body>
</html>
`, "html"),
          callout(
            "warning",
            "CDN cocok untuk belajar dan prototipe. Untuk produksi, Tailwind sebaiknya di-install lewat npm agar CSS yang dihasilkan lebih kecil.",
          ),
          p(
            "<p>Setelah script CDN dimuat, semua class Tailwind bisa langsung dipakai di atribut <code>class</code>. Tidak perlu file CSS terpisah.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Membaca Kelas Utility & Skala",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Membaca pola nama class Tailwind dan skala angkanya.</p>"),
          code(`
<!-- pola: properti-nilai -->
<p class="p-4 text-sm font-semibold text-gray-700">
  Contoh pemakaian utility
</p>

<!-- skala spacing: 1 = 0.25rem = 4px -->
<div class="p-1">4px</div>
<div class="p-2">8px</div>
<div class="p-4">16px</div>
<div class="p-6">24px</div>
<div class="p-8">32px</div>
`, "html"),
          p(
            "<ul><li><code>p-</code> padding, <code>m-</code> margin, <code>gap-</code> jarak grid/flex.</li><li><code>text-</code> ukuran/warna teks, <code>bg-</code> background.</li><li>Angka mengikuti skala: <code>4</code> = 1rem = 16px.</li><li>Arah: <code>t/r/b/l/x/y</code> (atas/kanan/bawah/kiri/horizontal/vertikal).</li></ul>",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Tailwind & CDN",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Pengenalan Tailwind"),
          p("<p>Uji pemahaman tentang utility-first dan pemasangan CDN.</p>"),
          quiz("Kuis Tailwind & CDN", [
            {
              q: "Pendekatan Tailwind disebut...",
              options: ["utility-first", "component-first", "class-first", "inline-first"],
              answer: 0,
            },
            {
              q: "Script CDN Tailwind yang benar adalah...",
              options: [
                "https://cdn.tailwindcss.com",
                "https://cdn.tailwind.com/app.js",
                "https://tailwind.cdn/style.css",
                "https://cdn.csswind.com",
              ],
              answer: 0,
            },
            {
              q: "Class `p-4` berarti...",
              options: ["padding 4px", "padding 1rem (16px)", "margin 4px", "font-size 4px"],
              answer: 1,
            },
            {
              q: "Class untuk background adalah...",
              options: ["color-", "bg-", "background-", "fill-"],
              answer: 1,
            },
            {
              q: "Kapan CDN sebaiknya tidak dipakai?",
              options: [
                "Saat belajar",
                "Saat prototipe",
                "Saat produksi",
                "Saat membuat 1 halaman",
              ],
              answer: 2,
            },
          ]),
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  {
    name: "Basic Tailwind",
    description:
      "Utility inti Tailwind: spacing, warna, tipografi, layout, sizing, dan responsive.",
    lessons: [
      {
        title: "Spacing: Padding, Margin & Gap",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengatur jarak dengan utility Tailwind.</p>"),
          code(`
<!-- padding -->
<div class="p-4">semua sisi</div>
<div class="px-6 py-2">horizontal 24px, vertikal 8px</div>

<!-- margin -->
<div class="mt-4 mb-8">atas 16px, bawah 32px</div>
<div class="mx-auto max-w-md">tengah horizontal</div>

<!-- gap pada flex/grid -->
<div class="flex gap-3">...</div>
<div class="grid grid-cols-2 gap-4">...</div>
`, "html"),
          p(
            "<p><code>mx-auto</code> dipakai untuk menengahkan blok yang punya lebar tetap. Untuk jarak vertikal antar paragraf, <code>space-y-*</code> lebih ringkas.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Warna & Background",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memakai palet warna Tailwind dan variasinya.</p>"),
          code(`
<p class="text-gray-700">Teks abu tua</p>
<p class="text-orange-600">Teks oranye</p>
<div class="bg-gray-100 p-4">Latar abu muda</div>
<div class="bg-orange-500 text-white p-4">Latar oranye</div>
<div class="border border-gray-300 rounded-lg p-4">Border abu</div>
`, "html"),
          p(
            "<p>Formatnya <code>{properti}-{warna}-{tingkat}</code>. Tingkat 50 paling terang, 950 paling gelap. Warna custom bisa ditambahkan lewat konfigurasi.</p>",
          ),
          callout(
            "info",
            "Untuk teks di atas background berwarna, gunakan <code>text-white</code> dan pastikan kontrasnya cukup.",
          ),
          divider(),
        ],
      },
      {
        title: "Typography",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengatur ukuran, ketebalan, jarak baris, dan perataan teks.</p>"),
          code(`
<h1 class="text-3xl font-bold tracking-tight">Judul</h1>
<h2 class="text-xl font-semibold">Sub Judul</h2>
<p class="text-base leading-relaxed text-gray-600">Isi paragraf.</p>
<p class="text-sm text-gray-500">Catatan kecil</p>
<p class="text-center uppercase text-xs tracking-widest">Label</p>
`, "html"),
          p(
            "<p>Ukuran teks: <code>text-xs</code> sampai <code>text-9xl</code>. Ketebalan: <code>font-light</code> sampai <code>font-black</code>. <code>leading-*</code> mengatur jarak baris.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Flexbox & Grid di Tailwind",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menyusun layout dengan utility flex dan grid.</p>"),
          code(`
<div class="flex items-center justify-between gap-4">
  <span>Kiri</span>
  <span>Kanan</span>
</div>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <div class="rounded-xl border p-4">Kartu 1</div>
  <div class="rounded-xl border p-4">Kartu 2</div>
  <div class="rounded-xl border p-4">Kartu 3</div>
</div>
`, "html"),
          p(
            "<ul><li><code>flex</code>, <code>items-*</code>, <code>justify-*</code>, <code>gap-*</code> untuk satu dimensi.</li><li><code>grid</code>, <code>grid-cols-*</code> untuk dua dimensi.</li><li><code>col-span-*</code> untuk menggabungkan kolom.</li></ul>",
          ),
          divider(),
        ],
      },
      {
        title: "Sizing, Border, Rounded & Shadow",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengatur ukuran, sudut, dan bayangan elemen.</p>"),
          code(`
<div class="w-full max-w-md min-h-40 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
  <p class="text-sm text-gray-600">Kartu dengan bayangan.</p>
</div>

<img src="foto.jpg" alt="Contoh" class="h-48 w-full rounded-xl object-cover">
`, "html"),
          p(
            "<p>Satuan lebar: <code>w-{skala}</code>, <code>w-full</code>, <code>w-1/2</code>, <code>w-screen</code>. <code>max-w-*</code> membatasi lebar maksimum. <code>object-cover</code> membuat gambar mengisi area tanpa gepeng.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Responsive & Dark Mode",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Membuat layout berubah sesuai ukuran layar dan tema gelap.</p>"),
          code(`
<div class="p-4 sm:p-6 lg:p-8">
  <h1 class="text-xl sm:text-2xl lg:text-4xl">Responsif</h1>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    ...
  </div>
</div>

<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
  Mendukung dark mode
</div>
`, "html"),
          p(
            "<p>Breakpoint Tailwind: <code>sm</code> 640px, <code>md</code> 768px, <code>lg</code> 1024px, <code>xl</code> 1280px. Tulis class dasar untuk mobile, lalu tambahkan varian untuk layar lebih besar.</p>",
          ),
          callout(
            "warning",
            "Dark mode lewat CDN otomatis mengikuti preferensi sistem. Untuk toggle manual, perlu konfigurasi <code>darkMode: 'class'</code>.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Basic Tailwind",
        duration: 12,
        type: "QUIZ",
        blocks: [
          h("Kuis Basic Tailwind"),
          p("<p>Uji pemahaman utility inti Tailwind.</p>"),
          quiz("Kuis Basic Tailwind", [
            {
              q: "Class untuk padding horizontal 24px dan vertikal 8px adalah...",
              options: ["p-6 p-2", "px-6 py-2", "pt-6 pb-2", "m-6 m-2"],
              answer: 1,
            },
            {
              q: "Class `text-orange-600` mengatur...",
              options: ["warna background", "warna teks", "ukuran teks", "border"],
              answer: 1,
            },
            {
              q: "Untuk membuat grid 3 kolom di layar besar dipakai...",
              options: ["lg:grid-cols-3", "grid-3", "cols-lg-3", "lg:flex-3"],
              answer: 0,
            },
            {
              q: "Class untuk menengahkan blok dengan lebar maksimum adalah...",
              options: ["mx-auto", "my-auto", "text-center", "items-center"],
              answer: 0,
            },
            {
              q: "Breakpoint `md` pada Tailwind berarti...",
              options: ["480px", "640px", "768px", "1024px"],
              answer: 2,
            },
            {
              q: "Class `object-cover` berguna untuk...",
              options: [
                "Gambar mengisi area tanpa gepeng",
                "Mengubah warna gambar",
                "Menambah border",
                "Menengahkan gambar",
              ],
              answer: 0,
            },
          ]),
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  {
    name: "Praktik & Penutup",
    description:
      "Tiga proyek Tailwind lengkap, ujian akhir, dan langkah lanjutan.",
    lessons: [
      {
        title: "Praktik 1 — Kartu Profil",
        duration: 20,
        blocks: [
          h("Tujuan Praktik"),
          p("<p>Membuat kartu profil dengan Tailwind: avatar, teks, dan tombol.</p>"),
          code(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kartu Profil</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex min-h-screen items-center justify-center bg-gray-100 p-6">
  <div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
    <img
      src="https://i.pravatar.cc/160"
      alt="Foto profil"
      class="mx-auto size-24 rounded-full object-cover">

    <h1 class="mt-4 text-xl font-bold text-gray-900">Budi Santoso</h1>
    <p class="text-sm text-gray-500">Frontend Developer</p>

    <p class="mt-3 text-sm leading-relaxed text-gray-600">
      Sedang belajar CSS dan Tailwind untuk membangun antarmuka yang rapi.
    </p>

    <div class="mt-5 flex gap-2">
      <button class="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
        Ikuti
      </button>
      <button class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
        Pesan
      </button>
    </div>
  </div>
</body>
</html>
`, "html"),
          callout(
            "success",
            "Perhatikan bagaimana setiap properti CSS punya padanan class Tailwind: padding, warna, rounded, shadow, dan hover.",
          ),
        ],
      },
      {
        title: "Praktik 2 — Landing Page Responsive",
        duration: 25,
        blocks: [
          h("Tujuan Praktik"),
          p("<p>Menyusun hero dan kartu fitur yang berubah kolom sesuai layar.</p>"),
          code(`
<section class="mx-auto max-w-5xl px-4 py-16">
  <div class="text-center">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
      Belajar Web dari Nol
    </h1>
    <p class="mx-auto mt-3 max-w-xl text-gray-600">
      Mulai dari HTML, lanjut CSS, lalu Tailwind.
    </p>
    <a href="#" class="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">
      Mulai Belajar
    </a>
  </div>

  <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <article class="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 class="font-semibold text-gray-900">Materi Terstruktur</h2>
      <p class="mt-2 text-sm text-gray-600">Dari dasar sampai praktik.</p>
    </article>
    <article class="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 class="font-semibold text-gray-900">Kuis Tiap Bagian</h2>
      <p class="mt-2 text-sm text-gray-600">Uji pemahaman sebelum lanjut.</p>
    </article>
    <article class="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 class="font-semibold text-gray-900">Proyek Nyata</h2>
      <p class="mt-2 text-sm text-gray-600">Bangun halaman utuh.</p>
    </article>
  </div>
</section>
`, "html"),
          callout(
            "info",
            "Coba perkecil jendela browser: kartu otomatis jadi 1 kolom, lalu 2, lalu 3.",
          ),
        ],
      },
      {
        title: "Praktik 3 — Navbar + Hero dengan Dark Mode",
        duration: 25,
        blocks: [
          h("Tujuan Praktik"),
          p("<p>Membuat navbar responsif dan hero yang mendukung mode gelap.</p>"),
          code(`
<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
    <span class="font-bold text-gray-900 dark:text-white">Belajar Web</span>

    <div class="hidden gap-6 text-sm text-gray-600 sm:flex dark:text-gray-300">
      <a href="#materi" class="hover:text-orange-600">Materi</a>
      <a href="#harga" class="hover:text-orange-600">Harga</a>
      <a href="#kontak" class="hover:text-orange-600">Kontak</a>
    </div>

    <a href="#daftar" class="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
      Daftar
    </a>
  </nav>
</header>

<section class="bg-white px-4 py-20 dark:bg-gray-900">
  <div class="mx-auto max-w-3xl text-center">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
      Kuasai CSS & Tailwind
    </h1>
    <p class="mt-4 text-gray-600 dark:text-gray-300">
      Dari CSS klasik sampai utility-first.
    </p>
  </div>
</section>
`, "html"),
          callout(
            "warning",
            "Menu navigasi di atas disembunyikan di layar kecil (<code>hidden sm:flex</code>). Di proyek nyata, tambahkan tombol menu untuk mobile.",
          ),
        ],
      },
      {
        title: "Kuis Akhir CSS & Tailwind",
        duration: 15,
        type: "QUIZ",
        blocks: [
          h("Ujian Akhir CSS & Tailwind"),
          p("<p>Kuis campuran dari seluruh materi.</p>"),
          quiz("Ujian Akhir CSS & Tailwind", [
            {
              q: "Selector untuk id bernama hero adalah...",
              options: [".hero", "#hero", "hero", "*hero"],
              answer: 1,
            },
            {
              q: "Cara memakai CSS yang paling mudah dirawat adalah...",
              options: ["inline", "internal", "external", "atribut HTML"],
              answer: 2,
            },
            {
              q: "Properti untuk jarak luar elemen adalah...",
              options: ["padding", "margin", "border", "gap"],
              answer: 1,
            },
            {
              q: "Untuk layout satu dimensi paling tepat memakai...",
              options: ["float", "table", "flexbox", "iframe"],
              answer: 2,
            },
            {
              q: "Script CDN Tailwind ditulis di...",
              options: ["body", "head", "footer", "file CSS"],
              answer: 1,
            },
            {
              q: "Class `p-4` setara dengan padding...",
              options: ["4px", "8px", "12px", "16px"],
              answer: 3,
            },
            {
              q: "Class untuk lebar maksimum dan tengah adalah...",
              options: ["max-w-md mx-auto", "w-md center", "mx-md", "max-w-full my-auto"],
              answer: 0,
            },
            {
              q: "Prefix breakpoint untuk layar >= 1024px adalah...",
              options: ["sm:", "md:", "lg:", "xl:"],
              answer: 2,
            },
            {
              q: "Class `dark:bg-gray-900` aktif saat...",
              options: [
                "Selalu",
                "Mode gelap aktif",
                "Layar kecil",
                "Hover",
              ],
              answer: 1,
            },
            {
              q: "Setelah CSS, bahasa untuk menambah interaksi adalah...",
              options: ["SQL", "PHP", "JavaScript", "Python"],
              answer: 2,
            },
          ]),
        ],
      },
      {
        title: "Ringkasan & Langkah Selanjutnya",
        duration: 8,
        blocks: [
          h("Yang sudah kamu pelajari"),
          p(
            "<ul><li>Peran CSS, anatomi aturan, dan selector.</li><li>Tiga cara memakai CSS klasik + cascade & specificity.</li><li>Contoh CSS nyata: warna, teks, box model, layout, flexbox.</li><li>Tailwind via CDN dan utility dasar.</li><li>Responsive design dengan breakpoint Tailwind.</li></ul>",
          ),
          h("Langkah selanjutnya"),
          p(
            "<ol><li><strong>JavaScript</strong> — logika, DOM, dan async.</li><li><strong>Tailwind npm</strong> — build production tanpa CDN.</li><li><strong>Component design</strong> — menyusun UI yang konsisten.</li></ol>",
          ),
          callout(
            "success",
            "Selamat! Kamu sudah bisa membuat halaman rapi dan responsif dengan CSS maupun Tailwind.",
          ),
        ],
      },
    ],
  },
];

const COURSE_SLUG = "belajar-css-tailwind-dari-dasar";
const COURSE_TITLE = "Belajar CSS & Tailwind: Dari Dasar sampai Siap Pakai";
const COURSE_DESCRIPTION =
  "Kursus CSS lengkap: pengenalan CSS, cara pakai CSS klasik (inline, internal, eksternal), contoh CSS nyata, lalu beralih ke Tailwind via CDN dan utility dasarnya. Ditutup dengan tiga proyek praktik responsif dan kuis di tiap bagian.";

async function main() {
  const cssTag = await prisma.tag.upsert({
    where: { slug: "css" },
    update: {},
    create: { name: "CSS", slug: "css", category: "Language" },
  });
  const tailwindTag = await prisma.tag.upsert({
    where: { slug: "tailwind-css" },
    update: {},
    create: { name: "Tailwind CSS", slug: "tailwind-css", category: "Frontend" },
  });

  const path =
    (await prisma.path.findUnique({ where: { slug: "web-development" } })) ??
    (await prisma.path.findFirst({ orderBy: { createdAt: "asc" } }));

  const course = await prisma.course.upsert({
    where: { slug: COURSE_SLUG },
    update: {
      title: COURSE_TITLE,
      description: COURSE_DESCRIPTION,
      status: "PUBLISHED",
      passingGrade: 70,
      isFastTrack: false,
      pathId: path?.id ?? null,
    },
    create: {
      title: COURSE_TITLE,
      slug: COURSE_SLUG,
      description: COURSE_DESCRIPTION,
      status: "PUBLISHED",
      passingGrade: 70,
      isFastTrack: false,
      pathId: path?.id ?? null,
    },
  });

  await prisma.coursePart.deleteMany({ where: { courseId: course.id } });
  await prisma.courseTag.deleteMany({ where: { courseId: course.id } });
  await prisma.courseTag.createMany({
    data: [
      { courseId: course.id, tagId: cssTag.id },
      { courseId: course.id, tagId: tailwindTag.id },
    ],
  });

  let lessonCount = 0;
  let blockCount = 0;
  let questionCount = 0;

  for (const [partIndex, part] of PARTS.entries()) {
    const coursePart = await prisma.coursePart.create({
      data: {
        courseId: course.id,
        name: part.name,
        description: part.description,
        durationMinutes: part.lessons.reduce((total, l) => total + l.duration, 0),
        order: partIndex,
      },
    });

    for (const [lessonIndex, lesson] of part.lessons.entries()) {
      const silabus = await prisma.silabusPart.create({
        data: {
          coursePartId: coursePart.id,
          title: lesson.title,
          slug: slugify(lesson.title),
          type: lesson.type ?? "ARTICLE",
          durationMinutes: lesson.duration,
          status: "PUBLISHED",
          order: lessonIndex,
        },
      });
      lessonCount += 1;

      for (const [blockIndex, block] of lesson.blocks.entries()) {
        const created = await prisma.contentBlock.create({
          data: {
            silabusPartId: silabus.id,
            type: block.type,
            order: blockIndex,
            content: block.content as Prisma.InputJsonValue,
          },
        });
        blockCount += 1;

        if (block.type === "QUIZ") {
          for (const [qIndex, question] of block.questions.entries()) {
            await prisma.quizQuestion.create({
              data: {
                contentBlockId: created.id,
                question: question.q,
                options: question.options as Prisma.InputJsonValue,
                answerIndex: question.answer,
                points: 1,
                order: qIndex,
              },
            });
            questionCount += 1;
          }
        }
      }
    }
  }

  console.log("Course :", course.title);
  console.log("Slug   :", course.slug);
  console.log("ID     :", course.id);
  console.log("Path   :", path?.name ?? "-");
  console.log("Tag    :", cssTag.name, "+", tailwindTag.name);
  console.log(
    `Isi    : ${PARTS.length} course part · ${lessonCount} silabus · ${blockCount} block · ${questionCount} soal`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
