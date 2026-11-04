import {
  callout,
  CoursePartDef,
  divider,
  h,
  htmlCode,
  p,
  quiz,
} from "../helpers";

export const CSS_PARTS_4_6: CoursePartDef[] = [
  // ==========================================================
  // PART 4 — PENGENALAN TAILWIND + CDN
  // ==========================================================
  {
    name: "Pengenalan Tailwind + CDN",
    description:
      "Beralih ke utility-first: kenapa Tailwind, cara pasang lewat CDN, dan cara membaca kelasnya.",
    lessons: [
      {
        title: "Kenapa Tailwind?",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami filosofi <em>utility-first</em>, kelebihan dan kekurangannya dibanding CSS klasik, serta kapan Tailwind tepat dipakai.</p>",
          ),
          h("1. Masalah CSS Klasik di Proyek Besar"),
          p(
            "<p>Semakin besar proyek, file CSS cenderung membengkak dan nama class mulai bertabrakan: <code>.card</code>, <code>.card-baru</code>, <code>.card-baru-final</code>. Perubahan kecil bisa berdampak tak terduga di halaman lain.</p>",
          ),
          htmlCode(`
<!-- CSS klasik: butuh class baru + aturan CSS terpisah -->
<div class="kartu">
  <h3 class="kartu-judul">Judul</h3>
  <p class="kartu-isi">Isi kartu</p>
</div>
`),
          h("2. Pendekatan Utility-First"),
          p(
            "<p>Tailwind tidak menyediakan class komponen seperti <code>.kartu</code>. Sebagai gantinya, tersedia ratusan kelas kecil yang masing-masing mengerjakan satu properti CSS. Kita menyusun tampilan langsung di markup.</p>",
          ),
          htmlCode(`
<!-- Tailwind: tanpa file CSS tambahan -->
<div class="rounded-xl border border-gray-200 bg-white p-5">
  <h3 class="font-semibold text-gray-900">Judul</h3>
  <p class="mt-1 text-sm text-gray-600">Isi kartu</p>
</div>
`),
          h("3. Perbandingan Langsung"),
          p(
            "<p>Contoh berikut menghasilkan tampilan yang sama persis, tetapi cara penulisannya berbeda.</p>",
          ),
          htmlCode(`
<!-- CSS klasik -->
<button class="tombol-utama">Simpan</button>
`),
          htmlCode(`
/* file CSS terpisah */
.tombol-utama {
  padding: 10px 18px;
  border-radius: 10px;
  background: #ea580c;
  color: #fff;
  font-weight: 600;
}
.tombol-utama:hover { background: #c2410c; }
`),
          htmlCode(`
<!-- Tailwind -->
<button class="rounded-[10px] bg-orange-600 px-4.5 py-2.5 font-semibold text-white hover:bg-orange-700">
  Simpan
</button>
`),
          callout(
            "info",
            "Kelebihan Tailwind: tidak perlu memikirkan nama class, perubahan langsung terlihat, dan style tidak bocor ke komponen lain. Kekurangan: markup jadi lebih ramai.",
          ),
          h("Studi Kasus: Menilai Dua Pendekatan"),
          p(
            "<p><strong>Skenario:</strong> Tim ingin membuat 12 kartu kursus yang identik. Mana yang lebih cepat dirawat?</p>",
          ),
          htmlCode(`
<!-- Dengan Tailwind: pola class yang sama dipakai ulang di setiap kartu -->
<article class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
  <h3 class="font-semibold">Belajar HTML</h3>
  <p class="mt-1 text-sm text-gray-500">12 materi</p>
</article>

<article class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
  <h3 class="font-semibold">Belajar CSS</h3>
  <p class="mt-1 text-sm text-gray-500">31 materi</p>
</article>
`),
          p(
            "<p>Jika ingin mengubah radius kartu, cukup ganti <code>rounded-2xl</code> menjadi <code>rounded-xl</code> di semua kartu (bisa dicari-ganti sekaligus). Alternatif lain adalah memindahkannya ke komponen React.</p>",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tulis dua versi tombol 'Hapus' berwarna merah — satu dengan CSS klasik, satu dengan utility Tailwind — lalu bandingkan jumlah baris kodenya.",
          ),
          divider(),
        ],
      },
      {
        title: "Pasang Tailwind via CDN",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memasang Tailwind langsung di file HTML memakai script CDN, memverifikasi bahwa ia berjalan, dan memahami batasan CDN untuk produksi.</p>",
          ),
          h("1. Menambahkan Script CDN"),
          p(
            "<p>Sisipkan satu baris script di dalam <code>&lt;head&gt;</code>. Setelah itu semua kelas Tailwind bisa dipakai.</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Latihan Tailwind</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 p-6">
  <h1 class="text-2xl font-bold text-orange-600">Halo Tailwind</h1>
  <p class="mt-2 text-slate-600">Tailwind aktif lewat CDN.</p>
</body>
</html>
`),
          h("2. Memastikan Tailwind Berjalan"),
          p(
            "<p>Jika class dikenali, judul akan berwarna oranye dan tebal. Jika tampil hitam polos, periksa:</p><ul><li>URL script salah ketik.</li><li>Script diletakkan setelah <code>&lt;/body&gt;</code>.</li><li>Tidak ada koneksi internet saat membuka file.</li></ul>",
          ),
          h("3. Menyesuaikan Tema Lewat tailwind.config"),
          p(
            "<p>CDN memungkinkan konfigurasi inline untuk menambah warna atau font kustom.</p>",
          ),
          htmlCode(`
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: {
            50: "#fff7ed",
            500: "#ea580c",
            700: "#c2410c",
          },
        },
        fontFamily: {
          display: ["Georgia", "serif"],
        },
      },
    },
  };
</script>

<!-- Pemakaian -->
<h1 class="font-display text-brand-500">Warna brand kustom</h1>
`),
          h("4. Batasan CDN untuk Produksi"),
          p(
            "<p>CDN memakai compiler yang berjalan di browser. Ukurannya besar dan tidak bisa mem-purge class yang tidak dipakai. Untuk produksi, Tailwind diinstal lewat npm dan di-build.</p>",
          ),
          htmlCode(`
<!-- Belajar / prototipe: CDN -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Produksi: install npm (tidak perlu dibahas detail di kursus ini) -->
<!-- npm install -D tailwindcss -->
`),
          callout(
            "warning",
            "Jangan memakai CDN Tailwind di situs produksi yang serius. Gunakan build npm agar CSS akhir jauh lebih kecil.",
          ),
          h("Studi Kasus: Halaman Cek Status Tailwind"),
          p(
            "<p><strong>Skenario:</strong> Buat halaman uji kecil yang memakai berbagai utility (warna, jarak, border, rounded) untuk memastikan Tailwind benar-benar aktif.</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cek Tailwind</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-slate-100 p-8">
  <div class="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
    <h1 class="text-xl font-bold text-slate-900">Tailwind aktif ✅</h1>
    <p class="mt-2 text-sm text-slate-600">
      Jika kotak ini membulat dan berbayang, semuanya berjalan.
    </p>
    <button class="mt-4 w-full rounded-xl bg-orange-600 px-4 py-2.5 font-semibold text-white">
      Tombol Contoh
    </button>
  </div>
</body>
</html>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan kustom warna bernama 'kampus' (kampus-500: #2563eb) lewat tailwind.config, lalu pakai pada judul.",
          ),
          divider(),
        ],
      },
      {
        title: "Membaca Kelas Utility & Skala",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membaca pola nama class Tailwind (<code>properti-nilai</code>), memahami skala spacing (4px per langkah), serta mengenali variant seperti <code>hover:</code> dan <code>sm:</code>.</p>",
          ),
          h("1. Pola Dasar Nama Class"),
          p(
            "<p>Hampir semua class mengikuti pola <strong>{properti}-{nilai}</strong>. Contoh: <code>text-sm</code>, <code>bg-white</code>, <code>p-4</code>, <code>rounded-lg</code>.</p>",
          ),
          htmlCode(`
<p class="text-sm font-medium text-slate-700">Teks kecil, tebal sedang</p>
<div class="bg-white p-4 rounded-lg border border-slate-200">Kotak putih</div>
`),
          h("2. Skala Spacing: Setiap Angka = 4px"),
          p(
            "<p>Tailwind memakai skala: <code>1</code> = 0.25rem (4px). Jadi <code>p-4</code> = 16px, <code>p-6</code> = 24px, dan seterusnya.</p>",
          ),
          htmlCode(`
<div class="p-1">padding 4px</div>
<div class="p-2">padding 8px</div>
<div class="p-4">padding 16px</div>
<div class="p-6">padding 24px</div>
<div class="p-8">padding 32px</div>
`),
          h("3. Arah pada Properti Spacing"),
          p(
            "<p>Tambahkan huruf arah setelah huruf pertama: <code>t</code> (top), <code>r</code> (right), <code>b</code> (bottom), <code>l</code> (left), <code>x</code> (kiri-kanan), <code>y</code> (atas-bawah).</p>",
          ),
          htmlCode(`
<div class="px-6 py-3">padding horizontal 24px, vertikal 12px</div>
<div class="mt-4 mb-8">margin atas 16px, bawah 32px</div>
<div class="mx-auto max-w-md">tengah dengan lebar maksimum</div>
`),
          h("4. Variant: hover, focus, sm:, dark:"),
          p(
            "<p>Variant ditulis dengan titik dua di depan class. <code>hover:</code> aktif saat kursor di atas elemen, <code>sm:</code> aktif di layar ≥640px, <code>dark:</code> aktif di mode gelap.</p>",
          ),
          htmlCode(`
<button class="bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-2 sm:px-6 sm:py-3 px-4 py-2 rounded-xl">
  Simpan
</button>

<div class="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
  Mode gelap otomatis
</div>
`),
          callout(
            "info",
            "Class tanpa prefix adalah nilai dasar (mobile). Semua variant hanya menimpa pada kondisi tertentu.",
          ),
          h("Studi Kasus: Menerjemahkan CSS Klasik ke Utility Tailwind"),
          p(
            "<p><strong>Skenario:</strong> Diberikan satu blok CSS klasik. Terjemahkan setiap properti menjadi class Tailwind yang setara.</p>",
          ),
          htmlCode(`
<!-- CSS klasik -->
<style>
  .kartu { padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }
  .kartu h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
  .kartu p { font-size: 14px; color: #64748b; }
</style>
`),
          htmlCode(`
<!-- Terjemahan Tailwind -->
<div class="p-5 border border-slate-200 rounded-xl bg-white">
  <h3 class="text-base font-semibold mb-1">Judul</h3>
  <p class="text-sm text-slate-500">Deskripsi kartu.</p>
</div>
`),
          callout(
            "success",
            "Tantangan Mandiri: Terjemahkan .catatan { padding: 12px 16px; border-left: 4px solid #f59e0b; background: #fffbeb; color: #78350f; border-radius: 8px; } ke utility Tailwind.",
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
              options: [
                "utility-first",
                "component-first",
                "class-first",
                "inline-first",
              ],
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
              options: [
                "padding 4px",
                "padding 1rem (16px)",
                "margin 4px",
                "font-size 4px",
              ],
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

  // ==========================================================
  // PART 5 — BASIC TAILWIND
  // ==========================================================
  {
    name: "Basic Tailwind",
    description:
      "Utility inti Tailwind: spacing, warna, tipografi, layout, sizing, dan responsive.",
    lessons: [
      {
        title: "Spacing: Padding, Margin & Gap",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengatur padding, margin, gap, dan jarak antar anak (space-y / space-x) dengan utility Tailwind secara presisi.</p>",
          ),
          h("1. Padding Semua Sisi dan Per Arah"),
          htmlCode(`
<div class="p-4">padding 16px di semua sisi</div>
<div class="px-6 py-2">horizontal 24px, vertikal 8px</div>
<div class="pt-8 pb-4 pl-2 pr-6">per sisi</div>
`),
          h("2. Margin, Termasuk margin Otomatis untuk Menengahkan"),
          htmlCode(`
<div class="mt-4 mb-8">atas 16px, bawah 32px</div>
<div class="mx-auto max-w-md">blok di tengah</div>
<div class="-mt-2">margin negatif (menarik ke atas)</div>
`),
          h("3. gap untuk Flex dan Grid"),
          htmlCode(`
<div class="flex gap-3">
  <span>Item 1</span><span>Item 2</span>
</div>

<div class="grid grid-cols-2 gap-4">
  <div>Kartu 1</div><div>Kartu 2</div>
</div>
`),
          h("4. space-y / space-x untuk Jarak Antar Anak Bertumpuk"),
          htmlCode(`
<div class="space-y-3">
  <p>Paragraf 1</p>
  <p>Paragraf 2</p>
  <p>Paragraf 3</p>
</div>
`),
          callout(
            "info",
            "gap bekerja pada flex/grid container, sedangkan space-y menambahkan margin ke setiap anak kecuali yang pertama.",
          ),
          h("Studi Kasus: Kartu Artikel dengan Jarak Konsisten"),
          htmlCode(`
<article class="max-w-md rounded-2xl border border-slate-200 bg-white p-6">
  <span class="text-xs font-bold uppercase tracking-widest text-orange-600">
    Tutorial
  </span>
  <h2 class="mt-2 text-xl font-bold text-slate-900">
    Menata Jarak yang Konsisten
  </h2>
  <p class="mt-3 text-sm leading-relaxed text-slate-600">
    Jarak yang konsisten membuat halaman terasa rapi tanpa perlu banyak berpikir.
  </p>
  <div class="mt-5 flex gap-2">
    <button class="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white">
      Baca
    </button>
    <button class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
      Simpan
    </button>
  </div>
</article>
`),
          callout(
            "success",
            "Tantangan Mandiri: Ganti seluruh jarak vertikal di kartu (mt-2, mt-3, mt-5) menjadi space-y-* pada container, lalu bandingkan hasilnya.",
          ),
          divider(),
        ],
      },
      {
        title: "Warna & Background",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai palet warna Tailwind, mengatur opasitas, border, ring, serta membuat gradien.</p>",
          ),
          h("1. Palet dan Tingkatan Warna"),
          p(
            "<p>Setiap warna punya tingkatan 50 (paling terang) sampai 950 (paling gelap).</p>",
          ),
          htmlCode(`
<p class="text-slate-900">Teks utama</p>
<p class="text-slate-500">Teks sekunder</p>
<div class="bg-orange-50 p-4 text-orange-900">Latar lembut</div>
<div class="bg-orange-600 p-4 text-white">Latar kuat</div>
`),
          h("2. Border, Ring, dan Opasitas"),
          htmlCode(`
<div class="border border-slate-200 rounded-lg p-4">Border tipis</div>
<div class="border-2 border-orange-500 p-4">Border tebal</div>

<button class="ring-2 ring-orange-500 ring-offset-2 rounded-lg px-4 py-2">
  Fokus
</button>

<div class="bg-slate-900/70 p-4 text-white">Latar 70% opasitas</div>
`),
          h("3. Gradien"),
          htmlCode(`
<div class="bg-gradient-to-r from-orange-500 to-amber-400 p-6 text-white rounded-xl">
  Gradien horizontal
</div>

<div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white">
  Gradien diagonal tiga warna
</div>
`),
          callout(
            "warning",
            "Jangan menilai warna hanya dari nama class. Pastikan kontras teks vs latar memenuhi standar aksesibilitas (minimal 4.5:1 untuk teks normal).",
          ),
          h("Studi Kasus: Set Badge Status"),
          htmlCode(`
<span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
  Published
</span>

<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
  Draft
</span>

<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
  Archived
</span>
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat badge keempat berstatus 'Error' dengan latar merah dan teks merah tua, lalu tambahkan border senada.",
          ),
          divider(),
        ],
      },
      {
        title: "Typography",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengatur ukuran, ketebalan, jarak baris, jarak huruf, perataan, dan pemotongan teks dengan utility Tailwind.</p>",
          ),
          h("1. Ukuran dan Ketebalan"),
          htmlCode(`
<h1 class="text-3xl font-bold tracking-tight text-slate-900">Judul besar</h1>
<h2 class="text-xl font-semibold">Sub judul</h2>
<p class="text-base text-slate-700">Paragraf normal</p>
<p class="text-sm text-slate-500">Catatan kecil</p>
`),
          h("2. Line Height, Tracking, dan Alignment"),
          htmlCode(`
<p class="text-base leading-relaxed">Paragraf dengan jarak baris lega.</p>
<p class="text-base leading-tight">Paragraf dengan jarak baris rapat.</p>
<p class="text-center uppercase text-xs tracking-widest text-slate-500">Label</p>
`),
          h("3. Memotong Teks Panjang"),
          htmlCode(`
<!-- satu baris dengan elipsis -->
<h3 class="truncate max-w-[240px]">Judul yang sangat panjang sekali</h3>

<!-- beberapa baris dengan elipsis -->
<p class="line-clamp-3">
  Paragraf panjang yang akan dipotong setelah tiga baris...
</p>
`),
          callout(
            "info",
            "truncate membutuhkan overflow: hidden dan white-space: nowrap. line-clamp-* lebih cocok untuk ringkasan multi-baris.",
          ),
          h("Studi Kasus: Kartu Kursus dengan Judul Terpotong"),
          htmlCode(`
<article class="w-72 rounded-xl border border-slate-200 bg-white p-4">
  <h3 class="truncate text-base font-semibold text-slate-900">
    Belajar JavaScript: Dari Nol sampai Asynchronous
  </h3>
  <p class="mt-1 text-sm text-slate-500">12 materi · 43 silabus</p>
  <p class="mt-3 line-clamp-2 text-sm text-slate-600">
    Kursus lengkap dari variabel, kontrol alur, DOM, sampai mengambil data dari API.
  </p>
</article>
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah line-clamp-2 menjadi line-clamp-4 dan amati tinggi kartu tetap konsisten atau tidak.",
          ),
          divider(),
        ],
      },
      {
        title: "Flexbox & Grid di Tailwind",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyusun layout dengan utility flex dan grid, termasuk menggabungkan kolom serta membuat layout kartu responsif.</p>",
          ),
          h("1. Flex Dasar"),
          htmlCode(`
<div class="flex items-center justify-between gap-4">
  <span class="font-semibold">Judul</span>
  <button class="text-sm text-orange-600">Lihat semua</button>
</div>
`),
          h("2. Arah, Perataan, dan Pembungkusan"),
          htmlCode(`
<div class="flex flex-col gap-2">...</div>
<div class="flex flex-wrap items-center justify-center gap-3">...</div>
<div class="flex items-start justify-end">...</div>
`),
          h("3. Grid Kolom dan Span"),
          htmlCode(`
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <div class="rounded-xl border p-4">Kartu 1</div>
  <div class="rounded-xl border p-4">Kartu 2</div>
  <div class="rounded-xl border p-4 sm:col-span-2 lg:col-span-1">Kartu 3</div>
</div>
`),
          h("4. Membagi Ruang dengan flex-1"),
          htmlCode(`
<div class="flex gap-4">
  <aside class="w-56 shrink-0">Sidebar</aside>
  <main class="flex-1 min-w-0">Konten utama</main>
</div>
`),
          callout(
            "warning",
            "Pada layout flex, tambahkan min-w-0 pada area konten agar teks panjang tidak membuat kolom melebar keluar layar.",
          ),
          h("Studi Kasus: Grid Galeri Foto Responsif"),
          htmlCode(`
<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
  <img class="aspect-square w-full rounded-xl object-cover" src="foto1.jpg" alt="Foto 1">
  <img class="aspect-square w-full rounded-xl object-cover" src="foto2.jpg" alt="Foto 2">
  <img class="aspect-square w-full rounded-xl object-cover" src="foto3.jpg" alt="Foto 3">
  <img class="aspect-square w-full rounded-xl object-cover" src="foto4.jpg" alt="Foto 4">
  <img class="aspect-square w-full rounded-xl object-cover" src="foto5.jpg" alt="Foto 5">
</div>
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat satu kartu yang membentang dua kolom pada layar besar menggunakan lg:col-span-2.",
          ),
          divider(),
        ],
      },
      {
        title: "Sizing, Border, Rounded & Shadow",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengatur lebar/tinggi, batas maksimum, sudut membulat, bayangan, serta pemotongan gambar dengan object-fit.</p>",
          ),
          h("1. Lebar dan Tinggi"),
          htmlCode(`
<div class="w-full">selebar induk</div>
<div class="w-1/2">setengah induk</div>
<div class="w-64 h-40">lebar tetap 256px, tinggi 160px</div>
<div class="max-w-md mx-auto">maksimum 448px & tengah</div>
<div class="min-h-screen">tinggi minimal satu layar</div>
`),
          h("2. Border, Rounded, dan Shadow"),
          htmlCode(`
<div class="rounded-lg border border-slate-200 p-4">Sudut 8px</div>
<div class="rounded-2xl border border-slate-200 p-4">Sudut 16px</div>
<div class="rounded-full border p-4">Bulat penuh</div>
<div class="rounded-xl shadow-sm p-4">Bayangan halus</div>
<div class="rounded-xl shadow-lg p-4">Bayangan besar</div>
`),
          h("3. Object Fit untuk Gambar"),
          htmlCode(`
<img src="foto.jpg" alt="Contoh" class="h-48 w-full rounded-xl object-cover">
<img src="logo.png" alt="Logo" class="size-16 object-contain">
`),
          h("4. Overflow dan Aspect Ratio"),
          htmlCode(`
<div class="aspect-video overflow-hidden rounded-2xl">
  <iframe class="size-full" src="https://www.youtube.com/embed/VIDEO_ID" title="Video"></iframe>
</div>
`),
          callout(
            "info",
            "size-16 adalah gabungan w-16 dan h-16. Gunakan size-* untuk ikon dan avatar persegi.",
          ),
          h("Studi Kasus: Kartu Video dengan Thumbnail Rapi"),
          htmlCode(`
<article class="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
  <img src="thumb.jpg" alt="Thumbnail video" class="aspect-video w-full object-cover">
  <div class="p-4">
    <h3 class="line-clamp-2 text-sm font-semibold text-slate-900">
      Belajar CSS & Tailwind dari Dasar sampai Siap Pakai
    </h3>
    <p class="mt-1 text-xs text-slate-500">31 silabus · 6 kuis</p>
  </div>
</article>
`),
          callout(
            "success",
            "Tantangan Mandiri: Ganti shadow-sm menjadi shadow-lg dan rounded-2xl menjadi rounded-none, lalu amati perbedaan karakternya.",
          ),
          divider(),
        ],
      },
      {
        title: "Responsive & Dark Mode",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat layout berubah sesuai ukuran layar dengan pendekatan mobile-first, serta mendukung mode gelap lewat variant <code>dark:</code>.</p>",
          ),
          h("1. Breakpoint Tailwind"),
          p(
            "<p>Tailwind memakai min-width: <code>sm</code> 640px, <code>md</code> 768px, <code>lg</code> 1024px, <code>xl</code> 1280px, <code>2xl</code> 1536px.</p>",
          ),
          htmlCode(`
<div class="p-4 sm:p-6 lg:p-8">
  <h1 class="text-xl sm:text-2xl lg:text-4xl">Judul responsif</h1>
</div>
`),
          h("2. Mobile-First: Tulis Dasar Dulu"),
          p(
            "<p>Class tanpa prefix berlaku untuk semua layar. Varian hanya menimpa pada layar yang lebih besar.</p>",
          ),
          htmlCode(`
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <div>Kartu A</div>
  <div>Kartu B</div>
  <div>Kartu C</div>
</div>
`),
          h("3. Menyembunyikan Elemen di Layar Tertentu"),
          htmlCode(`
<!-- tampil di HP, disembunyikan mulai sm -->
<p class="sm:hidden">Hanya HP</p>

<!-- disembunyikan di HP, tampil mulai md -->
<nav class="hidden md:flex gap-4">Menu desktop</nav>
`),
          h("4. Dark Mode"),
          htmlCode(`
<div class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
  <h2 class="text-slate-900 dark:text-white">Judul</h2>
  <p class="text-slate-600 dark:text-slate-400">Deskripsi</p>

  <button class="bg-orange-600 text-white dark:bg-orange-500 dark:text-slate-900">
    Tombol
  </button>
</div>
`),
          callout(
            "info",
            "Dengan CDN, dark: mengikuti preferensi sistem. Untuk tombol toggle manual, perlu konfigurasi darkMode: 'class'.",
          ),
          h("Studi Kasus: Kartu Produk Responsif + Mode Gelap"),
          htmlCode(`
<article class="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[160px_1fr] dark:border-slate-800 dark:bg-slate-900">
  <img src="produk.jpg" alt="Produk" class="h-40 w-full rounded-xl object-cover sm:h-full">
  <div class="flex flex-col gap-2">
    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Kursus CSS & Tailwind</h3>
    <p class="text-sm text-slate-600 dark:text-slate-400">31 silabus, 6 kuis, 3 proyek praktik.</p>
    <div class="mt-auto flex gap-2">
      <button class="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white">Ikuti</button>
      <button class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">Detail</button>
    </div>
  </div>
</article>
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah gambar agar pada layar kecil tampil setinggi 160px tetapi pada layar >= sm tampil memenuhi tinggi kartu (sm:h-full).",
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

  // ==========================================================
  // PART 6 — PRAKTIK & PENUTUP
  // ==========================================================
  {
    name: "Praktik & Penutup",
    description:
      "Tiga proyek Tailwind lengkap, ujian akhir, dan langkah lanjutan.",
    lessons: [
      {
        title: "Praktik 1 — Kartu Profil",
        duration: 22,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Membuat kartu profil dengan Tailwind: avatar bulat, teks hierarkis, dan dua tombol aksi. Fokus pada pemakaian spacing, typography, dan border.</p>",
          ),
          h("1. Struktur HTML"),
          htmlCode(`
<article class="profil">
  <img class="avatar" src="avatar.jpg" alt="Foto profil">
  <h1 class="nama">Budi Santoso</h1>
  <p class="peran">Frontend Developer</p>
  <p class="bio">Sedang belajar CSS dan Tailwind untuk membangun antarmuka yang rapi.</p>
  <div class="aksi">
    <button class="ikuti">Ikuti</button>
    <button class="pesan">Pesan</button>
  </div>
</article>
`),
          h("2. Menerapkan Utility Tailwind"),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kartu Profil</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex min-h-screen items-center justify-center bg-slate-100 p-6">
  <article class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
    <img src="https://i.pravatar.cc/160" alt="Foto profil"
         class="mx-auto size-24 rounded-full object-cover">

    <h1 class="mt-4 text-xl font-bold text-slate-900">Budi Santoso</h1>
    <p class="text-sm text-slate-500">Frontend Developer</p>

    <p class="mt-3 text-sm leading-relaxed text-slate-600">
      Sedang belajar CSS dan Tailwind untuk membangun antarmuka yang rapi.
    </p>

    <div class="mt-5 flex gap-2">
      <button class="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">
        Ikuti
      </button>
      <button class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        Pesan
      </button>
    </div>
  </article>
</body>
</html>
`),
          h("3. Variasi Versi Horizontal"),
          htmlCode(`
<article class="flex w-full max-w-md items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
  <img src="https://i.pravatar.cc/120" alt="Foto profil"
       class="size-16 rounded-full object-cover">
  <div class="min-w-0 flex-1">
    <h2 class="truncate font-semibold text-slate-900">Budi Santoso</h2>
    <p class="truncate text-sm text-slate-500">budi@contoh.id</p>
  </div>
  <button class="shrink-0 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white">
    Ikuti
  </button>
</article>
`),
          callout(
            "info",
            "Perhatikan min-w-0 pada pembungkus teks. Tanpa itu, nama atau email yang panjang akan mendorong tombol keluar kartu.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan badge 'Online' hijau kecil di pojok avatar menggunakan posisi absolute dan border putih.",
          ),
          divider(),
        ],
      },
      {
        title: "Praktik 2 — Landing Page Responsive",
        duration: 26,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Membuat hero section dan grid fitur yang berubah dari satu kolom di HP menjadi tiga kolom di desktop.</p>",
          ),
          h("1. Hero Section"),
          htmlCode(`
<section class="mx-auto max-w-5xl px-4 py-16 text-center">
  <p class="text-xs font-bold uppercase tracking-widest text-orange-600">
    Kelas Baru
  </p>
  <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
    Belajar Web dari Nol
  </h1>
  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">
    HTML, CSS, dan JavaScript dalam satu jalur belajar yang terstruktur.
  </p>
  <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
    <a href="#" class="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
      Mulai Belajar
    </a>
    <a href="#" class="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
      Lihat Silabus
    </a>
  </div>
</section>
`),
          h("2. Grid Fitur"),
          htmlCode(`
<div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
  <article class="rounded-2xl border border-slate-200 bg-white p-6">
    <h2 class="font-semibold text-slate-900">Materi Terstruktur</h2>
    <p class="mt-2 text-sm leading-relaxed text-slate-600">
      Dari dasar sampai praktik, berurutan.
    </p>
  </article>

  <article class="rounded-2xl border border-slate-200 bg-white p-6">
    <h2 class="font-semibold text-slate-900">Kuis Tiap Bagian</h2>
    <p class="mt-2 text-sm leading-relaxed text-slate-600">
      Uji pemahaman sebelum lanjut.
    </p>
  </article>

  <article class="rounded-2xl border border-slate-200 bg-white p-6 sm:col-span-2 lg:col-span-1">
    <h2 class="font-semibold text-slate-900">Proyek Nyata</h2>
    <p class="mt-2 text-sm leading-relaxed text-slate-600">
      Bangun halaman utuh setiap akhir bagian.
    </p>
  </article>
</div>
`),
          h("3. Menyesuaikan Ukuran Teks dan Jarak per Layar"),
          htmlCode(`
<h2 class="text-xl sm:text-2xl lg:text-3xl">Judul yang membesar bertahap</h2>

<section class="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
  Konten dengan padding bertingkat.
</section>
`),
          callout(
            "warning",
            "Jangan lupa meta viewport di head. Tanpa itu, breakpoint sm/md/lg tidak akan bekerja di HP sungguhan.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan bagian 'FAQ' berisi 3 kartu yang pada layar besar tersusun 3 kolom (lg:grid-cols-3).",
          ),
          divider(),
        ],
      },
      {
        title: "Praktik 3 — Navbar + Hero dengan Dark Mode",
        duration: 26,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Membuat navbar responsif (menu disembunyikan di HP) dan hero yang mendukung mode gelap otomatis.</p>",
          ),
          h("1. Navbar"),
          htmlCode(`
<header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
  <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
    <a href="#" class="font-bold text-slate-900 dark:text-white">Belajar Web</a>

    <div class="hidden gap-6 text-sm text-slate-600 sm:flex dark:text-slate-300">
      <a href="#materi" class="hover:text-orange-600">Materi</a>
      <a href="#harga" class="hover:text-orange-600">Harga</a>
      <a href="#kontak" class="hover:text-orange-600">Kontak</a>
    </div>

    <a href="#daftar" class="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">
      Daftar
    </a>
  </nav>
</header>
`),
          h("2. Hero dengan Dark Mode"),
          htmlCode(`
<section class="bg-white px-4 py-20 dark:bg-slate-900">
  <div class="mx-auto max-w-3xl text-center">
    <h1 class="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
      Kuasai CSS & Tailwind
    </h1>
    <p class="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
      Dari CSS klasik sampai utility-first, dalam satu kursus.
    </p>
    <a href="#" class="mt-8 inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
      Mulai Sekarang
    </a>
  </div>
</section>
`),
          h("3. Menambahkan Toggle Mode Gelap Manual"),
          htmlCode(`
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = { darkMode: "class" };
</script>

<button
  onclick="document.documentElement.classList.toggle('dark')"
  class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">
  Toggle Tema
</button>
`),
          callout(
            "info",
            "Dengan darkMode: 'class', warna gelap hanya aktif ketika <html> memiliki class dark. Tanpa konfigurasi ini, dark: mengikuti preferensi sistem.",
          ),
          h("4. Memeriksa Hasil di Dua Tema"),
          htmlCode(`
<!-- Coba matikan/nyalakan class dark pada <html> lewat DevTools -->
<html lang="id" class="dark">
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan izin toggle yang menyimpan pilihan tema ke localStorage sehingga tetap tersimpan setelah halaman dimuat ulang.",
          ),
          divider(),
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
              options: [
                "max-w-md mx-auto",
                "w-md center",
                "mx-md",
                "max-w-full my-auto",
              ],
              answer: 0,
            },
            {
              q: "Prefix breakpoint untuk layar >= 1024px adalah...",
              options: ["sm:", "md:", "lg:", "xl:"],
              answer: 2,
            },
            {
              q: "Class `dark:bg-slate-900` aktif saat...",
              options: ["Selalu", "Mode gelap aktif", "Layar kecil", "Hover"],
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
        duration: 10,
        blocks: [
          h("Yang Sudah Kamu Pelajari"),
          p(
            "<ul><li>Peran CSS, anatomi aturan, dan seluruh jenis selector dasar.</li><li>Tiga cara memakai CSS klasik, cascade, specificity, dan alasan menghindari <code>!important</code>.</li><li>Contoh CSS nyata: warna, tipografi, box model, display/position/float, dan flexbox.</li><li>Tailwind via CDN, cara membaca utility, dan konfigurasi tema sederhana.</li><li>Utility inti: spacing, warna, tipografi, flex/grid, sizing, serta responsive &amp; dark mode.</li><li>Tiga praktik: kartu profil, landing page responsif, dan navbar + hero dengan dark mode.</li></ul>",
          ),
          h("Perbandingan Singkat: Kapan Pakai Apa?"),
          p(
            "<ul><li><strong>CSS klasik</strong> cocok ketika butuh kontrol detail, animasi kompleks, atau bekerja dengan kode lama.</li><li><strong>Tailwind</strong> cocok untuk membangun UI cepat dengan konsistensi jarak dan warna, terutama di tim.</li><li>Keduanya bisa digabung: Tailwind untuk layout, CSS kustom untuk animasi unik.</li></ul>",
          ),
          h("Langkah Selanjutnya"),
          p(
            "<ol><li><strong>Tailwind via npm</strong> — build produksi tanpa CDN.</li><li><strong>JavaScript</strong> — menambah interaksi, mengambil data API, dan membuat komponen dinamis.</li><li><strong>Desain sistem</strong> — menyusun komponen yang konsisten (tombol, form, kartu).</li></ol>",
          ),
          callout(
            "success",
            "Selamat! Kamu sudah menguasai CSS klasik dan Tailwind. Lanjutkan ke kursus JavaScript untuk membuat halamanmu benar-benar hidup.",
          ),
          divider(),
        ],
      },
    ],
  },
];
