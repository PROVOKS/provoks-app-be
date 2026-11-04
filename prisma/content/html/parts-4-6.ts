import {
  callout,
  CoursePartDef,
  divider,
  h,
  htmlCode,
  p,
  quiz,
} from "../helpers";

export const HTML_PARTS_4_6: CoursePartDef[] = [
  // ==========================================================
  // PART 4 — TABEL & FORM (TAG INPUT)
  // ==========================================================
  {
    name: "Tabel & Form (Tag Input)",
    description:
      "Membuat tabel data dan form lengkap: tag input teks, pilihan, validasi, dan tombol.",
    lessons: [
      {
        title: "Tabel Dasar",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyusun data tabular dengan <code>table</code>, <code>tr</code>, <code>th</code>, <code>td</code>, dan <code>caption</code>, serta memahami atribut <code>scope</code> pada header.</p>",
          ),
          h("1. Struktur Tabel Minimal"),
          htmlCode(`
<table>
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
          h("2. Caption dan Scope untuk Aksesibilitas"),
          p(
            "<p><code>caption</code> memberi judul tabel, sedangkan <code>scope</code> memberi tahu pembaca layar apakah header berlaku untuk baris atau kolom.</p>",
          ),
          htmlCode(`
<table>
  <caption>Jadwal Kuliah Semester Ganjil</caption>
  <tr>
    <th scope="col">Hari</th>
    <th scope="col">Mata Kuliah</th>
    <th scope="col">Ruang</th>
  </tr>
  <tr>
    <th scope="row">Senin</th>
    <td>Pemrograman Web</td>
    <td>Lab 2</td>
  </tr>
</table>
`),
          h("3. Sel Data dan Header"),
          p(
            "<p><code>&lt;th&gt;</code> tebal dan rata tengah secara default, sedangkan <code>&lt;td&gt;</code> rata kiri. Jangan memakai <code>th</code> hanya agar teks terlihat tebal.</p>",
          ),
          htmlCode(`
<tr>
  <td>Keyboard</td>
  <td>Rp350.000</td>
</tr>
`),
          callout(
            "info",
            "Tabel hanya untuk data tabular. Untuk tata letak halaman, gunakan CSS Flexbox atau Grid.",
          ),
          h("Studi Kasus: Jadwal Pelajaran Mingguan"),
          p(
            "<p><strong>Skenario:</strong> Buat jadwal pelajaran dengan caption, header kolom, dan header baris untuk setiap hari.</p>",
          ),
          htmlCode(`
<table>
  <caption>Jadwal Kelas X-1</caption>
  <tr>
    <th scope="col">Jam</th>
    <th scope="col">Senin</th>
    <th scope="col">Selasa</th>
  </tr>
  <tr>
    <th scope="row">07.00 - 08.30</th>
    <td>Matematika</td>
    <td>Bahasa Indonesia</td>
  </tr>
  <tr>
    <th scope="row">08.30 - 10.00</th>
    <td>Fisika</td>
    <td>Biologi</td>
  </tr>
</table>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan satu baris untuk hari Rabu beserta dua mata pelajarannya.",
          ),
          divider(),
        ],
      },
      {
        title: "Tabel Lanjutan",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai <code>thead</code>, <code>tbody</code>, <code>tfoot</code>, menggabungkan sel dengan <code>colspan</code>/<code>rowspan</code>, dan memahami kapan pengelompokan ini penting.</p>",
          ),
          h("1. Struktur thead, tbody, tfoot"),
          htmlCode(`
<table>
  <thead>
    <tr>
      <th scope="col">Produk</th>
      <th scope="col">Harga</th>
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
      <th scope="row">Total</th>
      <td>Rp500.000</td>
    </tr>
  </tfoot>
</table>
`),
          h("2. Menggabungkan Kolom dengan colspan"),
          htmlCode(`
<table>
  <tr>
    <th colspan="2">Data Siswa</th>
  </tr>
  <tr>
    <th>Nama</th>
    <th>Kelas</th>
  </tr>
  <tr>
    <td colspan="2">Belum ada data</td>
  </tr>
</table>
`),
          h("3. Menggabungkan Baris dengan rowspan"),
          htmlCode(`
<table>
  <tr>
    <th scope="col">Nama</th>
    <th scope="col">Kelas</th>
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
          callout(
            "warning",
            "colspan dan rowspan mengubah jumlah sel di setiap baris. Hitung ulang total kolom agar tabel tidak rusak.",
          ),
          h("Studi Kasus: Rekap Nilai dengan Header Bertingkat"),
          p(
            "<p><strong>Skenario:</strong> Rekap nilai membagi kolom menjadi dua kelompok: Tugas dan Ujian, masing-masing dengan dua pertemuan.</p>",
          ),
          htmlCode(`
<table>
  <caption>Rekap Nilai Semester 1</caption>
  <thead>
    <tr>
      <th rowspan="2" scope="col">Nama</th>
      <th colspan="2" scope="colgroup">Tugas</th>
      <th colspan="2" scope="colgroup">Ujian</th>
    </tr>
    <tr>
      <th scope="col">1</th>
      <th scope="col">2</th>
      <th scope="col">UTS</th>
      <th scope="col">UAS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Budi</th>
      <td>85</td>
      <td>90</td>
      <td>78</td>
      <td>88</td>
    </tr>
    <tr>
      <th scope="row">Siti</th>
      <td>92</td>
      <td>88</td>
      <td>85</td>
      <td>90</td>
    </tr>
  </tbody>
</table>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan kolom 'Rata-rata' dengan colspan yang sesuai sehingga jumlah kolom di setiap baris tetap seimbang.",
          ),
          divider(),
        ],
      },
      {
        title: "Tag Input Teks & Angka",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami cara kerja <code>form</code> dan <code>label</code>, lalu memakai seluruh tipe <code>input</code> untuk teks, angka, tanggal, warna, dan berkas.</p>",
          ),
          h("1. Form dan Label"),
          p(
            "<p>Setiap input sebaiknya memiliki <code>label</code> yang terhubung melalui <code>for</code> dan <code>id</code>. Klik pada label akan memfokuskan input terkait.</p>",
          ),
          htmlCode(`
<form action="/kirim" method="post">
  <label for="nama">Nama lengkap</label>
  <input type="text" id="nama" name="nama" placeholder="Nama sesuai KTP">

  <button type="submit">Kirim</button>
</form>
`),
          h("2. Input Teks, Email, dan Password"),
          htmlCode(`
<label for="email">Email</label>
<input type="email" id="email" name="email" placeholder="nama@email.com">

<label for="sandi">Password</label>
<input type="password" id="sandi" name="sandi">

<label for="cari">Cari materi</label>
<input type="search" id="cari" name="cari">
`),
          h("3. Input Angka, Telepon, dan URL"),
          htmlCode(`
<label for="umur">Umur</label>
<input type="number" id="umur" name="umur" min="10" max="100" step="1">

<label for="telepon">Nomor telepon</label>
<input type="tel" id="telepon" name="telepon" inputmode="tel">

<label for="situs">Website</label>
<input type="url" id="situs" name="situs" placeholder="https://">
`),
          h("4. Tanggal, Warna, Range, dan Berkas"),
          htmlCode(`
<label for="lahir">Tanggal lahir</label>
<input type="date" id="lahir" name="lahir">

<label for="jam">Jam mulai</label>
<input type="time" id="jam" name="jam">

<label for="warna">Warna favorit</label>
<input type="color" id="warna" name="warna" value="#ea580c">

<label for="volume">Volume</label>
<input type="range" id="volume" name="volume" min="0" max="100" value="50">

<label for="berkas">Unggah berkas</label>
<input type="file" id="berkas" name="berkas" accept=".pdf,.jpg,.png">
`),
          h("5. Input Tersembunyi untuk Data Teknis"),
          htmlCode(`
<input type="hidden" name="idKursus" value="crs-101">
`),
          callout(
            "warning",
            "Validasi tipe input hanya membantu di browser. Selalu ulangi validasi di server karena data dari client tidak bisa dipercaya.",
          ),
          h("Studi Kasus: Form Pendaftaran Event"),
          p(
            "<p><strong>Skenario:</strong> Form pendaftaran membutuhkan data kontak, jadwal kedatangan, dan preferensi warna kaos peserta.</p>",
          ),
          htmlCode(`
<form action="/daftar-event" method="post">
  <p>
    <label for="nama-event">Nama</label><br>
    <input type="text" id="nama-event" name="nama" required>
  </p>

  <p>
    <label for="email-event">Email</label><br>
    <input type="email" id="email-event" name="email" required>
  </p>

  <p>
    <label for="telepon-event">Nomor WhatsApp</label><br>
    <input type="tel" id="telepon-event" name="telepon">
  </p>

  <p>
    <label for="hadir">Tanggal hadir</label><br>
    <input type="date" id="hadir" name="tanggal">
  </p>

  <p>
    <label for="warna-kaos">Warna kaos</label><br>
    <input type="color" id="warna-kaos" name="warna" value="#1d4ed8">
  </p>

  <button type="submit">Daftar</button>
</form>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan input type='number' untuk jumlah peserta (minimal 1, maksimal 4) beserta labelnya.",
          ),
          divider(),
        ],
      },
      {
        title: "Tag Input Pilihan",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat pilihan dengan <code>checkbox</code>, <code>radio</code>, <code>select</code>/<code>optgroup</code>, dan <code>datalist</code> beserta perbedaan perilakunya.</p>",
          ),
          h("1. Checkbox — Boleh Lebih dari Satu"),
          htmlCode(`
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
          h("2. Radio — Hanya Satu Pilihan"),
          p(
            "<p>Radio dengan atribut <code>name</code> yang sama otomatis saling meniadakan. Gunakan <code>fieldset</code> dan <code>legend</code> untuk memberi judul kelompok.</p>",
          ),
          htmlCode(`
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
          h("3. Select dan Optgroup"),
          htmlCode(`
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

<select id="minat" name="minat" multiple size="3">
  <option value="fe">Frontend</option>
  <option value="be">Backend</option>
  <option value="design">Desain</option>
</select>
`),
          h("4. Datalist — Saran Ketikan"),
          htmlCode(`
<label for="kampus">Kampus</label>
<input list="daftar-kampus" id="kampus" name="kampus">
<datalist id="daftar-kampus">
  <option value="Universitas Contoh A">
  <option value="Universitas Contoh B">
  <option value="Institut Contoh C">
</datalist>
`),
          callout(
            "info",
            "datalist memberi saran tetapi pengguna tetap bisa mengetik bebas. select membatasi pilihan pada daftar yang tersedia.",
          ),
          h("Studi Kasus: Form Preferensi Belajar"),
          p(
            "<p><strong>Skenario:</strong> Siswa memilih satu jalur belajar, beberapa topik minat, dan satu kota untuk kelas offline.</p>",
          ),
          htmlCode(`
<form action="/preferensi" method="post">
  <fieldset>
    <legend>Jalur belajar</legend>
    <label><input type="radio" name="jalur" value="web" checked> Web</label>
    <label><input type="radio" name="jalur" value="mobile"> Mobile</label>
    <label><input type="radio" name="jalur" value="data"> Data</label>
  </fieldset>

  <fieldset>
    <legend>Topik minat</legend>
    <label><input type="checkbox" name="topik" value="html"> HTML</label>
    <label><input type="checkbox" name="topik" value="css"> CSS</label>
    <label><input type="checkbox" name="topik" value="js"> JavaScript</label>
  </fieldset>

  <p>
    <label for="kota-pref">Kota kelas offline</label><br>
    <select id="kota-pref" name="kota">
      <option value="">-- Pilih kota --</option>
      <option value="bdg">Bandung</option>
      <option value="jkt">Jakarta</option>
    </select>
  </p>

  <button type="submit">Simpan Preferensi</button>
</form>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan datalist berisi tiga nama sekolah agar siswa bisa memilih atau mengetik nama sekolahnya sendiri.",
          ),
          divider(),
        ],
      },
      {
        title: "Textarea, Button & Validasi",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Melengkapi form dengan <code>textarea</code>, memahami tiga jenis <code>button</code>, serta memakai atribut validasi HTML5 tanpa JavaScript.</p>",
          ),
          h("1. Textarea untuk Teks Panjang"),
          htmlCode(`
<label for="pesan">Pesan</label>
<textarea id="pesan" name="pesan" rows="4" cols="40"
          placeholder="Tulis pesan..."></textarea>

<textarea id="bio" name="bio" rows="3" maxlength="200"></textarea>
`),
          h("2. Tiga Jenis Button"),
          htmlCode(`
<button type="submit">Kirim</button>
<button type="reset">Reset</button>
<button type="button">Tombol biasa (tanpa aksi form)</button>
`),
          p(
            "<p>Di dalam form, <code>type=\"submit\"</code> adalah bawaan. Selalu tulis <code>type=\"button\"</code> untuk tombol yang tidak dimaksudkan mengirim form.</p>",
          ),
          h("3. Atribut Validasi Bawaan Browser"),
          htmlCode(`
<label for="email-val">Email</label>
<input type="email" id="email-val" name="email" required
       placeholder="nama@email.com" autocomplete="email">

<label for="kode-pos">Kode pos</label>
<input type="text" id="kode-pos" name="kode" pattern="[0-9]{5}"
       title="5 digit angka" inputmode="numeric">

<label for="umur-val">Umur</label>
<input type="number" id="umur-val" name="umur" min="10" max="100" step="1">

<label for="bio-val">Bio (maks 120)</label>
<input type="text" id="bio-val" name="bio" maxlength="120">
`),
          h("4. Readonly dan Disabled"),
          htmlCode(`
<!-- readonly: bisa dibaca & dikirim, tidak bisa diubah -->
<input type="text" name="nim" value="253140700111001" readonly>

<!-- disabled: tidak bisa diubah & TIDAK dikirim -->
<input type="text" name="token" value="abc123" disabled>
`),
          callout(
            "warning",
            "Atribut readonly dan disabled berbeda. Jika butuh nilai tetap yang dikirim ke server, gunakan readonly atau input hidden.",
          ),
          h("Studi Kasus: Form Kontak Lengkap"),
          p(
            "<p><strong>Skenario:</strong> Form kontak dengan nama wajib, email wajib, subjek dari daftar, pesan dengan batas karakter, dan tombol reset.</p>",
          ),
          htmlCode(`
<form action="/kontak" method="post">
  <p>
    <label for="nama-kontak">Nama</label><br>
    <input type="text" id="nama-kontak" name="nama" required>
  </p>

  <p>
    <label for="email-kontak">Email</label><br>
    <input type="email" id="email-kontak" name="email" required>
  </p>

  <p>
    <label for="subjek">Subjek</label><br>
    <select id="subjek" name="subjek" required>
      <option value="">-- Pilih subjek --</option>
      <option value="kursus">Pertanyaan kursus</option>
      <option value="tagihan">Tagihan</option>
      <option value="lain">Lainnya</option>
    </select>
  </p>

  <p>
    <label for="isi-pesan">Pesan</label><br>
    <textarea id="isi-pesan" name="pesan" rows="5" maxlength="500"
              placeholder="Tulis pesanmu di sini..."></textarea>
  </p>

  <button type="submit">Kirim Pesan</button>
  <button type="reset">Reset</button>
</form>
`),
          callout(
            "success",
            "Tantangan Mandiri: Coba kirim form tanpa mengisi apa pun, lalu amati pesan validasi bawaan browser. Ganti teks pesanmu agar lebih ramah.",
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

  // ==========================================================
  // PART 5 — SEMANTIC HTML & AKSESIBILITAS
  // ==========================================================
  {
    name: "Semantic HTML & Aksesibilitas",
    description:
      "Menyusun halaman dengan tag bermakna, meta yang benar, dan dasar aksesibilitas.",
    lessons: [
      {
        title: "Kenapa Semantic? div vs section",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami kerugian struktur penuh <code>div</code>, manfaat tag semantic, serta membedakan <code>section</code>, <code>article</code>, dan <code>div</code>.</p>",
          ),
          h("1. Struktur Tanpa Semantic (Div Soup)"),
          htmlCode(`
<div class="atas">
  <div class="navigasi">...</div>
</div>
<div class="konten">
  <div class="artikel">
    <div class="judul">Judul</div>
    <div class="isi">Isi artikel</div>
  </div>
</div>
<div class="bawah">...</div>
`),
          p(
            "<p>Secara tampilan bisa sama, tetapi browser, mesin pencari, dan pembaca layar tidak tahu bagian mana pembuka, navigasi, konten utama, atau penutup.</p>",
          ),
          h("2. Struktur Semantic"),
          htmlCode(`
<header>
  <nav>...</nav>
</header>
<main>
  <article>
    <h1>Judul</h1>
    <p>Isi artikel</p>
  </article>
</main>
<footer>...</footer>
`),
          h("3. section vs article vs div"),
          htmlCode(`
<!-- article: konten mandiri, bisa berdiri sendiri -->
<article>
  <h2>Pengumuman Ujian</h2>
  <p>Jadwal ujian telah diperbarui.</p>
</article>

<!-- section: kelompok konten dengan tema, biasanya punya heading -->
<section>
  <h2>Fitur</h2>
  <p>...</p>
</section>

<!-- div: pembungkus tanpa makna khusus, untuk styling/JS -->
<div class="pembungkus-grid">
  ...
</div>
`),
          callout(
            "info",
            "Aturan sederhana: jika isinya bisa berdiri sendiri dan punya judul sendiri, itu article. Jika hanya mengelompokkan konten, section. Jika hanya untuk styling, div.",
          ),
          h("4. Manfaat Nyata Semantic"),
          p(
            "<p><ul><li>Pembaca layar dapat melompat langsung ke <code>main</code> atau <code>nav</code>.</li><li>Mesin pencari memahami hierarki konten.</li><li>Kode lebih mudah dirawat karena peran setiap bagian jelas.</li></ul>",
          ),
          h("Studi Kasus: Mengubah Halaman Beranda Menjadi Semantic"),
          p(
            "<p><strong>Skenario:</strong> Refactor halaman penuh div tanpa mengubah isi maupun gaya, hanya mengganti tag pembungkus.</p>",
          ),
          htmlCode(`
<!-- Sebelum -->
<div class="top">
  <div class="logo">Belajar Web</div>
  <div class="menu">
    <a href="/">Beranda</a>
    <a href="/kursus">Kursus</a>
  </div>
</div>
<div class="body">
  <div class="post"><div class="title">Judul</div><div>Teks...</div></div>
</div>
<div class="bottom">© 2026</div>
`),
          htmlCode(`
<!-- Sesudah -->
<header>
  <p class="logo">Belajar Web</p>
  <nav>
    <a href="/">Beranda</a>
    <a href="/kursus">Kursus</a>
  </nav>
</header>
<main>
  <article>
    <h1>Judul</h1>
    <p>Teks...</p>
  </article>
</main>
<footer>© 2026</footer>
`),
          callout(
            "success",
            "Tantangan Mandiri: Cari satu halaman HTML buatanmu yang masih penuh div, lalu ganti minimal tiga div menjadi header, main, dan footer.",
          ),
          divider(),
        ],
      },
      {
        title: "Struktur Halaman",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyusun halaman utuh dengan <code>header</code>, <code>nav</code>, <code>main</code>, <code>aside</code>, <code>article</code>, <code>section</code>, dan <code>footer</code>.</p>",
          ),
          h("1. Header dan Navigasi"),
          htmlCode(`
<header>
  <h1>Blog Belajar Web</h1>
  <nav aria-label="Navigasi utama">
    <ul>
      <li><a href="/">Beranda</a></li>
      <li><a href="/artikel">Artikel</a></li>
      <li><a href="/tentang">Tentang</a></li>
    </ul>
  </nav>
</header>
`),
          h("2. Main dan Article"),
          p(
            "<p>Hanya boleh ada <strong>satu</strong> <code>main</code> per halaman. Di dalamnya diletakkan konten utama.</p>",
          ),
          htmlCode(`
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
`),
          h("3. Aside dan Footer"),
          htmlCode(`
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
`),
          h("4. Menggabungkan Semuanya"),
          htmlCode(`
<body>
  <header>
    <h1>Blog Belajar Web</h1>
    <nav><a href="/">Beranda</a> | <a href="/artikel">Artikel</a></nav>
  </header>

  <main>
    <article>
      <h2>Belajar HTML dari Nol</h2>
      <p>HTML adalah fondasi semua halaman web.</p>
    </article>
  </main>

  <aside>
    <h2>Artikel Populer</h2>
    <ul><li><a href="/artikel/1">Dasar HTML</a></li></ul>
  </aside>

  <footer><p>&copy; 2026 Blog Belajar Web</p></footer>
</body>
`),
          callout(
            "warning",
            "Jangan memakai main untuk membungkus header atau footer. main khusus untuk konten utama halaman.",
          ),
          h("Studi Kasus: Halaman Profil dengan Struktur Lengkap"),
          p(
            "<p><strong>Skenario:</strong> Halaman profil berisi header, navigasi, konten utama, sidebar kontak, dan footer.</p>",
          ),
          htmlCode(`
<header>
  <h1>Budi Santoso</h1>
  <nav><a href="#tentang">Tentang</a> | <a href="#skill">Skill</a> | <a href="#kontak">Kontak</a></nav>
</header>

<main>
  <section id="tentang">
    <h2>Tentang</h2>
    <p>Mahasiswa Teknik Informatika yang sedang belajar web.</p>
  </section>

  <section id="skill">
    <h2>Skill</h2>
    <ul>
      <li>HTML dasar</li>
      <li>Mengetik cepat</li>
    </ul>
  </section>
</main>

<aside id="kontak">
  <h2>Kontak</h2>
  <p><a href="mailto:budi@contoh.id">budi@contoh.id</a></p>
</aside>

<footer><p>&copy; 2026 Budi Santoso</p></footer>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan section baru berisi 'Pengalaman' dan pastikan setiap section memiliki heading h2.",
          ),
          divider(),
        ],
      },
      {
        title: "Elemen Semantic Tambahan",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai <code>figure</code>, <code>time</code>, <code>details</code>/<code>summary</code>, <code>mark</code>, <code>abbr</code>, dan <code>kbd</code> untuk makna yang lebih kaya.</p>",
          ),
          h("1. Figure dan Figcaption"),
          htmlCode(`
<figure>
  <img src="gambar/diagram.png" alt="Diagram alur HTML">
  <figcaption>Alur dokumen dari server ke browser.</figcaption>
</figure>
`),
          h("2. Time untuk Tanggal yang Bisa Dibaca Mesin"),
          htmlCode(`
<p>Dirilis pada <time datetime="2026-11-04">4 November 2026</time>.</p>
<p>Kelas dimulai <time datetime="08:00">pukul delapan pagi</time>.</p>
`),
          h("3. Details dan Summary"),
          htmlCode(`
<details>
  <summary>Apa itu HTML?</summary>
  <p>HTML adalah bahasa markup untuk menyusun struktur halaman web.</p>
</details>

<details open>
  <summary>Sudah terbuka dari awal</summary>
  <p>Isi konten.</p>
</details>
`),
          h("4. Mark, Abbr, dan Kbd"),
          htmlCode(`
<p>Gunakan <mark>Ctrl + S</mark> untuk menyimpan.</p>
<p><abbr title="Cascading Style Sheets">CSS</abbr> mengatur tampilan.</p>
<p>Tekan <kbd>F5</kbd> untuk memuat ulang halaman.</p>
`),
          callout(
            "info",
            "details/summary membuat accordion tanpa JavaScript dan sudah mendukung keyboard secara bawaan.",
          ),
          h("Studi Kasus: Halaman FAQ Tanpa JavaScript"),
          p(
            "<p><strong>Skenario:</strong> Buat FAQ singkat menggunakan details/summary agar pembaca bisa membuka jawaban yang diinginkan.</p>",
          ),
          htmlCode(`
<h1>Pertanyaan yang Sering Diajukan</h1>

<details>
  <summary>Apakah kursus ini gratis?</summary>
  <p>Ya, seluruh materi dasar dapat diakses gratis.</p>
</details>

<details>
  <summary>Berapa lama akses materi?</summary>
  <p>Akses berlaku <time datetime="P1Y">satu tahun</time> sejak pendaftaran.</p>
</details>

<details>
  <summary>Apakah ada sertifikat?</summary>
  <p>Ada, setelah menyelesaikan semua kuis dengan nilai minimal <mark>70</mark>.</p>
</details>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan satu pertanyaan baru beserta jawabannya, dan gunakan <abbr> untuk singkatan di dalamnya.",
          ),
          divider(),
        ],
      },
      {
        title: "Meta & SEO Dasar",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengisi <code>head</code> dengan meta yang benar: charset, viewport, description, title, Open Graph, favicon, dan atribut <code>lang</code>.</p>",
          ),
          h("1. Charset dan Viewport"),
          htmlCode(`
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
`),
          p(
            "<p>Viewport wajib ada agar halaman responsif di HP. Tanpa itu, browser akan mengecilkan halaman sehingga teks tampak sangat kecil.</p>",
          ),
          h("2. Title dan Description"),
          htmlCode(`
<title>Belajar HTML dari Nol — Provoks</title>
<meta name="description" content="Panduan HTML lengkap untuk pemula: tag dasar, semantic, tabel, form, dan praktik.">
`),
          h("3. Open Graph untuk Media Sosial"),
          htmlCode(`
<meta property="og:title" content="Belajar HTML dari Nol">
<meta property="og:description" content="Panduan HTML lengkap untuk pemula.">
<meta property="og:image" content="https://contoh.id/og-html.png">
<meta property="og:type" content="website">
<meta property="og:url" content="https://contoh.id/html">
`),
          h("4. Favicon dan Bahasa Halaman"),
          htmlCode(`
<html lang="id">
<head>
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
`),
          callout(
            "warning",
            "Title sebaiknya unik per halaman dan panjangnya sekitar 50–60 karakter agar tidak terpotong di hasil pencarian.",
          ),
          h("Studi Kasus: Head Lengkap untuk Halaman Artikel"),
          p(
            "<p><strong>Skenario:</strong> Siapkan head yang siap dibagikan ke mesin pencari dan media sosial.</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Cara Membuat Form HTML — Panduan Lengkap</title>
  <meta name="description" content="Pelajari cara membuat form HTML lengkap dengan label, input, validasi, dan tombol.">

  <link rel="icon" href="/favicon.ico">

  <meta property="og:title" content="Cara Membuat Form HTML">
  <meta property="og:description" content="Panduan lengkap form HTML untuk pemula.">
  <meta property="og:image" content="https://contoh.id/og-form.png">
  <meta property="og:type" content="article">
</head>
<body>
  <h1>Cara Membuat Form HTML</h1>
</body>
</html>
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat head untuk halaman 'Kontak' dengan title, description, dan og:title yang sesuai konteks halaman tersebut.",
          ),
          divider(),
        ],
      },
      {
        title: "Aksesibilitas Dasar",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat halaman yang bisa dipakai semua orang: teks alternatif, label form, urutan heading, aria-label, serta navigasi keyboard.</p>",
          ),
          h("1. Alt pada Gambar"),
          htmlCode(`
<!-- gambar bermakna: deskripsi singkat -->
<img src="grafik.png" alt="Grafik penjualan naik 20% dari Januari ke Juni">

<!-- gambar dekoratif: alt kosong -->
<img src="pembatas.png" alt="">
`),
          h("2. Label yang Terhubung ke Input"),
          htmlCode(`
<label for="email-a11y">Email</label>
<input type="email" id="email-a11y" name="email" required>

<!-- alternatif: label membungkus input -->
<label>
  <input type="checkbox" name="setuju"> Saya setuju dengan syarat
</label>
`),
          h("3. Urutan Heading dan Landmark"),
          htmlCode(`
<h1>Judul Halaman</h1>
<h2>Bagian Pertama</h2>
<h3>Detail</h3>
<h2>Bagian Kedua</h2>

<nav aria-label="Navigasi utama">...</nav>
<main>...</main>
`),
          h("4. aria-label dan Tombol Ikon"),
          htmlCode(`
<button type="button" aria-label="Tutup dialog">
  <span aria-hidden="true">&times;</span>
</button>

<button type="button" aria-label="Mode gelap" aria-pressed="false">
  🌙
</button>
`),
          callout(
            "warning",
            "Jangan memakai div atau span sebagai tombol. Gunakan button agar bisa difokuskan dan diaktifkan dengan keyboard.",
          ),
          h("Studi Kasus: Audit Aksesibilitas Halaman Sederhana"),
          p(
            "<p><strong>Skenario:</strong> Perbaiki halaman berikut yang memiliki tiga masalah aksesibilitas.</p>",
          ),
          htmlCode(`
<!-- Sebelum -->
<img src="logo.png">
<input type="text" placeholder="Email">
<div onclick="kirim()">Kirim</div>
`),
          htmlCode(`
<!-- Sesudah -->
<img src="logo.png" alt="Logo Provoks">
<label for="email-fix">Email</label>
<input type="email" id="email-fix" name="email" placeholder="nama@email.com">
<button type="button" onclick="kirim()">Kirim</button>
`),
          callout(
            "success",
            "Tantangan Mandiri: Coba navigasi halamanmu hanya dengan tombol Tab. Pastikan semua tautan, input, dan tombol bisa dijangkau dan terlihat fokusnya.",
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
              options: [
                "Versi HTML",
                "Bahasa halaman",
                "Nama situs",
                "Tipe dokumen",
              ],
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

  // ==========================================================
  // PART 6 — PRAKTIK & PUBLIKASI
  // ==========================================================
  {
    name: "Praktik & Publikasi",
    description:
      "Tiga proyek nyata, debugging, ujian akhir, dan langkah lanjutan setelah HTML.",
    lessons: [
      {
        title: "Praktik 1 — Halaman Profil",
        duration: 26,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Membuat halaman profil utuh yang memakai heading, paragraf, gambar, list, tautan, dan struktur semantic.</p>",
          ),
          h("Langkah 1: Kerangka Dokumen"),
          htmlCode(`
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
</body>
</html>
`),
          h("Langkah 2: Bagian Tentang dan Skill"),
          htmlCode(`
<main>
  <section>
    <h2>Tentang Saya</h2>
    <p>Saya sedang belajar <strong>HTML</strong> dan <em>CSS</em>.</p>
  </section>

  <section>
    <h2>Skill</h2>
    <ul>
      <li>HTML dasar</li>
      <li>Mengetik cepat</li>
      <li>Kerja tim</li>
    </ul>
  </section>
</main>
`),
          h("Langkah 3: Foto dan Kontak"),
          htmlCode(`
<figure>
  <img src="gambar/budi.jpg" alt="Foto Budi Santoso" width="200" height="200">
  <figcaption>Foto profil Budi.</figcaption>
</figure>

<section>
  <h2>Kontak</h2>
  <p>
    Email: <a href="mailto:budi@contoh.id">budi@contoh.id</a><br>
    GitHub:
    <a href="https://github.com/budi" target="_blank" rel="noopener noreferrer">
      github.com/budi
    </a>
  </p>
</section>
`),
          h("Langkah 4: Kode Lengkap"),
          htmlCode(`
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
            "Halaman ini sudah valid dan semantic. Tampilannya masih polos karena belum ada CSS — itu normal.",
          ),
          callout(
            "info",
            "Tantangan Mandiri: Ganti semua data dengan profilmu sendiri, lalu tambahkan satu bagian 'Pendidikan' berisi daftar riwayat sekolah.",
          ),
        ],
      },
      {
        title: "Praktik 2 — Form Pendaftaran",
        duration: 26,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Membuat form pendaftaran lengkap dengan input teks, radio, select, checkbox, textarea, dan validasi.</p>",
          ),
          h("Langkah 1: Data Diri"),
          htmlCode(`
<form action="/daftar" method="post">
  <p>
    <label for="nama">Nama lengkap</label><br>
    <input type="text" id="nama" name="nama" required placeholder="Nama sesuai KTP">
  </p>

  <p>
    <label for="email">Email</label><br>
    <input type="email" id="email" name="email" required autocomplete="email">
  </p>

  <p>
    <label for="wa">Nomor WhatsApp</label><br>
    <input type="tel" id="wa" name="telepon" inputmode="tel">
  </p>
</form>
`),
          h("Langkah 2: Pilihan dan Minat"),
          htmlCode(`
<fieldset>
  <legend>Jenis kelamin</legend>
  <label><input type="radio" name="gender" value="pria" required> Pria</label>
  <label><input type="radio" name="gender" value="wanita"> Wanita</label>
</fieldset>

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
`),
          h("Langkah 3: Kode Lengkap"),
          htmlCode(`
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
          callout(
            "info",
            "Perhatikan setiap input punya id yang terhubung ke label for, dan atribut name yang menentukan nama data saat dikirim ke server.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan field 'tanggal lahir' (date) dan 'unggah foto' (file, hanya menerima gambar), lengkap dengan labelnya.",
          ),
        ],
      },
      {
        title: "Praktik 3 — Landing Page Semantic",
        duration: 28,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Menyusun landing page utuh dengan struktur semantic dan navigasi antar-bagian.</p>",
          ),
          h("Langkah 1: Header dan Navigasi"),
          htmlCode(`
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
`),
          h("Langkah 2: Hero dan Fitur"),
          htmlCode(`
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
</main>
`),
          h("Langkah 3: Alur, Form, dan Footer"),
          htmlCode(`
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

<footer>
  <p>&copy; 2026 Belajar Web. Semua hak dilindungi.</p>
</footer>
`),
          h("Kode Lengkap"),
          htmlCode(`
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
            "Tautan #fitur, #alur, dan #daftar akan melompat ke bagian yang sesuai karena setiap section punya id.",
          ),
          callout(
            "info",
            "Tantangan Mandiri: Tambahkan section 'Testimoni' berisi dua blockquote, lalu tambahkan tautannya di navigasi.",
          ),
        ],
      },
      {
        title: "Debugging & Validasi",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menemukan kesalahan HTML dengan DevTools, validator W3C, dan mengenali pola kesalahan yang paling sering terjadi.</p>",
          ),
          h("1. Memeriksa dengan DevTools"),
          htmlCode(`
<!-- Buka F12 -> tab Elements untuk melihat HTML hasil parsing -->
<div class="kartu">
  <h2>Judul</h2>
  <p>Isi</p>
</div>
`),
          p(
            "<p>Jika tag tidak ditutup, browser menebak sendiri dan hasilnya di panel Elements bisa berbeda dari file asli. Bandingkan keduanya untuk menemukan masalah.</p>",
          ),
          h("2. Validasi dengan W3C"),
          p(
            "<p>Buka <strong>validator.w3.org</strong>, tempel kode atau unggah file. Validator menampilkan tag yang tidak ditutup, atribut salah, dan tag deprecated.</p>",
          ),
          htmlCode(`
<!-- Contoh kesalahan yang dilaporkan validator -->
<img src="foto.jpg">                 <!-- alt tidak ada -->
<p>Paragraf <b>tanpa penutup      <!-- tag tidak ditutup -->
<font color="red">Teks</font>       <!-- tag deprecated -->
`),
          h("3. Kesalahan yang Sering Terjadi"),
          htmlCode(`
<!-- 1. Lupa menutup tag -->
<p>Teks

<!-- 2. Urutan penutupan salah -->
<div><p>Teks</div></p>

<!-- 3. Atribut tanpa tanda kutip -->
<img src=foto.jpg alt=foto>

<!-- 4. id ganda -->
<h1 id="judul">Satu</h1>
<h2 id="judul">Dua</h2>

<!-- 5. Konten di luar body -->
</body>
<p>Di luar body</p>
`),
          h("4. Alur Perbaikan yang Efisien"),
          p(
            "<ol><li>Buka halaman, lihat apakah ada elemen yang hilang/bergeser.</li><li>Periksa tab Console/Network untuk aset yang gagal dimuat.</li><li>Jalankan validator untuk kesalahan struktur.</li><li>Perbaiki satu per satu dari kesalahan paling atas.</li></ol>",
          ),
          callout(
            "info",
            "Browser memaafkan banyak kesalahan HTML, tetapi hasilnya bisa tidak sesuai harapan. Validator membuat masalah itu terlihat.",
          ),
          h("Studi Kasus: Memperbaiki Halaman yang Berantakan"),
          p(
            "<p><strong>Skenario:</strong> Halaman berikut punya empat kesalahan. Temukan dan perbaiki.</p>",
          ),
          htmlCode(`
<!-- Sebelum -->
<html>
<head><title>Halaman</title>
<body>
  <h1>Judul<h1>
  <img src=foto.jpg>
  <p>Paragraf <b>tebal</p></b>
  <div id="konten"></div>
  <span id="konten">Ganda</span>
</body>
`),
          htmlCode(`
<!-- Sesudah -->
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Halaman</title>
</head>
<body>
  <h1>Judul</h1>
  <img src="foto.jpg" alt="Foto contoh">
  <p>Paragraf <b>tebal</b></p>
  <div id="konten"></div>
  <span id="konten-dua">Ganda</span>
</body>
</html>
`),
          callout(
            "success",
            "Tantangan Mandiri: Jalankan halaman profilmu di validator.w3.org dan perbaiki semua error yang muncul sampai bersih.",
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
          p("<p>Kuis campuran dari seluruh materi.</p>"),
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
              options: [
                'type="date"',
                'type="calendar"',
                'type="day"',
                'type="time"',
              ],
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
        duration: 10,
        blocks: [
          h("Yang Sudah Kamu Pelajari"),
          p(
            "<ul><li>Struktur dokumen HTML dan cara browser membacanya.</li><li>Tag teks, format, kutipan, list, tautan, gambar, audio, dan video.</li><li>Tabel dasar &amp; lanjutan serta seluruh tipe input form.</li><li>Struktur semantic, meta &amp; SEO dasar, dan aksesibilitas.</li><li>Tiga proyek praktik utuh dan cara memvalidasi HTML.</li></ul>",
          ),
          h("Contoh Halaman Lengkap yang Sudah Kamu Kuasai"),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ringkasan HTML</title>
</head>
<body>
  <header>
    <h1>Belajar HTML</h1>
    <nav><a href="#materi">Materi</a> | <a href="#kontak">Kontak</a></nav>
  </header>

  <main>
    <section id="materi">
      <h2>Materi</h2>
      <ul>
        <li>Tag dasar</li>
        <li>Semantic</li>
        <li>Form</li>
      </ul>
    </section>
  </main>

  <footer id="kontak">
    <p>Email: <a href="mailto:halo@contoh.id">halo@contoh.id</a></p>
  </footer>
</body>
</html>
`),
          h("Langkah Selanjutnya"),
          p(
            "<ol><li><strong>CSS</strong> — mengatur warna, ukuran, jarak, dan tata letak.</li><li><strong>Responsive design</strong> — media query serta Flexbox/Grid.</li><li><strong>JavaScript</strong> — membuat halaman interaktif dan mengambil data dari API.</li><li><strong>Git &amp; GitHub</strong> — menyimpan dan membagikan proyek.</li></ol>",
          ),
          callout(
            "success",
            "Selamat! Kamu sudah punya fondasi HTML yang cukup untuk mulai belajar CSS.",
          ),
          divider(),
        ],
      },
    ],
  },
];
