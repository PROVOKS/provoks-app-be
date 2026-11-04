/**
 * Seed course "Belajar HTML: Dari Nol sampai Mahir".
 *
 * Jalankan: npx tsx prisma/seed-html-course.ts
 *
 * Idempotent: kalau course dengan slug yang sama sudah ada, seluruh
 * CoursePart-nya dihapus (cascade ke silabus, block, soal) lalu dibangun ulang.
 * Course lain tidak disentuh.
 */
import { prisma } from "../src/db/prisma";
import { Prisma } from "../src/generated/prisma/client";
import { slugify } from "../src/utils/slug";

// ============================================================
// Tipe & helper
// ============================================================

type QuizQuestionDef = { q: string; options: string[]; answer: number };

type Block =
  | { type: "HEADING"; content: { level: number; text: string } }
  | { type: "PARAGRAPH"; content: { html: string } }
  | { type: "CODE"; content: { language: string; code: string } }
  | { type: "CALLOUT"; content: { variant: string; text: string } }
  | { type: "DIVIDER"; content: Record<string, never> }
  | { type: "QUIZ"; content: { title: string; timeLimitMinutes: number; maxAttempts: number }; questions: QuizQuestionDef[] };

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

const code = (src: string, language = "html"): Block => ({
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

// ============================================================
// Kurikulum
// ============================================================

const PARTS: CoursePartDef[] = [
  // ----------------------------------------------------------
  {
    name: "Fondasi HTML",
    description:
      "Mengenal HTML, cara kerja halaman web, anatomi dokumen, dan alat yang dipakai sehari-hari.",
    lessons: [
      {
        title: "Apa Itu HTML & Cara Web Bekerja",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Setelah pelajaran ini kamu bisa menjelaskan apa itu HTML, perannya di halaman web, dan bagaimana sebuah halaman bisa muncul di browser.</p>",
          ),
          h("HTML itu apa?"),
          p(
            "<p><strong>HTML</strong> (HyperText Markup Language) adalah bahasa <em>markup</em> yang memberi <strong>struktur</strong> pada halaman web. HTML bukan bahasa pemrograman: tidak ada variabel, logika, atau perulangan. Tugasnya memberi tahu browser bahwa sebuah teks adalah judul, paragraf, gambar, atau tautan.</p><p>Analogi sederhana: <strong>HTML</strong> adalah kerangka rumah, <strong>CSS</strong> adalah cat dan dekorasinya, <strong>JavaScript</strong> adalah listrik dan saklarnya.</p>",
          ),
          code(`
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <title>Halaman Pertama</title>
  </head>
  <body>
    <h1>Halo, Dunia!</h1>
    <p>Ini halaman HTML pertama saya.</p>
  </body>
</html>
`),
          h("Bagaimana halaman sampai ke browser?"),
          p(
            "<p>Kamu mengetik alamat situs, lalu browser mengirim permintaan ke <strong>server</strong>. Server membalas dengan file HTML. Browser membaca file itu dan menyusun tampilannya sesuai tag yang ditemukan.</p><ol><li>Browser meminta file HTML ke server.</li><li>Server mengirim HTML (beserta CSS, gambar, dan JavaScript).</li><li>Browser membaca HTML dari atas ke bawah dan membangun tampilan.</li></ol>",
          ),
          callout(
            "info",
            "Kamu tidak butuh server untuk belajar. File .html yang disimpan di komputer bisa langsung dibuka di browser.",
          ),
          divider(),
        ],
      },
      {
        title: "Anatomi Dokumen HTML",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami bagian wajib sebuah dokumen HTML: doctype, html, head, dan body.</p>",
          ),
          h("Kerangka wajib"),
          code(`
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Judul Tab Browser</title>
  </head>
  <body>
    <!-- semua yang terlihat di halaman ditulis di sini -->
  </body>
</html>
`),
          p(
            "<ul><li><code>&lt;!DOCTYPE html&gt;</code> memberi tahu browser bahwa ini dokumen HTML5.</li><li><code>&lt;html&gt;</code> adalah akar seluruh dokumen. Atribut <code>lang</code> menyatakan bahasa halaman.</li><li><code>&lt;head&gt;</code> berisi informasi yang <em>tidak tampil</em>: judul tab, encoding, meta, CSS.</li><li><code>&lt;body&gt;</code> berisi semua konten yang terlihat oleh pengunjung.</li></ul>",
          ),
          h("Contoh lengkap"),
          code(`
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <title>Profil Saya</title>
  </head>
  <body>
    <h1>Halo, saya Budi</h1>
    <p>Saya sedang belajar HTML.</p>
  </body>
</html>
`),
          callout(
            "warning",
            "Tanpa <meta charset=\"UTF-8\">, karakter seperti é, ñ, atau emoji bisa tampil rusak.",
          ),
          divider(),
        ],
      },
      {
        title: "Tools: Editor, Browser, dan DevTools",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyiapkan alat kerja minimal: code editor, browser, dan DevTools untuk memeriksa hasil.</p>",
          ),
          h("Alat yang dipakai"),
          p(
            "<ul><li><strong>VS Code</strong> — editor gratis yang ringan dan punya banyak ekstensi.</li><li><strong>Browser</strong> — Chrome, Firefox, atau Edge untuk melihat hasil.</li><li><strong>DevTools</strong> — tekan <code>F12</code> (atau klik kanan → Inspect) untuk melihat struktur HTML yang sudah diproses browser.</li></ul>",
          ),
          h("Struktur folder latihan"),
          code(
            `
belajar-html/
├── index.html
├── tentang.html
├── gambar/
│   └── foto.jpg
└── style.css
`,
            "bash",
          ),
          p(
            "<p>Simpan file dengan ekstensi <code>.html</code>, lalu buka dengan klik dua kali. Setiap kali mengubah kode, simpan file (<code>Ctrl + S</code>) dan muat ulang browser (<code>F5</code>).</p>",
          ),
          callout(
            "success",
            "Di VS Code, ekstensi Live Server bisa memuat ulang halaman otomatis setiap kali kamu menyimpan file.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Fondasi",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Fondasi HTML"),
          p("<p>Jawab pertanyaan berikut untuk menguji pemahaman dasar kamu.</p>"),
          quiz("Kuis Fondasi HTML", [
            {
              q: "Apa kepanjangan dari HTML?",
              options: [
                "Hyper Text Markup Language",
                "High Text Machine Language",
                "Hyperlink Text Markup Language",
                "Home Tool Markup Language",
              ],
              answer: 0,
            },
            {
              q: "Deklarasi yang wajib ada di baris pertama dokumen HTML adalah...",
              options: ["<html>", "<!DOCTYPE html>", "<head>", "<body>"],
              answer: 1,
            },
            {
              q: "Bagian dokumen yang isinya tampil di browser adalah...",
              options: ["<head>", "<body>", "<title>", "<meta>"],
              answer: 1,
            },
            {
              q: "Ekstensi file halaman HTML yang umum adalah...",
              options: [".html", ".htm", ".html atau .htm", ".web"],
              answer: 2,
            },
            {
              q: "Tag <title> diletakkan di dalam...",
              options: ["<body>", "<head>", "<footer>", "<main>"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  {
    name: "Tag Dasar: Teks & Format",
    description:
      "Mengelompokkan tag teks: heading, paragraf, format huruf, tag font lama, dan kutipan.",
    lessons: [
      {
        title: "Heading & Paragraf",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menggunakan <code>h1</code>–<code>h6</code>, <code>p</code>, <code>br</code>, dan <code>hr</code> dengan benar.</p>",
          ),
          h("Tag heading"),
          p(
            "<p>Ada enam tingkat heading. <code>&lt;h1&gt;</code> paling besar dan paling penting, <code>&lt;h6&gt;</code> paling kecil.</p>",
          ),
          code(`
<h1>Judul Utama</h1>
<h2>Sub Judul</h2>
<h3>Sub-sub Judul</h3>
<h4>Tingkat 4</h4>
<h5>Tingkat 5</h5>
<h6>Tingkat 6</h6>
`),
          h("Paragraf, baris baru, dan garis"),
          code(`
<p>Ini paragraf pertama.</p>
<p>Ini paragraf kedua.<br>Baris ini masih paragraf yang sama.</p>
<hr>
<p>Paragraf setelah garis pemisah.</p>
`),
          p(
            "<ul><li><code>&lt;p&gt;</code> membuat paragraf baru (ada jarak atas-bawah).</li><li><code>&lt;br&gt;</code> hanya pindah baris, tanpa paragraf baru.</li><li><code>&lt;hr&gt;</code> membuat garis horizontal sebagai pemisah topik.</li></ul>",
          ),
          callout(
            "info",
            "Gunakan hanya satu <h1> per halaman, lalu susun heading secara berurutan (h2 sebelum h3) agar struktur mudah dibaca dan ramah SEO.",
          ),
          divider(),
        ],
      },
      {
        title: "Format Teks: Tebal, Miring, dan Coret",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membedakan tag format yang hanya visual dengan tag yang punya makna (semantik).</p>",
          ),
          h("Tag format teks"),
          code(`
<p><b>Tebal visual</b> dan <strong>tebal bermakna penting</strong></p>
<p><i>Miring visual</i> dan <em>miring dengan penekanan</em></p>
<p><u>Bergaris bawah</u> dan <s>dicoret</s></p>
<p><mark>Disorot seperti stabilo</mark></p>
<p><small>Catatan kecil</small></p>
<p>Harga lama <del>Rp150.000</del> menjadi <ins>Rp99.000</ins></p>
`),
          p(
            "<p><strong>b</strong> vs <strong>strong</strong>: keduanya terlihat tebal, tetapi <code>&lt;strong&gt;</code> memberi tahu browser (dan pembaca layar) bahwa teks itu <em>penting</em>. Sama halnya <code>&lt;i&gt;</code> vs <code>&lt;em&gt;</code>.</p>",
          ),
          h("Kombinasi"),
          code(`
<p><strong><em>Penting dan ditekankan</em></strong></p>
<p>Rumus kimia: H<sub>2</sub>O</p>
<p>Pangkat: 10<sup>2</sup> = 100</p>
`),
          callout(
            "warning",
            "Hindari memakai tag format untuk mengatur ukuran atau warna. Itu tugas CSS.",
          ),
          divider(),
        ],
      },
      {
        title: "Tag Font & Teks Khusus",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengenal tag font lama yang masih sering ditemui di kode warisan, sekaligus tag teks khusus yang masih relevan.</p>",
          ),
          h("Tag font lama (legacy)"),
          code(`
<font color="red" size="5" face="Arial">Teks dengan tag font</font>
<big>Teks besar</big>
<tt>Teks monospace</tt>
<center>Teks di tengah</center>
`),
          p(
            "<p><code>&lt;font&gt;</code>, <code>&lt;big&gt;</code>, <code>&lt;tt&gt;</code>, dan <code>&lt;center&gt;</code> sudah <strong>deprecated</strong> sejak HTML5. Browser masih menampilkannya demi kompatibilitas, tetapi jangan dipakai untuk proyek baru. Gunakan CSS: <code>color</code>, <code>font-size</code>, <code>font-family</code>, dan <code>text-align</code>.</p>",
          ),
          callout(
            "warning",
            "Tag <font> tidak akan lolos validasi HTML5. Kalau menemukannya di kode lama, ganti dengan CSS.",
          ),
          h("Tag teks khusus yang masih dipakai"),
          code(`
<p>Tekan <kbd>Ctrl</kbd> + <kbd>S</kbd> untuk menyimpan.</p>
<p>Kode sumber: <code>&lt;h1&gt;Judul&lt;/h1&gt;</code></p>
<pre>
Baris 1
  Baris 2 menjorok
    Baris 3 lebih menjorok
</pre>
`),
          p(
            "<ul><li><code>&lt;kbd&gt;</code> untuk tombol keyboard.</li><li><code>&lt;code&gt;</code> untuk potongan kode pendek di dalam teks.</li><li><code>&lt;pre&gt;</code> mempertahankan spasi dan baris apa adanya.</li></ul>",
          ),
          divider(),
        ],
      },
      {
        title: "Kutipan & Alamat",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai <code>blockquote</code>, <code>q</code>, <code>cite</code>, <code>address</code>, dan <code>abbr</code>.</p>",
          ),
          code(`
<blockquote cite="https://www.w3.org/">
  <p>Web dibuat untuk semua orang.</p>
  <cite>— Tim Berners-Lee</cite>
</blockquote>

<p>Menurut W3C, <q>aksesibilitas adalah kebutuhan</q>.</p>

<p><abbr title="HyperText Markup Language">HTML</abbr> adalah bahasa markup.</p>

<address>
  Jl. Contoh No. 10<br>
  Bandung, Jawa Barat<br>
  <a href="mailto:halo@contoh.id">halo@contoh.id</a>
</address>
`),
          p(
            "<ul><li><code>&lt;blockquote&gt;</code> untuk kutipan panjang (blok).</li><li><code>&lt;q&gt;</code> untuk kutipan pendek di tengah kalimat (browser menambahkan tanda kutip).</li><li><code>&lt;cite&gt;</code> untuk judul karya atau nama sumber.</li><li><code>&lt;address&gt;</code> untuk informasi kontak.</li><li><code>&lt;abbr&gt;</code> untuk singkatan; atribut <code>title</code> menampilkan kepanjangannya.</li></ul>",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Tag Teks",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Tag Teks & Format"),
          p("<p>Uji pemahamanmu tentang tag teks dasar.</p>"),
          quiz("Kuis Tag Teks & Format", [
            {
              q: "Tag heading dengan tingkat paling tinggi adalah...",
              options: ["<h6>", "<h1>", "<head>", "<header>"],
              answer: 1,
            },
            {
              q: "Perbedaan <b> dan <strong> yang benar adalah...",
              options: [
                "Tidak ada bedanya sama sekali",
                "<strong> memberi makna penting, <b> hanya visual",
                "<b> memberi makna penting",
                "<strong> hanya tebal visual",
              ],
              answer: 1,
            },
            {
              q: "Tag untuk mencoret teks adalah...",
              options: ["<u>", "<s>", "<i>", "<em>"],
              answer: 1,
            },
            {
              q: "Tag <pre> berguna untuk...",
              options: [
                "Menampilkan teks dengan spasi dan baris apa adanya",
                "Membuat teks menjadi tebal",
                "Membuat paragraf baru",
                "Menampilkan gambar",
              ],
              answer: 0,
            },
            {
              q: "Untuk menuliskan rumus H2O dengan angka 2 di bawah dipakai...",
              options: ["<sup>", "<sub>", "<small>", "<mark>"],
              answer: 1,
            },
            {
              q: "Tag mana yang sudah deprecated dan sebaiknya tidak dipakai lagi?",
              options: ["<strong>", "<font>", "<em>", "<code>"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  {
    name: "List, Link, Gambar & Media",
    description:
      "Membuat daftar, tautan, path file, gambar, serta menyisipkan audio, video, dan embed.",
    lessons: [
      {
        title: "List Tak Berurut & Berurut",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat daftar dengan <code>ul</code>, <code>ol</code>, dan <code>li</code>, termasuk daftar bersarang.</p>",
          ),
          h("Daftar tak berurut"),
          code(`
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
`),
          h("Daftar berurut"),
          code(`
<ol>
  <li>Siapkan editor</li>
  <li>Buat file index.html</li>
  <li>Buka di browser</li>
</ol>

<ol start="3" reversed>
  <li>Langkah ketiga</li>
  <li>Langkah kedua</li>
  <li>Langkah pertama</li>
</ol>
`),
          h("Daftar bersarang"),
          code(`
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
  <li>Backend
    <ul>
      <li>Node.js</li>
      <li>PostgreSQL</li>
    </ul>
  </li>
</ul>
`),
          callout(
            "info",
            "Atribut <code>start</code> mengatur nomor awal, <code>reversed</code> membalik urutan, dan <code>type</code> mengganti jenis penomoran (1, A, a, I, i).",
          ),
          divider(),
        ],
      },
      {
        title: "Definition List",
        duration: 10,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai <code>dl</code>, <code>dt</code>, dan <code>dd</code> untuk pasangan istilah–penjelasan.</p>",
          ),
          code(`
<dl>
  <dt>HTML</dt>
  <dd>Bahasa markup untuk menyusun struktur halaman web.</dd>

  <dt>CSS</dt>
  <dd>Bahasa untuk mengatur tampilan halaman.</dd>

  <dt>JavaScript</dt>
  <dd>Bahasa pemrograman yang berjalan di browser.</dd>
</dl>
`),
          p(
            "<p><code>&lt;dt&gt;</code> adalah istilah (<em>definition term</em>) dan <code>&lt;dd&gt;</code> adalah penjelasannya. Cocok untuk glosarium, FAQ singkat, atau daftar spesifikasi.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Link",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat tautan ke halaman lain, bagian halaman, email, telepon, dan file unduhan.</p>",
          ),
          h("Tautan dasar"),
          code(`
<a href="https://www.w3.org">Kunjungi W3C</a>

<a href="tentang.html">Tentang Kami</a>

<a href="https://www.w3.org" target="_blank" rel="noopener noreferrer">
  Buka di tab baru
</a>
`),
          h("Tautan ke bagian halaman"),
          code(`
<a href="#kontak">Langsung ke bagian kontak</a>

<!-- di bagian bawah halaman -->
<h2 id="kontak">Kontak</h2>
<p>Email: halo@contoh.id</p>
`),
          h("Email, telepon, dan unduhan"),
          code(`
<a href="mailto:halo@contoh.id">Kirim email</a>
<a href="tel:+6281234567890">Telepon kami</a>
<a href="dokumen.pdf" download>Unduh PDF</a>
`),
          p(
            "<ul><li><code>href</code> adalah tujuan tautan.</li><li><code>target=\"_blank\"</code> membuka tab baru; sertakan <code>rel=\"noopener noreferrer\"</code> demi keamanan.</li><li>Teks tautan sebaiknya deskriptif, bukan “klik di sini”.</li></ul>",
          ),
          divider(),
        ],
      },
      {
        title: "Path Relatif vs Absolut",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menulis alamat file dengan benar agar gambar dan tautan tidak rusak.</p>",
          ),
          h("Path relatif"),
          code(`
<!-- file di folder yang sama -->
<img src="foto.jpg" alt="Foto profil">

<!-- file di dalam subfolder -->
<img src="gambar/foto.jpg" alt="Foto profil">

<!-- naik satu folder -->
<img src="../aset/logo.png" alt="Logo">
`),
          h("Path absolut"),
          code(`
<img src="https://images.contoh.id/banner.jpg" alt="Banner">
<a href="https://www.w3.org">W3C</a>
`),
          p(
            "<p>Path relatif dihitung dari lokasi file HTML. Path absolut memuat alamat lengkap (biasanya untuk file dari internet).</p>",
          ),
          callout(
            "warning",
            "Nama file di Linux/macOS bersifat case-sensitive. <code>Foto.JPG</code> dan <code>foto.jpg</code> dianggap berbeda.",
          ),
          divider(),
        ],
      },
      {
        title: "Gambar",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menampilkan gambar dengan atribut yang benar, plus <code>figure</code> dan <code>figcaption</code>.</p>",
          ),
          code(`
<img src="gambar/foto.jpg" alt="Seorang siswa mengetik di laptop" width="480" height="320">

<figure>
  <img src="gambar/pantai.jpg" alt="Pantai berpasir saat matahari terbenam">
  <figcaption>Pantai di sore hari.</figcaption>
</figure>
`),
          p(
            "<ul><li><code>src</code> wajib: alamat file gambar.</li><li><code>alt</code> wajib: teks alternatif saat gambar gagal dimuat dan untuk pembaca layar.</li><li><code>width</code>/<code>height</code> menjaga tata letak tidak “melompat” saat gambar dimuat.</li><li><code>&lt;figure&gt;</code> + <code>&lt;figcaption&gt;</code> memasangkan gambar dengan keterangan.</li></ul>",
          ),
          h("Gambar responsif"),
          code(`
<picture>
  <source srcset="gambar/hero-besar.jpg" media="(min-width: 800px)">
  <img src="gambar/hero-kecil.jpg" alt="Ilustrasi hero">
</picture>

<img
  src="gambar/artikel.jpg"
  srcset="gambar/artikel-480.jpg 480w, gambar/artikel-960.jpg 960w"
  sizes="(max-width: 600px) 480px, 960px"
  alt="Ilustrasi artikel">
`),
          divider(),
        ],
      },
      {
        title: "Audio, Video & Embed",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyisipkan audio, video, dan konten pihak ketiga dengan <code>iframe</code>.</p>",
          ),
          code(`
<audio controls>
  <source src="audio/podcast.mp3" type="audio/mpeg">
  Browser kamu tidak mendukung elemen audio.
</audio>

<video controls width="480" poster="gambar/poster.jpg">
  <source src="video/tutorial.mp4" type="video/mp4">
  Browser kamu tidak mendukung elemen video.
</video>
`),
          h("Embed dengan iframe"),
          code(`
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video tutorial HTML"
  allowfullscreen>
</iframe>
`),
          p(
            "<p><code>controls</code> menampilkan tombol putar. <code>poster</code> adalah gambar sampul video. <code>iframe</code> dipakai untuk menyisipkan halaman lain, seperti video YouTube atau peta.</p>",
          ),
          callout(
            "warning",
            "Hanya sematkan konten dari sumber tepercaya. iframe bisa menjalankan kode dari situs lain.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Link, Gambar & Media",
        duration: 12,
        type: "QUIZ",
        blocks: [
          h("Kuis List, Link, Gambar & Media"),
          p("<p>Uji pemahaman tentang daftar, tautan, gambar, dan media.</p>"),
          quiz("Kuis Link, Gambar & Media", [
            {
              q: "Tag untuk membuat daftar bernomor adalah...",
              options: ["<ul>", "<ol>", "<li>", "<dl>"],
              answer: 1,
            },
            {
              q: "Atribut wajib pada tag <img> untuk aksesibilitas adalah...",
              options: ["src", "alt", "width", "title"],
              answer: 1,
            },
            {
              q: "Untuk membuka link di tab baru dipakai...",
              options: ['target="_blank"', 'href="_blank"', 'rel="new"', 'open="new"'],
              answer: 0,
            },
            {
              q: "Link ke alamat email memakai awalan...",
              options: ["mailto:", "email:", "tel:", "http:"],
              answer: 0,
            },
            {
              q: "Manakah path relatif ke gambar di folder yang sama?",
              options: [
                "C:\\Users\\foto.jpg",
                "https://situs.com/foto.jpg",
                "foto.jpg",
                "/var/www/foto.jpg",
              ],
              answer: 2,
            },
            {
              q: "Tag untuk menyisipkan video dari YouTube adalah...",
              options: ["<video>", "<iframe>", "<embed>", "<object>"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  {
    name: "Tabel & Form (Tag Input)",
    description:
      "Membuat tabel data dan form lengkap: tag input teks, pilihan, validasi, dan tombol.",
    lessons: [
      {
        title: "Tabel Dasar",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyusun data tabular dengan <code>table</code>, <code>tr</code>, <code>th</code>, <code>td</code>, dan <code>caption</code>.</p>",
          ),
          code(`
<table>
  <caption>Jadwal Kuliah</caption>
  <tr>
    <th>Hari</th>
    <th>Mata Kuliah</th>
  </tr>
  <tr>
    <td>Senin</td>
    <td>Pemrograman Web</td>
  </tr>
  <tr>
    <td>Rabu</td>
    <td>Basis Data</td>
  </tr>
</table>
`),
          p(
            "<ul><li><code>&lt;tr&gt;</code> = baris (<em>table row</em>).</li><li><code>&lt;th&gt;</code> = sel judul (tebal dan rata tengah secara default).</li><li><code>&lt;td&gt;</code> = sel data.</li><li><code>&lt;caption&gt;</code> = judul tabel.</li></ul>",
          ),
          callout(
            "info",
            "Tabel hanya untuk data tabular. Jangan pakai tabel untuk menyusun tata letak halaman — itu tugas CSS Grid atau Flexbox.",
          ),
          divider(),
        ],
      },
      {
        title: "Tabel Lanjutan",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai <code>thead</code>, <code>tbody</code>, <code>tfoot</code>, serta menggabungkan sel.</p>",
          ),
          code(`
<table>
  <thead>
    <tr>
      <th>Produk</th>
      <th>Harga</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Keyboard</td>
      <td>Rp350.000</td>
    </tr>
    <tr>
      <td>Mouse</td>
      <td>Rp150.000</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th>Total</th>
      <th>Rp500.000</th>
    </tr>
  </tfoot>
</table>
`),
          h("Menggabungkan sel"),
          code(`
<table>
  <tr>
    <th colspan="2">Data Siswa</th>
  </tr>
  <tr>
    <th>Nama</th>
    <th>Kelas</th>
  </tr>
  <tr>
    <td rowspan="2">Budi</td>
    <td>X-1</td>
  </tr>
  <tr>
    <td>X-2</td>
  </tr>
</table>
`),
          p(
            "<p><code>colspan</code> menggabungkan kolom (horizontal), <code>rowspan</code> menggabungkan baris (vertikal).</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Tag Input Teks & Angka",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengenal tipe-tipe <code>&lt;input&gt;</code> untuk teks, angka, tanggal, dan file.</p>",
          ),
          h("Form paling dasar"),
          code(`
<form>
  <label for="nama">Nama</label>
  <input type="text" id="nama" name="nama" placeholder="Nama lengkap">

  <button type="submit">Kirim</button>
</form>
`),
          h("Tipe input teks & angka"),
          code(`
<label for="email">Email</label>
<input type="email" id="email" name="email">

<label for="sandi">Password</label>
<input type="password" id="sandi" name="sandi">

<label for="umur">Umur</label>
<input type="number" id="umur" name="umur" min="10" max="100">

<label for="telepon">Telepon</label>
<input type="tel" id="telepon" name="telepon">

<label for="situs">Website</label>
<input type="url" id="situs" name="situs">

<label for="cari">Cari</label>
<input type="search" id="cari" name="cari">

<label for="lahir">Tanggal lahir</label>
<input type="date" id="lahir" name="lahir">

<label for="jam">Jam</label>
<input type="time" id="jam" name="jam">

<label for="warna">Warna favorit</label>
<input type="color" id="warna" name="warna">

<label for="volume">Volume</label>
<input type="range" id="volume" name="volume" min="0" max="100">

<label for="berkas">Upload berkas</label>
<input type="file" id="berkas" name="berkas" accept=".pdf,.jpg">
`),
          p(
            "<ul><li><code>type=\"password\"</code> menyembunyikan karakter.</li><li><code>type=\"number\"</code> hanya menerima angka dan memunculkan tombol naik/turun.</li><li><code>type=\"email\"</code> dan <code>type=\"url\"</code> memvalidasi format secara otomatis.</li><li><code>accept</code> membatasi jenis file yang bisa diunggah.</li></ul>",
          ),
          callout(
            "warning",
            "Tipe input membantu validasi di browser, tetapi validasi tetap harus diulang di server. Data dari browser tidak bisa dipercaya begitu saja.",
          ),
          divider(),
        ],
      },
      {
        title: "Tag Input Pilihan",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat pilihan dengan <code>checkbox</code>, <code>radio</code>, <code>select</code>, dan <code>datalist</code>.</p>",
          ),
          h("Checkbox — boleh lebih dari satu"),
          code(`
<fieldset>
  <legend>Skill yang dikuasai</legend>

  <label>
    <input type="checkbox" name="skill" value="html" checked>
    HTML
  </label>

  <label>
    <input type="checkbox" name="skill" value="css">
    CSS
  </label>

  <label>
    <input type="checkbox" name="skill" value="js">
    JavaScript
  </label>
</fieldset>
`),
          h("Radio — hanya satu pilihan"),
          code(`
<fieldset>
  <legend>Jenis kelamin</legend>

  <label>
    <input type="radio" name="gender" value="pria" checked>
    Pria
  </label>

  <label>
    <input type="radio" name="gender" value="wanita">
    Wanita
  </label>
</fieldset>
`),
          h("Select & datalist"),
          code(`
<label for="kota">Kota</label>
<select id="kota" name="kota">
  <option value="">-- Pilih kota --</option>
  <optgroup label="Jawa">
    <option value="bdg">Bandung</option>
    <option value="jkt">Jakarta</option>
  </optgroup>
  <optgroup label="Bali">
    <option value="dps">Denpasar</option>
  </optgroup>
</select>

<label for="kampus">Kampus</label>
<input list="daftar-kampus" id="kampus" name="kampus">
<datalist id="daftar-kampus">
  <option value="Universitas Contoh A">
  <option value="Universitas Contoh B">
</datalist>
`),
          p(
            "<p>Radio dengan <code>name</code> yang sama otomatis saling meniadakan. Checkbox dengan <code>name</code> yang sama mengirim banyak nilai.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Textarea, Button & Validasi",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Melengkapi form dengan <code>textarea</code>, <code>button</code>, dan atribut validasi.</p>",
          ),
          code(`
<form>
  <label for="pesan">Pesan</label>
  <textarea id="pesan" name="pesan" rows="4" placeholder="Tulis pesan..."></textarea>

  <label for="email2">Email</label>
  <input type="email" id="email2" name="email" required
         placeholder="nama@email.com" autocomplete="email">

  <label for="kode">Kode pos</label>
  <input type="text" id="kode" name="kode" pattern="[0-9]{5}"
         title="5 digit angka" inputmode="numeric">

  <label for="umur2">Umur</label>
  <input type="number" id="umur2" name="umur" min="10" max="100" step="1">

  <label for="bio">Bio (maks 120)</label>
  <input type="text" id="bio" name="bio" maxlength="120">

  <button type="submit">Kirim</button>
  <button type="reset">Reset</button>
</form>
`),
          h("Atribut validasi penting"),
          p(
            "<ul><li><code>required</code> — wajib diisi.</li><li><code>pattern</code> — ekspresi reguler untuk format.</li><li><code>min</code>/<code>max</code>/<code>step</code> — batas dan kelipatan angka atau tanggal.</li><li><code>maxlength</code> — batas jumlah karakter.</li><li><code>readonly</code> — bisa dibaca, tidak bisa diubah.</li><li><code>disabled</code> — tidak bisa diubah dan tidak dikirim.</li><li><code>autocomplete</code> — membantu pengisian otomatis.</li></ul>",
          ),
          callout(
            "success",
            "Coba kirim form kosong. Browser akan menampilkan pesan validasi bawaan tanpa JavaScript sedikit pun.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Tabel & Form",
        duration: 12,
        type: "QUIZ",
        blocks: [
          h("Kuis Tabel & Form"),
          p("<p>Uji pemahaman tentang tabel dan tag input.</p>"),
          quiz("Kuis Tabel & Form", [
            {
              q: "Tag untuk sel header pada tabel adalah...",
              options: ["<td>", "<th>", "<tr>", "<thead>"],
              answer: 1,
            },
            {
              q: "Atribut untuk menggabungkan kolom pada tabel adalah...",
              options: ["rowspan", "colspan", "merge", "span"],
              answer: 1,
            },
            {
              q: "Tipe input untuk menyembunyikan karakter yang diketik adalah...",
              options: [
                'type="text"',
                'type="password"',
                'type="hidden"',
                'type="secret"',
              ],
              answer: 1,
            },
            {
              q: "Input yang memungkinkan memilih lebih dari satu opsi adalah...",
              options: [
                'type="radio"',
                'type="checkbox"',
                'type="text"',
                'type="submit"',
              ],
              answer: 1,
            },
            {
              q: "Atribut untuk membuat input wajib diisi adalah...",
              options: ["placeholder", "required", "readonly", "disabled"],
              answer: 1,
            },
            {
              q: "Tag pembungkus daftar dropdown adalah...",
              options: ["<option>", "<select>", "<datalist>", "<menu>"],
              answer: 1,
            },
            {
              q: "Atribut for pada <label> harus sama dengan...",
              options: ["name input", "id input", "class input", "value input"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  {
    name: "Semantic HTML & Aksesibilitas",
    description:
      "Menyusun halaman dengan tag bermakna, meta yang benar, dan dasar aksesibilitas.",
    lessons: [
      {
        title: "Kenapa Semantic? div vs section",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami kenapa tag semantic lebih baik daripada tumpukan <code>div</code>.</p>",
          ),
          h("Tanpa semantic"),
          code(`
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">
  <div class="post">...</div>
</div>
<div class="footer">...</div>
`),
          h("Dengan semantic"),
          code(`
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>
`),
          p(
            "<p>Tag semantic memberi <strong>makna</strong> pada struktur: browser, mesin pencari, dan pembaca layar tahu bagian mana header, navigasi, konten utama, dan footer. Hasilnya lebih mudah dirawat dan lebih ramah aksesibilitas.</p><p><code>&lt;div&gt;</code> tetap dipakai, tetapi hanya sebagai pembungkus tanpa makna khusus.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Struktur Halaman",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyusun halaman utuh dengan <code>header</code>, <code>nav</code>, <code>main</code>, <code>aside</code>, dan <code>footer</code>.</p>",
          ),
          code(`
<body>
  <header>
    <h1>Blog Belajar Web</h1>
    <nav>
      <ul>
        <li><a href="/">Beranda</a></li>
        <li><a href="/artikel">Artikel</a></li>
        <li><a href="/tentang">Tentang</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h2>Belajar HTML dari Nol</h2>
      <p>HTML adalah fondasi semua halaman web.</p>
    </article>

    <article>
      <h2>Mengenal CSS</h2>
      <p>CSS mengatur tampilan halaman.</p>
    </article>
  </main>

  <aside>
    <h2>Artikel Populer</h2>
    <ul>
      <li><a href="/artikel/1">Dasar HTML</a></li>
      <li><a href="/artikel/2">Dasar CSS</a></li>
    </ul>
  </aside>

  <footer>
    <p>&copy; 2026 Blog Belajar Web</p>
  </footer>
</body>
`),
          p(
            "<ul><li><code>&lt;header&gt;</code> — bagian pembuka (logo, judul, navigasi).</li><li><code>&lt;nav&gt;</code> — kumpulan tautan navigasi.</li><li><code>&lt;main&gt;</code> — konten utama, hanya satu per halaman.</li><li><code>&lt;article&gt;</code> — konten mandiri (postingan, berita).</li><li><code>&lt;section&gt;</code> — kelompok konten dengan tema.</li><li><code>&lt;aside&gt;</code> — konten pendukung di samping.</li><li><code>&lt;footer&gt;</code> — penutup (hak cipta, kontak).</li></ul>",
          ),
          divider(),
        ],
      },
      {
        title: "Elemen Semantic Tambahan",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai <code>figure</code>, <code>time</code>, <code>details</code>/<code>summary</code>, <code>mark</code>, dan <code>abbr</code> dengan tepat.</p>",
          ),
          code(`
<h2>Jadwal Rilis</h2>
<p>Dirilis pada <time datetime="2026-11-04">4 November 2026</time>.</p>

<figure>
  <img src="gambar/diagram.png" alt="Diagram alur HTML">
  <figcaption>Alur dokumen dari server ke browser.</figcaption>
</figure>

<details>
  <summary>Apa itu HTML?</summary>
  <p>HTML adalah bahasa markup untuk menyusun struktur halaman web.</p>
</details>

<p>Gunakan <mark>Ctrl + S</mark> untuk menyimpan.</p>
<p><abbr title="Cascading Style Sheets">CSS</abbr> mengatur tampilan.</p>
`),
          p(
            "<p><code>&lt;time&gt;</code> menyimpan tanggal dalam format yang bisa dibaca mesin, <code>&lt;details&gt;</code> membuat konten yang bisa dibuka-tutup tanpa JavaScript.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Meta & SEO Dasar",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengisi <code>head</code> dengan meta yang benar agar halaman tampil baik di mobile dan mesin pencari.</p>",
          ),
          code(`
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Belajar HTML dari nol: tag dasar, semantic, tabel, form, dan praktik.">
  <title>Belajar HTML dari Nol — Provoks</title>

  <link rel="icon" href="/favicon.ico">

  <meta property="og:title" content="Belajar HTML dari Nol">
  <meta property="og:description" content="Panduan HTML lengkap untuk pemula.">
  <meta property="og:image" content="https://contoh.id/og-html.png">
  <meta property="og:type" content="website">
</head>
`),
          p(
            "<ul><li><code>charset</code> — encoding karakter.</li><li><code>viewport</code> — wajib agar halaman responsif di HP.</li><li><code>description</code> — ringkasan yang muncul di hasil pencarian.</li><li><code>title</code> — judul tab dan judul di hasil pencarian.</li><li><code>og:*</code> — tampilan saat tautan dibagikan di media sosial.</li></ul>",
          ),
          callout(
            "info",
            "Atribut <code>lang</code> pada <code>&lt;html&gt;</code> membantu mesin pencari dan pembaca layar mengenali bahasa halaman.",
          ),
          divider(),
        ],
      },
      {
        title: "Aksesibilitas Dasar",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat halaman yang bisa dipakai semua orang, termasuk pengguna pembaca layar.</p>",
          ),
          code(`
<img src="gambar/grafik.png" alt="Grafik penjualan naik 20% dari Januari ke Juni">

<label for="email">Email</label>
<input type="email" id="email" name="email" required>

<button type="button" aria-label="Tutup dialog">
  <span aria-hidden="true">&times;</span>
</button>

<nav aria-label="Navigasi utama">
  <ul>
    <li><a href="/">Beranda</a></li>
  </ul>
</nav>
`),
          p(
            "<ul><li>Selalu isi <code>alt</code> untuk gambar bermakna; kosongkan (<code>alt=\"\"</code>) untuk gambar dekoratif.</li><li>Hubungkan <code>&lt;label for&gt;</code> dengan <code>id</code> input.</li><li>Jaga urutan heading tetap logis (h1 → h2 → h3).</li><li>Gunakan <code>aria-label</code> untuk tombol yang hanya berisi ikon.</li><li>Elemen semantic sudah membawa peran aksesibilitas bawaan.</li></ul>",
          ),
          callout(
            "warning",
            "Jangan memakai <code>div</code> atau <code>span</code> sebagai tombol. Pakai <code>&lt;button&gt;</code> supaya bisa diakses lewat keyboard.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Semantic & Aksesibilitas",
        duration: 12,
        type: "QUIZ",
        blocks: [
          h("Kuis Semantic HTML & Aksesibilitas"),
          p("<p>Uji pemahaman tentang struktur semantic dan aksesibilitas.</p>"),
          quiz("Kuis Semantic & Aksesibilitas", [
            {
              q: "Tag utama untuk konten utama halaman adalah...",
              options: ["<main>", "<section>", "<div>", "<article>"],
              answer: 0,
            },
            {
              q: "Tag yang cocok untuk postingan blog mandiri adalah...",
              options: ["<section>", "<article>", "<aside>", "<nav>"],
              answer: 1,
            },
            {
              q: "Meta viewport berguna untuk...",
              options: [
                "SEO gambar",
                "Mengatur tampilan di perangkat mobile",
                "Menentukan bahasa",
                "Memuat CSS",
              ],
              answer: 1,
            },
            {
              q: "Atribut alt pada gambar berguna untuk...",
              options: [
                "Mengatur ukuran",
                "Teks alternatif untuk aksesibilitas",
                "Menambah animasi",
                "Menentukan format",
              ],
              answer: 1,
            },
            {
              q: "Atribut lang pada <html> menyatakan...",
              options: ["Versi HTML", "Bahasa halaman", "Nama situs", "Tipe dokumen"],
              answer: 1,
            },
            {
              q: "Tag <aside> biasanya berisi...",
              options: [
                "Konten utama",
                "Konten pendukung atau samping",
                "Footer",
                "Judul halaman",
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
    name: "Praktik & Publikasi",
    description:
      "Tiga proyek nyata, debugging, ujian akhir, dan langkah lanjutan setelah HTML.",
    lessons: [
      {
        title: "Praktik 1 — Halaman Profil",
        duration: 25,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Membuat halaman profil sederhana yang memakai heading, paragraf, gambar, list, dan tautan.</p>",
          ),
          h("Langkah"),
          p(
            "<ol><li>Buat file <code>profil.html</code>.</li><li>Tempel kode di bawah.</li><li>Ganti teks, tautan, dan nama gambar dengan data kamu sendiri.</li><li>Buka di browser dan cek setiap tautan.</li></ol>",
          ),
          code(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profil — Budi Santoso</title>
</head>
<body>
  <header>
    <h1>Budi Santoso</h1>
    <p>Mahasiswa Teknik Informatika</p>
  </header>

  <main>
    <figure>
      <img src="gambar/budi.jpg" alt="Foto Budi Santoso" width="200" height="200">
      <figcaption>Foto profil Budi.</figcaption>
    </figure>

    <section>
      <h2>Tentang Saya</h2>
      <p>Saya sedang belajar <strong>HTML</strong> dan <em>CSS</em> untuk menjadi frontend developer.</p>
    </section>

    <section>
      <h2>Skill</h2>
      <ul>
        <li>HTML dasar</li>
        <li>Mengetik cepat</li>
        <li>Kerja tim</li>
      </ul>
    </section>

    <section>
      <h2>Kontak</h2>
      <p>
        Email: <a href="mailto:budi@contoh.id">budi@contoh.id</a><br>
        GitHub: <a href="https://github.com/budi" target="_blank" rel="noopener noreferrer">github.com/budi</a>
      </p>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Budi Santoso.</p>
  </footer>
</body>
</html>
`),
          callout(
            "success",
            "Ini sudah halaman HTML yang valid dan semantic. Tampilannya masih polos karena belum ada CSS — itu normal.",
          ),
        ],
      },
      {
        title: "Praktik 2 — Form Pendaftaran",
        duration: 25,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Membuat form pendaftaran lengkap dengan input teks, radio, select, checkbox, dan validasi.</p>",
          ),
          code(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pendaftaran Peserta</title>
</head>
<body>
  <h1>Form Pendaftaran</h1>

  <form action="/daftar" method="post">
    <p>
      <label for="nama">Nama lengkap</label><br>
      <input type="text" id="nama" name="nama" required placeholder="Nama sesuai KTP">
    </p>

    <p>
      <label for="email">Email</label><br>
      <input type="email" id="email" name="email" required autocomplete="email">
    </p>

    <fieldset>
      <legend>Jenis kelamin</legend>
      <label><input type="radio" name="gender" value="pria" required> Pria</label>
      <label><input type="radio" name="gender" value="wanita"> Wanita</label>
    </fieldset>

    <p>
      <label for="usia">Usia</label><br>
      <input type="number" id="usia" name="usia" min="15" max="60" required>
    </p>

    <p>
      <label for="kota">Kota</label><br>
      <select id="kota" name="kota" required>
        <option value="">-- Pilih kota --</option>
        <option value="bdg">Bandung</option>
        <option value="jkt">Jakarta</option>
        <option value="sby">Surabaya</option>
      </select>
    </p>

    <fieldset>
      <legend>Minat</legend>
      <label><input type="checkbox" name="minat" value="frontend"> Frontend</label>
      <label><input type="checkbox" name="minat" value="backend"> Backend</label>
    </fieldset>

    <p>
      <label for="motivasi">Motivasi</label><br>
      <textarea id="motivasi" name="motivasi" rows="4" maxlength="300"></textarea>
    </p>

    <button type="submit">Daftar</button>
    <button type="reset">Reset</button>
  </form>
</body>
</html>
`),
          p(
            "<p>Perhatikan: setiap input punya <code>id</code> yang terhubung ke <code>&lt;label for&gt;</code>, dan atribut <code>name</code> yang menentukan nama data saat dikirim ke server.</p>",
          ),
        ],
      },
      {
        title: "Praktik 3 — Landing Page Semantic",
        duration: 30,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Menyusun landing page utuh dengan struktur semantic dan navigasi antar-bagian.</p>",
          ),
          code(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Landing page contoh dengan HTML semantic.">
  <title>Belajar Web — Landing Page</title>
</head>
<body>
  <header>
    <h1>Belajar Web</h1>
    <nav aria-label="Navigasi utama">
      <ul>
        <li><a href="#fitur">Fitur</a></li>
        <li><a href="#alur">Alur Belajar</a></li>
        <li><a href="#daftar">Daftar</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="hero">
      <h2>Belajar HTML dari Nol</h2>
      <p>Mulai dari tag dasar sampai membuat halaman utuh.</p>
      <a href="#daftar">Mulai sekarang</a>
    </section>

    <section id="fitur">
      <h2>Fitur</h2>
      <article>
        <h3>Materi Terstruktur</h3>
        <p>Dari pengenalan sampai praktik.</p>
      </article>
      <article>
        <h3>Kuis Tiap Bagian</h3>
        <p>Uji pemahaman sebelum lanjut.</p>
      </article>
    </section>

    <section id="alur">
      <h2>Alur Belajar</h2>
      <ol>
        <li>Pahami struktur dokumen HTML</li>
        <li>Latih tag dasar dan form</li>
        <li>Bangun halaman semantic</li>
      </ol>
    </section>

    <section id="daftar">
      <h2>Daftar Kelas</h2>
      <form action="/daftar" method="post">
        <label for="nama2">Nama</label>
        <input type="text" id="nama2" name="nama" required>
        <label for="email2">Email</label>
        <input type="email" id="email2" name="email" required>
        <button type="submit">Daftar</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Belajar Web. Semua hak dilindungi.</p>
  </footer>
</body>
</html>
`),
          callout(
            "success",
            "Tautan <code>#fitur</code>, <code>#alur</code>, dan <code>#daftar</code> akan melompat ke bagian yang sesuai karena setiap <code>section</code> punya <code>id</code>.",
          ),
        ],
      },
      {
        title: "Debugging & Validasi",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menemukan kesalahan HTML dengan cara yang benar.</p>",
          ),
          h("Cek cepat di browser"),
          p(
            "<ul><li>Buka DevTools (<code>F12</code>) → tab <strong>Elements</strong> untuk melihat HTML hasil parsing.</li><li>Tab <strong>Console</strong> menampilkan error JavaScript dan sumber daya yang gagal dimuat.</li><li>Tab <strong>Network</strong> menunjukkan file yang 404 (gambar atau CSS tidak ditemukan).</li></ul>",
          ),
          h("Validasi HTML"),
          p(
            "<p>Buka <strong>validator.w3.org</strong>, lalu tempel kode atau unggah file. Validator menunjukkan tag yang tidak ditutup, atribut salah, atau tag deprecated seperti <code>&lt;font&gt;</code>.</p>",
          ),
          h("Kesalahan pemula yang sering terjadi"),
          p(
            "<ul><li>Lupa menutup tag atau salah urutan penutupan.</li><li>Atribut tanpa tanda kutip.</li><li>Nama file gambar salah huruf besar/kecil.</li><li>Menaruh konten di luar <code>&lt;body&gt;</code>.</li><li>Memakai <code>id</code> ganda dalam satu halaman.</li></ul>",
          ),
          callout(
            "info",
            "Browser memaafkan banyak kesalahan HTML, tetapi hasilnya bisa tidak sesuai harapan. Validator membuat masalah itu terlihat.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Akhir HTML",
        duration: 15,
        type: "QUIZ",
        blocks: [
          h("Ujian Akhir HTML"),
          p("<p>Kuis campuran dari seluruh materi. Nilai minimal lulus mengikuti pengaturan course.</p>"),
          quiz("Ujian Akhir HTML", [
            {
              q: "Urutan struktur dokumen HTML yang benar adalah...",
              options: [
                "<head> lalu <html> lalu <body>",
                "<!DOCTYPE html> lalu <html> berisi <head> dan <body>",
                "<body> lalu <head>",
                "<html> lalu <!DOCTYPE html>",
              ],
              answer: 1,
            },
            {
              q: "Tag untuk pindah baris tanpa membuat paragraf baru adalah...",
              options: ["<br>", "<hr>", "<p>", "<lb>"],
              answer: 0,
            },
            {
              q: "Tag untuk membuat garis horizontal adalah...",
              options: ["<br>", "<hr>", "<line>", "<divider>"],
              answer: 1,
            },
            {
              q: "Manakah yang termasuk tag semantic?",
              options: ["<div>", "<span>", "<article>", "<b>"],
              answer: 2,
            },
            {
              q: "Untuk menuju bagian halaman yang sama dipakai...",
              options: ['href="#id"', 'href="id"', 'src="#id"', 'link="#id"'],
              answer: 0,
            },
            {
              q: "Input tanggal memakai tipe...",
              options: ['type="date"', 'type="calendar"', 'type="day"', 'type="time"'],
              answer: 0,
            },
            {
              q: "Atribut yang menampilkan petunjuk di dalam input adalah...",
              options: ["value", "placeholder", "label", "hint"],
              answer: 1,
            },
            {
              q: "Elemen <figure> biasanya dipasangkan dengan...",
              options: ["<figcaption>", "<caption>", "<legend>", "<label>"],
              answer: 0,
            },
            {
              q: "Cara memvalidasi HTML yang benar adalah...",
              options: [
                "Membuka DevTools",
                "Memakai W3C Markup Validation Service",
                "Menjalankan npm test",
                "Menekan F5",
              ],
              answer: 1,
            },
            {
              q: "Setelah HTML, bahasa yang dipelajari untuk mengatur tampilan adalah...",
              options: ["SQL", "CSS", "PHP", "Python"],
              answer: 1,
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
            "<ul><li>Struktur dokumen HTML dan cara browser membacanya.</li><li>Tag teks, list, tautan, gambar, audio, dan video.</li><li>Tabel dan seluruh tag input form.</li><li>Struktur semantic dan dasar aksesibilitas.</li><li>Praktik membuat tiga halaman utuh.</li></ul>",
          ),
          h("Langkah selanjutnya"),
          p(
            "<ol><li><strong>CSS</strong> — mengatur warna, ukuran, jarak, dan tata letak.</li><li><strong>Responsive design</strong> — media query dan Flexbox/Grid.</li><li><strong>JavaScript</strong> — membuat halaman interaktif.</li><li><strong>Git &amp; GitHub</strong> — menyimpan dan membagikan proyek.</li></ol>",
          ),
          callout(
            "success",
            "Selamat! Kamu sudah punya fondasi HTML yang cukup untuk mulai belajar CSS.",
          ),
        ],
      },
    ],
  },
];

// ============================================================
// Eksekusi
// ============================================================

const COURSE_SLUG = "belajar-html-dari-nol-sampai-mahir";
const COURSE_TITLE = "Belajar HTML: Dari Nol sampai Mahir";
const COURSE_DESCRIPTION =
  "Kursus HTML lengkap untuk pemula: dari pengenalan dan tag dasar, pengelompokan tag teks, form dan input, semantic HTML, sampai tiga proyek praktik. Dilengkapi contoh kode dan kuis di setiap bagian penting.";

async function main() {
  const tag = await prisma.tag.upsert({
    where: { slug: "html" },
    update: {},
    create: { name: "HTML", slug: "html", category: "Language" },
  });

  const path =
    (await prisma.path.findUnique({ where: { slug: "web-development" } })) ??
    (await prisma.path.findFirst({ orderBy: { createdAt: "asc" } }));

  const course = await prisma.course.upsert({
    where: { slug: COURSE_SLUG },
    update: {
      title: COURSE_TITLE,
      description: COURSE_DESCRIPTION,
      status: "DRAFT",
      passingGrade: 70,
      isFastTrack: false,
      pathId: path?.id ?? null,
    },
    create: {
      title: COURSE_TITLE,
      slug: COURSE_SLUG,
      description: COURSE_DESCRIPTION,
      status: "DRAFT",
      passingGrade: 70,
      isFastTrack: false,
      pathId: path?.id ?? null,
    },
  });

  // bangun ulang konten supaya script bisa dijalankan berkali-kali
  await prisma.coursePart.deleteMany({ where: { courseId: course.id } });
  await prisma.courseTag.deleteMany({ where: { courseId: course.id } });
  await prisma.courseTag.create({
    data: { courseId: course.id, tagId: tag.id },
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
  console.log("Tag    :", tag.name);
  console.log(
    `Isi    : ${PARTS.length} course part · ${lessonCount} silabus · ${blockCount} block · ${questionCount} soal`,
  );
  console.log("Status : DRAFT (publish dari halaman admin kalau sudah siap)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
