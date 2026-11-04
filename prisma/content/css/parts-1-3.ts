import {
  callout,
  CoursePartDef,
  cssCode,
  divider,
  h,
  htmlCode,
  p,
  quiz,
} from "../helpers";

export const CSS_PARTS_1_3: CoursePartDef[] = [
  // ==========================================================
  // PART 1 — PENGENALAN CSS
  // ==========================================================
  {
    name: "Pengenalan CSS",
    description:
      "Memahami peran CSS, anatomi aturan, dan selector yang dipakai sehari-hari.",
    lessons: [
      {
        title: "Apa Itu CSS & Perannya",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami kedudukan CSS dalam pembangunan halaman web, perbedaannya dengan HTML, dan contoh nyata perubahan tampilan sebelum dan sesudah CSS dipasang.</p>",
          ),
          h("1. Halaman Tanpa CSS"),
          p(
            "<p>Bila HTML ditulis tanpa CSS sama sekali, browser hanya menampilkan teks hitam di latar putih dengan susunan dari atas ke bawah. Semua elemen mengalir sebagai satu kolom panjang.</p>",
          ),
          htmlCode(`
<h1>Belajar CSS</h1>
<p>Paragraf ini akan tampil polos dengan font bawaan browser.</p>
<a href="#">Tautan polos berwarna biru</a>
`),
          h("2. Menambahkan Warna dan Tipografi Dasar"),
          p(
            "<p>Dengan satu blok CSS kecil, halaman langsung terasa berbeda: ukuran font diatur, warna latar diberi kontras, dan jarak antar elemen dibuat nyaman dibaca.</p>",
          ),
          htmlCode(`
<style>
  body {
    font-family: system-ui, sans-serif;
    background: #f8fafc;
    color: #0f172a;
    padding: 32px;
  }
  h1 { font-size: 32px; }
  p  { line-height: 1.7; color: #475569; }
</style>

<h1>Belajar CSS</h1>
<p>Halaman yang sama, kini jauh lebih nyaman dibaca.</p>
`),
          h("3. Memisahkan Struktur dan Tampilan"),
          p(
            "<p>Praktik terbaik: HTML hanya menyimpan struktur dan makna, sementara CSS menyimpan seluruh urusan tampilan. Dengan pemisahan ini, desain bisa diubah tanpa menyentuh isi.</p>",
          ),
          htmlCode(`
<!-- Struktur: bersih tanpa atribut tampilan -->
<article class="kartu">
  <h2>Belajar CSS</h2>
  <p>Struktur dan tampilan dipisahkan.</p>
</article>
`),
          cssCode(`
.kartu {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
}

.kartu h2 { margin: 0 0 8px; }
.kartu p  { margin: 0; color: #64748b; }
`),
          callout(
            "info",
            "Analogi: HTML adalah kerangka rumah, CSS adalah cat, lantai, dan perabot. Tanpa CSS rumah tetap berdiri, hanya tidak nyaman dipakai.",
          ),
          h("Studi Kasus: Kartu Pengumuman Kampus"),
          p(
            "<p><strong>Skenario:</strong> Panitia kampus mengirim pengumuman dalam HTML polos. Kita ubah menjadi kartu pengumuman dengan latar berbeda, judul menonjol, dan tanggal yang lebih redup.</p>",
          ),
          htmlCode(`
<article class="pengumuman">
  <p class="label">PENGUMUMAN</p>
  <h2>Jadwal Ujian Akhir Semester</h2>
  <p class="isi">Ujian dimulai 12 Januari 2026. Cek jadwal per mata kuliah.</p>
  <p class="tanggal">Dipublikasikan 4 November 2026</p>
</article>
`),
          cssCode(`
.pengumuman {
  max-width: 520px;
  padding: 24px;
  border-left: 4px solid #ea580c;
  border-radius: 12px;
  background: #fff7ed;
  font-family: system-ui, sans-serif;
}

.label {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #ea580c;
}

.pengumuman h2 { margin: 8px 0; font-size: 20px; color: #0f172a; }
.isi { margin: 0 0 12px; line-height: 1.6; color: #334155; }
.tanggal { margin: 0; font-size: 12px; color: #94a3b8; }
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah warna aksen dari oranye (#ea580c / #fff7ed) menjadi biru (#2563eb / #eff6ff) tanpa mengubah struktur HTML sama sekali.",
          ),
          divider(),
        ],
      },
      {
        title: "Anatomi Aturan CSS",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membaca dan menulis aturan CSS dengan benar: selector, declaration block, property, value, komentar, serta memahami aturan mana yang gagal bila ada kesalahan penulisan.</p>",
          ),
          h("1. Struktur Dasar Satu Aturan"),
          p(
            "<p>Sebuah aturan CSS terdiri dari <strong>selector</strong> (elemen yang dituju), lalu <strong>declaration block</strong> berisi pasangan properti dan nilai yang dibungkus kurung kurawal.</p>",
          ),
          cssCode(`
/* selector */ h1 /* <- */ {
  color: #ea580c;      /* property: color, value: #ea580c */
  font-size: 32px;     /* property: font-size, value: 32px */
  text-align: center;
}
`),
          h("2. Beberapa Deklarasi dalam Satu Aturan"),
          p(
            "<p>Satu selector boleh memiliki banyak deklarasi. Akhiri setiap deklarasi dengan titik koma agar tidak menimbulkan kesalahan pada deklarasi berikutnya.</p>",
          ),
          cssCode(`
.tombol {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 10px;
  background: #ea580c;
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
}
`),
          h("3. Komentar dan Menonaktifkan Deklarasi"),
          p(
            "<p>Komentar diapit <code>/* ... */</code>. Sering dipakai untuk memberi judul bagian file CSS atau menonaktifkan sementara sebuah deklarasi saat proses percobaan desain.</p>",
          ),
          cssCode(`
/* ===== Tombol Utama ===== */
.tombol {
  background: #ea580c;
  /* background: #2563eb;  <- dicoba tapi dibatalkan */
  color: #fff;
}
`),
          h("4. Kesalahan Kecil yang Membuat Deklarasi Diabaikan"),
          p(
            "<p>Browser bersifat toleran: satu deklarasi salah tidak membuat seluruh file mati. Namun deklarasi yang salah akan <strong>diabaikan</strong> sehingga tampilan tidak berubah seperti yang diharapkan.</p>",
          ),
          cssCode(`
.peringatan {
  colour: red;        /* SALAH: properti tidak dikenal -> diabaikan */
  font-size: 14px      /* SALAH: kurang titik koma, deklarasi berikut bisa ikut gagal */
  background: #fef2f2;
}
`),
          callout(
            "warning",
            "Jika sebuah perubahan tidak berefek, periksa tiga hal: (1) selector cocok dengan HTML, (2) nama properti benar, (3) tidak ada deklarasi lain yang menimpa nilainya.",
          ),
          h("Studi Kasus: Membaca & Merapikan CSS Warisan"),
          p(
            "<p><strong>Skenario:</strong> Kamu mewarisi file CSS lama dengan penulisan berantakan. Rapi kan tanpa mengubah hasil tampilannya.</p>",
          ),
          cssCode(`
/* Sebelum dirapikan */
.kotak{background:#fff;padding:16px;border:1px solid #ddd;border-radius:8px}
.kotak   h3{font-size:16px;margin:0 0 6px}
.kotak p{font-size:14px;margin:0;color:#555}
`),
          cssCode(`
/* Sesudah dirapikan */
.kotak {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.kotak h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.kotak p {
  margin: 0;
  font-size: 14px;
  color: #555;
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan aturan baru untuk .kotak:hover yang mengubah border-color menjadi #ea580c dan sedikit mengangkat kotak dengan transform: translateY(-2px).",
          ),
          divider(),
        ],
      },
      {
        title: "Selector Dasar",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menguasai selector tag, class, id, universal, grouping, dan turunan (descendant) beserta kapan sebaiknya masing-masing dipakai.</p>",
          ),
          h("1. Selector Tag"),
          p(
            "<p>Selector tag menargetkan <strong>semua</strong> elemen dengan nama tag tersebut di halaman.</p>",
          ),
          cssCode(`
p {
  line-height: 1.7;
  margin-bottom: 12px;
}

h2 {
  font-size: 22px;
  color: #0f172a;
}
`),
          h("2. Selector Class"),
          p(
            "<p>Selector class diawali titik (<code>.</code>) dan boleh dipakai berulang pada banyak elemen. Ini pilihan utama untuk styling yang bisa digunakan ulang.</p>",
          ),
          htmlCode(`
<p class="catatan">Catatan penting untuk ujian.</p>
<p class="catatan">Catatan kedua.</p>
`),
          cssCode(`
.catatan {
  padding: 12px 16px;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  background: #fffbeb;
  color: #78350f;
}
`),
          h("3. Selector ID"),
          p(
            "<p>Selector id diawali tanda pagar (<code>#</code>) dan <strong>hanya boleh muncul satu kali</strong> per halaman.</p>",
          ),
          cssCode(`
#hero-utama {
  padding: 64px 24px;
  background: #0f172a;
  color: #ffffff;
  text-align: center;
}
`),
          h("4. Universal, Grouping, dan Turunan"),
          p(
            "<p>Empat teknik pelengkap yang membuat CSS lebih efisien:</p><ul><li><code>*</code> — semua elemen.</li><li><code>h1, h2, h3</code> — grouping beberapa selector sekaligus.</li><li><code>.kartu a</code> — hanya tautan di dalam .kartu.</li><li><code>.kartu &gt; h2</code> — hanya anak langsung.</li></ul>",
          ),
          cssCode(`
* {
  box-sizing: border-box;
}

h1, h2, h3 {
  font-family: system-ui, sans-serif;
  line-height: 1.25;
}

.kartu a {
  color: #ea580c;
  text-decoration: none;
}

.kartu > h2 {
  margin-top: 0;
}
`),
          h("5. Prioritas Sederhana: Class Mengalahkan Tag"),
          p(
            "<p>Ketika dua selector menargetkan elemen yang sama, selector yang lebih spesifik menang. Class lebih kuat daripada tag, dan id lebih kuat daripada class.</p>",
          ),
          htmlCode(`
<p class="khusus">Teks ini mengikuti aturan class.</p>
`),
          cssCode(`
p       { color: black; }
.khusus { color: #ea580c; } /* menang karena lebih spesifik */
`),
          callout(
            "info",
            "Biasakan memakai class untuk seluruh styling. Simpan id hanya untuk anchor halaman atau target JavaScript.",
          ),
          h("Studi Kasus: Menata Menu Navigasi dengan Class"),
          p(
            "<p><strong>Skenario:</strong> Navigasi memiliki tautan biasa dan satu tautan aktif. Semua tautan memakai class dasar, dan tautan aktif mendapat class tambahan.</p>",
          ),
          htmlCode(`
<nav class="menu">
  <a class="menu-item" href="#">Beranda</a>
  <a class="menu-item aktif" href="#">Kursus</a>
  <a class="menu-item" href="#">Profil</a>
</nav>
`),
          cssCode(`
.menu {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: 12px;
  background: #f1f5f9;
  width: fit-content;
}

.menu-item {
  padding: 8px 14px;
  border-radius: 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.menu-item:hover { background: #e2e8f0; }

.menu-item.aktif {
  background: #ea580c;
  color: #ffffff;
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan satu tautan menu baru yang memakai class menu-item saja, lalu tambahkan aturan .menu-item:focus-visible dengan outline 2px putus-putus.",
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

  // ==========================================================
  // PART 2 — CARA PAKAI CSS "LAMA"
  // ==========================================================
  {
    name: 'Cara Pakai CSS "Lama"',
    description:
      "Tiga cara menyisipkan CSS klasik, plus cara kerja cascade dan specificity.",
    lessons: [
      {
        title: "Inline Style",
        duration: 14,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami atribut <code>style</code> pada elemen, kapan masih boleh dipakai, dan mengapa berbahaya untuk proyek besar.</p>",
          ),
          h("1. Menulis Style Langsung pada Elemen"),
          p(
            "<p>Inline style ditulis pada atribut <code>style</code> menggunakan sintaks CSS tanpa selector dan tanpa kurung kurawal.</p>",
          ),
          htmlCode(`
<p style="color: #dc2626; font-size: 18px; font-weight: bold;">
  Teks ini diwarnai langsung dari atribut elemen.
</p>
`),
          h("2. Beberapa Deklarasi Sekaligus"),
          p(
            "<p>Pisahkan deklarasi dengan titik koma. Inline style tetap mengikuti aturan properti CSS yang sama.</p>",
          ),
          htmlCode(`
<div style="padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
  Kotak dengan inline style.
</div>
`),
          h("3. Mengapa Inline Style Bermasalah?"),
          p(
            "<p>Tiga alasan utama menghindari inline style untuk proyek nyata:</p><ul><li>Tidak bisa dipakai ulang di elemen lain.</li><li>Sangat sulit diubah massal (harus mengedit HTML satu per satu).</li><li>Prioritasnya sangat tinggi sehingga sulit ditimpa CSS lain.</li></ul>",
          ),
          htmlCode(`
<!-- Jika ada 50 kartu seperti ini, mengubah satu warna berarti mengedit 50 tempat -->
<div style="background:#fff7ed; color:#7c2d12; padding:16px;">Kartu 1</div>
<div style="background:#fff7ed; color:#7c2d12; padding:16px;">Kartu 2</div>
`),
          cssCode(`
/* Dengan class, perubahan cukup di satu tempat */
.kartu-sorot {
  padding: 16px;
  border-radius: 12px;
  background: #fff7ed;
  color: #7c2d12;
}
`),
          callout(
            "warning",
            "Satu-satunya pemakaian inline style yang wajar: email HTML (karena banyak klien email memblokir tag <style>) atau pengujian cepat di DevTools.",
          ),
          h("Studi Kasus: Mengubah Inline Style Menjadi Class"),
          p(
            "<p><strong>Skenario:</strong> Sebuah tombol masih memakai inline style. Pindahkan ke class agar konsisten dengan tombol lain di halaman.</p>",
          ),
          htmlCode(`
<!-- Sebelum -->
<button style="background:#ea580c; color:white; padding:10px 18px; border:none; border-radius:10px; font-weight:600;">
  Daftar Sekarang
</button>

<!-- Sesudah -->
<button class="tombol-utama">Daftar Sekarang</button>
`),
          cssCode(`
.tombol-utama {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: #ea580c;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.tombol-utama:hover { background: #c2410c; }
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat class .tombol-outline berisi border 1px solid #ea580c, latar transparan, dan warna teks #ea580c, lalu pakai pada tombol kedua.",
          ),
          divider(),
        ],
      },
      {
        title: "Internal Style",
        duration: 14,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menulis CSS di dalam tag <code>&lt;style&gt;</code> pada bagian <code>head</code>, serta memahami kapan pendekatan ini tepat digunakan.</p>",
          ),
          h("1. Struktur Dasar Internal Style"),
          p(
            "<p>Semua aturan CSS ditulis di dalam <code>&lt;style&gt;</code>. Selector di sini berlaku untuk seluruh halaman tersebut.</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Internal Style</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
    }

    h1 { color: #ea580c; }
  </style>
</head>
<body>
  <h1>Halo CSS</h1>
</body>
</html>
`),
          h("2. Menaruh Style di Akhir Head"),
          p(
            "<p>Tag <code>&lt;style&gt;</code> umumnya diletakkan di akhir <code>&lt;head&gt;</code> agar aturan dasar (seperti font dan warna body) ditulis lebih dulu, lalu komponen menyusul.</p>",
          ),
          htmlCode(`
<head>
  <meta charset="UTF-8">
  <title>Urutan Style</title>
  <style>
    :root { --aksen: #ea580c; }

    body { font-family: system-ui, sans-serif; }

    .badge {
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--aksen);
      color: white;
      font-size: 12px;
    }
  </style>
</head>
`),
          h("3. Kapan Internal Style Tepat Dipakai?"),
          p(
            "<p>Internal style cocok untuk: halaman demo satu file, halaman error statis, email sederhana, atau prototipe cepat. Untuk situs dengan banyak halaman, CSS akan terduplikasi di setiap file.</p>",
          ),
          callout(
            "warning",
            "Jika kamu punya 20 halaman dan masing-masing punya <style> sendiri, memperbaiki satu warna berarti mengedit 20 file.",
          ),
          h("Studi Kasus: Halaman Ucapan Satu File"),
          p(
            "<p><strong>Skenario:</strong> Kamu ingin mengirim satu file HTML ucapan ulang tahun yang bisa langsung dibuka penerima. Semua CSS dimasukkan ke file yang sama.</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Selamat Ulang Tahun</title>
  <style>
    body {
      display: grid;
      place-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #f97316, #fbbf24);
      font-family: system-ui, sans-serif;
    }

    .kartu {
      padding: 40px;
      border-radius: 24px;
      background: white;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    h1 { margin: 0 0 8px; color: #ea580c; }
    p  { margin: 0; color: #475569; }
  </style>
</head>
<body>
  <div class="kartu">
    <h1>Selamat Ulang Tahun!</h1>
    <p>Semoga tahun ini penuh hal baik.</p>
  </div>
</body>
</html>
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah gradien latar menjadi #2563eb ke #22d3ee dan ganti warna judul menjadi #2563eb.",
          ),
          divider(),
        ],
      },
      {
        title: "External CSS & Struktur Folder",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memisahkan CSS ke file terpisah, menghubungkannya lewat <code>&lt;link&gt;</code>, dan menyusun folder proyek yang rapi.</p>",
          ),
          h("1. Struktur Folder Proyek"),
          p(
            "<p>Simpan CSS di dalam folder <code>css/</code> agar file HTML dan aset tidak bercampur.</p>",
          ),
          htmlCode(`
proyek/
├── index.html
├── tentang.html
├── css/
│   ├── style.css
│   └── komponen.css
└── gambar/
    └── logo.png
`),
          h("2. Menghubungkan File CSS"),
          p(
            "<p>Gunakan <code>&lt;link rel=\"stylesheet\" href=\"...\"&gt;</code> di dalam <code>head</code>. Perhatikan jalur <code>href</code> relatif terhadap lokasi file HTML.</p>",
          ),
          htmlCode(`
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/komponen.css">
`),
          h("3. Contoh Isi File CSS Terpisah"),
          cssCode(`
/* css/style.css */
:root {
  --warna-utama: #ea580c;
  --teks: #0f172a;
  --teks-redup: #64748b;
}

body {
  margin: 0;
  padding: 24px;
  font-family: system-ui, sans-serif;
  color: var(--teks);
  background: #f8fafc;
}

a { color: var(--warna-utama); }
`),
          h("4. Urutan Link Menentukan Pemenang"),
          p(
            "<p>Jika dua file CSS mengatur properti yang sama, file yang dimuat <strong>belakangan</strong> menang (dengan asumsi tingkat spesifisitas sama).</p>",
          ),
          htmlCode(`
<!-- style.css memuat .judul { color: black; } -->
<link rel="stylesheet" href="css/style.css">
<!-- komponen.css memuat .judul { color: orange; } -> menang -->
<link rel="stylesheet" href="css/komponen.css">
`),
          callout(
            "info",
            "Server produksi biasanya menggabungkan semua CSS menjadi satu file agar halaman lebih cepat dimuat.",
          ),
          h("Studi Kasus: Menghubungkan Dua Halaman ke Satu Stylesheet"),
          p(
            "<p><strong>Skenario:</strong> Dua halaman (beranda dan tentang) harus tampil konsisten. Keduanya memakai file CSS yang sama.</p>",
          ),
          htmlCode(`
<!-- index.html -->
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Beranda</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <h1>Beranda</h1>
  <p>Selamat datang.</p>
</body>
</html>

<!-- tentang.html -->
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Tentang</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <h1>Tentang</h1>
  <p>Tentang situs ini.</p>
</body>
</html>
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat file css/layout.css yang mengatur .kontainer dengan max-width 960px dan margin otomatis, lalu hubungkan setelah style.css di index.html.",
          ),
          divider(),
        ],
      },
      {
        title: "Cascade, Specificity & !important",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami aturan siapa yang menang saat dua deklarasi bentrok: cascade (urutan), spesifisitas, dan kapan <code>!important</code> boleh dipakai.</p>",
          ),
          h("1. Cascade: Aturan Terakhir Menang"),
          p(
            "<p>Untuk selector dengan kekuatan sama, deklarasi yang ditulis paling akhir yang dipakai.</p>",
          ),
          cssCode(`
.judul { color: #0f172a; }
.judul { color: #ea580c; } /* menang */
`),
          h("2. Spesifisitas: Nilai Kekuatan Selector"),
          p(
            "<p>Urutan kekuatan dari terendah ke tertinggi: <strong>tag</strong> &lt; <strong>class / atribut / pseudo-class</strong> &lt; <strong>id</strong> &lt; <strong>inline style</strong>.</p>",
          ),
          htmlCode(`
<p id="paragraf" class="teks">Contoh teks</p>
`),
          cssCode(`
p        { color: black; }   /* paling lemah */
.teks    { color: blue; }
#paragraf{ color: red; }     /* paling kuat di antara ketiganya */
`),
          h("3. Contoh Konflik Nyata"),
          p(
            "<p>Perhatikan bagaimana selector turunan dengan dua class mengalahkan satu class biasa.</p>",
          ),
          cssCode(`
.kartu p        { color: #475569; } /* 0-1-1 */
.kartu .catatan { color: #b45309; } /* 0-2-0 -> menang */

/* Inline style selalu menang atas file CSS:
   <p style="color: purple"> akan tetap ungu */
`),
          h("4. !important: Pintu Darurat, Bukan Solusi"),
          p(
            "<p><code>!important</code> memaksa deklarasi dipakai, menimpa hampir semua aturan lain. Semakin sering dipakai, CSS semakin sulit dirawat karena tidak ada lagi urutan yang bisa diandalkan.</p>",
          ),
          cssCode(`
.badge {
  background: #ea580c !important; /* hanya jika benar-benar terpaksa */
}
`),
          callout(
            "warning",
            "Jika perubahan warna tidak berefek, jangan langsung menambah !important. Cari tahu dulu selector mana yang menimpa menggunakan panel Styles di DevTools.",
          ),
          h("Studi Kasus: Memperbaiki Warna Tombol yang Tidak Berubah"),
          p(
            "<p><strong>Skenario:</strong> Class <code>.tombol-bahaya</code> sudah diberi background merah, tetapi tombol tetap oranye. Kita telusuri penyebabnya.</p>",
          ),
          cssCode(`
/* Aturan awal */
.tombol { background: #ea580c; }
.tombol-bahaya { background: #dc2626; }

/* HTML: <button class="tombol tombol-bahaya">Hapus</button> */
/* Hasil: MERAH. Karena kedua class punya spesifisitas sama,
   aturan yang ditulis terakhir (tombol-bahaya) menang. */
`),
          cssCode(`
/* Kasus berbeda: selector lebih spesifik mengalahkan class */
#form-utama .tombol { background: #ea580c; } /* 1-1-1 -> lebih kuat */
.tombol-bahaya { background: #dc2626; }      /* 0-1-0 -> kalah */

/* Solusi rapi: samakan kekuatan selector, jangan pakai !important */
#form-utama .tombol-bahaya { background: #dc2626; }
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat tiga aturan CSS yang menargetkan elemen yang sama (p, .teks, #teks) dengan warna berbeda dan urutkan dari yang paling lemah ke paling kuat.",
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
              options: [
                "Inline style",
                "Internal style",
                "External CSS",
                "Atribut bgcolor",
              ],
              answer: 2,
            },
            {
              q: "Tag untuk menghubungkan file CSS eksternal adalah...",
              options: [
                "<style>",
                "<link rel=\"stylesheet\">",
                "<script>",
                "<css>",
              ],
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

  // ==========================================================
  // PART 3 — CONTOH CSS BIASA
  // ==========================================================
  {
    name: "Contoh CSS Biasa",
    description:
      "Contoh nyata CSS klasik: warna, teks, box model, layout, dan flexbox.",
    lessons: [
      {
        title: "Warna & Background",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengatur warna teks, warna latar, gradien, transparansi, serta memakai variabel CSS agar palet warna konsisten.</p>",
          ),
          h("1. Warna Teks dan Latar"),
          p(
            "<p>Tiga properti dasar: <code>color</code> untuk teks, <code>background-color</code> untuk latar, dan <code>border-color</code> untuk garis.</p>",
          ),
          cssCode(`
.kartu {
  color: #0f172a;         /* teks gelap */
  background-color: #f8fafc; /* latar terang */
  border: 1px solid #cbd5e1;
}
`),
          h("2. Format Penulisan Warna (hex, rgb, hsl)"),
          p(
            "<p>Ketiganya sah. Hex paling ringkas, rgb memudahkan transparansi, hsl memudahkan variasi terang/gelap.</p>",
          ),
          cssCode(`
.contoh-hex { color: #ea580c; }
.contoh-rgb { color: rgb(234, 88, 12); }
.contoh-hsl { color: hsl(21, 90%, 48%); }

.transparan {
  background-color: rgba(234, 88, 12, 0.15); /* 15% opacity */
}
`),
          h("3. Gradien Latar"),
          p(
            "<p>Gradien dibuat dengan <code>linear-gradient</code> atau <code>radial-gradient</code> sebagai nilai <code>background</code>.</p>",
          ),
          cssCode(`
.banner {
  padding: 48px 24px;
  border-radius: 20px;
  background: linear-gradient(135deg, #ea580c, #f59e0b);
  color: white;
}

.cahaya {
  background: radial-gradient(circle at top, #fed7aa, #fff7ed 60%);
}
`),
          h("4. Variabel CSS untuk Palet Konsisten"),
          p(
            "<p>Simpan warna utama di <code>:root</code> agar mudah diganti di satu tempat.</p>",
          ),
          cssCode(`
:root {
  --utama: #ea580c;
  --utama-gelap: #c2410c;
  --teks: #0f172a;
  --latar: #f8fafc;
}

body { background: var(--latar); color: var(--teks); }
.tombol { background: var(--utama); }
.tombol:hover { background: var(--utama-gelap); }
`),
          callout(
            "warning",
            "Pastikan kontras teks terhadap latar cukup. Teks abu muda (#94a3b8) di atas latar putih sulit dibaca di layar HP.",
          ),
          h("Studi Kasus: Hero Section dengan Gradien & Variabel"),
          p(
            "<p><strong>Skenario:</strong> Membuat bagian pembuka landing page yang memakai palet konsisten dan gradien lembut.</p>",
          ),
          htmlCode(`
<section class="hero">
  <p class="hero-label">KELAS BARU</p>
  <h1>Belajar Web dari Nol</h1>
  <p class="hero-desc">Mulai dari HTML, CSS, hingga JavaScript.</p>
  <a class="hero-cta" href="#">Daftar Sekarang</a>
</section>
`),
          cssCode(`
:root {
  --utama: #ea580c;
  --utama-gelap: #9a3412;
}

.hero {
  padding: 56px 28px;
  border-radius: 24px;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  text-align: center;
}

.hero-label {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--utama);
}

.hero h1 {
  margin: 0 0 10px;
  font-size: 32px;
  color: #0f172a;
}

.hero-desc {
  margin: 0 0 20px;
  color: #57534e;
}

.hero-cta {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 12px;
  background: var(--utama);
  color: white;
  font-weight: 600;
  text-decoration: none;
}

.hero-cta:hover { background: var(--utama-gelap); }
`),
          callout(
            "success",
            "Tantangan Mandiri: Ganti gradien hero menjadi dua warna biru (#eff6ff ke #dbeafe) dan ubah --utama menjadi #2563eb.",
          ),
          divider(),
        ],
      },
      {
        title: "Teks & Font",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengatur keluarga font, ukuran, ketebalan, jarak baris, perataan, serta transformasi huruf agar teks nyaman dibaca.</p>",
          ),
          h("1. Jenis Font dan Cadangannya"),
          p(
            "<p>Selalu sertakan beberapa font cadangan. Browser memakai font pertama yang tersedia di perangkat pengguna.</p>",
          ),
          cssCode(`
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

.judul-penting {
  font-family: Georgia, "Times New Roman", serif;
}
`),
          h("2. Ukuran, Ketebalan, dan Jarak Baris"),
          p(
            "<p><code>line-height</code> 1.5–1.7 membuat paragraf panjang jauh lebih nyaman dibaca daripada jarak bawaan yang rapat.</p>",
          ),
          cssCode(`
h1 {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
}

p {
  font-size: 16px;
  line-height: 1.7;
  color: #334155;
}

.catatan-kecil {
  font-size: 12px;
  line-height: 1.4;
  color: #94a3b8;
}
`),
          h("3. Perataan dan Transformasi Huruf"),
          p(
            "<p><code>text-align</code> mengatur perataan, sedangkan <code>text-transform</code> mengubah kapitalisasi tanpa mengubah isi HTML.</p>",
          ),
          cssCode(`
.pusat { text-align: center; }
.kanan { text-align: right; }

.label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
  font-weight: 700;
}

.potong {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; /* tampilkan "..." jika terlalu panjang */
}
`),
          h("4. Menghias Tautan"),
          p(
            "<p>Tautan punya empat status yang bisa diatur: <code>:link</code>, <code>:visited</code>, <code>:hover</code>, dan <code>:focus-visible</code>.</p>",
          ),
          cssCode(`
a { color: #ea580c; text-decoration: none; }
a:hover { text-decoration: underline; }
a:focus-visible { outline: 2px solid #ea580c; outline-offset: 2px; }
`),
          callout(
            "info",
            "Jangan mengatur lebar teks terlalu panjang. Batas nyaman membaca adalah sekitar 60–75 karakter per baris (max-width: 65ch).",
          ),
          h("Studi Kasus: Halaman Artikel yang Nyaman Dibaca"),
          p(
            "<p><strong>Skenario:</strong> Artikel blog tampil melebar penuh di layar besar sehingga mata cepat lelah. Kita batasi lebar konten dan perbaiki tipografinya.</p>",
          ),
          htmlCode(`
<article class="artikel">
  <p class="kategori">TUTORIAL</p>
  <h1>Mengapa Tipografi Penting?</h1>
  <p class="ringkas">Tipografi yang baik membuat pembaca bertahan lebih lama.</p>
  <p>Paragraf isi artikel yang panjang, dengan jarak baris nyaman dan lebar yang terkendali...</p>
  <a href="#">Baca lanjutan</a>
</article>
`),
          cssCode(`
.artikel {
  max-width: 65ch;
  margin: 0 auto;
  padding: 32px 20px;
  font-family: system-ui, sans-serif;
}

.kategori {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #ea580c;
}

.artikel h1 {
  font-size: 34px;
  line-height: 1.2;
  margin: 8px 0 12px;
}

.ringkas {
  font-size: 18px;
  color: #475569;
  line-height: 1.6;
}

.artikel p { line-height: 1.8; color: #334155; }
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan class .kutipan untuk blockquote dengan border-left 3px solid #ea580c, padding-left 16px, dan font-style italic.",
          ),
          divider(),
        ],
      },
      {
        title: "Box Model",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami empat lapisan box model (content, padding, border, margin) dan mengapa <code>box-sizing: border-box</code> hampir selalu wajib dipakai.</p>",
          ),
          h("1. Padding: Jarak di Dalam Elemen"),
          p(
            "<p><code>padding</code> memberi jarak antara isi (teks) dan tepi elemen. Latar elemen ikut meluas ke area padding.</p>",
          ),
          cssCode(`
.kartu {
  padding: 24px;              /* semua sisi */
  padding: 16px 24px;         /* vertikal | horizontal */
  padding: 8px 16px 24px 16px;/* atas | kanan | bawah | kiri */
  background: #fff7ed;
}
`),
          h("2. Border: Garis Tepi"),
          p(
            "<p><code>border</code> adalah singkatan dari lebar, gaya, dan warna garis.</p>",
          ),
          cssCode(`
.kotak {
  border: 1px solid #cbd5e1;      /* semua sisi */
  border-left: 4px solid #ea580c; /* hanya kiri */
  border-radius: 12px;            /* sudut membulat */
}
`),
          h("3. Margin: Jarak Antar Elemen"),
          p(
            "<p><code>margin</code> memberi jarak <strong>di luar</strong> elemen. <code>margin: 0 auto</code> menengahkan blok yang memiliki lebar tetap.</p>",
          ),
          cssCode(`
.kartu {
  width: 480px;
  margin: 24px auto;   /* atas-bawah 24px, kiri-kanan otomatis (tengah) */
}

.paragraf { margin-bottom: 16px; }
`),
          h("4. box-sizing: border-box — Kenapa Penting?"),
          p(
            "<p>Secara bawaan, <code>width</code> hanya menghitung isi. Setelah padding dan border ditambahkan, lebar total bisa melebihi perkiraan. <code>border-box</code> membuat width sudah mencakup padding dan border.</p>",
          ),
          cssCode(`
/* Bawaan (content-box): total lebar = 300 + 20*2 + 2*2 = 342px */
.content-box {
  box-sizing: content-box;
  width: 300px;
  padding: 20px;
  border: 2px solid #333;
}

/* border-box: total lebar tetap 300px */
.border-box {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 2px solid #333;
}

* { box-sizing: border-box; } /* reset standar di hampir semua proyek */
`),
          callout(
            "warning",
            "Margin vertikal antar elemen bisa saling menumpuk (margin collapse). Gunakan gap pada flexbox/grid untuk jarak yang lebih prediktif.",
          ),
          h("Studi Kasus: Kartu Harga dengan Dua Varian Lebar"),
          p(
            "<p><strong>Skenario:</strong> Dua kartu harga ditempatkan berdampingan. Tanpa <code>border-box</code>, kartu meluber dan merusak baris.</p>",
          ),
          htmlCode(`
<div class="baris">
  <div class="paket">Paket Reguler</div>
  <div class="paket">Paket Intensif</div>
</div>
`),
          cssCode(`
* { box-sizing: border-box; }

.baris {
  display: flex;
  gap: 16px;
  max-width: 640px;
}

.paket {
  flex: 1;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  text-align: center;
  font-weight: 600;
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Hapus deklarasi * { box-sizing: border-box; } lalu amati apa yang terjadi pada dua kartu, kemudian kembalikan.",
          ),
          divider(),
        ],
      },
      {
        title: "Display, Position & Float",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengenal nilai <code>display</code>, teknik <code>position</code> untuk elemen mengambang, serta cara kerja <code>float</code> pada layout lama.</p>",
          ),
          h("1. Nilai display dan Perilakunya"),
          p(
            "<p><code>block</code> memenuhi lebar penuh, <code>inline</code> mengikuti aliran teks, <code>inline-block</code> gabungan keduanya, dan <code>none</code> menyembunyikan elemen.</p>",
          ),
          cssCode(`
.blok   { display: block; }
.sebaris { display: inline; }
.chip   { display: inline-block; padding: 6px 12px; border-radius: 999px; }
.sembunyi { display: none; }

/* grid & flex juga nilai display */
.kolom  { display: flex; }
.grid   { display: grid; }
`),
          h("2. Position: Relatif, Absolut, Fixed, Sticky"),
          p(
            "<p><code>absolute</code> diposisikan terhadap induk terdekat yang memiliki <code>position: relative</code>.</p>",
          ),
          cssCode(`
.wadah {
  position: relative;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.label-pojok {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ea580c;
  color: white;
  font-size: 12px;
}

.navbar-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}
`),
          h("3. Float: Layout Lama"),
          p(
            "<p><code>float</code> menggeser elemen ke kiri/kanan dan membuat teks mengalir di sekitarnya. Dulu dipakai untuk kolom, sekarang hanya untuk efek teks mengelilingi gambar.</p>",
          ),
          cssCode(`
.gambar-kiri {
  float: left;
  margin: 0 16px 8px 0;
  border-radius: 12px;
}

.pembersih::after {
  content: "";
  display: table;
  clear: both;
}
`),
          h("4. z-index dan Tumpukan Elemen"),
          p(
            "<p>Elemen dengan <code>position</code> selain static bisa ditumpuk. <code>z-index</code> lebih besar berarti lebih dekat ke depan.</p>",
          ),
          cssCode(`
.modal    { position: fixed; inset: 0; z-index: 50; }
.overlay  { position: absolute; inset: 0; z-index: 40; }
.konten   { position: relative; z-index: 1; }
`),
          callout(
            "info",
            "Untuk proyek baru, gunakan flexbox atau grid untuk layout kolom. Float hanya untuk teks mengelilingi gambar.",
          ),
          h("Studi Kasus: Kartu Produk dengan Badge Diskon dan Gambar Float"),
          p(
            "<p><strong>Skenario:</strong> Kartu produk memerlukan badge di pojok kanan atas dan gambar kecil yang dilingkari teks deskripsi.</p>",
          ),
          htmlCode(`
<article class="produk">
  <span class="badge">-20%</span>
  <img class="gambar" src="gambar/sepatu.jpg" alt="Sepatu" width="120" height="120">
  <h3>Sepatu Lari</h3>
  <p>Ringan, nyaman dipakai harian. Harga promo minggu ini.</p>
</article>
`),
          cssCode(`
.produk {
  position: relative;
  max-width: 420px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #dc2626;
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.gambar {
  float: left;
  margin: 0 16px 8px 0;
  border-radius: 12px;
}

.produk::after { content: ""; display: table; clear: both; }
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan tombol 'Beli' yang diposisikan absolute di pojok kanan bawah kartu.",
          ),
          divider(),
        ],
      },
      {
        title: "Flexbox Dasar",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyusun layout satu dimensi dengan flexbox: mengatur arah, perataan sumbu utama dan silang, jarak antar item, serta pembungkusan baris.</p>",
          ),
          h("1. Mengaktifkan Flexbox"),
          p(
            "<p><code>display: flex</code> pada container membuat anak-anaknya tersusun sebaris secara otomatis.</p>",
          ),
          cssCode(`
.baris {
  display: flex;
}

/* arah kolom */
.kolom {
  display: flex;
  flex-direction: column;
}
`),
          h("2. justify-content: Perataan Sumbu Utama"),
          p(
            "<p>Pada arah baris, <code>justify-content</code> mengatur posisi horizontal anak-anaknya.</p>",
          ),
          cssCode(`
.mulai   { display: flex; justify-content: flex-start; }
.tengah  { display: flex; justify-content: center; }
.akhir   { display: flex; justify-content: flex-end; }
.antara  { display: flex; justify-content: space-between; }
.sekitar { display: flex; justify-content: space-around; }
`),
          h("3. align-items dan gap"),
          p(
            "<p><code>align-items</code> mengatur sumbu silang (vertikal pada baris), sedangkan <code>gap</code> memberi jarak tanpa margin tambahan.</p>",
          ),
          cssCode(`
.baris {
  display: flex;
  align-items: center;   /* tengah vertikal */
  gap: 12px;
}

.rata-atas { align-items: flex-start; }
.rata-bawah { align-items: flex-end; }
`),
          h("4. flex, flex-wrap, dan min-width: 0"),
          p(
            "<p><code>flex: 1</code> membagi ruang sisa. <code>flex-wrap</code> membolehkan anak turun baris. <code>min-width: 0</code> mencegah teks panjang mendorong layout melebar.</p>",
          ),
          cssCode(`
.kartu-horizontal {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.isi { flex: 1; min-width: 0; }

.aksi { display: flex; gap: 8px; flex-shrink: 0; }
`),
          callout(
            "warning",
            "Jika teks di dalam flex item tidak mau terpotong dan membuat layout melebar, tambahkan min-width: 0 pada item tersebut.",
          ),
          h("Studi Kasus: Kartu Kursus Horizontal yang Responsif"),
          p(
            "<p><strong>Skenario:</strong> Kartu kursus berisi ikon, judul, progres, dan tombol. Pada layar sempit semua elemen harus turun baris dengan rapi.</p>",
          ),
          htmlCode(`
<article class="kursus">
  <span class="ikon">JS</span>
  <div class="info">
    <h3>Belajar JavaScript</h3>
    <p>Progres 60% · 12 materi tersisa</p>
  </div>
  <div class="aksi">
    <a class="tombol" href="#">Lanjut</a>
  </div>
</article>
`),
          cssCode(`
.kursus {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
}

.ikon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fff7ed;
  color: #ea580c;
  font-weight: 700;
}

.info { flex: 1; min-width: 180px; }
.info h3 { margin: 0; font-size: 15px; }
.info p  { margin: 4px 0 0; font-size: 13px; color: #64748b; }

.aksi { flex-shrink: 0; }

.tombol {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 10px;
  background: #ea580c;
  color: white;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah .kursus menjadi flex-direction: column pada layar kecil menggunakan media query max-width: 480px, lalu kembalikan arah baris di layar lebih besar.",
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
              options: [
                "flex-wrap: wrap",
                "display: block",
                "overflow: auto",
                "float: none",
              ],
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
];
