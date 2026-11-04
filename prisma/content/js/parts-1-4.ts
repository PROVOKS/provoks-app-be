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

export const JS_PARTS_1_4: CoursePartDef[] = [
  // ==========================================================
  // PART 1 — PENGENALAN JAVASCRIPT
  // ==========================================================
  {
    name: "Pengenalan JavaScript",
    description:
      "Memahami peran JavaScript dan cara menjalankannya di browser maupun Node.js.",
    lessons: [
      {
        title: "Apa Itu JavaScript & Perannya",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Setelah mempelajari materi ini, kamu mampu membedakan peran HTML, CSS, dan JavaScript, serta memahami bagaimana JavaScript membuat halaman web menjadi hidup dan interaktif.</p>",
          ),
          h("1. Pembagian Peran: HTML vs CSS vs JavaScript"),
          p(
            "<p>Bayangkan sebuah halaman web seperti toko fisik: <strong>HTML</strong> adalah bangunan dan rak-raknya, <strong>CSS</strong> adalah cat dinding, pencahayaan, dan dekorasinya, sedangkan <strong>JavaScript</strong> adalah kasir otomatis, pintu sensor, serta layar antrean yang merespons pengunjung.</p><p>Tanpa JavaScript, halaman web bersifat statis — tampilannya tidak berubah kecuali pengguna berpindah halaman.</p>",
          ),
          htmlCode(`
<!-- Hanya HTML & CSS: tombol ini tidak melakukan apa-apa saat diklik -->
<div class="kartu">
  <p>Jumlah suka: <span>0</span></p>
  <button>Suka</button>
</div>
`),
          h("2. Mengubah Teks Secara Dinamis"),
          p(
            "<p>Hal paling dasar yang bisa dilakukan JavaScript adalah membaca elemen HTML lalu mengubah isinya ketika pengguna melakukan aksi seperti klik.</p>",
          ),
          htmlCode(`
<h2 id="sapaan">Halo, Pengunjung!</h2>
<button id="btn-sapa">Ubah Sapaan</button>

<script>
  const teksSapaan = document.getElementById("sapaan");
  const tombolSapa = document.getElementById("btn-sapa");

  tombolSapa.addEventListener("click", () => {
    teksSapaan.textContent = "Selamat datang di kelas JavaScript!";
  });
</script>
`),
          p(
            "<p>Baris <code>document.getElementById</code> mencari elemen berdasarkan <code>id</code>, lalu <code>addEventListener(\"click\", ...)</code> menjalankan fungsi setiap kali tombol diklik.</p>",
          ),
          h("3. Mengubah Tampilan (Style & Class) Saat Interaksi"),
          p(
            "<p>Selain mengubah teks, JavaScript juga bisa menyembunyikan elemen, mengganti warna, atau mengaktifkan mode gelap secara langsung.</p>",
          ),
          htmlCode(`
<div id="kotak" style="padding: 16px; border: 1px solid #ccc;">
  Kotak pengumuman penting
</div>
<button id="btn-sorot">Sorot Pengumuman</button>

<script>
  const kotak = document.getElementById("kotak");
  const btnSorot = document.getElementById("btn-sorot");

  btnSorot.addEventListener("click", () => {
    kotak.style.backgroundColor = "#fff7ed";
    kotak.style.borderColor = "#ea580c";
    kotak.style.fontWeight = "bold";
  });
</script>
`),
          callout(
            "info",
            "JavaScript tidak hanya berjalan di browser. Dengan Node.js, bahasa yang sama juga dipakai untuk membuat server backend, bot, hingga alat baris perintah.",
          ),
          h("Studi Kasus: Tombol Suka (Like Counter)"),
          p(
            "<p><strong>Skenario:</strong> Kita ingin membuat kartu postingan yang menampilkan jumlah suka. Setiap kali pengguna menekan tombol <em>Suka</em>, angkanya bertambah 1 dan label tombol berubah.</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Studi Kasus Like Counter</title>
</head>
<body>
  <article>
    <h3>Belajar JavaScript Hari Pertama</h3>
    <p>Disukai oleh <strong id="jumlah-suka">0</strong> orang</p>
    <button id="tombol-suka">👍 Suka</button>
  </article>

  <script>
    let totalSuka = 0;
    const elemenJumlah = document.getElementById("jumlah-suka");
    const tombolSuka = document.getElementById("tombol-suka");

    tombolSuka.addEventListener("click", () => {
      totalSuka = totalSuka + 1;
      elemenJumlah.textContent = totalSuka;
      tombolSuka.textContent = "❤️ Disukai (" + totalSuka + ")";
    });
  </script>
</body>
</html>
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan satu tombol 'Reset' di sebelah tombol Suka yang mengembalikan angka ke 0 dan teks tombol ke semula.",
          ),
          divider(),
        ],
      },
      {
        title: "Cara Menjalankan JavaScript",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengetahui empat cara menjalankan kode JavaScript: lewat Console browser, tag <code>&lt;script&gt;</code> internal, file <code>.js</code> eksternal, serta menggunakan atribut <code>defer</code>.</p>",
          ),
          h("1. Langsung di Console Browser"),
          p(
            "<p>Untuk mencoba potongan kode singkat tanpa membuat file, buka browser, tekan <code>F12</code>, pilih tab <strong>Console</strong>, lalu ketik kode berikut dan tekan Enter:</p>",
          ),
          jsCode(`
console.log("Halo dari Console!");
console.log(25 * 4);
`),
          h("2. Tag <script> Internal di Dalam File HTML"),
          p(
            "<p>Kita bisa menulis kode JavaScript langsung di dalam elemen <code>&lt;script&gt;</code>, biasanya diletakkan tepat sebelum penutup <code>&lt;/body&gt;</code> agar seluruh elemen HTML sudah selesai dimuat.</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Internal Script</title>
</head>
<body>
  <h1 id="judul">Halaman Latihan</h1>

  <!-- Diletakkan di paling bawah body -->
  <script>
    const judul = document.getElementById("judul");
    console.log("Isi judul:", judul.textContent);
  </script>
</body>
</html>
`),
          h("3. File .js Eksternal"),
          p(
            "<p>Pada proyek nyata, kode JavaScript dipisahkan ke file sendiri (misalnya <code>app.js</code>) supaya rapi dan dapat dipakai di banyak halaman.</p>",
          ),
          htmlCode(`
<!-- index.html -->
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Eksternal Script</title>
  <script src="app.js" defer></script>
</head>
<body>
  <h1 id="pesan">Memuat...</h1>
</body>
</html>
`),
          jsCode(`
// app.js
const elemenPesan = document.getElementById("pesan");
elemenPesan.textContent = "Halo dari file app.js!";
`),
          h("4. Pentingnya Atribut defer"),
          p(
            "<p>Jika kita meletakkan <code>&lt;script src=\"app.js\"&gt;</code> di dalam <code>&lt;head&gt;</code> <strong>tanpa</strong> <code>defer</code>, script akan langsung dijalankan sebelum <code>&lt;body&gt;</code> dibaca sehingga <code>document.getElementById</code> menghasilkan <code>null</code>.</p>",
          ),
          htmlCode(`
<!-- SALAH: dijalankan sebelum body ada -> menghasilkan error null -->
<head>
  <script src="app.js"></script>
</head>

<!-- BENAR: diunduh paralel, dijalankan setelah HTML siap -->
<head>
  <script src="app.js" defer></script>
</head>
`),
          callout(
            "warning",
            "Jika muncul error 'Cannot set properties of null', penyebab paling sering adalah script dijalankan sebelum elemen HTML-nya selesai dibuat atau salah ketik id.",
          ),
          h("Studi Kasus: Menghubungkan Dua File Script"),
          p(
            "<p><strong>Skenario:</strong> Sebuah halaman memiliki file <code>konfigurasi.js</code> (menyimpan nama aplikasi) dan <code>utama.js</code> (menampilkan nama aplikasi ke layar).</p>",
          ),
          htmlCode(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Multi Script</title>
  <script src="konfigurasi.js" defer></script>
  <script src="utama.js" defer></script>
</head>
<body>
  <header>
    <h1 id="nama-aplikasi"></h1>
    <p id="versi-aplikasi"></p>
  </header>
</body>
</html>
`),
          jsCode(`
// konfigurasi.js
const NAMA_APP = "Provoks LMS";
const VERSI_APP = "Versi 2.0";

// utama.js (dijalankan setelah konfigurasi.js karena urutan defer dijaga)
document.getElementById("nama-aplikasi").textContent = NAMA_APP;
document.getElementById("versi-aplikasi").textContent = VERSI_APP;
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat folder latihan di komputermu berisi index.html dan script.js dengan atribut defer, lalu tampilkan namamu di dalam elemen <h1>.",
          ),
          divider(),
        ],
      },
      {
        title: "console.log, Komentar & Debugging",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menguasai berbagai metode <code>console</code> untuk memeriksa nilai, menulis komentar yang bersih, dan membaca pesan error di DevTools.</p>",
          ),
          h("1. Mencetak Banyak Nilai Sekaligus"),
          p(
            "<p><code>console.log()</code> bisa menerima banyak argumen yang dipisahkan koma. Ini memudahkan kita memberi label pada variabel yang sedang diperiksa.</p>",
          ),
          jsCode(`
const produk = "Keyboard Mekanik";
const harga = 450000;
const stokTersedia = true;

console.log("Produk:", produk);
console.log("Harga:", harga, "| Stok:", stokTersedia);
`),
          h("2. console.warn, console.error, dan console.table"),
          p(
            "<p>Saat aplikasi makin besar, gunakan variasi console agar pesan penting mudah dibedakan warnanya di DevTools.</p>",
          ),
          jsCode(`
console.warn("Stok barang tinggal sedikit!");
console.error("Gagal menghubungi server pembayaran.");

const daftarSiswa = [
  { nama: "Budi", nilai: 88 },
  { nama: "Siti", nilai: 92 },
  { nama: "Andi", nilai: 75 },
];
console.table(daftarSiswa);
`),
          h("3. Menulis Komentar yang Bermanfaat"),
          p(
            "<p>Komentar diabaikan oleh JavaScript saat dijalankan. Gunakan komentar untuk menjelaskan <em>alasan</em> sebuah logika ditulis, bukan mengulang kode yang sudah jelas.</p>",
          ),
          jsCode(`
// Komentar satu baris: diskon 10% khusus pembelian di atas Rp500.000
const BATAS_DISKON = 500000;

/*
  Komentar beberapa baris:
  Pajak dihitung setelah harga dikurangi diskon,
  sesuai aturan perpajakan yang berlaku.
*/
const TARIF_PAJAK = 0.11;
`),
          h("4. Membaca Pesan Error di Console"),
          p(
            "<p>Ketika kode berhenti bekerja, jangan menebak-nebak. Buka tab Console dan perhatikan jenis error serta nomor barisnya:</p>",
          ),
          jsCode(`
// 1. ReferenceError: variabel belum pernah dibuat / salah ketik
console.log(hargaBarang); // ReferenceError: hargaBarang is not defined

// 2. TypeError: mengubah nilai const atau memanggil sesuatu yang bukan fungsi
const pajak = 0.11;
pajak = 0.12; // TypeError: Assignment to constant variable
`),
          callout(
            "info",
            "Perhatikan angka di ujung kanan pesan error seperti (app.js:14:5) — artinya error terjadi di file app.js baris ke-14 kolom ke-5.",
          ),
          h("Studi Kasus: Melacak Bug Perhitungan Rata-Rata"),
          p(
            "<p><strong>Skenario:</strong> Seorang teman mengeluh hasil rata-rata tiga nilai ujiannya menjadi <code>808590 / 3</code> alias salah besar. Kita gunakan <code>console.log</code> untuk memeriksa setiap langkah.</p>",
          ),
          jsCode(`
// Data awal dari input form (masih berupa teks/string!)
const ujian1 = "80";
const ujian2 = "85";
const ujian3 = "90";

// Langkah debugging: cek nilai dan tipe sebelum dihitung
console.log("Nilai awal:", ujian1, ujian2, ujian3);
console.log("Tipe ujian1:", typeof ujian1);

const jumlahSalah = ujian1 + ujian2 + ujian3;
console.warn("Hasil penjumlahan sebelum diperbaiki:", jumlahSalah); // "808590"

// Perbaikan: ubah ke Number lebih dulu
const jumlahBenar = Number(ujian1) + Number(ujian2) + Number(ujian3);
const rataRata = jumlahBenar / 3;
console.log("Jumlah benar:", jumlahBenar);
console.log("Rata-rata akhir:", rataRata); // 85
`),
          callout(
            "success",
            "Tantangan Mandiri: Cetak sebuah array berisi 3 makanan favoritmu menggunakan console.table(), lalu amati kolom index dan value yang muncul.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Pengenalan JavaScript",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Pengenalan JavaScript"),
          p("<p>Uji pemahaman dasar tentang peran dan cara menjalankan JavaScript.</p>"),
          quiz("Kuis Pengenalan JavaScript", [
            {
              q: "Peran utama JavaScript pada halaman web adalah...",
              options: [
                "Menyusun struktur",
                "Mengatur tampilan",
                "Menambah perilaku/interaksi",
                "Menyimpan data permanen",
              ],
              answer: 2,
            },
            {
              q: "Perintah untuk menampilkan sesuatu di console adalah...",
              options: ["print()", "console.log()", "echo()", "document.write()"],
              answer: 1,
            },
            {
              q: "Agar script dimuat setelah HTML selesai diproses, tambahkan atribut...",
              options: ["async", "defer", "delay", "load"],
              answer: 1,
            },
            {
              q: "Komentar satu baris di JavaScript diawali...",
              options: ["<!--", "//", "#", "/*"],
              answer: 1,
            },
            {
              q: "JavaScript di luar browser dijalankan dengan...",
              options: ["Node.js", "Apache", "MySQL", "Figma"],
              answer: 0,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 2 — DASAR JAVASCRIPT
  // ==========================================================
  {
    name: "Dasar JavaScript",
    description:
      "Variabel, tipe data, operator, string, dan konversi tipe.",
    lessons: [
      {
        title: "Variabel: let, const, var",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami cara mendeklarasikan variabel dengan <code>const</code> dan <code>let</code>, aturan penamaan identifier, serta alasan menghindari <code>var</code>.</p>",
          ),
          h("1. const — Nilai yang Tidak Diisi Ulang"),
          p(
            "<p>Gunakan <code>const</code> sebagai pilihan utama. Variabel yang dibuat dengan <code>const</code> wajib langsung diberi nilai awal dan tidak boleh ditimpa dengan nilai baru.</p>",
          ),
          jsCode(`
const negara = "Indonesia";
const tahunBerdiri = 1945;

console.log(negara, tahunBerdiri);

// Baris di bawah ini akan menghasilkan TypeError jika dijalankan:
// negara = "Malaysia";
`),
          h("2. let — Nilai yang Akan Berubah"),
          p(
            "<p>Gunakan <code>let</code> ketika nilai variabel memang dirancang untuk berubah seiring waktu, misalnya skor permainan, saldo, atau penghitung perulangan.</p>",
          ),
          jsCode(`
let skor = 0;
console.log("Skor awal:", skor);

skor = skor + 10;
console.log("Setelah jawab benar:", skor);

skor = skor - 3;
console.log("Setelah kena penalti:", skor);
`),
          h("3. Kenapa var Sebaiknya Dihindari?"),
          p(
            "<p><code>var</code> adalah cara lama sebelum ES6 (2015). Masalah utamanya: <code>var</code> boleh dideklarasikan ulang tanpa error dan bocor keluar dari blok <code>{ ... }</code>.</p>",
          ),
          jsCode(`
var kota = "Bandung";
var kota = "Jakarta"; // Tidak error! Berbahaya karena menimpa variabel tanpa sadar

if (true) {
  var bocor = "Saya bocor keluar blok if";
  let aman = "Saya hanya hidup di dalam blok if";
}

console.log(bocor); // Tetap bisa diakses di luar if!
// console.log(aman); // ReferenceError
`),
          h("4. const pada Object dan Array"),
          p(
            "<p>Penting: <code>const</code> mengunci <em>ikatan variabelnya</em>, bukan isi di dalam object atau array. Jadi kita tetap bisa mengubah properti object atau menambah isi array.</p>",
          ),
          jsCode(`
const siswa = { nama: "Budi", kelas: "X-1" };
siswa.kelas = "XI-1"; // BOLEH: mengubah properti di dalamnya
console.log(siswa);

// siswa = { nama: "Andi" }; // TIDAK BOLEH: mengganti object dengan object baru
`),
          callout(
            "info",
            "Gunakan gaya camelCase untuk nama variabel (mis. totalHargaBarang) dan UPPER_SNAKE_CASE untuk konstanta tetap (mis. BATAS_MAKSIMUM).",
          ),
          h("Studi Kasus: Pelacak Pengeluaran Harian"),
          p(
            "<p><strong>Skenario:</strong> Kita menyimpan anggaran harian tetap menggunakan <code>const</code>, lalu mengurangi sisa saldo menggunakan <code>let</code> setiap kali ada transaksi.</p>",
          ),
          jsCode(`
const ANGGARAN_HARIAN = 100000;
const namaPengguna = "Rina";

let sisaSaldo = ANGGARAN_HARIAN;
let jumlahTransaksi = 0;

// Transaksi 1: sarapan
const biayaSarapan = 25000;
sisaSaldo = sisaSaldo - biayaSarapan;
jumlahTransaksi = jumlahTransaksi + 1;

// Transaksi 2: ongkos transport
const biayaTransport = 18000;
sisaSaldo = sisaSaldo - biayaTransport;
jumlahTransaksi = jumlahTransaksi + 1;

console.log("Pengguna:", namaPengguna);
console.log("Anggaran awal:", ANGGARAN_HARIAN);
console.log("Jumlah transaksi:", jumlahTransaksi);
console.log("Sisa saldo hari ini:", sisaSaldo);
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan transaksi ketiga untuk makan siang sebesar Rp32.000, lalu cetak total uang yang sudah terpakai.",
          ),
          divider(),
        ],
      },
      {
        title: "Tipe Data",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengenali tipe data primitif (string, number, boolean, null, undefined) serta tipe referensi (object, array) beserta cara memeriksanya dengan <code>typeof</code>.</p>",
          ),
          h("1. String dan Number"),
          p(
            "<p><code>string</code> adalah teks yang diapit tanda kutip (<code>\"...\"</code>, <code>'...'</code>, atau <code>`...`</code>). <code>number</code> mencakup bilangan bulat maupun pecahan desimal.</p>",
          ),
          jsCode(`
const judulKursus = "Belajar JavaScript";
const jumlahPeserta = 120;
const ratingKursus = 4.85;

console.log(typeof judulKursus);   // "string"
console.log(typeof jumlahPeserta); // "number"
console.log(typeof ratingKursus);  // "number"
`),
          h("2. Boolean: true dan false"),
          p(
            "<p><code>boolean</code> hanya memiliki dua kemungkinan nilai: <code>true</code> (benar) atau <code>false</code> (salah). Tipe ini menjadi dasar semua kondisi <code>if</code>.</p>",
          ),
          jsCode(`
const sudahLogin = true;
const akunTerkunci = false;
const lulusUjian = 85 >= 70; // menghasilkan true

console.log(sudahLogin, akunTerkunci, lulusUjian);
console.log(typeof sudahLogin); // "boolean"
`),
          h("3. Perbedaan undefined vs null"),
          p(
            "<p>Keduanya menandakan ketiadaan nilai, tetapi maksudnya berbeda:</p><ul><li><code>undefined</code>: variabel sudah dibuat, tetapi <em>belum diisi</em> apa pun.</li><li><code>null</code>: sengaja dikosongkan oleh programmer (misalnya belum memilih voucher).</li></ul>",
          ),
          jsCode(`
let nomorKursi;              // belum diisi -> undefined
let kodeVoucherDipilih = null; // sengaja kosong -> null

console.log("Nomor kursi:", nomorKursi);
console.log("Voucher:", kodeVoucherDipilih);
`),
          h("4. Object dan Array"),
          p(
            "<p>Untuk mengelompokkan banyak data sekaligus, gunakan <code>Array</code> (daftar berurutan) atau <code>Object</code> (pasangan nama properti dan nilai).</p>",
          ),
          jsCode(`
const daftarTag = ["HTML", "CSS", "JavaScript"];

const detailKursus = {
  judul: "Belajar JavaScript",
  durasiJam: 12,
  gratis: true,
};

console.log(Array.isArray(daftarTag)); // true
console.log(detailKursus.judul);       // "Belajar JavaScript"
`),
          callout(
            "warning",
            "Uniknya di JavaScript, typeof null menghasilkan 'object'. Itu adalah bug sejarah sejak versi pertama JS. Untuk mengecek null, gunakan nilai === null.",
          ),
          h("Studi Kasus: Memodelkan Data Produk Toko Online"),
          p(
            "<p><strong>Skenario:</strong> Kita diminta menyusun struktur variabel untuk satu halaman detail produk lengkap dengan diskon yang boleh kosong (<code>null</code>) dan daftar varian ukuran.</p>",
          ),
          jsCode(`
const produk = {
  id: "PRD-101",
  nama: "Jaket Hoodie Kampus",
  harga: 249000,
  tersedia: true,
  persenDiskon: null, // sedang tidak ada promo
  ukuranTersedia: ["S", "M", "L", "XL"],
};

console.log("Nama produk:", produk.nama, "(" + typeof produk.nama + ")");
console.log("Harga:", produk.harga, "(" + typeof produk.harga + ")");
console.log("Tersedia:", produk.tersedia, "(" + typeof produk.tersedia + ")");
console.log("Ada promo?", produk.persenDiskon !== null);
console.log("Jumlah ukuran:", produk.ukuranTersedia.length);
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat sebuah object bernama profilSiswa yang memiliki properti nama (string), semester (number), aktif (boolean), hobi (array string), dan nilaiAkhir (null).",
          ),
          divider(),
        ],
      },
      {
        title: "Operator",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menggunakan operator aritmatika, assignment singkat, perbandingan ketat (<code>===</code>), serta operator logika (<code>&amp;&amp;</code>, <code>||</code>, <code>!</code>).</p>",
          ),
          h("1. Operator Aritmatika"),
          p(
            "<p>Selain tambah, kurang, kali, dan bagi, perhatikan operator <code>%</code> (modulo / sisa bagi) dan <code>**</code> (pangkat).</p>",
          ),
          jsCode(`
const hargaSatuan = 15000;
const jumlahBeli = 4;

console.log("Total:", hargaSatuan * jumlahBeli); // 60000
console.log("Sisa bagi 10 % 3:", 10 % 3);        // 1 (sering dipakai cek ganjil/genap)
console.log("Pangkat 2 ** 3:", 2 ** 3);          // 8
`),
          h("2. Operator Assignment Singkat"),
          p(
            "<p>Untuk memperbarui nilai variabel berdasarkan nilai sebelumnya, gunakan bentuk singkat <code>+=</code>, <code>-=</code>, <code>*=</code>, atau <code>/=</code>.</p>",
          ),
          jsCode(`
let poin = 100;
poin += 25; // sama dengan: poin = poin + 25 -> 125
poin -= 10; // sama dengan: poin = poin - 10 -> 115
poin *= 2;  // sama dengan: poin = poin * 2  -> 230

console.log("Poin akhir:", poin);
`),
          h("3. Perbandingan Longgar (==) vs Ketat (===)"),
          p(
            "<p>Operator perbandingan selalu menghasilkan boolean. Hindari <code>==</code> karena ia diam-diam mengubah tipe data sehingga hasilnya sering mengejutkan.</p>",
          ),
          jsCode(`
console.log(10 == "10");  // true  (string "10" diubah jadi angka 10)
console.log(0 == false);  // true  (berbahaya!)

console.log(10 === "10"); // false (tipe berbeda: number vs string)
console.log(10 !== "10"); // true
console.log(75 >= 70);    // true
`),
          h("4. Operator Logika: && (DAN), || (ATAU), ! (BUKAN)"),
          p(
            "<p>Operator logika menggabungkan beberapa kondisi sekaligus:</p><ul><li><code>&amp;&amp;</code> bernilai <code>true</code> hanya jika <strong>semua</strong> kondisi benar.</li><li><code>||</code> bernilai <code>true</code> jika <strong>minimal satu</strong> kondisi benar.</li><li><code>!</code> membalik nilai boolean.</li></ul>",
          ),
          jsCode(`
const nilaiUjian = 80;
const persentaseHadir = 90;

const lulus = nilaiUjian >= 70 && persentaseHadir >= 80;
console.log("Lulus kelas:", lulus); // true

const punyaVoucher = false;
const memberVip = true;
const dapatDiskon = punyaVoucher || memberVip;
console.log("Dapat diskon:", dapatDiskon); // true
console.log("Kebalikan lulus:", !lulus);   // false
`),
          callout(
            "warning",
            "Biasakan selalu memakai === dan !== di seluruh kode JavaScript agar terhindar dari bug konversi tipe otomatis.",
          ),
          h("Studi Kasus: Pemeriksa Syarat Beasiswa"),
          p(
            "<p><strong>Skenario:</strong> Beasiswa diberikan kepada mahasiswa yang memiliki IPK minimal 3.5 <strong>dan</strong> aktif organisasi, <strong>atau</strong> mahasiswa yang pernah memenangkan lomba nasional.</p>",
          ),
          jsCode(`
const mahasiswa = {
  nama: "Dina",
  ipk: 3.62,
  aktifOrganisasi: true,
  juaraNasional: false,
  semester: 4,
};

const syaratSemester = mahasiswa.semester >= 3 && mahasiswa.semester <= 6;
const jalurAkademik = mahasiswa.ipk >= 3.5 && mahasiswa.aktifOrganisasi;
const jalurPrestasi = mahasiswa.juaraNasional === true;

const lolosBeasiswa = syaratSemester && (jalurAkademik || jalurPrestasi);

console.log("Peserta:", mahasiswa.nama);
console.log("Syarat semester terpenuhi:", syaratSemester);
console.log("Lolos jalur akademik:", jalurAkademik);
console.log("Hasil akhir lolos beasiswa:", lolosBeasiswa);
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah nilai ipk menjadi 3.2 dan juaraNasional menjadi true, lalu amati apakah peserta masih lolos beasiswa.",
          ),
          divider(),
        ],
      },
      {
        title: "String & Template Literal",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Merangkai teks dinamis dengan template literal serta mengolah teks menggunakan method string yang paling sering dipakai.</p>",
          ),
          h("1. Menggabungkan Teks: Cara Lama (+) vs Template Literal (` `)"),
          p(
            "<p>Menggabungkan banyak variabel dengan tanda <code>+</code> mudah salah spasi. Template literal menggunakan backtick (<code>`</code>) dan <code>${...}</code> sehingga jauh lebih bersih.</p>",
          ),
          jsCode(`
const nama = "Budi";
const kursus = "JavaScript";
const progres = 75;

// Cara lama dengan +
const pesanLama = "Halo " + nama + ", progres " + kursus + " kamu " + progres + "%.";

// Template literal (disarankan)
const pesanBaru = \`Halo \${nama}, progres \${kursus} kamu \${progres}%.\`;

console.log(pesanLama);
console.log(pesanBaru);
`),
          h("2. Membersihkan dan Mengubah Huruf (trim, toLowerCase, toUpperCase)"),
          p(
            "<p>Input dari pengguna sering memiliki spasi berlebih di awal/akhir atau huruf besar-kecil yang tidak seragam.</p>",
          ),
          jsCode(`
const inputEmail = "   Budi.Santoso@Contoh.ID  ";
const emailBersih = inputEmail.trim().toLowerCase();

console.log("Sebelum:", inputEmail);
console.log("Sesudah:", emailBersih); // "budi.santoso@contoh.id"
console.log("Jumlah karakter:", emailBersih.length);
`),
          h("3. Mencari dan Mengganti Isi Teks (includes, startsWith, replaceAll)"),
          p(
            "<p>Kita bisa memeriksa apakah sebuah kalimat mengandung kata tertentu atau mengganti bagian teks.</p>",
          ),
          jsCode(`
const judul = "Belajar Dasar JavaScript untuk Pemula";

console.log(judul.includes("JavaScript")); // true
console.log(judul.startsWith("Belajar"));  // true

const slug = judul.toLowerCase().replaceAll(" ", "-");
console.log("Slug URL:", slug); // "belajar-dasar-javascript-untuk-pemula"
`),
          h("4. Memotong dan Memecah Teks (slice & split)"),
          p(
            "<p><code>slice(awal, akhir)</code> mengambil sebagian karakter, sedangkan <code>split(pemisah)</code> memecah teks menjadi array.</p>",
          ),
          jsCode(`
const kodePesanan = "INV-2026-9981";
const tahunPesanan = kodePesanan.slice(4, 8);
console.log("Tahun:", tahunPesanan); // "2026"

const barisCsv = "Keyboard,450000,12";
const kolom = barisCsv.split(",");
console.log("Nama barang:", kolom[0]);
console.log("Harga:", kolom[1]);
`),
          callout(
            "info",
            "Semua method string tidak mengubah string aslinya, melainkan menghasilkan string baru. Simpan hasilnya ke dalam variabel.",
          ),
          h("Studi Kasus: Pembuat Ringkasan & Slug Artikel Otomatis"),
          p(
            "<p><strong>Skenario:</strong> Saat penulis memasukkan judul dan isi artikel yang masih berantakan spasinya, kita ingin membuatkan URL slug otomatis dan cuplikan 60 karakter pertama.</p>",
          ),
          jsCode(`
const judulMentah = "   Panduan Lengkap Belajar Async JavaScript   ";
const isiArtikel =
  "Asynchronous JavaScript memungkinkan halaman mengambil data dari API tanpa membuat tampilan membeku.";

const judulBersih = judulMentah.trim();
const slug = judulBersih.toLowerCase().replaceAll(" ", "-");
const cuplikan = isiArtikel.slice(0, 60) + "...";

const ringkasanKartu = \`
Judul    : \${judulBersih}
URL      : /artikel/\${slug}
Cuplikan : \${cuplikan}
\`.trim();

console.log(ringkasanKartu);
`),
          callout(
            "success",
            "Tantangan Mandiri: Ambil nama depan saja dari string 'Budi Santoso Wijaya' menggunakan split(' ')[0].",
          ),
          divider(),
        ],
      },
      {
        title: "Konversi Tipe & NaN",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengonversi string ke angka dan sebaliknya dengan aman, memahami nilai <em>truthy</em> &amp; <em>falsy</em>, serta mencegah munculnya <code>NaN</code>.</p>",
          ),
          h("1. Masalah Klasik: Angka yang Masih Berupa String"),
          p(
            "<p>Semua nilai yang diambil dari <code>&lt;input&gt;</code> HTML selalu bertipe <code>string</code>. Jika langsung dijumlahkan dengan <code>+</code>, JavaScript akan menggabungkannya sebagai teks.</p>",
          ),
          jsCode(`
const hargaInput = "50000";
const ongkirInput = "12000";

console.log("Salah (digabung):", hargaInput + ongkirInput); // "5000012000"

const totalBenar = Number(hargaInput) + Number(ongkirInput);
console.log("Benar (dijumlah):", totalBenar); // 62000
`),
          h("2. Number() vs parseInt() vs parseFloat()"),
          p(
            "<p>Ketiganya mengubah teks ke angka, tetapi perilakunya berbeda saat menemui karakter non-angka:</p>",
          ),
          jsCode(`
console.log(Number("120"));       // 120
console.log(Number("120px"));     // NaN (ketat: gagal jika ada huruf)

console.log(parseInt("120px"));   // 120 (mengambil angka bulat di depan)
console.log(parseFloat("3.75m")); // 3.75 (mengambil angka desimal di depan)
`),
          h("3. Mengenali dan Mengecek NaN"),
          p(
            "<p><code>NaN</code> (<em>Not a Number</em>) muncul ketika operasi matematika gagal menghasilkan angka yang sah. Uniknya, <code>NaN === NaN</code> selalu bernilai <code>false</code>, sehingga kita wajib memakai <code>Number.isNaN()</code>.</p>",
          ),
          jsCode(`
const hasilKonversi = Number("seratus");

console.log(hasilKonversi);               // NaN
console.log(hasilKonversi === NaN);       // false (JANGAN dipakai!)
console.log(Number.isNaN(hasilKonversi)); // true  (BENAR)
`),
          h("4. Nilai Falsy dan Truthy"),
          p(
            "<p>Saat nilai non-boolean dimasukkan ke dalam kondisi <code>if (...)</code>, JavaScript mengubahnya menjadi boolean. Hanya ada <strong>6 nilai falsy</strong> yang dianggap <code>false</code>: <code>false</code>, <code>0</code>, <code>\"\"</code> (string kosong), <code>null</code>, <code>undefined</code>, dan <code>NaN</code>. Selain itu semuanya <em>truthy</em>.</p>",
          ),
          jsCode(`
console.log(Boolean(""));      // false (string kosong)
console.log(Boolean("Halo"));  // true
console.log(Boolean(0));       // false
console.log(Boolean(100));     // true
console.log(Boolean([]));      // true (hati-hati: array kosong tetap truthy!)
`),
          callout(
            "warning",
            "Karena array kosong [] bersifat truthy, jangan mengecek isi array dengan if (daftar). Gunakan if (daftar.length > 0).",
          ),
          h("Studi Kasus: Kalkulator Total Keranjang dari Input Form"),
          p(
            "<p><strong>Skenario:</strong> Pengguna mengetik harga barang dan jumlah beli di form. Kita harus memvalidasi apakah inputnya benar-benar angka sebelum menghitung total.</p>",
          ),
          jsCode(`
const inputHarga = "75000";
const inputJumlah = "3";

const harga = Number(inputHarga);
const jumlah = Number(inputJumlah);

if (Number.isNaN(harga) || Number.isNaN(jumlah)) {
  console.error("Input tidak valid! Masukkan angka saja.");
} else {
  const total = harga * jumlah;
  console.log(\`Total bayar untuk \${jumlah} barang: Rp\${total}\`);
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Coba ubah inputJumlah menjadi 'dua' dan pastikan pesan error 'Input tidak valid!' yang muncul.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Dasar JavaScript",
        duration: 12,
        type: "QUIZ",
        blocks: [
          h("Kuis Dasar JavaScript"),
          p("<p>Uji pemahaman variabel, tipe data, operator, dan string.</p>"),
          quiz("Kuis Dasar JavaScript", [
            {
              q: "Keyword untuk nilai yang tidak akan diubah adalah...",
              options: ["let", "const", "var", "function"],
              answer: 1,
            },
            {
              q: "Hasil dari `5 === \"5\"` adalah...",
              options: ["true", "false", "NaN", "error"],
              answer: 1,
            },
            {
              q: "Tipe data dari `true` adalah...",
              options: ["string", "number", "boolean", "object"],
              answer: 2,
            },
            {
              q: "Cara menyisipkan variabel ke template literal adalah...",
              options: ["${nama}", "{nama}", "[nama]", "<nama>"],
              answer: 0,
            },
            {
              q: "`parseInt(\"42px\")` menghasilkan...",
              options: ["NaN", "42", "\"42\"", "error"],
              answer: 1,
            },
            {
              q: "Operator untuk mengecek sisa bagi adalah...",
              options: ["/", "%", "*", "//"],
              answer: 1,
            },
            {
              q: "Pengecekan NaN yang benar adalah...",
              options: ["x === NaN", "x == NaN", "Number.isNaN(x)", "typeof x"],
              answer: 2,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 3 — KONTROL ALUR
  // ==========================================================
  {
    name: "Kontrol Alur",
    description: "Percabangan dan perulangan secara mendalam beserta studi kasus.",
    lessons: [
      {
        title: "if / else if / else",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menguasai seluruh bentuk percabangan <code>if</code>: mulai dari <code>if</code> tunggal, <code>if...else</code> dua jalur, <code>else if</code> banyak cabang, penggabungan kondisi dengan <code>&amp;&amp;</code>/<code>||</code>, hingga operator ternary.</p>",
          ),
          h("1. Pernyataan if Tunggal"),
          p(
            "<p>Gunakan <code>if</code> ketika sebuah blok kode hanya boleh dijalankan jika syaratnya bernilai <code>true</code>. Jika syaratnya <code>false</code>, blok tersebut dilewati begitu saja.</p>",
          ),
          jsCode(`
const totalBelanja = 150000;

if (totalBelanja >= 100000) {
  console.log("Selamat! Kamu mendapat gratis ongkir.");
}

console.log("Terima kasih sudah berbelanja.");
`),
          p(
            "<p>Kondisi ditulis di dalam tanda kurung <code>(totalBelanja &gt;= 100000)</code>, dan aksi yang dijalankan ditulis di dalam kurung kurawal <code>{ ... }</code>.</p>",
          ),
          h("2. Pernyataan if ... else (Dua Jalur)"),
          p(
            "<p>Ketika ada dua kemungkinan yang saling berlawanan (misalnya lulus atau belum lulus, saldo cukup atau kurang), tambahkan blok <code>else</code>. Salah satu blok pasti dijalankan.</p>",
          ),
          jsCode(`
const saldoDompet = 40000;
const hargaTiket = 55000;

if (saldoDompet >= hargaTiket) {
  console.log("Pembayaran berhasil. Tiket diterbitkan!");
} else {
  const kekurangan = hargaTiket - saldoDompet;
  console.log(\`Saldo kurang Rp\${kekurangan}. Silakan top up dulu.\`);
}
`),
          h("3. Pernyataan else if (Banyak Cabang Berurutan)"),
          p(
            "<p>Untuk lebih dari dua kondisi, rangkai dengan <code>else if</code>. JavaScript memeriksa dari <strong>atas ke bawah</strong> dan berhenti pada cabang pertama yang bernilai <code>true</code>.</p>",
          ),
          jsCode(`
const nilai = 82;
let predikat;

if (nilai >= 85) {
  predikat = "A (Sangat Baik)";
} else if (nilai >= 70) {
  predikat = "B (Baik)";
} else if (nilai >= 55) {
  predikat = "C (Cukup)";
} else {
  predikat = "D (Perlu Perbaikan)";
}

console.log(\`Nilai \${nilai} mendapat predikat: \${predikat}\`);
`),
          callout(
            "warning",
            "Urutan else if sangat menentukan! Jika kamu menulis if (nilai >= 55) di paling atas, maka nilai 90 pun akan masuk ke cabang C karena 90 >= 55 sudah bernilai true.",
          ),
          h("4. Merapikan if Bersarang dengan Operator Logika"),
          p(
            "<p>Hindari menumpuk <code>if</code> di dalam <code>if</code> terlalu dalam. Gabungkan syarat yang saling berkaitan menggunakan <code>&amp;&amp;</code> atau <code>||</code>.</p>",
          ),
          jsCode(`
const sudahLogin = true;
const emailTerverifikasi = true;

// Kurang rapi (nested if)
if (sudahLogin) {
  if (emailTerverifikasi) {
    console.log("Boleh mengunggah tugas.");
  }
}

// Lebih bersih (digabung dengan &&)
if (sudahLogin && emailTerverifikasi) {
  console.log("Boleh mengunggah tugas.");
}
`),
          h("5. Operator Ternary (? :) untuk Nilai Singkat"),
          p(
            "<p>Jika kita hanya ingin memilih satu dari dua nilai untuk disimpan ke variabel, operator ternary <code>kondisi ? nilaiJikaBenar : nilaiJikaSalah</code> jauh lebih ringkas daripada <code>if...else</code>.</p>",
          ),
          jsCode(`
const jam = 19;
const temaLayar = jam >= 18 ? "Mode Gelap" : "Mode Terang";
const harga = 100000;
const adalahMember = true;
const hargaAkhir = adalahMember ? harga * 0.9 : harga;

console.log("Tema:", temaLayar);
console.log("Harga akhir:", hargaAkhir);
`),
          h("Studi Kasus: Perhitungan Total Checkout & Ongkir Toko Online"),
          p(
            "<p><strong>Skenario:</strong> Sebuah toko online memiliki aturan checkout sebagai berikut:</p><ol><li>Jika keranjang belanja kosong (total 0), tampilkan peringatan.</li><li>Belanja minimal Rp200.000 mendapat diskon 15%, minimal Rp100.000 diskon 5%, di bawah itu tidak dapat diskon.</li><li>Ongkir normal Rp20.000, tetapi <strong>gratis</strong> jika member VIP <em>atau</em> belanja setelah diskon minimal Rp150.000.</li></ol>",
          ),
          jsCode(`
const totalBelanja = 180000;
const memberVip = false;

if (totalBelanja <= 0) {
  console.log("Keranjang belanja masih kosong.");
} else {
  // 1. Hitung persentase diskon berjenjang
  let persenDiskon = 0;
  if (totalBelanja >= 200000) {
    persenDiskon = 0.15;
  } else if (totalBelanja >= 100000) {
    persenDiskon = 0.05;
  }

  const nominalDiskon = totalBelanja * persenDiskon;
  const subtotal = totalBelanja - nominalDiskon;

  // 2. Tentukan ongkir
  const gratisOngkir = memberVip || subtotal >= 150000;
  const ongkir = gratisOngkir ? 0 : 20000;
  const totalBayar = subtotal + ongkir;

  console.log("Total belanja :", totalBelanja);
  console.log("Potongan diskon:", nominalDiskon);
  console.log("Ongkos kirim  :", ongkir, gratisOngkir ? "(Gratis!)" : "");
  console.log("Total dibayar :", totalBayar);
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan variabel pakeVoucherKilat = true yang memberikan potongan tambahan Rp10.000 khusus jika subtotal minimal Rp120.000.",
          ),
          divider(),
        ],
      },
      {
        title: "switch",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menggunakan <code>switch</code> untuk membandingkan satu nilai terhadap banyak kemungkinan tetap, memahami fungsi <code>break</code>, serta teknik mengelompokkan beberapa <code>case</code>.</p>",
          ),
          h("1. Bentuk Dasar switch"),
          p(
            "<p>Ketika kamu memeriksa satu variabel yang sama terhadap banyak nilai pasti (seperti kode status, nama peran, atau metode pembayaran), <code>switch</code> lebih rapi dibanding deretan <code>else if</code>.</p>",
          ),
          jsCode(`
const metodeBayar = "QRIS";

switch (metodeBayar) {
  case "QRIS":
    console.log("Tampilkan kode QR untuk dipindai.");
    break;
  case "VA_BCA":
    console.log("Tampilkan nomor Virtual Account BCA.");
    break;
  case "COD":
    console.log("Siapkan uang pas saat kurir tiba.");
    break;
  default:
    console.log("Metode pembayaran belum didukung.");
}
`),
          h("2. Apa yang Terjadi Tanpa break? (Fallthrough)"),
          p(
            "<p>Tanpa <code>break</code>, setelah satu <code>case</code> cocok, JavaScript akan terus mengeksekusi baris di bawahnya walaupun nilainya berbeda.</p>",
          ),
          jsCode(`
const level = 2;

switch (level) {
  case 1:
    console.log("Level 1");
  case 2:
    console.log("Level 2"); // cocok di sini...
  case 3:
    console.log("Level 3"); // ...tapi ikut tercetak karena tidak ada break!
}
`),
          h("3. Mengelompokkan Beberapa case Sekaligus"),
          p(
            "<p>Sifat <em>fallthrough</em> justru berguna jika beberapa nilai menghasilkan tindakan yang sama persis.</p>",
          ),
          jsCode(`
const hari = "Sabtu";

switch (hari) {
  case "Senin":
  case "Selasa":
  case "Rabu":
  case "Kamis":
  case "Jumat":
    console.log("Hari kerja — kelas dimulai pukul 08.00.");
    break;
  case "Sabtu":
  case "Minggu":
    console.log("Akhir pekan — waktunya istirahat atau latihan mandiri.");
    break;
  default:
    console.log("Nama hari tidak valid.");
}
`),
          callout(
            "info",
            "switch menggunakan perbandingan ketat (===). Jadi case '1' tidak akan cocok dengan angka 1.",
          ),
          h("Studi Kasus: Penentu Hak Akses & Tarif Layanan berdasarkan Role"),
          p(
            "<p><strong>Skenario:</strong> Di dalam LMS, setiap pengguna memiliki <code>role</code> yang menentukan halaman beranda dan batas unduhan materi harian.</p>",
          ),
          jsCode(`
const rolePengguna = "INSTRUCTOR";
let halamanUtama = "/login";
let batasUnduhHarian = 0;

switch (rolePengguna) {
  case "ADMIN":
    halamanUtama = "/dashboard";
    batasUnduhHarian = 999;
    break;
  case "INSTRUCTOR":
    halamanUtama = "/dashboard/courses";
    batasUnduhHarian = 100;
    break;
  case "STUDENT":
    halamanUtama = "/my-course";
    batasUnduhHarian = 20;
    break;
  default:
    halamanUtama = "/login";
    batasUnduhHarian = 0;
}

console.log(\`Role: \${rolePengguna}\`);
console.log(\`Arahkan ke: \${halamanUtama} (kuota unduh: \${batasUnduhHarian}/hari)\`);
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan case 'GUEST' yang diarahkan ke '/katalog' dengan kuota unduh 3 per hari.",
          ),
          divider(),
        ],
      },
      {
        title: "Loop: for, while, do-while",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menguasai perulangan <code>for</code>, <code>while</code>, dan <code>do...while</code>, serta mengendalikan jalannya loop dengan <code>break</code> dan <code>continue</code>.</p>",
          ),
          h("1. Perulangan for — Jumlah Putaran Diketahui"),
          p(
            "<p><code>for</code> memiliki tiga bagian di dalam kurung: <strong>nilai awal</strong>, <strong>syarat lanjut</strong>, dan <strong>perubahan tiap putaran</strong>.</p>",
          ),
          jsCode(`
// Mencetak nomor modul 1 sampai 5
for (let nomor = 1; nomor <= 5; nomor += 1) {
  console.log(\`Modul ke-\${nomor}\`);
}

// Hitung mundur dari 3 ke 1
for (let detik = 3; detik >= 1; detik -= 1) {
  console.log(\`Mulai dalam \${detik}...\`);
}
`),
          h("2. Menjumlahkan Nilai dengan Akumulator di Dalam for"),
          p(
            "<p>Pola yang sangat sering dipakai adalah menyiapkan variabel penampung di luar loop, lalu menambahkannya di setiap putaran.</p>",
          ),
          jsCode(`
const pengeluaran = [15000, 22000, 10000, 35000];
let total = 0;

for (let i = 0; i < pengeluaran.length; i += 1) {
  total += pengeluaran[i];
}

console.log("Total pengeluaran:", total); // 82000
`),
          h("3. while dan do...while"),
          p(
            "<p>Gunakan <code>while</code> saat jumlah putaran belum pasti (bergantung kondisi). Gunakan <code>do...while</code> jika blok kode harus dijalankan <strong>minimal satu kali</strong> sebelum syarat diperiksa.</p>",
          ),
          jsCode(`
let percobaan = 1;
while (percobaan <= 3) {
  console.log("Mencoba koneksi ke-" + percobaan);
  percobaan += 1;
}

let langkah = 1;
do {
  console.log("Langkah ini tetap jalan minimal sekali:", langkah);
  langkah += 1;
} while (langkah < 1);
`),
          h("4. Menghentikan (break) dan Melompati (continue) Putaran"),
          p(
            "<p><code>break</code> menghentikan seluruh loop seketika, sedangkan <code>continue</code> hanya melewati sisa baris pada putaran saat ini dan lanjut ke putaran berikutnya.</p>",
          ),
          jsCode(`
const daftarNilai = [80, -1, 90, 75, 999, 85];

for (let i = 0; i < daftarNilai.length; i += 1) {
  const n = daftarNilai[i];

  if (n === -1) {
    continue; // lewati data kosong (-1)
  }
  if (n === 999) {
    console.log("Kode berhenti ditemukan, hentikan loop!");
    break;
  }

  console.log("Memproses nilai sah:", n);
}
`),
          callout(
            "warning",
            "Pastikan variabel kondisi di dalam while selalu bergerak menuju false. Jika lupa menulis percobaan += 1, akan terjadi infinite loop yang membuat tab browser macet.",
          ),
          h("Studi Kasus: Mencari Barang Habis & Menghitung Nilai Stok Gudang"),
          p(
            "<p><strong>Skenario:</strong> Kita memiliki daftar stok barang di gudang. Kita ingin menghitung total nilai barang yang masih tersedia, melewati barang yang stoknya 0, dan langsung berhenti jika menemukan barang berstatus rusak berat.</p>",
          ),
          jsCode(`
const gudang = [
  { nama: "Mouse", harga: 150000, stok: 4, rusakBerat: false },
  { nama: "Kabel USB", harga: 30000, stok: 0, rusakBerat: false },
  { nama: "Monitor", harga: 1800000, stok: 2, rusakBerat: false },
  { nama: "UPS Lama", harga: 900000, stok: 1, rusakBerat: true },
  { nama: "Keyboard", harga: 350000, stok: 5, rusakBerat: false },
];

let totalNilaiStok = 0;

for (let i = 0; i < gudang.length; i += 1) {
  const barang = gudang[i];

  if (barang.rusakBerat) {
    console.warn(\`Audit dihentikan: \${barang.nama} rusak berat!\`);
    break;
  }

  if (barang.stok === 0) {
    console.log(\`Lewati \${barang.nama} (stok habis)\`);
    continue;
  }

  const nilaiBarang = barang.harga * barang.stok;
  totalNilaiStok += nilaiBarang;
  console.log(\`\${barang.nama}: Rp\${nilaiBarang}\`);
}

console.log("Total nilai stok terhitung: Rp" + totalNilaiStok);
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah properti rusakBerat pada UPS Lama menjadi false, lalu hitung berapa totalNilaiStok ketika semua barang ikut dihitung.",
          ),
          divider(),
        ],
      },
      {
        title: "for...of & for...in",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menelusuri isi array dan string dengan <code>for...of</code>, serta menelusuri properti object dengan <code>for...in</code> dan <code>Object.entries()</code>.</p>",
          ),
          h("1. for...of — Menelusuri Nilai Array dengan Bersih"),
          p(
            "<p>Jika kita tidak membutuhkan nomor index <code>i</code>, <code>for...of</code> jauh lebih mudah dibaca daripada <code>for (let i = 0; ...)</code>.</p>",
          ),
          jsCode(`
const daftarKelas = ["HTML Dasar", "CSS & Tailwind", "JavaScript Async"];

for (const namaKelas of daftarKelas) {
  console.log("Kelas tersedia:", namaKelas);
}
`),
          h("2. for...of dengan Index menggunakan .entries()"),
          p(
            "<p>Jika tetap butuh nomor urut sekaligus nilainya, gunakan <code>daftar.entries()</code>.</p>",
          ),
          jsCode(`
const peserta = ["Budi", "Siti", "Andi"];

for (const [index, nama] of peserta.entries()) {
  console.log(\`\${index + 1}. \${nama}\`);
}
`),
          h("3. for...in — Menelusuri Key pada Object"),
          p(
            "<p>Object biasa tidak bisa ditelusuri dengan <code>for...of</code>. Gunakan <code>for...in</code> untuk mengambil setiap nama properti (<em>key</em>).</p>",
          ),
          jsCode(`
const nilaiMapel = {
  html: 90,
  css: 85,
  javascript: 88,
};

for (const mapel in nilaiMapel) {
  const skor = nilaiMapel[mapel];
  console.log(\`Mata pelajaran \${mapel}: \${skor}\`);
}
`),
          h("4. Alternatif Modern: Object.entries()"),
          p(
            "<p><code>Object.entries(obj)</code> mengubah object menjadi pasangan <code>[key, value]</code> sehingga bisa ditelusuri dengan <code>for...of</code>.</p>",
          ),
          jsCode(`
const kuotaKelas = { reguler: 30, intensif: 15 };

for (const [jenis, kuota] of Object.entries(kuotaKelas)) {
  console.log(\`Kelas \${jenis} maksimal \${kuota} siswa\`);
}
`),
          callout(
            "warning",
            "Jangan gunakan for...in untuk array karena ia mengembalikan index berupa string ('0', '1', dst.), bukan nilainya langsung.",
          ),
          h("Studi Kasus: Rekap Rapor Siswa & Penentuan Kelulusan"),
          p(
            "<p><strong>Skenario:</strong> Kita memiliki object berisi nilai setiap modul seorang siswa. Kita ingin mencetak daftar nilainya, menghitung rata-rata, dan menentukan modul mana yang masih di bawah KKM (75).</p>",
          ),
          jsCode(`
const raporBudi = {
  "Fondasi HTML": 88,
  "CSS & Tailwind": 72,
  "Dasar JavaScript": 91,
  "Async & API": 80,
};

const KKM = 75;
let totalNilai = 0;
let jumlahModul = 0;
const perluRemedial = [];

for (const [namaModul, nilai] of Object.entries(raporBudi)) {
  totalNilai += nilai;
  jumlahModul += 1;

  if (nilai < KKM) {
    perluRemedial.push(namaModul);
  }
}

const rataRata = totalNilai / jumlahModul;
console.log("Rata-rata nilai:", rataRata);
console.log(
  "Modul perlu remedial:",
  perluRemedial.length > 0 ? perluRemedial.join(", ") : "Tidak ada",
);
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan satu modul baru di dalam raporBudi dan tampilkan modul dengan nilai tertinggi.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Kontrol Alur",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Kontrol Alur"),
          p("<p>Uji pemahaman percabangan dan perulangan.</p>"),
          quiz("Kuis Kontrol Alur", [
            {
              q: "Kata kunci untuk kondisi alternatif tambahan adalah...",
              options: ["else if", "elseif", "otherwise", "elif"],
              answer: 0,
            },
            {
              q: "Tanpa `break` pada switch, yang terjadi adalah...",
              options: [
                "Program berhenti",
                "Lanjut mengeksekusi case berikutnya",
                "Error",
                "Loop tak berujung",
              ],
              answer: 1,
            },
            {
              q: "Loop yang dijamin jalan minimal sekali adalah...",
              options: ["for", "while", "do-while", "for...in"],
              answer: 2,
            },
            {
              q: "Untuk menelusuri isi array paling tepat memakai...",
              options: ["for...in", "for...of", "switch", "do-while"],
              answer: 1,
            },
            {
              q: "`i += 1` sama artinya dengan...",
              options: ["i = 1", "i = i + 1", "i = i - 1", "i++ 1"],
              answer: 1,
            },
            {
              q: "Operator ternary ditulis dengan...",
              options: ["if ? else", "? :", ": ?", "&& ||"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 4 — FUNCTION & SCOPE
  // ==========================================================
  {
    name: "Function & Scope",
    description: "Membuat fungsi, arrow function, parameter, dan scope.",
    lessons: [
      {
        title: "Function Declaration vs Expression",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membungkus logika yang berulang ke dalam fungsi, memahami parameter &amp; <code>return</code>, serta membedakan function declaration dengan function expression.</p>",
          ),
          h("1. Membuat dan Memanggil Fungsi"),
          p(
            "<p>Fungsi adalah blok kode bernama yang bisa dipanggil berkali-kali dengan input (parameter) yang berbeda.</p>",
          ),
          jsCode(`
function sapaPeserta(nama, kelas) {
  console.log(\`Halo \${nama}, selamat datang di kelas \${kelas}!\`);
}

sapaPeserta("Budi", "JavaScript");
sapaPeserta("Siti", "CSS & Tailwind");
`),
          h("2. Mengembalikan Nilai dengan return"),
          p(
            "<p><code>console.log</code> hanya menampilkan teks ke layar, sedangkan <code>return</code> mengirimkan hasil perhitungan keluar dari fungsi agar bisa disimpan di variabel atau diolah lagi. Baris setelah <code>return</code> tidak akan dijalankan.</p>",
          ),
          jsCode(`
function hitungLuasPersegiPanjang(panjang, lebar) {
  const luas = panjang * lebar;
  return luas;
}

const luasKamar = hitungLuasPersegiPanjang(4, 3);
const luasRuangTamu = hitungLuasPersegiPanjang(6, 5);
console.log("Total luas:", luasKamar + luasRuangTamu); // 42
`),
          h("3. Pola Early Return untuk Validasi"),
          p(
            "<p>Kita bisa memakai <code>return</code> di awal fungsi untuk langsung menghentikan proses jika input tidak sah.</p>",
          ),
          jsCode(`
function hitungDiskon(harga, persen) {
  if (harga <= 0 || persen < 0) {
    return 0; // langsung keluar lebih awal
  }
  return harga * (persen / 100);
}

console.log(hitungDiskon(-5000, 10)); // 0
console.log(hitungDiskon(100000, 15)); // 15000
`),
          h("4. Function Declaration vs Function Expression"),
          p(
            "<p><em>Function declaration</em> dapat dipanggil sebelum baris deklarasinya (karena <em>hoisting</em>), sedangkan <em>function expression</em> disimpan ke variabel sehingga baru bisa dipanggil setelah baris tersebut.</p>",
          ),
          jsCode(`
// Declaration
function bulatKeRibuan(angka) {
  return Math.round(angka / 1000) * 1000;
}

// Expression
const formatRupiah = function (angka) {
  return "Rp" + angka.toLocaleString("id-ID");
};

console.log(formatRupiah(bulatKeRibuan(48700))); // "Rp49.000"
`),
          callout(
            "info",
            "Jika sebuah fungsi tidak memiliki pernyataan return, maka pemanggilan fungsi tersebut otomatis menghasilkan undefined.",
          ),
          h("Studi Kasus: Fungsi Perhitungan Tagihan Kursus + Pajak"),
          p(
            "<p><strong>Skenario:</strong> Kita memisahkan logika potongan kupon, perhitungan PPN 11%, dan pembuatan ringkasan tagihan menjadi fungsi-fungsi kecil yang rapi.</p>",
          ),
          jsCode(`
function hitungPotongan(harga, kodeKupon) {
  if (kodeKupon === "HEMAT50") return 50000;
  if (kodeKupon === "HEMAT20") return 20000;
  return 0;
}

function hitungPpn(nominal) {
  return Math.round(nominal * 0.11);
}

function buatTagihan(namaKursus, hargaAsli, kodeKupon) {
  const potongan = hitungPotongan(hargaAsli, kodeKupon);
  const hargaSetelahPotongan = Math.max(0, hargaAsli - potongan);
  const pajak = hitungPpn(hargaSetelahPotongan);
  const totalAkhir = hargaSetelahPotongan + pajak;

  return {
    namaKursus,
    hargaAsli,
    potongan,
    pajak,
    totalAkhir,
  };
}

console.log(buatTagihan("Full-Stack Web", 250000, "HEMAT50"));
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan kupon 'GRATISONGKIR' atau kupon 'PELAJAR' yang memotong 10% dari hargaAsli.",
          ),
          divider(),
        ],
      },
      {
        title: "Arrow Function",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menulis fungsi menggunakan sintaks arrow function (<code>=&gt;</code>), memahami kapan kurung kurawal dan <code>return</code> bisa disingkat, serta cara mengembalikan object literal.</p>",
          ),
          h("1. Dari Function Biasa ke Arrow Function"),
          p(
            "<p>Arrow function adalah cara ringkas menulis function expression menggunakan tanda panah <code>=&gt;</code>.</p>",
          ),
          jsCode(`
// Function expression biasa
const sapaBiasa = function (nama) {
  return \`Halo, \${nama}!\`;
};

// Arrow function dengan blok { ... }
const sapaPanah = (nama) => {
  return \`Halo, \${nama}!\`;
};

// Arrow function satu ekspresi (implicit return — tanpa kata return)
const sapaSingkat = (nama) => \`Halo, \${nama}!\`;

console.log(sapaBiasa("Budi"));
console.log(sapaPanah("Siti"));
console.log(sapaSingkat("Andi"));
`),
          h("2. Mengembalikan Object secara Singkat"),
          p(
            "<p>Jika ingin langsung mengembalikan object tanpa kata <code>return</code>, bungkus kurung kurawal object dengan tanda kurung biasa <code>({ ... })</code> agar tidak dikira blok fungsi.</p>",
          ),
          jsCode(`
const buatItemKeranjang = (nama, harga) => ({
  nama,
  harga,
  mataUang: "IDR",
});

console.log(buatItemKeranjang("Mouse", 150000));
`),
          h("3. Arrow Function di Dalam Method Array"),
          p(
            "<p>Keunggulan terbesar arrow function terlihat saat dikirim sebagai argumen (callback) ke method seperti <code>map</code> dan <code>filter</code>.</p>",
          ),
          jsCode(`
const hargaBarang = [10000, 25000, 50000];

const hargaSetelahDiskon = hargaBarang.map((h) => h * 0.9);
const barangMahal = hargaBarang.filter((h) => h >= 20000);

console.log(hargaSetelahDiskon); // [9000, 22500, 45000]
console.log(barangMahal);        // [25000, 50000]
`),
          callout(
            "warning",
            "Arrow function tidak memiliki konteks 'this' sendiri. Gunakan function biasa ketika membuat method di dalam object yang membaca properti memakai this.",
          ),
          h("Studi Kasus: Konverter Nilai & Penyaring Kelulusan Cepat"),
          p(
            "<p><strong>Skenario:</strong> Daftar nilai mentah siswa perlu diberi bonus 5 poin (maksimal 100), diubah menjadi object berstatus lulus/remedial, lalu disaring yang lulus saja.</p>",
          ),
          jsCode(`
const daftarSiswa = [
  { nama: "Budi", nilai: 68 },
  { nama: "Siti", nilai: 82 },
  { nama: "Andi", nilai: 97 },
];

const tambahBonus = (nilai) => Math.min(100, nilai + 5);

const hasilAkhir = daftarSiswa.map((s) => {
  const nilaiBaru = tambahBonus(s.nilai);
  return {
    nama: s.nama,
    nilaiAkhir: nilaiBaru,
    lulus: nilaiBaru >= 70,
  };
});

const siswaLulus = hasilAkhir.filter((s) => s.lulus);
console.log("Semua hasil:", hasilAkhir);
console.log("Siswa lulus:", siswaLulus);
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat satu arrow function satu baris bernama adalahGenap = (n) => ... yang mengembalikan true jika n genap.",
          ),
          divider(),
        ],
      },
      {
        title: "Parameter Default, Rest & Spread",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memberikan nilai bawaan pada parameter fungsi, mengumpulkan banyak argumen dengan <em>rest parameter</em> (<code>...</code>), serta menyalin/menggabungkan data dengan <em>spread operator</em>.</p>",
          ),
          h("1. Parameter Default"),
          p(
            "<p>Jika pemanggil fungsi tidak mengirim argumen (atau mengirim <code>undefined</code>), parameter default otomatis digunakan.</p>",
          ),
          jsCode(`
function hitungOngkir(beratKg = 1, tarifPerKg = 9000) {
  return beratKg * tarifPerKg;
}

console.log(hitungOngkir());        // 9000  (1 * 9000)
console.log(hitungOngkir(3));       // 27000 (3 * 9000)
console.log(hitungOngkir(3, 12000)); // 36000 (3 * 12000)
`),
          h("2. Rest Parameter (...args) — Mengumpulkan Argumen"),
          p(
            "<p>Ditulis di daftar parameter fungsi, <code>...nama</code> mengumpulkan sisa argumen berapa pun jumlahnya menjadi sebuah array.</p>",
          ),
          jsCode(`
function hitungTotalBelanja(namaPembeli, ...daftarHarga) {
  let total = 0;
  for (const harga of daftarHarga) {
    total += harga;
  }
  return \`\${namaPembeli} membeli \${daftarHarga.length} barang: Rp\${total}\`;
}

console.log(hitungTotalBelanja("Budi", 15000, 25000, 10000));
`),
          h("3. Spread Operator pada Array"),
          p(
            "<p>Kebalikan dari rest, <em>spread</em> membongkar isi array untuk digabungkan atau disalin tanpa mengubah array aslinya.</p>",
          ),
          jsCode(`
const wajib = ["HTML", "CSS"];
const lanjutan = ["JavaScript", "React"];

const kurikulumLengkap = [...wajib, ...lanjutan, "Next.js"];
console.log(kurikulumLengkap);
`),
          h("4. Spread Operator pada Object (Update Imutabel)"),
          p(
            "<p>Kita bisa membuat salinan object sembari memperbarui beberapa propertinya. Properti yang ditulis belakangan akan menimpa properti lama.</p>",
          ),
          jsCode(`
const profilLama = {
  nama: "Budi",
  kota: "Bandung",
  role: "STUDENT",
};

const profilBaru = {
  ...profilLama,
  kota: "Jakarta", // menimpa kota lama
  terverifikasi: true,
};

console.log("Profil lama tetap utuh:", profilLama);
console.log("Profil baru:", profilBaru);
`),
          callout(
            "info",
            "Pola { ...stateLama, propertiBaru } sangat sering dipakai saat bekerja dengan React dan pengelolaan state modern.",
          ),
          h("Studi Kasus: Penggabung Konfigurasi Pengaturan Kelas"),
          p(
            "<p><strong>Skenario:</strong> Setiap kuis memiliki pengaturan bawaan (waktu 15 menit, maks 3 percobaan), tetapi instruktur boleh menimpa sebagian pengaturan saja dan menambahkan daftar tag berapa pun jumlahnya.</p>",
          ),
          jsCode(`
const PENGATURAN_BAWAAN = {
  batasWaktuMenit: 15,
  maksPercobaan: 3,
  nilaiLulus: 70,
  acakSoal: false,
};

function buatKonfigurasiKuis(judul, kustom = {}, ...tags) {
  return {
    judul,
    ...PENGATURAN_BAWAAN,
    ...kustom,
    tags,
  };
}

const kuis1 = buatKonfigurasiKuis("Kuis Dasar JS");
const kuisUjian = buatKonfigurasiKuis(
  "Ujian Akhir JS",
  { batasWaktuMenit: 30, maksPercobaan: 1, acakSoal: true },
  "javascript",
  "ujian",
  "wajib",
);

console.log(kuis1);
console.log(kuisUjian);
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat fungsi cariNilaiTertinggi(...angka) yang memakai Math.max(...angka) untuk mengembalikan angka terbesar.",
          ),
          divider(),
        ],
      },
      {
        title: "Scope & Closure",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami jangkauan hidup variabel (global, function, block scope) dan cara kerja <em>closure</em> untuk menyimpan state privat.</p>",
          ),
          h("1. Global Scope vs Function Scope"),
          p(
            "<p>Variabel di luar fungsi bersifat <strong>global</strong> (bisa dibaca di mana saja). Variabel di dalam fungsi bersifat <strong>lokal</strong> dan tidak dikenal di luar fungsi tersebut.</p>",
          ),
          jsCode(`
const namaAplikasi = "Provoks"; // global

function tampilkanInfo() {
  const versi = "1.0"; // lokal di dalam fungsi
  console.log(namaAplikasi, versi);
}

tampilkanInfo();
// console.log(versi); // ReferenceError: versi tidak dikenal di luar fungsi
`),
          h("2. Block Scope pada let dan const"),
          p(
            "<p>Setiap pasangan kurung kurawal <code>{ ... }</code> pada <code>if</code> atau <code>for</code> membentuk <em>block scope</em>. Variabel <code>let</code> dan <code>const</code> hanya hidup di dalam blok tempat ia dibuat.</p>",
          ),
          jsCode(`
const nilai = 85;

if (nilai >= 70) {
  const pesan = "Selamat, kamu lulus!";
  console.log(pesan);
}

// console.log(pesan); // ReferenceError: pesan hanya hidup di dalam blok if
`),
          h("3. Apa Itu Closure?"),
          p(
            "<p><strong>Closure</strong> terjadi ketika sebuah fungsi di dalam fungsi lain tetap mengingat dan bisa mengakses variabel milik fungsi induknya, meskipun fungsi induknya sudah selesai dijalankan.</p>",
          ),
          jsCode(`
function buatPenghitung(awal = 0) {
  let hitung = awal; // variabel privat, tidak bisa diubah langsung dari luar

  return function () {
    hitung += 1;
    return hitung;
  };
}

const counterA = buatPenghitung(0);
console.log(counterA()); // 1
console.log(counterA()); // 2

const counterB = buatPenghitung(10);
console.log(counterB()); // 11
`),
          callout(
            "info",
            "Perhatikan bahwa counterA dan counterB memiliki ingatan 'hitung' masing-masing yang tidak saling mengganggu.",
          ),
          h("Studi Kasus: Dompet Digital dengan Saldo Privat"),
          p(
            "<p><strong>Skenario:</strong> Kita ingin membuat objek dompet yang saldonya tidak bisa diubah sembarangan seperti <code>dompet.saldo = 99999999</code>, melainkan hanya bisa ditambah lewat <code>topUp()</code> dan dikurangi lewat <code>bayar()</code>.</p>",
          ),
          jsCode(`
function buatDompet(pemilik, saldoAwal = 0) {
  let saldo = saldoAwal; // terlindungi di dalam closure

  return {
    cekSaldo() {
      return \`Saldo \${pemilik}: Rp\${saldo}\`;
    },
    topUp(nominal) {
      if (nominal > 0) saldo += nominal;
      return saldo;
    },
    bayar(nominal) {
      if (nominal > saldo) {
        console.warn("Saldo tidak mencukupi!");
        return false;
      }
      saldo -= nominal;
      return true;
    },
  };
}

const dompetBudi = buatDompet("Budi", 50000);
dompetBudi.topUp(25000);
dompetBudi.bayar(30000);
console.log(dompetBudi.cekSaldo()); // "Saldo Budi: Rp45000"
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan method riwayat() di dalam buatDompet yang menyimpan dan mengembalikan daftar semua transaksi yang pernah dilakukan.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Function & Scope",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Function & Scope"),
          p("<p>Uji pemahaman fungsi dan scope.</p>"),
          quiz("Kuis Function & Scope", [
            {
              q: "Kata kunci untuk mengembalikan nilai dari fungsi adalah...",
              options: ["break", "return", "yield", "output"],
              answer: 1,
            },
            {
              q: "Arrow function ditulis dengan...",
              options: ["->", "=>", "::", "function="],
              answer: 1,
            },
            {
              q: "`function f(...args)` membuat args menjadi...",
              options: ["string", "array", "object", "number"],
              answer: 1,
            },
            {
              q: "Spread operator ditulis dengan...",
              options: ["...", "..", "***", "&&"],
              answer: 0,
            },
            {
              q: "Fungsi dalam yang tetap mengingat variabel luar disebut...",
              options: ["callback", "closure", "hoisting", "recursion"],
              answer: 1,
            },
            {
              q: "Fungsi tanpa return menghasilkan...",
              options: ["null", "0", "undefined", "error"],
              answer: 2,
            },
          ]),
        ],
      },
    ],
  },
];
