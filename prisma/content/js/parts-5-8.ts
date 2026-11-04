import {
  callout,
  CoursePartDef,
  divider,
  h,
  htmlCode,
  jsCode,
  p,
  quiz,
} from "../helpers";

export const JS_PARTS_5_8: CoursePartDef[] = [
  // ==========================================================
  // PART 5 — ARRAY & OBJECT
  // ==========================================================
  {
    name: "Array & Object",
    description: "Method array penting, object, destructuring, dan JSON.",
    lessons: [
      {
        title: "Array Dasar",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengelola daftar data menggunakan array: mengakses berdasarkan index, menambah &amp; menghapus elemen di ujung, mencari isi, serta membedakan <code>slice</code> dan <code>splice</code>.</p>",
          ),
          h("1. Membuat dan Mengakses Elemen Array"),
          p(
            "<p>Index array dimulai dari <code>0</code>. Gunakan <code>.length</code> untuk mengetahui jumlah item, dan <code>daftar[daftar.length - 1]</code> untuk mengambil elemen terakhir.</p>",
          ),
          jsCode(`
const materi = ["HTML", "CSS", "JavaScript"];

console.log("Pertama :", materi[0]);                  // "HTML"
console.log("Terakhir:", materi[materi.length - 1]);  // "JavaScript"
console.log("Jumlah  :", materi.length);              // 3
`),
          h("2. Menambah dan Menghapus di Akhir / Awal (push, pop, unshift, shift)"),
          p(
            "<p>Empat method ini mengubah array aslinya secara langsung:</p><ul><li><code>push</code> / <code>pop</code>: tambah &amp; ambil dari <strong>akhir</strong>.</li><li><code>unshift</code> / <code>shift</code>: tambah &amp; ambil dari <strong>awal</strong>.</li></ul>",
          ),
          jsCode(`
const antrean = ["Budi", "Siti"];

antrean.push("Andi");       // ["Budi", "Siti", "Andi"]
antrean.unshift("Prioritas"); // ["Prioritas", "Budi", "Siti", "Andi"]

const dilayaniPertama = antrean.shift();
const batalTerakhir = antrean.pop();

console.log("Dilayani:", dilayaniPertama); // "Prioritas"
console.log("Batal   :", batalTerakhir);   // "Andi"
console.log("Sisa    :", antrean);         // ["Budi", "Siti"]
`),
          h("3. Mencari dan Menggabungkan (includes, indexOf, join)"),
          p(
            "<p><code>includes</code> mengembalikan boolean, <code>indexOf</code> mengembalikan posisi index (atau <code>-1</code> jika tidak ada), dan <code>join</code> menyatukan array menjadi string.</p>",
          ),
          jsCode(`
const tags = ["frontend", "html", "tailwind"];

console.log(tags.includes("tailwind")); // true
console.log(tags.indexOf("html"));      // 1
console.log(tags.indexOf("python"));    // -1
console.log(tags.join(" • "));          // "frontend • html • tailwind"
`),
          h("4. Perbedaan Penting: slice vs splice"),
          p(
            "<p><code>slice(awal, akhir)</code> menyalin sebagian array <strong>tanpa mengubah</strong> array asli. Sebaliknya, <code>splice(mulai, jumlahHapus, ...itemBaru)</code> <strong>mengubah</strong> array asli.</p>",
          ),
          jsCode(`
const huruf = ["A", "B", "C", "D", "E"];

const potongan = huruf.slice(1, 4);
console.log("Hasil slice :", potongan); // ["B", "C", "D"]
console.log("Huruf tetap :", huruf);    // ["A", "B", "C", "D", "E"]

huruf.splice(2, 1, "X"); // mulai index 2, hapus 1 ("C"), sisipkan "X"
console.log("Setelah splice:", huruf);  // ["A", "B", "X", "D", "E"]
`),
          callout(
            "warning",
            "Jika ingin mengambil sebagian data tanpa merusak data sumber, selalu pilih slice ketimbang splice.",
          ),
          h("Studi Kasus: Pengelola Antrean Tiket Bantuan (Helpdesk)"),
          p(
            "<p><strong>Skenario:</strong> Tiket reguler masuk dari belakang (<code>push</code>), tiket darurat masuk ke paling depan (<code>unshift</code>), dan petugas memproses satu tiket terdepan (<code>shift</code>).</p>",
          ),
          jsCode(`
const antreanTiket = ["TKT-101: Lupa password", "TKT-102: Video gagal muat"];

// Tiket reguler baru masuk
antreanTiket.push("TKT-103: Ganti email");

// Tiket darurat masuk ke urutan paling depan
antreanTiket.unshift("DARURAT-01: Server kuis tidak merespons");

console.log("Antrean saat ini:", antreanTiket);

// Petugas mulai menangani tiket paling depan
const sedangDitangani = antreanTiket.shift();
console.log("Sedang ditangani:", sedangDitangani);
console.log("Tersisa (" + antreanTiket.length + "):", antreanTiket.join(" | "));
`),
          callout(
            "success",
            "Tantangan Mandiri: Gunakan slice(0, 2) pada antreanTiket untuk menampilkan maksimal 2 tiket berikutnya yang akan segera dilayani.",
          ),
          divider(),
        ],
      },
      {
        title: "map, filter, find & reduce",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menguasai empat method transformasi array paling penting di JavaScript modern: <code>map</code>, <code>filter</code>, <code>find</code>, dan <code>reduce</code>.</p>",
          ),
          h("1. map — Mengubah Setiap Elemen Menjadi Bentuk Baru"),
          p(
            "<p><code>map</code> menjalankan fungsi pada setiap elemen dan mengembalikan <strong>array baru dengan panjang yang sama</strong>.</p>",
          ),
          jsCode(`
const hargaMentah = [50000, 120000, 75000];

const hargaBerpajak = hargaMentah.map((harga) => harga + harga * 0.11);
const labelHarga = hargaMentah.map((harga) => \`Rp\${harga.toLocaleString("id-ID")}\`);

console.log(hargaBerpajak); // [55500, 133200, 83250]
console.log(labelHarga);    // ["Rp50.000", "Rp120.000", "Rp75.000"]
`),
          h("2. filter — Menyaring Elemen yang Memenuhi Syarat"),
          p(
            "<p><code>filter</code> mengembalikan <strong>array baru</strong> yang hanya berisi elemen-elemen yang fungsi callback-nya bernilai <code>true</code>.</p>",
          ),
          jsCode(`
const daftarKursus = [
  { judul: "HTML Dasar", status: "PUBLISHED", kuota: 40 },
  { judul: "Rust Lanjutan", status: "DRAFT", kuota: 0 },
  { judul: "CSS & Tailwind", status: "PUBLISHED", kuota: 25 },
];

const kursusAktif = daftarKursus.filter(
  (k) => k.status === "PUBLISHED" && k.kuota > 0,
);

console.log(kursusAktif);
`),
          h("3. find & some/every — Mencari Satu Item dan Mengecek Kondisi"),
          p(
            "<p>Perhatikan bedanya dengan <code>filter</code>: <code>find</code> mengembalikan <strong>satu objek pertama</strong> yang cocok (atau <code>undefined</code> jika tidak ada), bukan array.</p>",
          ),
          jsCode(`
const pengguna = [
  { id: "u1", nama: "Budi", role: "STUDENT" },
  { id: "u2", nama: "Rina", role: "INSTRUCTOR" },
  { id: "u3", nama: "Andi", role: "STUDENT" },
];

const instruktur = pengguna.find((u) => u.role === "INSTRUCTOR");
const adaAdmin = pengguna.some((u) => u.role === "ADMIN");

console.log("Instruktur:", instruktur); // { id: "u2", nama: "Rina", ... }
console.log("Ada admin?:", adaAdmin);   // false
`),
          h("4. reduce — Merangkum Array Menjadi Satu Nilai Akhir"),
          p(
            "<p><code>reduce((akumulator, item) =&gt; ..., nilaiAwal)</code> menggabungkan seluruh isi array menjadi satu nilai (angka total, objek rekap, dsb.).</p>",
          ),
          jsCode(`
const keranjang = [
  { nama: "Buku HTML", harga: 65000, qty: 2 },
  { nama: "Kursus JS", harga: 150000, qty: 1 },
];

const totalBayar = keranjang.reduce((total, item) => {
  return total + item.harga * item.qty;
}, 0);

console.log("Total bayar:", totalBayar); // 280000
`),
          callout(
            "info",
            "Keempat method ini bisa dirangkai (method chaining), misalnya daftar.filter(...).map(...).reduce(...).",
          ),
          h("Studi Kasus: Laporan Nilai & Statistik Kelas"),
          p(
            "<p><strong>Skenario:</strong> Dari daftar hasil kuis siswa, kita ingin mengambil daftar nama siswa yang lulus saja (<code>filter</code> + <code>map</code>), mencari siswa dengan skor sempurna 100 (<code>find</code>), dan menghitung rata-rata kelas (<code>reduce</code>).</p>",
          ),
          jsCode(`
const hasilKuis = [
  { nama: "Budi", skor: 80 },
  { nama: "Siti", skor: 100 },
  { nama: "Andi", skor: 60 },
  { nama: "Dina", skor: 90 },
];

// 1. Nama siswa yang lulus (>= 70)
const namaLulus = hasilKuis
  .filter((h) => h.skor >= 70)
  .map((h) => h.nama);

// 2. Siswa pertama yang dapat 100
const peraihSeratus = hasilKuis.find((h) => h.skor === 100);

// 3. Rata-rata kelas
const totalSkor = hasilKuis.reduce((acc, h) => acc + h.skor, 0);
const rataRata = totalSkor / hasilKuis.length;

console.log("Siswa lulus :", namaLulus.join(", "));
console.log("Skor 100    :", peraihSeratus ? peraihSeratus.nama : "Belum ada");
console.log("Rata-rata   :", rataRata);
`),
          callout(
            "success",
            "Tantangan Mandiri: Gunakan filter untuk menghitung berapa banyak siswa yang belum lulus (skor < 70).",
          ),
          divider(),
        ],
      },
      {
        title: "Object & Destructuring",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membaca, menambah, dan mengubah properti object, bekerja dengan nested object, serta membongkar isi object/array menggunakan <em>destructuring</em>.</p>",
          ),
          h("1. Dot Notation vs Bracket Notation"),
          p(
            "<p>Properti object umumnya diakses dengan tanda titik (<code>obj.nama</code>). Namun jika nama propertinya disimpan di dalam variabel atau mengandung spasi/tanda hubung, gunakan kurung siku <code>obj[kunci]</code>.</p>",
          ),
          jsCode(`
const kursus = {
  judul: "Belajar JavaScript",
  "tingkat-kesulitan": "Pemula",
  kuota: 50,
};

const kolomYangDicari = "kuota";

console.log(kursus.judul);
console.log(kursus["tingkat-kesulitan"]);
console.log(kursus[kolomYangDicari]); // 50
`),
          h("2. Destructuring Object Dasar & Nilai Default"),
          p(
            "<p>Destructuring mengekstrak beberapa properti object langsung menjadi variabel terpisah, lengkap dengan nilai cadangan jika propertinya <code>undefined</code>.</p>",
          ),
          jsCode(`
const pengguna = {
  nama: "Budi Santoso",
  email: "budi@contoh.id",
};

const { nama, email, role = "STUDENT" } = pengguna;
console.log(nama, "|", email, "|", role);
`),
          h("3. Mengganti Nama Variabel (Alias) & Nested Destructuring"),
          p(
            "<p>Gunakan titik dua <code>propertiAsli: namaBaru</code> jika nama variabelnya ingin dibedakan.</p>",
          ),
          jsCode(`
const responsApi = {
  id: "crs-01",
  title: "CSS & Tailwind",
  author: {
    name: "Rina Kartika",
  },
};

const {
  title: judulKursus,
  author: { name: namaInstruktur },
} = responsApi;

console.log(judulKursus, "oleh", namaInstruktur);
`),
          h("4. Destructuring langsung pada Parameter Fungsi"),
          p(
            "<p>Teknik ini sangat sering dipakai di komponen UI agar fungsi langsung menerima properti yang dibutuhkan.</p>",
          ),
          jsCode(`
function cetakKartuSiswa({ nama, nim, prodi = "Teknik Informatika" }) {
  return \`\${nama} (\${nim}) — \${prodi}\`;
}

console.log(cetakKartuSiswa({ nama: "Budi", nim: "253140700111001" }));
`),
          callout(
            "info",
            "Gunakan optional chaining (obj?.alamat?.kota) ketika membaca object bersarang yang mungkin bernilai null atau undefined agar tidak terjadi TypeError.",
          ),
          h("Studi Kasus: Pemformat Profil Pengguna dari Data Server"),
          p(
            "<p><strong>Skenario:</strong> Server mengirimkan data pengguna bersarang yang sebagian opsional. Kita perlu membongkarnya dengan aman untuk ditampilkan di halaman profil.</p>",
          ),
          jsCode(`
const dataServer = {
  id: "usr-99",
  fullName: "Dina Maharani",
  contact: {
    email: "dina@contoh.id",
  },
  stats: {
    completedCourses: 4,
  },
};

function formatRingkasanProfil(user) {
  const {
    fullName: namaLengkap,
    contact: { email, phone: nomorHp = "Belum diisi" },
    stats: { completedCourses = 0, certificates = 0 },
  } = user;

  return {
    namaLengkap,
    email,
    nomorHp,
    ringkasanBelajar: \`\${completedCourses} kursus selesai (\${certificates} sertifikat)\`,
  };
}

console.log(formatRingkasanProfil(dataServer));
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan properti phone: '08123456789' ke dalam contact pada dataServer lalu jalankan ulang.",
          ),
          divider(),
        ],
      },
      {
        title: "JSON",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami format JSON, mengubah object ke string JSON (<code>JSON.stringify</code>) dan sebaliknya (<code>JSON.parse</code>), serta menyimpan data ke <code>localStorage</code> dengan aman.</p>",
          ),
          h("1. Object JavaScript vs String JSON"),
          p(
            "<p>Ketika data dikirim lewat jaringan (HTTP) atau disimpan di <code>localStorage</code>, data harus berupa <strong>teks (string)</strong>. JSON (<em>JavaScript Object Notation</em>) adalah format teks standar yang wajib memakai tanda kutip ganda pada setiap nama propertinya.</p>",
          ),
          jsCode(`
const objekSiswa = {
  nama: "Budi",
  aktif: true,
  kelas: ["HTML", "CSS"],
};

// Ubah object menjadi string JSON
const stringJson = JSON.stringify(objekSiswa);
console.log(typeof stringJson); // "string"
console.log(stringJson);        // '{"nama":"Budi","aktif":true,"kelas":["HTML","CSS"]}'

// Ubah string JSON dengan indentasi 2 spasi agar mudah dibaca
console.log(JSON.stringify(objekSiswa, null, 2));
`),
          h("2. Mengubah String JSON Kembali ke Object (JSON.parse)"),
          p(
            "<p>Saat menerima teks JSON dari server atau penyimpanan lokal, gunakan <code>JSON.parse()</code> agar bisa diakses kembali seperti object biasa.</p>",
          ),
          jsCode(`
const teksDariServer = '{"judul":"Belajar JS","lulus":true,"skor":90}';

const data = JSON.parse(teksDariServer);
console.log(data.judul); // "Belajar JS"
console.log(data.skor);  // 90
`),
          h("3. Menangani JSON Rusak dengan try / catch"),
          p(
            "<p>Jika string yang diberikan ke <code>JSON.parse</code> tidak sesuai aturan JSON (misalnya tanda kutip kurang), program akan melempar <code>SyntaxError</code>. Bungkus dengan <code>try...catch</code> agar aplikasi tidak berhenti.</p>",
          ),
          jsCode(`
function parseJsonAman(teks, nilaiCadangan = null) {
  try {
    return JSON.parse(teks);
  } catch (error) {
    console.warn("JSON tidak valid:", error.message);
    return nilaiCadangan;
  }
}

console.log(parseJsonAman('{"valid": true}'));
console.log(parseJsonAman("{rusak}", { valid: false }));
`),
          callout(
            "warning",
            "JSON hanya mendukung string, number, boolean, null, array, dan object. Properti berisi function atau undefined akan otomatis dibuang saat JSON.stringify.",
          ),
          h("Studi Kasus: Menyimpan & Memuat Preferensi Belajar di localStorage"),
          p(
            "<p><strong>Skenario:</strong> Kita ingin menyimpan pengaturan pengguna (tema, ukuran font, modul terakhir) ke dalam bentuk JSON, lalu membacanya kembali dengan nilai cadangan jika belum ada.</p>",
          ),
          jsCode(`
const PREFERENSI_BAWAAN = {
  tema: "terang",
  ukuranFont: 16,
  modulTerakhir: "html-1",
};

function simpanPreferensi(prefBaru) {
  const gabungan = { ...PREFERENSI_BAWAAN, ...prefBaru };
  return JSON.stringify(gabungan);
}

function muatPreferensi(teksTersimpan) {
  if (!teksTersimpan) return PREFERENSI_BAWAAN;
  try {
    return { ...PREFERENSI_BAWAAN, ...JSON.parse(teksTersimpan) };
  } catch {
    return PREFERENSI_BAWAAN;
  }
}

const tersimpan = simpanPreferensi({ tema: "gelap", modulTerakhir: "js-5" });
console.log("Tersimpan (string):", tersimpan);
console.log("Dimuat kembali    :", muatPreferensi(tersimpan));
`),
          callout(
            "success",
            "Tantangan Mandiri: Di Console browser, coba jalankan localStorage.setItem('pref', tersimpan) lalu baca kembali dengan JSON.parse(localStorage.getItem('pref')).",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Array & Object",
        duration: 12,
        type: "QUIZ",
        blocks: [
          h("Kuis Array & Object"),
          p("<p>Uji pemahaman array method, object, dan JSON.</p>"),
          quiz("Kuis Array & Object", [
            {
              q: "Method untuk mengubah setiap item array adalah...",
              options: ["filter", "map", "find", "reduce"],
              answer: 1,
            },
            {
              q: "Method untuk menyaring array adalah...",
              options: ["map", "filter", "slice", "push"],
              answer: 1,
            },
            {
              q: "Method yang merangkum array menjadi satu nilai adalah...",
              options: ["reduce", "forEach", "find", "concat"],
              answer: 0,
            },
            {
              q: "Destructuring object ditulis dengan...",
              options: [
                "const [a] = obj",
                "const { a } = obj",
                "const a = obj{a}",
                "const a <- obj",
              ],
              answer: 1,
            },
            {
              q: "Untuk mengubah object menjadi string JSON dipakai...",
              options: ["JSON.parse", "JSON.stringify", "String()", "Object.keys"],
              answer: 1,
            },
            {
              q: "`splice` berbeda dari `slice` karena...",
              options: [
                "splice hanya membaca",
                "splice mengubah array asli",
                "slice mengubah array asli",
                "tidak ada bedanya",
              ],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 6 — DOM & EVENT
  // ==========================================================
  {
    name: "DOM & Event",
    description: "Memanipulasi halaman: memilih elemen, mengubah konten, dan event.",
    lessons: [
      {
        title: "Memilih Elemen",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengambil elemen dari pohon DOM menggunakan <code>getElementById</code>, <code>querySelector</code>, dan <code>querySelectorAll</code>, serta menangani kasus ketika elemen tidak ditemukan.</p>",
          ),
          h("1. getElementById vs querySelector"),
          p(
            "<p><code>getElementById(\"judul\")</code> mencari berdasarkan atribut <code>id</code> (tanpa tanda <code>#</code>). <code>querySelector</code> menerima <strong>selector CSS apa pun</strong> (<code>#id</code>, <code>.class</code>, <code>nav a</code>) dan mengembalikan elemen pertama yang cocok.</p>",
          ),
          htmlCode(`
<h1 id="judul-utama">Belajar DOM</h1>
<p class="deskripsi">Paragraf pertama</p>
<p class="deskripsi">Paragraf kedua</p>

<script>
  const judul = document.getElementById("judul-utama");
  const paragrafPertama = document.querySelector(".deskripsi");

  console.log(judul.textContent);
  console.log(paragrafPertama.textContent);
</script>
`),
          h("2. Mengambil Banyak Elemen Sekaligus dengan querySelectorAll"),
          p(
            "<p><code>querySelectorAll</code> mengembalikan <code>NodeList</code> berisi seluruh elemen yang cocok. Kita bisa menelusurinya menggunakan <code>for...of</code> atau <code>.forEach()</code>.</p>",
          ),
          htmlCode(`
<ul>
  <li class="item-menu">Beranda</li>
  <li class="item-menu">Kursus</li>
  <li class="item-menu">Profil</li>
</ul>

<script>
  const semuaMenu = document.querySelectorAll(".item-menu");
  console.log("Jumlah menu:", semuaMenu.length);

  semuaMenu.forEach((elemen, index) => {
    console.log(\`Menu \${index + 1}: \${elemen.textContent}\`);
  });
</script>
`),
          h("3. Mencari di Dalam Elemen Tertentu (Scoped Query)"),
          p(
            "<p>Kita tidak harus selalu memanggil <code>document.querySelector</code>. Kita juga bisa mencari di dalam satu kartu/elemen induk tertentu.</p>",
          ),
          htmlCode(`
<article id="kartu-1">
  <h3 class="judul">Kursus HTML</h3>
</article>
<article id="kartu-2">
  <h3 class="judul">Kursus JavaScript</h3>
</article>

<script>
  const kartuKedua = document.querySelector("#kartu-2");
  const judulKartuKedua = kartuKedua.querySelector(".judul");
  console.log(judulKartuKedua.textContent); // "Kursus JavaScript"
</script>
`),
          callout(
            "warning",
            "Jika selector tidak menemukan elemen apa pun, querySelector mengembalikan null. Biasakan mengecek if (elemen) sebelum mengakses textContent agar tidak error.",
          ),
          h("Studi Kasus: Pemeriksa Kelengkapan Elemen Halaman"),
          p(
            "<p><strong>Skenario:</strong> Sebelum menjalankan logika halaman kuis, script memeriksa apakah elemen judul, timer, dan daftar soal semuanya ada di halaman.</p>",
          ),
          htmlCode(`
<header>
  <h1 id="judul-kuis">Kuis DOM</h1>
  <span id="timer-kuis">15:00</span>
</header>
<section>
  <div class="butir-soal">Soal 1</div>
  <div class="butir-soal">Soal 2</div>
  <div class="butir-soal">Soal 3</div>
</section>

<script>
  const judul = document.querySelector("#judul-kuis");
  const timer = document.querySelector("#timer-kuis");
  const daftarSoal = document.querySelectorAll(".butir-soal");

  if (!judul || !timer) {
    console.error("Elemen header kuis belum lengkap!");
  } else {
    console.log("Kuis siap:", judul.textContent);
    console.log("Sisa waktu:", timer.textContent);
    console.log("Total soal ditemukan:", daftarSoal.length);
  }
</script>
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah setiap teks di dalam .butir-soal menjadi 'Pertanyaan ke-1', 'Pertanyaan ke-2', dst. menggunakan forEach.",
          ),
          divider(),
        ],
      },
      {
        title: "Manipulasi Konten & Class",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengubah isi teks dengan aman (<code>textContent</code> vs <code>innerHTML</code>), mengelola class CSS dengan <code>classList</code>, serta memodifikasi atribut elemen.</p>",
          ),
          h("1. textContent vs innerHTML"),
          p(
            "<p>Gunakan <code>textContent</code> untuk memasukkan teks murni. Hindari memasukkan input pengguna ke dalam <code>innerHTML</code> karena tag HTML/script di dalamnya akan ikut dieksekusi browser.</p>",
          ),
          htmlCode(`
<p id="info"></p>

<script>
  const info = document.querySelector("#info");

  // Aman: semua karakter dianggap teks biasa
  info.textContent = "Selamat belajar <script> berbahaya tidak akan jalan!";
</script>
`),
          h("2. Mengelola Class CSS dengan classList"),
          p(
            "<p>Daripada mengubah banyak properti <code>elemen.style.*</code> satu per satu, siapkan class di CSS/Tailwind lalu nyalakan/matikan lewat <code>classList.add</code>, <code>remove</code>, dan <code>toggle</code>.</p>",
          ),
          htmlCode(`
<div id="panel" class="p-4 rounded-xl bg-gray-100">
  Panel materi
</div>
<button id="btn-mode">Toggle Sorotan</button>

<script>
  const panel = document.querySelector("#panel");
  const btn = document.querySelector("#btn-mode");

  btn.addEventListener("click", () => {
    panel.classList.toggle("bg-orange-100");
    panel.classList.toggle("border");
    console.log("Aktif?", panel.classList.contains("bg-orange-100"));
  });
</script>
`),
          h("3. Membaca & Mengubah Atribut (setAttribute, disabled, dataset)"),
          p(
            "<p>Kita juga bisa mengganti gambar <code>src</code>, menonaktifkan tombol <code>disabled</code>, atau menyimpan data kustom di atribut <code>data-*</code>.</p>",
          ),
          htmlCode(`
<button id="btn-kirim" data-langkah="1">Kirim Jawaban</button>

<script>
  const tombol = document.querySelector("#btn-kirim");

  console.log("Langkah:", tombol.dataset.langkah); // "1"
  tombol.disabled = true;
  tombol.textContent = "Mengirim...";
</script>
`),
          callout(
            "warning",
            "Gunakan textContent sebagai standar utama. Hanya gunakan innerHTML jika string HTML-nya 100% kamu tulis sendiri di dalam kode, bukan dari input user.",
          ),
          h("Studi Kasus: Komponen Accordion Buka-Tutup Materi"),
          p(
            "<p><strong>Skenario:</strong> Saat judul bagian diklik, isi materinya dibuka/ditutup dengan men-toggle class <code>hidden</code> dan mengganti ikon panah.</p>",
          ),
          htmlCode(`
<div class="border rounded-xl p-4">
  <button id="kepala-accordion" class=" font-bold">
    <span id="ikon">▶</span> Bagian 1: Pengenalan DOM
  </button>
  <div id="isi-accordion" hidden>
    <p>DOM adalah representasi dokumen HTML sebagai objek yang bisa diubah lewat JavaScript.</p>
  </div>
</div>

<script>
  const kepala = document.querySelector("#kepala-accordion");
  const isi = document.querySelector("#isi-accordion");
  const ikon = document.querySelector("#ikon");

  kepala.addEventListener("click", () => {
    const sedangTersembunyi = isi.hasAttribute("hidden");
    if (sedangTersembunyi) {
      isi.removeAttribute("hidden");
      ikon.textContent = "▼";
    } else {
      isi.setAttribute("hidden", "");
      ikon.textContent = "▶";
    }
  });
</script>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan atribut aria-expanded='true' / 'false' pada tombol kepala-accordion setiap kali dibuka atau ditutup.",
          ),
          divider(),
        ],
      },
      {
        title: "Event Listener & Form",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menangani berbagai event pengguna (<code>click</code>, <code>input</code>, <code>keydown</code>, <code>submit</code>), memahami objek <code>event</code>, serta memvalidasi form tanpa reload halaman.</p>",
          ),
          h("1. Event click dan Objek Event"),
          p(
            "<p>Fungsi pendengar event otomatis menerima parameter <code>event</code> yang berisi informasi seperti elemen mana yang memicu aksi (<code>event.currentTarget</code>).</p>",
          ),
          htmlCode(`
<button id="btn-tes">Klik Saya</button>

<script>
  const btn = document.querySelector("#btn-tes");
  btn.addEventListener("click", (event) => {
    console.log("Tipe event:", event.type);
    console.log("Teks tombol:", event.currentTarget.textContent);
  });
</script>
`),
          h("2. Event input — Reaksi Langsung Saat Mengetik"),
          p(
            "<p>Event <code>input</code> terpanggil setiap kali isi kotak teks berubah. Sangat cocok untuk penghitung karakter atau pencarian instan.</p>",
          ),
          htmlCode(`
<textarea id="komentar" maxlength="100" placeholder="Tulis komentar..."></textarea>
<p><span id="hitung">0</span>/100 karakter</p>

<script>
  const komentar = document.querySelector("#komentar");
  const hitung = document.querySelector("#hitung");

  komentar.addEventListener("input", () => {
    hitung.textContent = komentar.value.length;
  });
</script>
`),
          h("3. Event submit & event.preventDefault()"),
          p(
            "<p>Secara bawaan, saat form di-submit browser akan me-reload halaman. Panggil <code>event.preventDefault()</code> di baris pertama agar kita bisa memvalidasi dan memproses datanya dengan JavaScript.</p>",
          ),
          htmlCode(`
<form id="form-kode">
  <input id="input-kode" placeholder="Masukkan kode kelas" />
  <button type="submit">Gabung</button>
</form>
<p id="pesan-form"></p>

<script>
  const form = document.querySelector("#form-kode");
  const inputKode = document.querySelector("#input-kode");
  const pesan = document.querySelector("#pesan-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const kode = inputKode.value.trim().toUpperCase();

    if (kode.length < 6) {
      pesan.textContent = "Kode kelas minimal 6 karakter!";
      return;
    }

    pesan.textContent = "Berhasil mengirim kode: " + kode;
    form.reset();
  });
</script>
`),
          callout(
            "info",
            "Pasang pendengar pada elemen <form> dengan event 'submit', bukan hanya 'click' pada tombolnya, supaya menekan tombol Enter di keyboard juga ikut tertangani.",
          ),
          h("Studi Kasus: Form Pendaftaran dengan Validasi Langsung"),
          p(
            "<p><strong>Skenario:</strong> Kita membuat form pendaftaran yang memeriksa kelengkapan nama, format email, dan kecocokan konfirmasi password sebelum mengizinkan submit.</p>",
          ),
          htmlCode(`
<form id="form-daftar">
  <input id="nama" placeholder="Nama lengkap" />
  <input id="email" type="email" placeholder="Email" />
  <input id="pass" type="password" placeholder="Password (min 8 karakter)" />
  <button type="submit">Daftar</button>
</form>
<p id="umpan-balik"></p>

<script>
  const form = document.querySelector("#form-daftar");
  const umpanBalik = document.querySelector("#umpan-balik");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nama = document.querySelector("#nama").value.trim();
    const email = document.querySelector("#email").value.trim();
    const pass = document.querySelector("#pass").value;

    if (!nama || !email) {
      umpanBalik.textContent = "Nama dan email wajib diisi.";
      return;
    }

    if (pass.length < 8) {
      umpanBalik.textContent = "Password minimal harus 8 karakter.";
      return;
    }

    umpanBalik.textContent = \`Pendaftaran \${nama} (\${email}) berhasil!\`;
    form.reset();
  });
</script>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan satu input konfirmasi password dan tampilkan pesan error jika isinya tidak sama dengan input password pertama.",
          ),
          divider(),
        ],
      },
      {
        title: "Membuat Elemen Dinamis",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat elemen baru dengan <code>document.createElement</code>, menyusunnya ke dalam halaman (<code>append</code>), serta menghapus elemen saat tombol hapus diklik.</p>",
          ),
          h("1. Membuat dan Menambahkan Satu Elemen"),
          p(
            "<p>Tiga langkah standar: buat elemen dengan <code>createElement</code>, isi teks/class-nya, lalu tempelkan ke induk dengan <code>appendChild</code> atau <code>append</code>.</p>",
          ),
          htmlCode(`
<ul id="daftar-materi"></ul>

<script>
  const ul = document.querySelector("#daftar-materi");

  const li = document.createElement("li");
  li.textContent = "1. Pengenalan DOM";
  li.className = "item-materi";

  ul.appendChild(li);
</script>
`),
          h("2. Merender Array Data Menjadi Daftar Elemen"),
          p(
            "<p>Sebelum merender ulang dari sebuah array, kosongkan isi container dengan <code>container.innerHTML = \"\"</code> atau <code>replaceChildren()</code> agar daftar tidak mengganda.</p>",
          ),
          htmlCode(`
<ul id="daftar-siswa"></ul>

<script>
  const dataSiswa = [
    { nama: "Budi", nilai: 90 },
    { nama: "Siti", nilai: 85 },
  ];

  const container = document.querySelector("#daftar-siswa");
  container.replaceChildren();

  for (const siswa of dataSiswa) {
    const item = document.createElement("li");
    item.textContent = \`\${siswa.nama} — Skor: \${siswa.nilai}\`;
    container.appendChild(item);
  }
</script>
`),
          h("3. Menghapus Elemen dengan .remove()"),
          p(
            "<p>Setiap elemen DOM memiliki method <code>.remove()</code> untuk menghapus dirinya sendiri dari halaman.</p>",
          ),
          htmlCode(`
<div id="notifikasi">
  <span>Progres berhasil disimpan.</span>
  <button id="tutup">Tutup</button>
</div>

<script>
  const notif = document.querySelector("#notifikasi");
  const tombolTutup = document.querySelector("#tutup");

  tombolTutup.addEventListener("click", () => {
    notif.remove();
  });
</script>
`),
          callout(
            "info",
            "Membuat elemen dengan createElement + textContent jauh lebih aman dari serangan injeksi HTML dibanding merangkai string innerHTML.",
          ),
          h("Studi Kasus: Aplikasi Catatan Tugas (Todo List) Interaktif"),
          p(
            "<p><strong>Skenario:</strong> Pengguna bisa mengetik tugas baru di form, menambahkannya ke daftar, dan menekan tombol <em>Hapus</em> di samping tiap tugas untuk menghapusnya.</p>",
          ),
          htmlCode(`
<form id="form-tugas">
  <input id="input-tugas" placeholder="Tulis tugas belajar..." required />
  <button type="submit">Tambah</button>
</form>
<ul id="daftar-tugas"></ul>

<script>
  const form = document.querySelector("#form-tugas");
  const input = document.querySelector("#input-tugas");
  const daftar = document.querySelector("#daftar-tugas");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const teks = input.value.trim();
    if (!teks) return;

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = teks + " ";

    const btnHapus = document.createElement("button");
    btnHapus.type = "button";
    btnHapus.textContent = "Hapus";
    btnHapus.addEventListener("click", () => {
      li.remove();
    });

    li.append(span, btnHapus);
    daftar.appendChild(li);
    input.value = "";
  });
</script>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan tombol 'Selesai' di samping tombol Hapus yang mencoret teks tugas (span.style.textDecoration = 'line-through').",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis DOM & Event",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis DOM & Event"),
          p("<p>Uji pemahaman manipulasi DOM.</p>"),
          quiz("Kuis DOM & Event", [
            {
              q: "Method untuk mengambil satu elemen berdasarkan selector CSS adalah...",
              options: [
                "getElementById",
                "querySelector",
                "querySelectorAll",
                "getElementsByTag",
              ],
              answer: 1,
            },
            {
              q: "Untuk mengubah teks tanpa risiko HTML dipakai...",
              options: ["innerHTML", "textContent", "outerHTML", "innerTextHTML"],
              answer: 1,
            },
            {
              q: "Untuk menambah class pada elemen dipakai...",
              options: [
                "classList.add()",
                "classList.push()",
                "addClass()",
                "style.class",
              ],
              answer: 0,
            },
            {
              q: "Mencegah reload saat submit form memakai...",
              options: [
                "event.stop()",
                "event.preventDefault()",
                "return false saja",
                "event.reset()",
              ],
              answer: 1,
            },
            {
              q: "Untuk membuat elemen baru dipakai...",
              options: [
                "document.new()",
                "document.createElement()",
                "document.append()",
                "new Element()",
              ],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 7 — ASYNCHRONOUS JAVASCRIPT
  // ==========================================================
  {
    name: "Asynchronous JavaScript",
    description:
      "Callback, Promise, async/await, dan menangani banyak request sekaligus.",
    lessons: [
      {
        title: "Sync vs Async & Event Loop",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami perbedaan eksekusi <em>synchronous</em> dan <em>asynchronous</em>, penggunaan <code>setTimeout</code> serta <code>setInterval</code>, dan bagaimana Event Loop menjaga halaman tetap responsif.</p>",
          ),
          h("1. Kode Synchronous: Baris demi Baris"),
          p(
            "<p>Secara bawaan, JavaScript bekerja secara <em>synchronous</em> (satu jalur): baris kedua baru dijalankan setelah baris pertama selesai.</p>",
          ),
          jsCode(`
console.log("Langkah 1: Siapkan bahan");
console.log("Langkah 2: Masak air");
console.log("Langkah 3: Seduh kopi");
`),
          h("2. Kode Asynchronous dengan setTimeout"),
          p(
            "<p>Jika sebuah tugas membutuhkan waktu tunggu (seperti timer atau mengambil data dari internet), JavaScript tidak membekukan layar. Tugas itu dititipkan ke browser, lalu baris berikutnya tetap jalan lebih dulu.</p>",
          ),
          jsCode(`
console.log("1. Mulai unduh materi...");

setTimeout(() => {
  console.log("2. Unduhan selesai (setelah 2 detik)!");
}, 2000);

console.log("3. Pengguna tetap bisa menggulir halaman.");
// Urutan yang tampil: 1 -> 3 -> 2
`),
          h("3. Menjalankan Tugas Berulang dengan setInterval & clearInterval"),
          p(
            "<p><code>setInterval</code> menjalankan fungsi berulang kali setiap sekian milidetik sampai dihentikan dengan <code>clearInterval(id)</code>.</p>",
          ),
          jsCode(`
let sisaDetik = 3;

const idTimer = setInterval(() => {
  console.log("Sisa waktu:", sisaDetik);
  sisaDetik -= 1;

  if (sisaDetik === 0) {
    console.log("Waktu habis!");
    clearInterval(idTimer);
  }
}, 1000);
`),
          callout(
            "info",
            "Bahkan setTimeout(fn, 0) pun tetap masuk ke antrean Event Loop dan baru dijalankan setelah seluruh kode synchronous di bawahnya selesai.",
          ),
          h("Studi Kasus: Simulasi Timer Kuis dengan Peringatan Waktu Hampir Habis"),
          p(
            "<p><strong>Skenario:</strong> Kita membuat penghitung mundur kuis yang memberi peringatan khusus ketika sisa waktu tinggal 3 detik terakhir, lalu otomatis berhenti di angka 0.</p>",
          ),
          jsCode(`
function mulaiTimerKuis(durasiDetik) {
  let sisa = durasiDetik;
  console.log(\`Kuis dimulai (\${sisa} detik)\`);

  const intervalId = setInterval(() => {
    sisa -= 1;

    if (sisa > 0 && sisa <= 3) {
      console.warn(\`⚠️ Cepat! Sisa \${sisa} detik lagi\`);
    } else if (sisa > 3) {
      console.log(\`Sisa waktu: \${sisa} detik\`);
    } else {
      console.log("⏰ Waktu habis! Jawaban dikumpulkan otomatis.");
      clearInterval(intervalId);
    }
  }, 1000);
}

mulaiTimerKuis(5);
`),
          callout(
            "success",
            "Tantangan Mandiri: Format tampilan sisa detik menjadi menit:detik (misalnya 01:05) menggunakan Math.floor dan String.padStart(2, '0').",
          ),
          divider(),
        ],
      },
      {
        title: "Callback & Callback Hell",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami konsep fungsi callback pada operasi asynchronous serta mengenali masalah <em>callback hell</em> yang melahirkan Promise.</p>",
          ),
          h("1. Apa Itu Callback?"),
          p(
            "<p><strong>Callback</strong> adalah fungsi yang dikirim sebagai argumen ke fungsi lain untuk dipanggil kembali saat prosesnya selesai.</p>",
          ),
          jsCode(`
function ambilProfilSiswa(idSiswa, saatSelesai) {
  console.log("Mengambil data siswa " + idSiswa + "...");

  setTimeout(() => {
    const data = { id: idSiswa, nama: "Budi Santoso" };
    saatSelesai(data);
  }, 500);
}

ambilProfilSiswa("USR-01", (siswa) => {
  console.log("Data diterima:", siswa.nama);
});
`),
          h("2. Callback dengan Penanganan Sukses dan Gagal"),
          p(
            "<p>Di pola lama, kita biasanya mengirim dua fungsi callback: satu untuk hasil sukses, satu lagi untuk menangani error.</p>",
          ),
          jsCode(`
function verifikasiKode(kode, onSuccess, onError) {
  setTimeout(() => {
    if (kode === "WEBDEV-2026") {
      onSuccess({ path: "Web Development" });
    } else {
      onError("Kode akses tidak ditemukan atau sudah dicabut.");
    }
  }, 300);
}

verifikasiKode(
  "WEBDEV-2026",
  (hasil) => console.log("Berhasil gabung:", hasil.path),
  (pesanError) => console.error("Gagal:", pesanError),
);
`),
          h("3. Masalah Callback Bersarang (Callback Hell)"),
          p(
            "<p>Ketika langkah ke-2 bergantung pada hasil langkah ke-1, dan langkah ke-3 bergantung pada langkah ke-2, kode akan menjorok makin dalam membentuk segitiga yang sulit dirawat.</p>",
          ),
          jsCode(`
// Ilustrasi Callback Hell (segitiga menjorok ke kanan)
ambilUser("USR-01", (user) => {
  ambilPath(user.pathId, (path) => {
    ambilDaftarKursus(path.id, (kursus) => {
      ambilSilabus(kursus[0].id, (silabus) => {
        console.log("Akhirnya sampai di silabus:", silabus);
      });
    });
  });
});
`),
          callout(
            "warning",
            "Hindari membuat callback bersarang lebih dari 2 tingkat. Di materi berikutnya kita akan meratakannya menggunakan Promise dan async/await.",
          ),
          h("Studi Kasus: Alur Pemeriksaan Stok & Pembuatan Pesanan dengan Callback"),
          p(
            "<p><strong>Skenario:</strong> Sebelum pesanan dibuat, sistem harus memeriksa stok barang lebih dulu, lalu menghitung ongkir secara berurutan.</p>",
          ),
          jsCode(`
function cekStok(namaBarang, qty, callback) {
  setTimeout(() => {
    const stokGudang = 5;
    if (qty <= stokGudang) {
      callback(null, { namaBarang, qty, hargaSatuan: 100000 });
    } else {
      callback("Stok tidak mencukupi", null);
    }
  }, 200);
}

function prosesPesanan(pesanan, callback) {
  setTimeout(() => {
    const total = pesanan.qty * pesanan.hargaSatuan;
    callback({ ...pesanan, total, kodeResi: "RESI-8891" });
  }, 200);
}

cekStok("Keyboard", 2, (err, dataStok) => {
  if (err) {
    console.error("Gagal:", err);
    return;
  }
  prosesPesanan(dataStok, (hasilAkhir) => {
    console.log("Pesanan berhasil:", hasilAkhir);
  });
});
`),
          callout(
            "success",
            "Tantangan Mandiri: Coba panggil cekStok('Keyboard', 10, ...) dan pastikan pesan error 'Stok tidak mencukupi' yang tercetak.",
          ),
          divider(),
        ],
      },
      {
        title: "Promise",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami objek <code>Promise</code>, tiga statusnya (<em>pending</em>, <em>fulfilled</em>, <em>rejected</em>), serta merangkai proses asynchronous dengan <code>.then()</code>, <code>.catch()</code>, dan <code>.finally()</code>.</p>",
          ),
          h("1. Membuat dan Memahami Status Promise"),
          p(
            "<p>Sebuah <code>Promise</code> mewakili janji hasil operasi yang baru selesai di masa depan:</p><ul><li><strong>pending</strong>: masih diproses.</li><li><strong>fulfilled</strong>: berhasil (memanggil <code>resolve(data)</code>).</li><li><strong>rejected</strong>: gagal (memanggil <code>reject(error)</code>).</li></ul>",
          ),
          jsCode(`
function unduhSertifikat(lulusKuis) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (lulusKuis) {
        resolve({ nomor: "CERT-2026-01", nama: "Budi Santoso" });
      } else {
        reject(new Error("Belum memenuhi nilai minimum kelulusan."));
      }
    }, 400);
  });
}
`),
          h("2. Menangani Hasil dengan .then(), .catch(), dan .finally()"),
          p(
            "<p><code>.then()</code> berjalan jika sukses, <code>.catch()</code> menangkap kegagalan, dan <code>.finally()</code> selalu dijalankan di akhir (cocok untuk mematikan indikator loading).</p>",
          ),
          jsCode(`
unduhSertifikat(true)
  .then((sertifikat) => {
    console.log("Sertifikat terbit:", sertifikat.nomor);
  })
  .catch((error) => {
    console.error("Gagal:", error.message);
  })
  .finally(() => {
    console.log("Proses pengecekan selesai.");
  });
`),
          h("3. Promise Chaining — Meratakan Callback Hell"),
          p(
            "<p>Nilai yang di-<code>return</code> dari dalam <code>.then()</code> dapat langsung ditangkap oleh <code>.then()</code> berikutnya secara mendatar.</p>",
          ),
          jsCode(`
Promise.resolve(100000)
  .then((hargaAwal) => {
    console.log("Harga awal:", hargaAwal);
    return hargaAwal * 0.9; // diskon 10%
  })
  .then((setelahDiskon) => {
    console.log("Setelah diskon:", setelahDiskon);
    return setelahDiskon + 15000; // tambah ongkir
  })
  .then((totalAkhir) => {
    console.log("Total bayar:", totalAkhir);
  });
`),
          callout(
            "info",
            "Satu blok .catch() di paling bawah rantai .then() sudah cukup untuk menangkap error yang terjadi di langkah mana pun di atasnya.",
          ),
          h("Studi Kasus: Rantai Login, Ambil Enrollments, dan Buka Kursus"),
          p(
            "<p><strong>Skenario:</strong> Kita mengubah alur 3 langkah (login → cek daftar kursus → buka detail kursus pertama) menjadi rantai Promise yang bersih.</p>",
          ),
          jsCode(`
function loginSiswa(email) {
  return new Promise((resolve, reject) => {
    if (!email.includes("@")) return reject(new Error("Email tidak sah"));
    setTimeout(() => resolve({ id: "u-1", email }), 200);
  });
}

function ambilKursusSaya(userId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(["Belajar HTML", "Belajar CSS", "Belajar JS"]), 200);
  });
}

loginSiswa("budi@provoks.id")
  .then((user) => {
    console.log("Login berhasil:", user.email);
    return ambilKursusSaya(user.id);
  })
  .then((daftarKursus) => {
    console.log("Kursus ditemukan:", daftarKursus.length);
    console.log("Membuka kursus pertama:", daftarKursus[0]);
  })
  .catch((err) => {
    console.error("Terjadi kendala:", err.message);
  });
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah argumen loginSiswa menjadi string tanpa '@' dan perhatikan bagaimana lompatan langsung menuju blok .catch().",
          ),
          divider(),
        ],
      },
      {
        title: "async / await & try/catch",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menulis kode asynchronous berbasis Promise menggunakan sintaks <code>async</code> dan <code>await</code> agar terbaca seperti kode synchronous biasa, lengkap dengan penanganan error <code>try / catch / finally</code>.</p>",
          ),
          h("1. Fungsi async dan Kata Kunci await"),
          p(
            "<p>Tambahkan kata <code>async</code> di depan deklarasi fungsi, lalu gunakan <code>await</code> di depan pemanggilan fungsi yang mengembalikan Promise. Baris di bawahnya akan menunggu hingga Promise tersebut selesai.</p>",
          ),
          jsCode(`
function tungguSebentar(pesan, ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(pesan), ms);
  });
}

async function jalankanAlur() {
  console.log("Mulai...");
  const langkah1 = await tungguSebentar("1. Materi dimuat", 300);
  console.log(langkah1);

  const langkah2 = await tungguSebentar("2. Kuis disiapkan", 300);
  console.log(langkah2);
  console.log("Selesai!");
}

jalankanAlur();
`),
          h("2. Menangani Error dengan try / catch / finally"),
          p(
            "<p>Pada <code>async/await</code>, kita menggunakan blok <code>try { ... } catch (error) { ... }</code> sebagai pengganti <code>.then().catch()</code>.</p>",
          ),
          jsCode(`
function kirimJawabanKuis(semuaTerisi) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!semuaTerisi) {
        reject(new Error("Masih ada soal yang belum dijawab!"));
      } else {
        resolve({ skor: 90, lulus: true });
      }
    }, 300);
  });
}

async function prosesSubmit(semuaTerisi) {
  let sedangMengirim = true;
  try {
    const hasil = await kirimJawabanKuis(semuaTerisi);
    console.log("Berhasil! Skor kamu:", hasil.skor);
  } catch (error) {
    console.error("Peringatan:", error.message);
  } finally {
    sedangMengirim = false;
    console.log("Status loading:", sedangMengirim);
  }
}

prosesSubmit(false);
`),
          h("3. Nilai Kembalian Fungsi async Selalu Berupa Promise"),
          p(
            "<p>Setiap fungsi yang diberi label <code>async</code> otomatis membungkus nilai <code>return</code>-nya di dalam Promise.</p>",
          ),
          jsCode(`
async function ambilVersiApp() {
  return "Provoks LMS v2.0";
}

ambilVersiApp().then((versi) => console.log(versi));
`),
          callout(
            "warning",
            "Jangan lupa menulis kata await di depan fungsi async. Tanpa await, variabelmu hanya berisi Promise { <pending> }, bukan data hasilnya.",
          ),
          h("Studi Kasus: Alur Penukaran Kode Akses Path Belajar"),
          p(
            "<p><strong>Skenario:</strong> Siswa memasukkan kode akses path. Sistem memvalidasi format kode, mengeceknya ke server simulasi, lalu mendaftarkan siswa ke seluruh kursus di dalam path tersebut.</p>",
          ),
          jsCode(`
function cekKodeServer(kode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (kode === "WEBDEV-OK") {
        resolve({ id: "path-1", nama: "Web Development", jumlahKursus: 3 });
      } else {
        reject(new Error("Kode akses tidak valid atau sudah kedaluwarsa."));
      }
    }, 300);
  });
}

async function gabungPathDenganKode(inputKode) {
  const kodeBersih = inputKode.trim().toUpperCase();
  if (!kodeBersih) {
    console.error("Kode akses wajib diisi.");
    return;
  }

  try {
    console.log("Memeriksa kode " + kodeBersih + "...");
    const path = await cekKodeServer(kodeBersih);
    console.log(\`✅ Berhasil bergabung ke path \${path.nama} (\${path.jumlahKursus} kursus terbuka)\`);
  } catch (error) {
    console.error("❌ Gagal bergabung:", error.message);
  }
}

gabungPathDenganKode("webdev-ok");
`),
          callout(
            "success",
            "Tantangan Mandiri: Panggil gabungPathDenganKode('SALAH-123') untuk menguji apakah blok catch menangkap pesan error dengan benar.",
          ),
          divider(),
        ],
      },
      {
        title: "Promise.all & Promise.race",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menjalankan beberapa operasi asynchronous secara paralel menggunakan <code>Promise.all</code>, <code>Promise.allSettled</code>, dan <code>Promise.race</code> agar halaman dimuat jauh lebih cepat.</p>",
          ),
          h("1. Berurutan (Lambat) vs Paralel dengan Promise.all (Cepat)"),
          p(
            "<p>Jika dua request tidak saling bergantung, jangan ditunggu satu per satu. Gunakan <code>Promise.all([p1, p2])</code> agar keduanya jalan bersamaan.</p>",
          ),
          jsCode(`
const ambilProfil = () =>
  new Promise((r) => setTimeout(() => r({ nama: "Budi" }), 300));
const ambilStatistik = () =>
  new Promise((r) => setTimeout(() => r({ kursusSelesai: 3 }), 300));

async function muatDashboard() {
  // Jalan paralel: total waktu ~300ms (bukan 600ms!)
  const [profil, statistik] = await Promise.all([
    ambilProfil(),
    ambilStatistik(),
  ]);

  console.log("Profil   :", profil);
  console.log("Statistik:", statistik);
}

muatDashboard();
`),
          h("2. Promise.allSettled — Tetap Aman Walau Sebagian Gagal"),
          p(
            "<p><code>Promise.all</code> langsung gagal seluruhnya jika salah satu promise gagal. Jika ingin tetap menampilkan data yang berhasil walau widget lain gagal, gunakan <code>Promise.allSettled</code>.</p>",
          ),
          jsCode(`
async function muatWidget() {
  const hasil = await Promise.allSettled([
    Promise.resolve("Daftar kursus berhasil dimuat"),
    Promise.reject(new Error("Server pengumuman sedang sibuk")),
  ]);

  for (const item of hasil) {
    if (item.status === "fulfilled") {
      console.log("SUKSES:", item.value);
    } else {
      console.warn("GAGAL :", item.reason.message);
    }
  }
}

muatWidget();
`),
          h("3. Promise.race — Membatasi Waktu Tunggu (Timeout)"),
          p(
            "<p><code>Promise.race</code> mengambil hasil dari promise mana pun yang selesai paling cepat. Ini sering dipakai untuk membatalkan request yang terlalu lama.</p>",
          ),
          jsCode(`
function batasWaktu(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request melewati batas waktu!")), ms),
  );
}

function requestCepat() {
  return new Promise((resolve) => setTimeout(() => resolve("Data tiba!"), 200));
}

Promise.race([requestCepat(), batasWaktu(1000)])
  .then((data) => console.log(data))
  .catch((err) => console.error(err.message));
`),
          callout(
            "info",
            "Gunakan Promise.all ketika semua data wajib ada, dan pilih Promise.allSettled ketika masing-masing bagian halaman bersifat independen.",
          ),
          h("Studi Kasus: Memuat Halaman Beranda Siswa secara Paralel"),
          p(
            "<p><strong>Skenario:</strong> Halaman <em>My Learning</em> membutuhkan 3 data sekaligus: profil siswa, daftar path, dan daftar kursus yang diikuti.</p>",
          ),
          jsCode(`
const fetchUser = () => Promise.resolve({ nama: "Budi", role: "STUDENT" });
const fetchPaths = () => Promise.resolve(["Web Development"]);
const fetchCourses = () =>
  Promise.resolve([
    { judul: "Belajar HTML", progres: 100 },
    { judul: "Belajar CSS & Tailwind", progres: 60 },
  ]);

async function inisialisasiMyLearning() {
  try {
    const [user, paths, courses] = await Promise.all([
      fetchUser(),
      fetchPaths(),
      fetchCourses(),
    ]);

    console.log(\`Selamat datang, \${user.nama}!\`);
    console.log("Path diikuti :", paths.join(", "));
    console.log("Jumlah kursus:", courses.length);
  } catch (error) {
    console.error("Gagal memuat halaman:", error.message);
  }
}

inisialisasiMyLearning();
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah inisialisasiMyLearning agar memakai Promise.allSettled sehingga jika fetchPaths gagal, daftar kursus tetap tampil.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Asynchronous",
        duration: 12,
        type: "QUIZ",
        blocks: [
          h("Kuis Asynchronous JavaScript"),
          p("<p>Uji pemahaman callback, promise, dan async/await.</p>"),
          quiz("Kuis Asynchronous JavaScript", [
            {
              q: "Output dari kode dengan setTimeout(…, 0) di antara dua console.log adalah...",
              options: [
                "Sesuai urutan tertulis",
                "Kode setelah setTimeout tampil lebih dulu",
                "Semua jadi error",
                "Hanya console pertama tampil",
              ],
              answer: 1,
            },
            {
              q: "Status Promise saat masih menunggu adalah...",
              options: ["pending", "fulfilled", "rejected", "done"],
              answer: 0,
            },
            {
              q: "Method untuk menangani Promise yang gagal adalah...",
              options: ["then", "catch", "finally", "await"],
              answer: 1,
            },
            {
              q: "Kata kunci untuk menunggu Promise selesai adalah...",
              options: ["wait", "await", "yield", "sleep"],
              answer: 1,
            },
            {
              q: "Untuk menunggu semua Promise sekaligus dipakai...",
              options: [
                "Promise.race",
                "Promise.all",
                "Promise.any",
                "Promise.resolve",
              ],
              answer: 1,
            },
            {
              q: "Blok untuk menangani error pada async/await adalah...",
              options: ["if/else", "try/catch", "switch", "finally saja"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 8 — LATIHAN API EKSTERNAL
  // ==========================================================
  {
    name: "Latihan API Eksternal",
    description:
      "Mengambil data dari API nyata dengan fetch, menampilkan ke halaman, dan menangani error.",
    lessons: [
      {
        title: "API & REST",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami cara kerja REST API, struktur URL endpoint &amp; query parameter, HTTP method, serta arti kode status HTTP.</p>",
          ),
          h("1. Anatomi Endpoint REST & Query Parameter"),
          p(
            "<p>Sebuah endpoint API terdiri dari alamat dasar (<em>base URL</em>), path resource, dan opsional <em>query parameter</em> setelah tanda tanya <code>?</code> untuk menyaring atau membatasi hasil.</p>",
          ),
          jsCode(`
// Mengambil semua post
"https://jsonplaceholder.typicode.com/posts"

// Mengambil 1 post dengan ID 5
"https://jsonplaceholder.typicode.com/posts/5"

// Menyaring dengan query parameter: hanya milik userId=1 dan dibatasi 3 data
"https://jsonplaceholder.typicode.com/posts?userId=1&_limit=3"
`),
          h("2. Empat Method Utama pada REST API"),
          p(
            "<ul><li><code>GET</code>: mengambil data (tidak mengubah server).</li><li><code>POST</code>: mengirim/membuat data baru.</li><li><code>PUT</code> / <code>PATCH</code>: memperbarui data yang sudah ada.</li><li><code>DELETE</code>: menghapus data.</li></ul>",
          ),
          jsCode(`
const daftarEndpoint = [
  { method: "GET", url: "/api/v1/courses", keterangan: "Ambil daftar kursus" },
  { method: "POST", url: "/api/v1/courses", keterangan: "Buat kursus baru" },
  { method: "PUT", url: "/api/v1/courses/12", keterangan: "Perbarui kursus 12" },
  { method: "DELETE", url: "/api/v1/courses/12", keterangan: "Hapus kursus 12" },
];
console.table(daftarEndpoint);
`),
          h("3. Membaca HTTP Status Code"),
          p(
            "<p>Server selalu membalas dengan kode angka 3 digit yang memberi tahu nasib request kita:</p>",
          ),
          jsCode(`
function artiStatusHttp(status) {
  if (status === 200) return "200 OK — Permintaan berhasil";
  if (status === 201) return "201 Created — Data baru berhasil dibuat";
  if (status === 400) return "400 Bad Request — Data yang dikirim tidak valid";
  if (status === 401) return "401 Unauthorized — Belum login";
  if (status === 403) return "403 Forbidden — Tidak punya hak akses";
  if (status === 404) return "404 Not Found — Data/endpoint tidak ditemukan";
  if (status >= 500) return "5xx Server Error — Kendala di sisi server";
  return "Status lainnya: " + status;
}

console.log(artiStatusHttp(200));
console.log(artiStatusHttp(404));
`),
          callout(
            "info",
            "Di tab Network pada DevTools browser (F12), kamu bisa melihat seluruh request API lengkap dengan method, status code, header, dan isi respons JSON-nya.",
          ),
          h("Studi Kasus: Penyusun URL Endpoint dengan URLSearchParams"),
          p(
            "<p><strong>Skenario:</strong> Daripada merangkai query parameter secara manual yang rawan salah karakter spasi, kita gunakan <code>URLSearchParams</code> bawaan JavaScript.</p>",
          ),
          jsCode(`
function bangunUrlPencarian(kataKunci, halaman = 1, batas = 10) {
  const base = "https://jsonplaceholder.typicode.com/posts";
  const params = new URLSearchParams({
    q: kataKunci.trim(),
    _page: String(halaman),
    _limit: String(batas),
  });

  return \`\${base}?\${params.toString()}\`;
}

console.log(bangunUrlPencarian("belajar javascript", 2, 5));
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan parameter opsional userId ke dalam bangunUrlPencarian jika nilainya diberikan.",
          ),
          divider(),
        ],
      },
      {
        title: "fetch GET + Render ke Halaman",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengambil data JSON dari API publik menggunakan <code>fetch()</code>, memeriksa <code>response.ok</code>, serta merender hasilnya ke dalam elemen DOM.</p>",
          ),
          h("1. Dua Tahap await pada fetch()"),
          p(
            "<p>Memanggil <code>fetch(url)</code> membutuhkan dua kali <code>await</code>: pertama menunggu header respons tiba, kedua membaca isi body sebagai JSON dengan <code>await response.json()</code>.</p>",
          ),
          jsCode(`
async function ambilSatuPost() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts/1",
  );
  const post = await response.json();

  console.log("Judul:", post.title);
  console.log("Isi  :", post.body);
}

ambilSatuPost();
`),
          h("2. Memeriksa response.ok Sebelum Membaca JSON"),
          p(
            "<p>Penting: <code>fetch</code> tidak otomatis masuk ke <code>catch</code> saat server membalas 404 atau 500. Kita wajib mengecek <code>if (!response.ok)</code>.</p>",
          ),
          jsCode(`
async function ambilDataAman(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(\`Gagal mengambil data (HTTP \${response.status})\`);
  }

  return await response.json();
}
`),
          h("3. Menampilkan Daftar Data API ke dalam DOM"),
          p(
            "<p>Setelah array objek diterima dari API, kita bersihkan container lalu buat elemen HTML untuk setiap item.</p>",
          ),
          htmlCode(`
<ul id="daftar-artikel"></ul>

<script>
  async function muatArtikel() {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=5",
    );
    if (!response.ok) throw new Error("HTTP " + response.status);

    const daftar = await response.json();
    const ul = document.querySelector("#daftar-artikel");
    ul.replaceChildren();

    for (const item of daftar) {
      const li = document.createElement("li");
      li.textContent = \`#\${item.id} — \${item.title}\`;
      ul.appendChild(li);
    }
  }

  muatArtikel();
</script>
`),
          callout(
            "info",
            "JSONPlaceholder (jsonplaceholder.typicode.com) menyediakan endpoint gratis /posts, /users, /todos, dan /comments yang bisa langsung kamu panggil dari browser.",
          ),
          h("Studi Kasus: Kartu Direktori Kontak dari Endpoint /users"),
          p(
            "<p><strong>Skenario:</strong> Kita mengambil 4 pengguna dari API, lalu menampilkan nama, email, dan nama perusahaannya di dalam kartu.</p>",
          ),
          htmlCode(`
<section id="grid-kontak"></section>

<script>
  async function tampilkanKontak() {
    const grid = document.querySelector("#grid-kontak");
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users?_limit=4",
    );
    if (!response.ok) return;

    const users = await response.json();
    grid.replaceChildren();

    for (const user of users) {
      const card = document.createElement("article");
      card.className = "kartu-kontak";

      const nama = document.createElement("h3");
      nama.textContent = user.name;

      const info = document.createElement("p");
      info.textContent = \`\${user.email} • \${user.company.name}\`;

      card.append(nama, info);
      grid.appendChild(card);
    }
  }

  tampilkanKontak();
</script>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan elemen paragraf kedua di dalam tiap kartu yang menampilkan kota alamat pengguna (user.address.city).",
          ),
          divider(),
        ],
      },
      {
        title: "Loading & Error Handling",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membangun pengalaman pengguna yang baik saat mengambil data API: menampilkan indikator <em>loading</em>, pesan error yang ramah, state kosong, serta tombol <em>Coba Lagi</em>.</p>",
          ),
          h("1. Tiga State Wajib: Loading, Error, dan Success"),
          p(
            "<p>Koneksi internet pengguna tidak selalu cepat atau stabil. Jangan biarkan layar kosong melompong saat data sedang diambil.</p>",
          ),
          htmlCode(`
<p id="status-muat" hidden>⏳ Sedang memuat data...</p>
<p id="pesan-galat" hidden></p>
<ul id="daftar-data"></ul>
`),
          h("2. Mengatur State di dalam try / catch / finally"),
          p(
            "<p>Nyalakan indikator loading sebelum <code>fetch</code>, sembunyikan pesan error lama, dan matikan indikator loading di dalam blok <code>finally</code>.</p>",
          ),
          jsCode(`
async function ambilDenganStatus() {
  const statusEl = document.querySelector("#status-muat");
  const galatEl = document.querySelector("#pesan-galat");
  const daftarEl = document.querySelector("#daftar-data");

  statusEl.hidden = false;
  galatEl.hidden = true;

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    if (!res.ok) throw new Error("Server mengembalikan status " + res.status);

    const todos = await res.json();
    daftarEl.replaceChildren();

    for (const todo of todos) {
      const li = document.createElement("li");
      li.textContent = (todo.completed ? "✅ " : "⬜ ") + todo.title;
      daftarEl.appendChild(li);
    }
  } catch (err) {
    galatEl.textContent = "Gagal memuat tugas: " + err.message;
    galatEl.hidden = false;
  } finally {
    statusEl.hidden = true;
  }
}
`),
          h("3. Menangani Hasil Pencarian yang Kosong (Empty State)"),
          p(
            "<p>Request yang sukses (HTTP 200) bisa saja mengembalikan array kosong <code>[]</code>. Berikan keterangan jelas agar pengguna tahu pencariannya tidak menemukan hasil.</p>",
          ),
          jsCode(`
function renderHasil(daftar, container) {
  container.replaceChildren();

  if (daftar.length === 0) {
    const kosong = document.createElement("p");
    kosong.textContent = "Tidak ada data yang cocok dengan pencarianmu.";
    container.appendChild(kosong);
    return;
  }

  for (const item of daftar) {
    const el = document.createElement("div");
    el.textContent = item.title;
    container.appendChild(el);
  }
}
`),
          callout(
            "warning",
            "Saat proses fetch sedang berlangsung, nonaktifkan tombol Muat/Cari (button.disabled = true) agar pengguna tidak mengirim request berulang-ulang.",
          ),
          h("Studi Kasus: Pencarian Tugas Berdasarkan User ID dengan Tombol Coba Lagi"),
          p(
            "<p><strong>Skenario:</strong> Pengguna memilih nomor User ID untuk memuat daftar tugasnya, lengkap dengan tombol <em>Muat Ulang</em> jika koneksi sempat terputus.</p>",
          ),
          htmlCode(`
<div>
  <button id="btn-muat">Muat Tugas User #1</button>
  <p id="info-status"></p>
  <ul id="list-tugas"></ul>
</div>

<script>
  const btnMuat = document.querySelector("#btn-muat");
  const infoStatus = document.querySelector("#info-status");
  const listTugas = document.querySelector("#list-tugas");

  async function muatTugas() {
    btnMuat.disabled = true;
    infoStatus.textContent = "Memuat daftar tugas...";
    listTugas.replaceChildren();

    try {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/todos?userId=1&_limit=6",
      );
      if (!res.ok) throw new Error("HTTP " + res.status);

      const data = await res.json();
      infoStatus.textContent = \`Menampilkan \${data.length} tugas:\`;

      for (const item of data) {
        const li = document.createElement("li");
        li.textContent = \`\${item.completed ? "[Selesai]" : "[Belum]"} \${item.title}\`;
        listTugas.appendChild(li);
      }
    } catch (error) {
      infoStatus.textContent = "Gagal memuat (" + error.message + "). Klik tombol untuk coba lagi.";
    } finally {
      btnMuat.disabled = false;
    }
  }

  btnMuat.addEventListener("click", muatTugas);
</script>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan elemen <select> berisi pilihan User 1 sampai 5 agar pengguna bisa mengganti userId yang dimuat.",
          ),
          divider(),
        ],
      },
      {
        title: "POST, PUT & DELETE",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengirim data ke server menggunakan method <code>POST</code>, memperbarui data dengan <code>PUT</code>/<code>PATCH</code>, serta menghapus data dengan <code>DELETE</code> lengkap dengan header <code>Content-Type</code>.</p>",
          ),
          h("1. Mengirim Data Baru dengan POST"),
          p(
            "<p>Untuk mengirim objek JSON ke server, sertakan objek konfigurasi pada argumen kedua <code>fetch</code> yang berisi <code>method: \"POST\"</code>, header <code>Content-Type: application/json</code>, dan <code>body: JSON.stringify(data)</code>.</p>",
          ),
          jsCode(`
async function tambahArtikelBaru(judul, isi) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: judul,
      body: isi,
      userId: 1,
    }),
  });

  if (!response.ok) throw new Error("Gagal membuat artikel");
  const hasil = await response.json();
  console.log("Artikel berhasil dibuat dengan ID:", hasil.id);
  return hasil;
}

tambahArtikelBaru("Belajar Fetch POST", "Mengirim JSON ke server itu mudah.");
`),
          h("2. Memperbarui Data dengan PUT dan PATCH"),
          p(
            "<p><code>PUT</code> mengganti seluruh isi resource, sedangkan <code>PATCH</code> hanya memperbarui sebagian field yang dikirim.</p>",
          ),
          jsCode(`
async function ubahJudulArtikel(idArtikel, judulBaru) {
  const response = await fetch(
    \`https://jsonplaceholder.typicode.com/posts/\${idArtikel}\`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: judulBaru }),
    },
  );

  if (!response.ok) throw new Error("Gagal memperbarui artikel");
  const diperbarui = await response.json();
  console.log("Judul setelah PATCH:", diperbarui.title);
}

ubahJudulArtikel(1, "Judul Artikel yang Sudah Diperbarui");
`),
          h("3. Menghapus Data dengan DELETE"),
          p(
            "<p>Request <code>DELETE</code> biasanya tidak memerlukan <code>body</code>, cukup arahkan ke URL yang memuat ID item yang ingin dihapus.</p>",
          ),
          jsCode(`
async function hapusArtikel(idArtikel) {
  const response = await fetch(
    \`https://jsonplaceholder.typicode.com/posts/\${idArtikel}\`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) throw new Error("Gagal menghapus artikel");
  console.log(\`Artikel #\${idArtikel} berhasil dihapus (status \${response.status})\`);
}

hapusArtikel(1);
`),
          callout(
            "info",
            "Jika API membutuhkan autentikasi cookie (seperti backend Provoks LMS), tambahkan opsi credentials: 'include' di dalam konfigurasi fetch.",
          ),
          h("Studi Kasus: Form Kirim Komentar & Hapus Komentar"),
          p(
            "<p><strong>Skenario:</strong> Pengguna mengetik komentar di form, mengirimkannya ke endpoint <code>/comments</code> dengan <code>POST</code>, lalu menampilkannya ke halaman lengkap dengan tombol hapus.</p>",
          ),
          htmlCode(`
<form id="form-komentar">
  <input id="isi-komentar" placeholder="Tulis komentar..." required />
  <button type="submit">Kirim</button>
</form>
<ul id="daftar-komentar"></ul>

<script>
  const form = document.querySelector("#form-komentar");
  const input = document.querySelector("#isi-komentar");
  const daftar = document.querySelector("#daftar-komentar");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const isi = input.value.trim();
    if (!isi) return;

    const res = await fetch("https://jsonplaceholder.typicode.com/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: isi, postId: 1 }),
    });

    if (!res.ok) return;
    const komentarBaru = await res.json();

    const li = document.createElement("li");
    li.textContent = komentarBaru.body + " ";

    const btnHapus = document.createElement("button");
    btnHapus.textContent = "Hapus";
    btnHapus.addEventListener("click", async () => {
      await fetch(
        \`https://jsonplaceholder.typicode.com/comments/\${komentarBaru.id}\`,
        { method: "DELETE" },
      );
      li.remove();
    });

    li.appendChild(btnHapus);
    daftar.prepend(li);
    input.value = "";
  });
</script>
`),
          callout(
            "success",
            "Tantangan Mandiri: Nonaktifkan tombol Kirim dan ubah teksnya menjadi 'Mengirim...' selama proses POST berlangsung.",
          ),
          divider(),
        ],
      },
      {
        title: "Mini Project — Daftar Pengguna",
        duration: 28,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Menggabungkan seluruh materi JavaScript (variabel, array method <code>filter</code>, manipulasi DOM, event listener, dan <code>async/await fetch</code>) menjadi aplikasi Direktori Pengguna dengan fitur pencarian langsung.</p>",
          ),
          h("1. Arsitektur Mini Project"),
          p(
            "<p>Agar pencarian berjalan instan tanpa memanggil API berulang kali setiap ketikan, kita simpan data hasil <code>fetch</code> pertama ke dalam variabel array <code>semuaPengguna</code>, lalu saring dengan <code>.filter()</code> saat pengguna mengetik.</p>",
          ),
          jsCode(`
let semuaPengguna = [];

function saringPengguna(kataKunci) {
  const q = kataKunci.trim().toLowerCase();
  if (!q) return semuaPengguna;

  return semuaPengguna.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.company.name.toLowerCase().includes(q),
  );
}
`),
          h("2. Kode Lengkap (HTML + Tailwind CDN + Fetch + Pencarian)"),
          p(
            "<p>Salin kode lengkap di bawah ini ke dalam file <code>direktori.html</code> lalu buka di browser untuk mencobanya langsung:</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Direktori Pengguna — Mini Project JS</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-50 p-6">
  <main class="mx-auto max-w-5xl">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Direktori Pengguna</h1>
        <p id="status" class="text-sm text-gray-500">Memuat data dari API...</p>
      </div>
      <input
        id="input-cari"
        type="search"
        placeholder="Cari nama, email, atau perusahaan..."
        class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm sm:w-80"
      />
    </header>

    <div id="daftar" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
  </main>

  <script>
    const statusEl = document.querySelector("#status");
    const daftarEl = document.querySelector("#daftar");
    const inputCari = document.querySelector("#input-cari");
    let semuaPengguna = [];

    function renderDaftar(items) {
      daftarEl.replaceChildren();

      if (items.length === 0) {
        const kosong = document.createElement("p");
        kosong.className = "col-span-full py-12 text-center text-sm text-gray-500";
        kosong.textContent = "Tidak ada pengguna yang cocok dengan pencarian.";
        daftarEl.appendChild(kosong);
        return;
      }

      for (const user of items) {
        const kartu = document.createElement("article");
        kartu.className = "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm";

        const nama = document.createElement("h2");
        nama.className = "font-semibold text-gray-900";
        nama.textContent = user.name;

        const email = document.createElement("p");
        email.className = "mt-1 text-sm text-orange-600";
        email.textContent = user.email;

        const kantor = document.createElement("p");
        kantor.className = "mt-2 text-xs text-gray-500";
        kantor.textContent = \`\${user.company.name} • \${user.address.city}\`;

        kartu.append(nama, email, kantor);
        daftarEl.appendChild(kartu);
      }
    }

    async function muatPengguna() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error("HTTP " + response.status);

        semuaPengguna = await response.json();
        statusEl.textContent = \`Menampilkan \${semuaPengguna.length} pengguna\`;
        renderDaftar(semuaPengguna);
      } catch (error) {
        statusEl.textContent = "Gagal memuat data: " + error.message;
      }
    }

    inputCari.addEventListener("input", () => {
      const q = inputCari.value.trim().toLowerCase();
      const hasil = semuaPengguna.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.company.name.toLowerCase().includes(q),
      );
      statusEl.textContent = \`Menampilkan \${hasil.length} dari \${semuaPengguna.length} pengguna\`;
      renderDaftar(hasil);
    });

    muatPengguna();
  </script>
</body>
</html>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan tombol 'Urutkan A-Z' yang mengurutkan semuaPengguna berdasarkan nama sebelum memanggil renderDaftar.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Akhir JavaScript",
        duration: 15,
        type: "QUIZ",
        blocks: [
          h("Ujian Akhir JavaScript"),
          p("<p>Kuis campuran dari seluruh materi JavaScript.</p>"),
          quiz("Ujian Akhir JavaScript", [
            {
              q: "Keyword untuk variabel yang tidak bisa diganti adalah...",
              options: ["let", "const", "var", "static"],
              answer: 1,
            },
            {
              q: "`typeof 42` menghasilkan...",
              options: ['"int"', '"number"', '"integer"', '"digit"'],
              answer: 1,
            },
            {
              q: "Operator perbandingan yang mengecek tipe adalah...",
              options: ["==", "===", "=", "!="],
              answer: 1,
            },
            {
              q: "Method array untuk mengubah tiap item adalah...",
              options: ["filter", "map", "find", "reduce"],
              answer: 1,
            },
            {
              q: "Untuk memilih elemen pertama sesuai selector CSS dipakai...",
              options: [
                "getElementById",
                "querySelector",
                "querySelectorAll",
                "createElement",
              ],
              answer: 1,
            },
            {
              q: "Mencegah reload pada submit form memakai...",
              options: [
                "preventDefault()",
                "stopPropagation()",
                "return null",
                "reset()",
              ],
              answer: 0,
            },
            {
              q: "Status Promise saat berhasil adalah...",
              options: ["pending", "fulfilled", "rejected", "settled"],
              answer: 1,
            },
            {
              q: "Untuk menunggu hasil Promise di fungsi async dipakai...",
              options: ["then", "await", "wait", "yield"],
              answer: 1,
            },
            {
              q: "Cek response HTTP yang berhasil dilakukan dengan...",
              options: [
                "response.ok",
                "response.success",
                "response.status === 100",
                "response.error",
              ],
              answer: 0,
            },
            {
              q: "REST method untuk mengambil data adalah...",
              options: ["POST", "GET", "PUT", "DELETE"],
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
            "<ul><li>Fondasi JavaScript: variabel (<code>const</code>/<code>let</code>), tipe data, operator ketat (<code>===</code>), string &amp; template literal, serta konversi tipe.</li><li>Kontrol alur: percabangan <code>if/else if/else</code>, <code>switch</code>, serta perulangan <code>for</code>, <code>while</code>, dan <code>for...of</code>.</li><li>Fungsi modular, arrow function, rest/spread, scope, dan closure.</li><li>Pengolahan data dengan <code>map</code>, <code>filter</code>, <code>find</code>, <code>reduce</code>, destructuring, dan JSON.</li><li>Manipulasi DOM, penanganan event form, hingga pengambilan data asynchronous dari REST API menggunakan <code>async/await</code> dan <code>fetch</code>.</li></ul>",
          ),
          h("Contoh Rangkaian Skill Lengkap yang Sudah Kamu Kuasai"),
          jsCode(`
// Mengambil data -> menyaring -> memformat -> siap dirender ke DOM
async function ambilRingkasanPostPopuler() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");
  if (!res.ok) throw new Error("Gagal memuat post");

  const posts = await res.json();
  return posts
    .filter((p) => p.title.length > 20)
    .map(({ id, title }) => \`#\${id}: \${title.toUpperCase()}\`);
}
`),
          h("Langkah Selanjutnya"),
          p(
            "<ol><li><strong>TypeScript</strong> — menambahkan pemeriksaan tipe statis di atas JavaScript agar bug tertangkap sebelum kode dijalankan.</li><li><strong>React &amp; Next.js</strong> — membangun antarmuka berbasis komponen yang reaktif.</li><li><strong>Node.js &amp; Backend</strong> — membuat REST API sendiri dan menghubungkannya ke database.</li></ol>",
          ),
          callout(
            "success",
            "Selamat! Kamu sudah menyelesaikan seluruh rangkaian materi HTML, CSS & Tailwind, hingga JavaScript Asynchronous.",
          ),
          divider(),
        ],
      },
    ],
  },
];
