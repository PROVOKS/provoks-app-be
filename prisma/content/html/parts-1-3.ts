import {
  bashCode,
  callout,
  CoursePartDef,
  divider,
  h,
  htmlCode,
  p,
  quiz,
} from "../helpers";

export const HTML_PARTS_1_3: CoursePartDef[] = [
  // ==========================================================
  // PART 1 — FONDASI HTML
  // ==========================================================
  {
    name: "Fondasi HTML",
    description:
      "Mengenal HTML, cara kerja halaman web, anatomi dokumen, dan alat yang dipakai sehari-hari.",
    lessons: [
      {
        title: "Apa Itu HTML & Cara Web Bekerja",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami kedudukan HTML sebagai fondasi halaman web, perannya dibanding CSS &amp; JavaScript, dan alur perjalanan file HTML sampai tampil di browser.</p>",
          ),
          h("1. Halaman HTML Paling Sederhana"),
          p(
            "<p>HTML terdiri dari <em>tag</em> yang membungkus konten. Tag memberi tahu browser bahwa sebuah teks adalah judul, paragraf, atau tautan.</p>",
          ),
          htmlCode(`
<h1>Halo, Dunia!</h1>
<p>Ini halaman HTML pertama saya.</p>
<a href="https://www.w3.org">Kunjungi W3C</a>
`),
          h("2. Tiga Lapisan Halaman Web"),
          p(
            "<p>Halaman modern terbentuk dari tiga lapisan yang bekerja bersama. HTML menyusun struktur, CSS mengatur tampilan, dan JavaScript menambah perilaku.</p>",
          ),
          htmlCode(`
<article class="kartu" id="kartu-1">
  <h2>Belajar Web</h2>
  <p>Mulai dari HTML.</p>
</article>

<style>
  .kartu { padding: 16px; border: 1px solid #ddd; border-radius: 12px; }
</style>

<script>
  const kartu = document.getElementById("kartu-1");
  kartu.addEventListener("click", () => {
    alert("Kartu diklik!");
  });
</script>
`),
          h("3. HTML Bukan Bahasa Pemrograman"),
          p(
            "<p>HTML tidak punya variabel, kondisi, atau perulangan. Ia hanya <strong>menandai</strong> bagian-bagian konten. Kesalahan penulisan biasanya tidak menghentikan halaman, tetapi membuat struktur tampil kacau.</p>",
          ),
          htmlCode(`
<!-- Tanpa penutup tag: browser tetap menampilkan, tapi struktur bisa salah -->
<p>Paragraf yang lupa ditutup
<p>Paragraf berikutnya ikut terpengaruh
`),
          callout(
            "info",
            "Analogi: HTML adalah kerangka bangunan, CSS adalah cat dan dekorasi, JavaScript adalah listrik dan sakelarnya.",
          ),
          h("4. Bagaimana Halaman Sampai ke Browser?"),
          p(
            "<p>Alurnya sederhana:</p><ol><li>Kamu mengetik alamat situs.</li><li>Browser meminta file HTML ke server.</li><li>Server mengirim HTML (beserta CSS, gambar, JavaScript).</li><li>Browser membaca HTML dari atas ke bawah dan menyusun tampilan.</li></ol>",
          ),
          htmlCode(`
<!-- Urutan pembacaan browser kira-kira seperti ini -->
<!DOCTYPE html>
<html>
  <head> ...informasi & aset... </head>
  <body> ...konten yang terlihat... </body>
</html>
`),
          h("Studi Kasus: Mengubah Pengumuman Teks Menjadi Halaman HTML"),
          p(
            "<p><strong>Skenario:</strong> Panitia memiliki pengumuman dalam teks biasa. Ubah menjadi halaman HTML yang mudah dibaca dan memiliki tautan kontak.</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Pengumuman Kelas</title>
</head>
<body>
  <h1>Pengumuman Kelas</h1>
  <p><strong>Ujian praktik</strong> dilaksanakan hari Senin pukul 08.00.</p>
  <p>Bawa laptop dan pastikan baterai terisi penuh.</p>
  <p>
    Ada pertanyaan? Hubungi
    <a href="mailto:panitia@contoh.id">panitia@contoh.id</a>.
  </p>
</body>
</html>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan satu paragraf baru berisi daftar barang yang wajib dibawa, lalu buka file tersebut di browser.",
          ),
          divider(),
        ],
      },
      {
        title: "Anatomi Dokumen HTML",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengenal setiap bagian wajib dokumen HTML5: <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, dan <code>&lt;body&gt;</code>, serta memahami akibat bila salah letak.</p>",
          ),
          h("1. Deklarasi DOCTYPE"),
          p(
            "<p>Baris pertama memberi tahu browser bahwa dokumen memakai standar HTML5. Tanpa ini, browser masuk ke <em>quirks mode</em> dan sebagian aturan CSS bisa berperilaku berbeda.</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
`),
          h("2. Elemen html, head, dan body"),
          p(
            "<p><code>&lt;html&gt;</code> adalah akar dokumen. Di dalamnya ada dua bagian: <code>&lt;head&gt;</code> (informasi yang tidak tampil) dan <code>&lt;body&gt;</code> (konten yang terlihat).</p>",
          ),
          htmlCode(`
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
          h("3. Isi Umum Bagian Head"),
          p(
            "<p>Bagian <code>head</code> biasanya berisi encoding, judul tab, deskripsi, favicon, dan tautan CSS.</p>",
          ),
          htmlCode(`
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Pengumuman dan jadwal kelas.">
  <title>Beranda — Kelas Web</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="favicon.ico">
</head>
`),
          h("4. Kesalahan Umum Penempatan"),
          p(
            "<p>Konten yang seharusnya tampil tidak boleh diletakkan di dalam <code>head</code>, dan tag penutup tidak boleh tertukar urutannya.</p>",
          ),
          htmlCode(`
<!-- SALAH: paragraf di dalam head tidak akan tampil -->
<head>
  <p>Halo</p>
</head>

<!-- SALAH: penutupan tidak berurutan -->
<div><p>Teks</div></p>

<!-- BENAR -->
<div><p>Teks</p></div>
`),
          callout(
            "warning",
            "Tanpa <meta charset=\"UTF-8\">, karakter seperti é, ñ, atau emoji bisa tampil rusak (Ã©, dsb).",
          ),
          h("Studi Kasus: Menyusun Dokumen Halaman Profil dari Nol"),
          p(
            "<p><strong>Skenario:</strong> Buat dokumen HTML lengkap dengan judul tab, deskripsi, encoding, viewport, dan konten profil.</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Profil singkat Budi Santoso.">
  <title>Profil — Budi Santoso</title>
</head>
<body>
  <h1>Budi Santoso</h1>
  <p>Mahasiswa Teknik Informatika.</p>
  <p>Sedang belajar HTML dari nol.</p>
</body>
</html>
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah isi <title> menjadi nama lengkapmu dan ganti atribut lang menjadi 'en' untuk melihat apakah kamu paham fungsi atribut tersebut.",
          ),
          divider(),
        ],
      },
      {
        title: "Tools: Editor, Browser, dan DevTools",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyiapkan alat kerja minimal, memahami struktur folder proyek, dan menggunakan DevTools untuk memeriksa hasil.</p>",
          ),
          h("1. Alat yang Dipakai"),
          p(
            "<ul><li><strong>VS Code</strong> — editor gratis yang ringan.</li><li><strong>Browser</strong> — Chrome, Firefox, atau Edge.</li><li><strong>DevTools</strong> — tekan <code>F12</code> atau klik kanan → Inspect.</li></ul>",
          ),
          h("2. Struktur Folder Latihan"),
          bashCode(`
belajar-html/
├── index.html
├── tentang.html
├── css/
│   └── style.css
└── gambar/
    └── foto.jpg
`),
          h("3. Membuat File Pertama"),
          p(
            "<p>Simpan file dengan ekstensi <code>.html</code>, lalu buka dengan klik dua kali. Setelah mengubah kode, simpan (<code>Ctrl + S</code>) dan muat ulang browser (<code>F5</code>).</p>",
          ),
          htmlCode(`
<!-- index.html -->
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Latihan Pertama</title>
</head>
<body>
  <h1>File pertama saya</h1>
</body>
</html>
`),
          h("4. Memeriksa dengan DevTools"),
          p(
            "<p>Di tab <strong>Elements</strong>, kamu bisa melihat HTML yang sudah diproses browser, mengubah teks sementara, dan mematikan/menyalakan CSS untuk bereksperimen tanpa mengubah file asli.</p>",
          ),
          htmlCode(`
<!-- Di DevTools, elemen ini bisa diubah sementara tanpa menyentuh file -->
<h1>Judul yang sedang diperiksa</h1>
`),
          callout(
            "info",
            "Perubahan di panel Elements bersifat sementara dan hilang setelah halaman dimuat ulang.",
          ),
          h("Studi Kasus: Struktur Folder Tiga Halaman"),
          p(
            "<p><strong>Skenario:</strong> Sebuah proyek latihan memiliki tiga halaman dengan tautan saling terhubung dan satu folder gambar.</p>",
          ),
          bashCode(`
proyek-profil/
├── index.html
├── tentang.html
├── kontak.html
├── css/
│   └── style.css
└── gambar/
    ├── foto-profil.jpg
    └── logo.png
`),
          htmlCode(`
<!-- index.html -->
<nav>
  <a href="index.html">Beranda</a>
  <a href="tentang.html">Tentang</a>
  <a href="kontak.html">Kontak</a>
</nav>

<h1>Beranda</h1>
<img src="gambar/foto-profil.jpg" alt="Foto profil" width="160" height="160">
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat folder baru berisi index.html, css/style.css, dan gambar/, lalu pastikan tidak ada tautan atau gambar yang rusak (404) di tab Network.",
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
          p("<p>Jawab pertanyaan berikut untuk menguji pemahaman dasar.</p>"),
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

  // ==========================================================
  // PART 2 — TAG DASAR: TEKS & FORMAT
  // ==========================================================
  {
    name: "Tag Dasar: Teks & Format",
    description:
      "Mengelompokkan tag teks: heading, paragraf, format huruf, tag font lama, dan kutipan.",
    lessons: [
      {
        title: "Heading & Paragraf",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menggunakan hierarki heading <code>h1</code>–<code>h6</code> secara benar, membuat paragraf, serta memahami kapan memakai <code>br</code> dan <code>hr</code>.</p>",
          ),
          h("1. Hierarki Heading"),
          p(
            "<p>Heading menunjukkan kepentingan dan urutan bab. <code>h1</code> untuk judul halaman, <code>h2</code> untuk bab, <code>h3</code> untuk sub-bab, dan seterusnya.</p>",
          ),
          htmlCode(`
<h1>Panduan Belajar HTML</h1>
<h2>Bab 1: Pengenalan</h2>
<h3>1.1 Apa itu HTML</h3>
<h3>1.2 Sejarah Singkat</h3>
<h2>Bab 2: Tag Dasar</h2>
`),
          h("2. Paragraf dan Baris Baru"),
          p(
            "<p><code>&lt;p&gt;</code> membuat paragraf baru dengan jarak atas-bawah. <code>&lt;br&gt;</code> hanya memindahkan baris di dalam paragraf yang sama.</p>",
          ),
          htmlCode(`
<p>Ini paragraf pertama.</p>
<p>Ini paragraf kedua.<br>Baris ini masih paragraf yang sama.</p>
`),
          h("3. Garis Pemisah Horizontal"),
          p(
            "<p><code>&lt;hr&gt;</code> dipakai untuk memisahkan dua topik yang berbeda, bukan sekadar memperindah halaman.</p>",
          ),
          htmlCode(`
<h2>Bab 1</h2>
<p>Isi bab pertama...</p>
<hr>
<h2>Bab 2</h2>
<p>Isi bab kedua...</p>
`),
          h("4. Hierarki yang Salah vs Benar"),
          p(
            "<p>Jangan memilih heading berdasarkan ukuran yang diinginkan. Gunakan urutan yang logis; ukuran tampilan bisa diatur dengan CSS.</p>",
          ),
          htmlCode(`
<!-- SALAH: melompati level dan memilih berdasarkan ukuran -->
<h1>Judul</h1>
<h4>Sub judul (harusnya h2)</h4>
<h2>Bab lain</h2>

<!-- BENAR: berurutan -->
<h1>Judul</h1>
<h2>Sub judul</h2>
<h3>Detail</h3>
`),
          callout(
            "info",
            "Gunakan hanya satu <h1> per halaman, lalu susun heading berurutan (h2 sebelum h3) agar mudah dibaca dan ramah SEO.",
          ),
          h("Studi Kasus: Artikel Blog dengan Struktur Heading Benar"),
          p(
            "<p><strong>Skenario:</strong> Ubah teks artikel yang berantakan menjadi artikel dengan struktur heading dan paragraf yang jelas.</p>",
          ),
          htmlCode(`
<article>
  <h1>Tips Belajar HTML untuk Pemula</h1>
  <p>Belajar HTML tidak harus rumorit. Berikut urutan yang disarankan.</p>

  <h2>1. Kuasai struktur dokumen</h2>
  <p>Pahami doctype, head, dan body sebelum masuk ke tag lain.</p>

  <h2>2. Latih tag teks</h2>
  <p>Mulai dari heading, paragraf, dan format teks.</p>
  <hr>
  <h2>3. Bangun halaman sederhana</h2>
  <p>Gabungkan semua yang sudah dipelajari menjadi satu halaman utuh.</p>
</article>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan sub-bab h3 '1.1 Menulis DOCTYPE' di bawah h2 pertama, lalu periksa apakah urutannya tetap logis.",
          ),
          divider(),
        ],
      },
      {
        title: "Format Teks: Tebal, Miring, dan Coret",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membedakan tag format visual dengan tag bermakna, serta memakai <code>del</code>/<code>ins</code>, <code>mark</code>, <code>small</code>, <code>sub</code>, dan <code>sup</code> dengan tepat.</p>",
          ),
          h("1. Tebal dan Miring: Visual vs Semantik"),
          p(
            "<p><code>&lt;b&gt;</code> dan <code>&lt;i&gt;</code> hanya mengubah tampilan. <code>&lt;strong&gt;</code> dan <code>&lt;em&gt;</code> menyampaikan makna penting/penekanan kepada browser dan pembaca layar.</p>",
          ),
          htmlCode(`
<p><b>Tebal visual</b> dan <strong>tebal bermakna penting</strong></p>
<p><i>Miring visual</i> dan <em>miring dengan penekanan</em></p>
`),
          h("2. Garis Bawah, Coret, dan Sorot"),
          htmlCode(`
<p><u>Bergaris bawah</u></p>
<p><s>Harga lama tidak berlaku</s></p>
<p><mark>Disorot seperti stabilo</mark></p>
<p><small>Catatan kecil di bawah</small></p>
`),
          h("3. Del dan Ins untuk Perubahan Konten"),
          p(
            "<p><code>&lt;del&gt;</code> menandai teks yang dihapus, <code>&lt;ins&gt;</code> menandai teks yang ditambahkan. Berguna untuk menampilkan revisi harga atau dokumen.</p>",
          ),
          htmlCode(`
<p>Harga lama <del>Rp150.000</del> menjadi <ins>Rp99.000</ins></p>
`),
          h("4. Subscript dan Superscript"),
          htmlCode(`
<p>Rumus kimia air: H<sub>2</sub>O</p>
<p>Sepuluh pangkat dua: 10<sup>2</sup> = 100</p>
`),
          callout(
            "warning",
            "Jangan memakai tag format untuk mengatur ukuran atau warna. Itu tugas CSS. HTML hanya memberi makna.",
          ),
          h("Studi Kasus: Halaman Detail Produk dengan Harga Diskon"),
          p(
            "<p><strong>Skenario:</strong> Tampilkan produk dengan harga lama dicoret, harga baru ditandai, stok kecil, dan spesifikasi bahan kimia.</p>",
          ),
          htmlCode(`
<article>
  <h1>Serum Vitamin C</h1>
  <p>
    Harga promo:
    <del>Rp180.000</del>
    <ins><strong>Rp129.000</strong></ins>
    <mark>Hemat 28%</mark>
  </p>
  <p><small>Stok tersisa 12 botol.</small></p>
  <p>Mengandung H<sub>2</sub>O sebagai bahan utama.</p>
  <p><em>Gunakan sesuai petunjuk pemakaian.</em></p>
</article>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan satu baris yang memakai ketiga tag sekaligus: tebal, miring, dan bergaris bawah.",
          ),
          divider(),
        ],
      },
      {
        title: "Tag Font & Teks Khusus",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengenali tag font lama yang masih ditemui di kode warisan, serta memakai tag teks khusus yang masih relevan: <code>kbd</code>, <code>code</code>, <code>pre</code>, <code>samp</code>, dan <code>var</code>.</p>",
          ),
          h("1. Tag Font Lama (Legacy)"),
          p(
            "<p>Sebelum CSS populer, tampilan diatur langsung lewat tag seperti <code>font</code>, <code>big</code>, <code>tt</code>, dan <code>center</code>.</p>",
          ),
          htmlCode(`
<font color="red" size="5" face="Arial">Teks dengan tag font</font>
<big>Teks besar</big>
<tt>Teks monospace</tt>
<center>Teks di tengah</center>
`),
          h("2. Kenapa Tag Itu Tidak Dipakai Lagi?"),
          p(
            "<p>Tag tersebut sudah <strong>deprecated</strong> sejak HTML5. Browser masih menampilkannya demi kompatibilitas, tetapi tidak lolos validasi dan tidak bisa dipakai ulang secara rapi.</p>",
          ),
          htmlCode(`
<!-- Pengganti modern memakai CSS -->
<p style="color: #dc2626; font-size: 20px;">Teks berwarna</p>
<p style="text-align: center;">Teks di tengah</p>
`),
          h("3. Teks Khusus: kbd, code, dan pre"),
          htmlCode(`
<p>Tekan <kbd>Ctrl</kbd> + <kbd>S</kbd> untuk menyimpan.</p>
<p>Tag judul: <code>&lt;h1&gt;Judul&lt;/h1&gt;</code></p>

<pre>
Baris 1
  Baris 2 menjorok
    Baris 3 lebih menjorok
</pre>
`),
          h("4. Samp dan Var"),
          htmlCode(`
<p>Program menampilkan: <samp>Error: file tidak ditemukan</samp></p>
<p>Rumus luas: <var>p</var> × <var>l</var></p>
`),
          callout(
            "warning",
            "Jika menemukan <font> di kode lama, ganti dengan CSS (color, font-size, font-family, text-align) agar lolos validasi HTML5.",
          ),
          h("Studi Kasus: Dokumentasi Singkat dengan Kode dan Perintah"),
          p(
            "<p><strong>Skenario:</strong> Buat halaman bantuan berisi langkah instalasi dengan perintah terminal dan potongan kode.</p>",
          ),
          htmlCode(`
<h1>Panduan Memulai</h1>

<h2>1. Buka terminal</h2>
<p>Tekan <kbd>Ctrl</kbd> + <kbd>&#96;</kbd> di VS Code.</p>

<h2>2. Jalankan perintah</h2>
<pre>npm install
npm run dev</pre>

<h2>3. Buka browser</h2>
<p>Kunjungi <code>http://localhost:3000</code>.</p>
<p>Jika berhasil, muncul pesan: <samp>Ready in 1200ms</samp></p>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan blok <pre> berisi struktur folder proyek, lalu bandingkan tampilannya dengan tag <p> biasa.",
          ),
          divider(),
        ],
      },
      {
        title: "Kutipan & Alamat",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai <code>blockquote</code>, <code>cite</code>, <code>q</code>, <code>address</code>, dan <code>abbr</code> untuk kutipan, sumber, kontak, serta singkatan.</p>",
          ),
          h("1. Kutipan Blok"),
          p(
            "<p><code>blockquote</code> untuk kutipan panjang yang berdiri sendiri. Atribut <code>cite</code> berisi URL sumbernya.</p>",
          ),
          htmlCode(`
<blockquote cite="https://www.w3.org/standards/webdesign/">
  <p>Web dibuat untuk semua orang, tanpa memandang perangkat atau kemampuan.</p>
  <cite>— W3C</cite>
</blockquote>
`),
          h("2. Kutipan Pendek dan Singkatan"),
          htmlCode(`
<p>Menurut W3C, <q>aksesibilitas adalah kebutuhan</q>, bukan tambahan.</p>

<p>
  <abbr title="HyperText Markup Language">HTML</abbr> adalah bahasa markup.
</p>
`),
          h("3. Informasi Kontak"),
          p(
            "<p><code>address</code> dipakai untuk kontak penulis atau pemilik halaman, bukan untuk alamat mana pun secara umum.</p>",
          ),
          htmlCode(`
<address>
  Jl. Contoh No. 10<br>
  Bandung, Jawa Barat<br>
  <a href="mailto:halo@contoh.id">halo@contoh.id</a><br>
  <a href="tel:+6281234567890">+62 812-3456-7890</a>
</address>
`),
          h("4. Menggabungkan dengan figure dan figcaption"),
          htmlCode(`
<figure>
  <blockquote>
    <p>Simplicity is the soul of efficiency.</p>
  </blockquote>
  <figcaption>— Austin Freeman, dalam <cite>The Eye of Osiris</cite></figcaption>
</figure>
`),
          callout(
            "info",
            "Browser menambahkan tanda kutip otomatis pada <q>. Jangan menambahkan tanda kutip manual agar tidak dobel.",
          ),
          h("Studi Kasus: Halaman Testimoni Siswa"),
          p(
            "<p><strong>Skenario:</strong> Kumpulan testimoni singkat dengan nama dan kontak penyelenggara kelas.</p>",
          ),
          htmlCode(`
<h1>Testimoni Siswa</h1>

<blockquote>
  <p><q>Materinya runtut, kuisnya membantu.</q></p>
  <cite>— Budi, siswa angkatan 2026</cite>
</blockquote>

<blockquote>
  <p><q>Sekarang saya paham bedanya HTML dan CSS.</q></p>
  <cite>— Siti, siswa angkatan 2026</cite>
</blockquote>

<address>
  Pertanyaan? Hubungi <a href="mailto:kelas@contoh.id">kelas@contoh.id</a>
</address>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan satu <abbr> untuk singkatan CSS beserta atribut title-nya di dalam salah satu testimoni.",
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

  // ==========================================================
  // PART 3 — LIST, LINK, GAMBAR & MEDIA
  // ==========================================================
  {
    name: "List, Link, Gambar & Media",
    description:
      "Membuat daftar, tautan, path file, gambar, serta menyisipkan audio, video, dan embed.",
    lessons: [
      {
        title: "List Tak Berurut & Berurut",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat daftar dengan <code>ul</code>, <code>ol</code>, dan <code>li</code>, termasuk daftar bersarang serta atribut <code>start</code>, <code>reversed</code>, dan <code>type</code>.</p>",
          ),
          h("1. Daftar Tak Berurut"),
          htmlCode(`
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
`),
          h("2. Daftar Berurut dan Atributnya"),
          htmlCode(`
<ol>
  <li>Siapkan editor</li>
  <li>Buat file index.html</li>
  <li>Buka di browser</li>
</ol>

<ol start="3">
  <li>Langkah ketiga</li>
  <li>Langkah keempat</li>
</ol>

<ol type="A">
  <li>Poin A</li>
  <li>Poin B</li>
</ol>
`),
          h("3. Daftar Bersarang"),
          p(
            "<p>Daftar bersarang harus diletakkan <strong>di dalam</strong> <code>&lt;li&gt;</code> induknya, bukan di luar.</p>",
          ),
          htmlCode(`
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
          h("4. Daftar di Dalam Navigasi"),
          htmlCode(`
<nav>
  <ul>
    <li><a href="/">Beranda</a></li>
    <li><a href="/kursus">Kursus</a></li>
    <li><a href="/tentang">Tentang</a></li>
  </ul>
</nav>
`),
          callout(
            "info",
            "Gunakan ul ketika urutan tidak penting, dan ol ketika urutan bermakna (langkah, peringkat, resep).",
          ),
          h("Studi Kasus: Daftar Materi Kursus Bertingkat"),
          p(
            "<p><strong>Skenario:</strong> Tampilkan silabus kursus dengan bab dan sub-bab menggunakan daftar bersarang, lengkap dengan nomor urut.</p>",
          ),
          htmlCode(`
<h1>Silabus Belajar Web</h1>

<ol>
  <li>Fondasi
    <ul>
      <li>Apa itu HTML</li>
      <li>Anatomi dokumen</li>
    </ul>
  </li>
  <li>Tag Dasar
    <ul>
      <li>Heading &amp; paragraf</li>
      <li>Format teks</li>
    </ul>
  </li>
  <li>Praktik
    <ol>
      <li>Halaman profil</li>
      <li>Form pendaftaran</li>
    </ol>
  </li>
</ol>
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat daftar berurut dengan type='I' dan reversed untuk menampilkan peringkat 3 besar secara menurun.",
          ),
          divider(),
        ],
      },
      {
        title: "Definition List",
        duration: 14,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai <code>dl</code>, <code>dt</code>, dan <code>dd</code> untuk pasangan istilah–penjelasan, serta memahami kapan memilihnya dibanding daftar biasa.</p>",
          ),
          h("1. Struktur Dasar"),
          htmlCode(`
<dl>
  <dt>HTML</dt>
  <dd>Bahasa markup untuk menyusun struktur halaman web.</dd>

  <dt>CSS</dt>
  <dd>Bahasa untuk mengatur tampilan halaman.</dd>
</dl>
`),
          h("2. Satu Istilah dengan Beberapa Penjelasan"),
          htmlCode(`
<dl>
  <dt>Frontend</dt>
  <dd>Bagian aplikasi yang dilihat pengguna.</dd>
  <dd>Dibangun dengan HTML, CSS, dan JavaScript.</dd>

  <dt>Backend</dt>
  <dd>Bagian yang mengelola data dan logika di server.</dd>
</dl>
`),
          h("3. Beberapa Istilah untuk Satu Penjelasan"),
          htmlCode(`
<dl>
  <dt>JS</dt>
  <dt>JavaScript</dt>
  <dd>Bahasa pemrograman yang berjalan di browser.</dd>
</dl>
`),
          callout(
            "info",
            "Definition list cocok untuk glosarium, FAQ singkat, dan daftar spesifikasi. Untuk daftar biasa, tetap gunakan ul/ol.",
          ),
          h("Studi Kasus: Glosarium Istilah Web"),
          p(
            "<p><strong>Skenario:</strong> Buat halaman glosarium singkat berisi istilah yang sering muncul di kursus.</p>",
          ),
          htmlCode(`
<h1>Glosarium</h1>

<dl>
  <dt>Tag</dt>
  <dd>Penanda yang membungkus konten HTML, misalnya &lt;p&gt;.</dd>

  <dt>Atribut</dt>
  <dd>Informasi tambahan pada tag, misalnya href atau src.</dd>

  <dt>Render</dt>
  <dd>Proses browser menyusun dan menampilkan halaman.</dd>

  <dt>Path</dt>
  <dd>Alamat lokasi file, bisa relatif atau absolut.</dd>
</dl>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan dua istilah baru (viewport dan semantic) beserta penjelasannya di dalam glosarium.",
          ),
          divider(),
        ],
      },
      {
        title: "Link",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat tautan ke halaman lain, bagian halaman, email, telepon, dan file unduhan, serta memahami atribut <code>target</code> dan <code>rel</code>.</p>",
          ),
          h("1. Tautan Dasar"),
          htmlCode(`
<a href="https://www.w3.org">Kunjungi W3C</a>
<a href="tentang.html">Tentang Kami</a>
`),
          h("2. Membuka di Tab Baru"),
          p(
            "<p><code>target=\"_blank\"</code> membuka tautan di tab baru. Sertakan <code>rel=\"noopener noreferrer\"</code> demi keamanan.</p>",
          ),
          htmlCode(`
<a href="https://www.w3.org" target="_blank" rel="noopener noreferrer">
  Buka W3C di tab baru
</a>
`),
          h("3. Tautan ke Bagian Halaman (Anchor)"),
          htmlCode(`
<a href="#kontak">Langsung ke kontak</a>

<h2 id="kontak">Kontak</h2>
<p>Email: halo@contoh.id</p>
`),
          h("4. Email, Telepon, dan Unduhan"),
          htmlCode(`
<a href="mailto:halo@contoh.id">Kirim email</a>
<a href="tel:+6281234567890">Telepon kami</a>
<a href="dokumen.pdf" download>Unduh PDF</a>
`),
          callout(
            "warning",
            "Teks tautan harus deskriptif. Hindari 'klik di sini' karena pembaca layar menampilkan daftar tautan tanpa konteks sekitarnya.",
          ),
          h("Studi Kasus: Menu Navigasi + Tautan Kontak"),
          p(
            "<p><strong>Skenario:</strong> Satu halaman berisi navigasi antar-bagian, tautan eksternal, dan kontak.</p>",
          ),
          htmlCode(`
<nav>
  <a href="#fitur">Fitur</a> |
  <a href="#harga">Harga</a> |
  <a href="#kontak">Kontak</a>
</nav>

<section id="fitur"><h2>Fitur</h2><p>...</p></section>
<section id="harga"><h2>Harga</h2><p>...</p></section>

<section id="kontak">
  <h2>Kontak</h2>
  <p><a href="mailto:halo@contoh.id">halo@contoh.id</a></p>
  <p><a href="tel:+6281234567890">+62 812-3456-7890</a></p>
  <p>
    <a href="https://www.w3.org" target="_blank" rel="noopener noreferrer">
      Dokumentasi W3C
    </a>
  </p>
</section>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan tautan unduhan untuk file silabus.pdf dan pastikan atribut download terpasang.",
          ),
          divider(),
        ],
      },
      {
        title: "Path Relatif vs Absolut",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menulis alamat file dengan benar agar gambar dan tautan tidak rusak saat proyek dipindahkan atau diunggah.</p>",
          ),
          h("1. Path Relatif"),
          p(
            "<p>Path relatif dihitung dari lokasi file HTML yang sedang dibuka.</p>",
          ),
          htmlCode(`
<!-- file di folder yang sama -->
<img src="foto.jpg" alt="Foto">

<!-- di dalam subfolder -->
<img src="gambar/foto.jpg" alt="Foto">

<!-- naik satu folder -->
<img src="../aset/logo.png" alt="Logo">
`),
          h("2. Path Absolut"),
          htmlCode(`
<img src="https://images.contoh.id/banner.jpg" alt="Banner">
<a href="https://www.w3.org">W3C</a>

<!-- path absolut dari root domain (diawali /) -->
<a href="/kursus">Kursus</a>
<img src="/gambar/logo.png" alt="Logo">
`),
          h("3. Memahami ../ dan ./"),
          bashCode(`
proyek/
├── index.html
├── halaman/
│   └── tentang.html
└── gambar/
    └── logo.png
`),
          htmlCode(`
<!-- dari index.html -->
<img src="gambar/logo.png" alt="Logo">

<!-- dari halaman/tentang.html -->
<img src="../gambar/logo.png" alt="Logo">
`),
          h("4. Kesalahan Umum"),
          htmlCode(`
<!-- Salah: huruf besar/kecil tidak cocok di Linux -->
<img src="Gambar/Logo.PNG" alt="Logo">

<!-- Salah: path absolut ke komputer sendiri -->
<img src="C:/Users/budi/foto.jpg" alt="Foto">

<!-- Benar -->
<img src="gambar/logo.png" alt="Logo">
`),
          callout(
            "warning",
            "Nama file di Linux/macOS bersifat case-sensitive. Foto.JPG dan foto.jpg dianggap dua file berbeda.",
          ),
          h("Studi Kasus: Proyek dengan Dua Tingkat Folder"),
          p(
            "<p><strong>Skenario:</strong> Pastikan gambar dan tautan tetap benar saat halaman berada di subfolder.</p>",
          ),
          bashCode(`
website/
├── index.html
├── halaman/
│   └── artikel.html
├── gambar/
│   └── hero.jpg
└── css/
    └── style.css
`),
          htmlCode(`
<!-- halaman/artikel.html -->
<link rel="stylesheet" href="../css/style.css">

<img src="../gambar/hero.jpg" alt="Ilustrasi artikel">

<a href="../index.html">Kembali ke beranda</a>
`),
          callout(
            "success",
            "Tantangan Mandiri: Pindahkan artikel.html ke subfolder baru bernama blog/ dan perbaiki semua path relatifnya.",
          ),
          divider(),
        ],
      },
      {
        title: "Gambar",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menampilkan gambar dengan atribut yang benar, memasangkannya dengan <code>figure</code>/<code>figcaption</code>, serta membuatnya responsif dengan <code>srcset</code>.</p>",
          ),
          h("1. Tag img Dasar"),
          p(
            "<p><code>img</code> adalah elemen kosong (tidak punya tag penutup). Atribut <code>src</code> dan <code>alt</code> wajib diisi.</p>",
          ),
          htmlCode(`
<img src="gambar/foto.jpg" alt="Seorang siswa mengetik di laptop">
`),
          h("2. Ukuran dan Rasio"),
          htmlCode(`
<img
  src="gambar/foto.jpg"
  alt="Foto siswa"
  width="480"
  height="320">
`),
          p(
            "<p>Menyertakan <code>width</code> dan <code>height</code> membantu browser mencadangkan ruang sehingga tata letak tidak melompat saat gambar selesai dimuat.</p>",
          ),
          h("3. Figure dan Figcaption"),
          htmlCode(`
<figure>
  <img src="gambar/pantai.jpg" alt="Pantai berpasir saat matahari terbenam">
  <figcaption>Pantai di sore hari.</figcaption>
</figure>
`),
          h("4. Gambar Responsif dengan srcset"),
          htmlCode(`
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
          callout(
            "info",
            "alt untuk gambar dekoratif boleh kosong (alt=\"\") agar pembaca layar melewatinya. Untuk gambar bermakna, tulis deskripsi singkat.",
          ),
          h("Studi Kasus: Galeri Produk dengan Keterangan"),
          p(
            "<p><strong>Skenario:</strong> Tampilkan tiga produk dengan gambar, nama, dan keterangan harga yang terhubung semantik.</p>",
          ),
          htmlCode(`
<h1>Katalog Produk</h1>

<figure>
  <img src="gambar/sepatu.jpg" alt="Sepatu lari warna biru" width="320" height="240">
  <figcaption>Sepatu Lari Pro — Rp450.000</figcaption>
</figure>

<figure>
  <img src="gambar/tas.jpg" alt="Tas punggung hitam" width="320" height="240">
  <figcaption>Tas Punggung Urban — Rp320.000</figcaption>
</figure>

<figure>
  <img src="gambar/topi.jpg" alt="Topi baseball abu-abu" width="320" height="240">
  <figcaption>Topi Baseball — Rp95.000</figcaption>
</figure>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan atribut loading='lazy' pada gambar kedua dan ketiga, lalu jelaskan kapan atribut itu berguna.",
          ),
          divider(),
        ],
      },
      {
        title: "Audio, Video & Embed",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyisipkan audio dan video dengan kontrol bawaan, menyediakan fallback, serta menyematkan konten pihak ketiga dengan <code>iframe</code> secara aman.</p>",
          ),
          h("1. Audio"),
          htmlCode(`
<audio controls>
  <source src="audio/podcast.mp3" type="audio/mpeg">
  <source src="audio/podcast.ogg" type="audio/ogg">
  Browser kamu tidak mendukung elemen audio.
</audio>
`),
          h("2. Video"),
          htmlCode(`
<video controls width="480" poster="gambar/poster.jpg">
  <source src="video/tutorial.mp4" type="video/mp4">
  Browser kamu tidak mendukung elemen video.
</video>
`),
          h("3. Atribut Penting pada Video"),
          htmlCode(`
<video
  controls
  width="480"
  poster="gambar/poster.jpg"
  muted
  loop
  preload="metadata">
  <source src="video/intro.mp4" type="video/mp4">
</video>
`),
          p(
            "<ul><li><code>controls</code> menampilkan tombol putar.</li><li><code>poster</code> gambar sampul sebelum diputar.</li><li><code>muted</code> tanpa suara (wajib untuk autoplay di banyak browser).</li><li><code>preload</code> mengatur seberapa banyak video diunduh lebih dulu.</li></ul>",
          ),
          h("4. Embed dengan iframe"),
          htmlCode(`
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video tutorial HTML"
  allowfullscreen>
</iframe>

<iframe
  title="Lokasi kampus"
  src="https://www.google.com/maps/embed?pb=..."
  loading="lazy">
</iframe>
`),
          callout(
            "warning",
            "Sematkan iframe hanya dari sumber tepercaya. iframe menjalankan kode dari situs lain di dalam halamanmu.",
          ),
          h("Studi Kasus: Halaman Materi dengan Video dan Audio"),
          p(
            "<p><strong>Skenario:</strong> Halaman belajar berisi satu video utama, satu audio penjelasan, dan satu embed peta lokasi kelas.</p>",
          ),
          htmlCode(`
<h1>Belajar HTML — Sesi 1</h1>

<h2>Video Materi</h2>
<video controls width="100%" poster="gambar/sesi1.jpg">
  <source src="video/sesi1.mp4" type="video/mp4">
</video>

<h2>Audio Ringkasan</h2>
<audio controls>
  <source src="audio/sesi1.mp3" type="audio/mpeg">
</audio>

<h2>Lokasi Kelas</h2>
<iframe
  title="Lokasi kelas"
  src="https://www.google.com/maps/embed?pb=..."
  width="100%"
  height="300"
  loading="lazy">
</iframe>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan atribut preload='none' pada audio dan jelaskan dampaknya terhadap penggunaan kuota pengguna.",
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
              options: [
                'target="_blank"',
                'href="_blank"',
                'rel="new"',
                'open="new"',
              ],
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
];
