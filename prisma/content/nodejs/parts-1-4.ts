import {
  bashCode,
  callout,
  CoursePartDef,
  divider,
  h,
  jsCode,
  jsonCode,
  p,
  quiz,
  tsCode,
} from "../helpers";

export const NODE_PARTS_1_4: CoursePartDef[] = [
  // ==========================================================
  // PART 1 — NODE.JS VS BROWSER JAVASCRIPT
  // ==========================================================
  {
    name: "Node.js vs Browser JavaScript",
    description:
      "Memahami apa itu Node.js, perbedaannya dengan JavaScript di browser, serta cara menjalankan kode TypeScript di runtime Node.",
    lessons: [
      {
        title: "Apa Itu Node.js & Bagaimana Ia Bekerja",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Setelah mempelajari materi ini, kamu mampu menjelaskan apa itu Node.js, komponen utamanya (V8 dan libuv), serta kapan sebaiknya memakai Node.js.</p>",
          ),
          h("1. JavaScript yang Keluar dari Browser"),
          p(
            "<p>Selama ini JavaScript identik dengan halaman web. <strong>Node.js</strong> adalah runtime yang membuat JavaScript bisa berjalan di luar browser — di laptop, server, container, bahkan perangkat IoT.</p><p>Node.js bukan bahasa pemrograman baru dan bukan framework. Ia adalah <em>environment</em> yang menyediakan mesin JavaScript plus sekumpulan API untuk mengakses file, jaringan, dan proses sistem operasi.</p>",
          ),
          h("2. Arsitektur Singkat: V8 + libuv"),
          p(
            "<ul><li><strong>V8</strong> — mesin JavaScript dari Chrome yang mengubah kode menjadi instruksi mesin.</li><li><strong>libuv</strong> — pustaka C yang menangani event loop, thread pool, file system, jaringan, dan timer.</li><li><strong>API inti Node</strong> — modul seperti <code>fs</code>, <code>path</code>, <code>http</code>, dan <code>crypto</code> yang dibungkus agar mudah dipakai dari JavaScript.</li></ul><p>Model utamanya <em>single-threaded</em> untuk kode JavaScript, tetapi operasi I/O dijalankan secara asynchronous sehingga server bisa menangani banyak permintaan tanpa membuat satu thread per permintaan.</p>",
          ),
          tsCode(`
// src/hello.ts
const nama: string = "Budi";
const versi: string = process.versions.node;

console.log(\`Halo \${nama}, kamu memakai Node.js \${versi}\`);
`),
          h("3. Kapan Memakai Node.js?"),
          p(
            "<ul><li><strong>REST API dan backend web</strong> — terutama yang banyak operasi I/O seperti membaca database atau memanggil layanan lain.</li><li><strong>Alat baris perintah (CLI)</strong> — generator proyek, formatter, dan automation script.</li><li><strong>Streaming dan real-time</strong> — chat, notifikasi, dan pengolahan file besar.</li><li><strong>Tooling frontend</strong> — bundler, linter, dan development server seperti yang dipakai Next.js.</li></ul><p>Node.js kurang ideal untuk komputasi CPU berat jangka panjang (misalnya pengolahan video) karena dapat memblokir event loop. Untuk kasus itu, gunakan <code>worker_threads</code> atau layanan terpisah.</p>",
          ),
          callout(
            "info",
            "Satu bahasa untuk dua sisi: JavaScript yang sama bisa dipakai di browser dan di server. Inilah alasan Node.js populer untuk tim full-stack.",
          ),
          h("Studi Kasus: Cek Runtime"),
          p(
            "<p>Buat file <code>src/hello.ts</code> berisi kode di atas, lalu jalankan dengan <code>tsx</code> (kita akan memasang TypeScript di Part 3). Untuk sekarang, pastikan Node sudah terpasang:</p>",
          ),
          bashCode(`
node --version
npm --version
npx tsx src/hello.ts
`),
          callout(
            "success",
            "Tantangan Mandiri: Cetak juga process.platform dan process.arch, lalu jalankan di komputer lain (jika ada) untuk melihat perbedaannya.",
          ),
          divider(),
        ],
      },
      {
        title: "Browser vs Node.js: Global, DOM, dan API",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membedakan lingkungan browser dan Node.js: objek global, ketersediaan DOM, serta API yang bisa dipakai di masing-masing runtime.</p>",
          ),
          h("1. Tidak Ada DOM di Node.js"),
          p(
            "<p>Browser menyediakan <code>document</code>, <code>window</code>, dan API tampilan lainnya. Di Node.js objek-objek itu <strong>tidak ada</strong> karena Node tidak merender halaman.</p>",
          ),
          tsCode(`
// Di browser
console.log(typeof window);   // "object"
console.log(typeof document); // "object"

// Di Node.js
console.log(typeof process);  // "object"
console.log(typeof document); // "undefined"
`),
          h("2. Global Object: window vs globalThis"),
          p(
            "<p>Di browser, global object adalah <code>window</code>. Di Node.js, objek global modern bernama <code>globalThis</code>, dan <code>process</code> tersedia sebagai pintu masuk ke informasi runtime.</p>",
          ),
          tsCode(`
console.log(globalThis === globalThis); // true di kedua runtime

// Node.js
console.log(process.pid);       // ID proses
console.log(process.cwd());     // folder kerja
console.log(process.env.NODE_ENV);
`),
          h("3. API yang Sama vs Berbeda"),
          p(
            "<ul><li><strong>Sama:</strong> <code>console</code>, <code>setTimeout</code>, <code>fetch</code>, <code>URL</code>, <code>TextEncoder</code>, dan <code>Promise</code>.</li><li><strong>Hanya browser:</strong> <code>document</code>, <code>localStorage</code>, <code>alert</code>, dan <code>IntersectionObserver</code>.</li><li><strong>Hanya Node:</strong> <code>fs</code>, <code>path</code>, <code>http</code>, <code>os</code>, <code>crypto</code>, dan <code>process</code>.</li></ul>",
          ),
          callout(
            "warning",
            "Kode yang memakai document atau localStorage akan error di Node.js. Sebaliknya, kode yang memakai fs tidak akan jalan di browser tanpa polyfill atau bundler khusus.",
          ),
          h("Studi Kasus: Deteksi Lingkungan"),
          p(
            "<p>Kadang satu pustaka dipakai di browser dan Node. Pola aman adalah memeriksa keberadaan objek sebelum memakainya.</p>",
          ),
          tsCode(`
function lingkunganSaatIni(): "browser" | "node" {
  if (typeof process !== "undefined" && process.versions?.node) {
    return "node";
  }
  return "browser";
}

console.log(lingkunganSaatIni());
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat fungsi yang mengembalikan nama platform (process.platform) saat di Node, dan string \"browser\" saat di browser.",
          ),
          divider(),
        ],
      },
      {
        title: "Menjalankan Node.js: CLI, REPL & Argumen",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menjalankan file, memakai REPL, membaca argumen baris perintah, dan mengatur exit code pada proses Node.</p>",
          ),
          h("1. Menjalankan File"),
          p(
            "<p>Node bisa menjalankan file <code>.js</code> secara langsung. Untuk TypeScript, kita memakai <code>tsx</code> (atau hasil build <code>tsc</code>) karena Node standar tidak selalu memahami semua sintaks TypeScript.</p>",
          ),
          bashCode(`
node src/index.js
npx tsx src/index.ts
node dist/index.js
`),
          h("2. REPL Interaktif"),
          p(
            "<p>Jalankan <code>node</code> tanpa argumen untuk masuk ke REPL. Berguna untuk mencoba potongan kode dengan cepat.</p>",
          ),
          bashCode(`
$ node
> 2 + 3
5
> [1, 2, 3].map((n) => n * 2)
[ 2, 4, 6 ]
> .exit
`),
          h("3. Argumen Baris Perintah"),
          p(
            "<p><code>process.argv</code> berisi path Node, path file, lalu argumen tambahan. Elemen pertama dan kedua biasanya kita lewati.</p>",
          ),
          tsCode(`
// src/args.ts
const [, , ...args] = process.argv;

if (args.length === 0) {
  console.error("Contoh: npx tsx src/args.ts halo dunia");
  process.exit(1);
}

console.log("Argumen:", args);
console.log("Jumlah:", args.length);
`),
          bashCode(`
npx tsx src/args.ts halo dunia
# Argumen: [ 'halo', 'dunia' ]
`),
          h("4. Exit Code"),
          p(
            "<p>Exit code <code>0</code> berarti sukses; selain itu menandakan kegagalan. CI/CD dan skrip shell memakai nilai ini untuk menentukan langkah berikutnya.</p>",
          ),
          tsCode(`
function jalankan(nilai: number) {
  if (!Number.isFinite(nilai)) {
    console.error("Nilai tidak valid");
    process.exitCode = 1;
    return;
  }
  console.log("Nilai:", nilai);
}

jalankan(Number(process.argv[2]));
`),
          callout(
            "info",
            "Gunakan process.exitCode = 1 lalu biarkan proses selesai secara alami. process.exit() langsung mematikan proses dan bisa memotong output yang belum terkirim.",
          ),
          h("Studi Kasus: Kalkulator CLI"),
          tsCode(`
// src/kalkulator.ts
const [, , operasi, a, b] = process.argv;
const kiri = Number(a);
const kanan = Number(b);

const hasil: Record<string, number> = {
  tambah: kiri + kanan,
  kurang: kiri - kanan,
  kali: kiri * kanan,
  bagi: kanan === 0 ? Number.NaN : kiri / kanan,
};

const nilai = hasil[operasi];

if (nilai === undefined || Number.isNaN(nilai)) {
  console.error("Operasi atau angka tidak valid");
  process.exitCode = 1;
} else {
  console.log(\`\${kiri} \${operasi} \${kanan} = \${nilai}\`);
}
`),
          bashCode(`
npx tsx src/kalkulator.ts tambah 7 5
# 7 tambah 5 = 12
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan operasi modulus dan pangkat, lengkap dengan validasi jumlah argumen.",
          ),
          divider(),
        ],
      },
      {
        title: "Modul: CommonJS vs ESM",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami dua sistem modul di Node.js, cara menulis keduanya, dan cara memilih yang tepat untuk proyek TypeScript baru.</p>",
          ),
          h("1. CommonJS (CJS)"),
          p(
            "<p>CommonJS adalah sistem modul lama Node.js. Ia memakai <code>require()</code> dan <code>module.exports</code>. Banyak paket lama masih memakai format ini.</p>",
          ),
          jsCode(`
// math.cjs
function tambah(a, b) {
  return a + b;
}

module.exports = { tambah };
`),
          jsCode(`
// app.cjs
const { tambah } = require("./math.cjs");

console.log(tambah(2, 3)); // 5
`),
          h("2. ECMAScript Modules (ESM)"),
          p(
            "<p>ESM memakai <code>import</code> dan <code>export</code>, sama seperti JavaScript modern di browser. Ini adalah standar yang direkomendasikan untuk proyek baru.</p>",
          ),
          tsCode(`
// math.ts
export function tambah(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14;
`),
          tsCode(`
// app.ts
import { PI, tambah } from "./math.js";

console.log(tambah(2, 3)); // 5
console.log(PI);           // 3.14
`),
          callout(
            "info",
            "Pada ESM + TypeScript dengan module NodeNext, import memakai ekstensi .js walaupun file sumbernya .ts. Compiler yang mengubahnya menjadi JavaScript.",
          ),
          h("3. Mengaktifkan ESM"),
          p(
            "<p>Tambahkan <code>\"type\": \"module\"</code> di <code>package.json</code>. Tanpa itu, file <code>.js</code> dianggap CommonJS.</p>",
          ),
          jsonCode(`
{
  "name": "latihan-node",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/app.ts"
  }
}
`),
          h("4. Aturan Praktis"),
          p(
            "<ul><li>Proyek baru + TypeScript → gunakan <strong>ESM</strong> dan <code>module: \"NodeNext\"</code>.</li><li>Paket lama yang belum mendukung ESM → bisa diimpor dari ESM, tetapi perhatikan default export.</li><li>Jangan mencampur <code>require</code> dan <code>import</code> dalam satu file.</li><li>Satu proyek sebaiknya konsisten memakai satu sistem modul.</li></ul>",
          ),
          callout(
            "warning",
            "Error \"Cannot use import statement outside a module\" biasanya muncul karena package.json belum memakai type module atau tsconfig belum NodeNext.",
          ),
          h("Studi Kasus: Memecah Program Menjadi Dua File"),
          tsCode(`
// src/hitung.ts
export function rataRata(angka: number[]): number {
  if (angka.length === 0) return 0;
  const total = angka.reduce((jumlah, nilai) => jumlah + nilai, 0);
  return total / angka.length;
}
`),
          tsCode(`
// src/index.ts
import { rataRata } from "./hitung.js";

const nilai = [80, 90, 75, 100];
console.log("Rata-rata:", rataRata(nilai));
`),
          bashCode(`
npx tsx src/index.ts
# Rata-rata: 86.25
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat modul kedua bernama statistik.ts yang mengekspor fungsi nilaiTertinggi, lalu pakai di index.ts.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Node.js vs Browser",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Node.js vs Browser JavaScript"),
          p(
            "<p>Uji pemahaman tentang runtime Node.js, perbedaannya dengan browser, dan sistem modul.</p>",
          ),
          quiz("Kuis Node.js vs Browser", [
            {
              q: "Node.js adalah...",
              options: [
                "Bahasa pemrograman baru",
                "Framework UI",
                "Runtime JavaScript di luar browser",
                "Database",
              ],
              answer: 2,
            },
            {
              q: "Komponen Node.js yang menangani event loop dan I/O adalah...",
              options: ["V8", "libuv", "npm", "TypeScript"],
              answer: 1,
            },
            {
              q: "Objek yang tersedia di Node.js tetapi tidak ada di browser adalah...",
              options: ["document", "window", "process", "localStorage"],
              answer: 2,
            },
            {
              q: "Sistem modul modern yang memakai import/export disebut...",
              options: ["CommonJS", "AMD", "ESM", "UMD"],
              answer: 2,
            },
            {
              q: "Agar suatu proyek Node memakai ESM, package.json perlu berisi...",
              options: [
                '"module": "esm"',
                '"type": "module"',
                '"format": "esm"',
                '"esm": true',
              ],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 2 — NPM & PENGENALAN LIBRARY
  // ==========================================================
  {
    name: "NPM & Pengenalan Library",
    description:
      "Mengelola proyek dengan package.json, memahami dependency dan semver, memakai library, serta menilai kualitas paket sebelum dipakai.",
    lessons: [
      {
        title: "package.json & npm init",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat proyek Node, memahami isi <code>package.json</code>, serta memakai <code>scripts</code> untuk menjalankan perintah proyek.</p>",
          ),
          h("1. Membuat Proyek"),
          p(
            "<p><code>npm init -y</code> membuat <code>package.json</code> dengan nilai awal. File ini adalah identitas dan konfigurasi proyek.</p>",
          ),
          bashCode(`
mkdir latihan-node
cd latihan-node
npm init -y
`),
          h("2. Field Penting"),
          p(
            "<ul><li><code>name</code> — nama paket, huruf kecil dan tanpa spasi.</li><li><code>version</code> — versi proyek mengikuti semver.</li><li><code>private</code> — <code>true</code> jika tidak dipublikasikan ke npm.</li><li><code>type</code> — <code>module</code> untuk ESM atau <code>commonjs</code> untuk CJS.</li><li><code>scripts</code> — perintah yang bisa dijalankan dengan <code>npm run</code>.</li><li><code>dependencies</code> dan <code>devDependencies</code> — daftar paket.</li></ul>",
          ),
          jsonCode(`
{
  "name": "latihan-node",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^26.0.0",
    "tsx": "^4.20.0",
    "typescript": "^6.0.0"
  }
}
`),
          h("3. Menjalankan Script"),
          bashCode(`
npm run dev
npm run build
npm run typecheck
`),
          p(
            "<p>Script <code>test</code>, <code>start</code>, dan beberapa nama lain bisa dipanggil tanpa kata <code>run</code>, misalnya <code>npm start</code>.</p>",
          ),
          callout(
            "info",
            "Gunakan npm run untuk semua script proyek agar tim memakai perintah yang sama, tanpa bergantung pada cara menjalankan di masing-masing komputer.",
          ),
          h("Studi Kasus: Script Dev dan Build"),
          p(
            "<p>Dengan dua script di atas, alur kerja menjadi jelas: <code>npm run dev</code> untuk pengembangan dengan reload otomatis, dan <code>npm run build</code> untuk menghasilkan JavaScript siap produksi di folder <code>dist</code>.</p>",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan script check yang menjalankan typecheck lalu build secara berurutan.",
          ),
          divider(),
        ],
      },
      {
        title: "Dependencies, Semver & Lockfile",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membedakan dependencies dan devDependencies, membaca versi semver, serta memahami peran lockfile.</p>",
          ),
          h("1. Dependencies vs devDependencies"),
          p(
            "<ul><li><strong>dependencies</strong> — dibutuhkan saat aplikasi berjalan, misalnya <code>zod</code> atau driver database.</li><li><strong>devDependencies</strong> — hanya untuk pengembangan dan build, misalnya <code>typescript</code>, <code>tsx</code>, dan <code>@types/node</code>.</li></ul>",
          ),
          jsonCode(`
{
  "dependencies": {
    "zod": "^4.6.0"
  },
  "devDependencies": {
    "@types/node": "^26.0.0",
    "tsx": "^4.20.0",
    "typescript": "^6.0.0"
  }
}
`),
          h("2. Semver: MAJOR.MINOR.PATCH"),
          p(
            "<ul><li><strong>MAJOR</strong> — perubahan yang tidak kompatibel.</li><li><strong>MINOR</strong> — fitur baru, tetap kompatibel.</li><li><strong>PATCH</strong> — perbaikan bug.</li></ul><p>Simbol di depan versi menentukan seberapa bebas npm memperbarui:</p>",
          ),
          jsonCode(`
{
  "versi": {
    "exact": "4.6.7",
    "patch": "~4.6.7",
    "minor": "^4.6.7",
    "bebas": "*"
  }
}
`),
          p(
            "<p><code>^4.6.7</code> mengizinkan update ke <code>4.x.x</code> terbaru, tetapi tidak ke <code>5.0.0</code>. Ini adalah default yang paling umum.</p>",
          ),
          h("3. Lockfile"),
          p(
            "<p><code>package-lock.json</code> mencatat versi persis seluruh dependency dan sub-dependency. File ini <strong>wajib di-commit</strong> agar setiap mesin dan server memasang versi yang sama.</p>",
          ),
          callout(
            "warning",
            "Jangan menghapus package-lock.json hanya untuk mengatasi konflik. Hapus node_modules lalu jalankan npm ci untuk memasang ulang sesuai lockfile.",
          ),
          h("4. Memasang Paket"),
          bashCode(`
# dependency runtime
npm install zod

# devDependency
npm install -D typescript tsx @types/node

# versi tertentu
npm install zod@4.6.7
`),
          h("5. Melihat Paket Terpasang"),
          bashCode(`
npm ls --depth=0
npm outdated
`),
          callout(
            "success",
            "Tantangan Mandiri: Pasang zod sebagai dependency, lalu buat skema sederhana untuk memvalidasi input dan tampilkan pesan error yang rapi.",
          ),
          divider(),
        ],
      },
      {
        title: "Install, Update, npx & Scripts",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menguasai perintah npm sehari-hari: memasang, memperbarui, menghapus paket, memakai npx, dan merapikan dependency.</p>",
          ),
          h("1. Perintah Dasar"),
          bashCode(`
npm install            # pasang semua dependency dari package.json
npm install zod        # tambah dependency
npm install -D vitest  # tambah devDependency
npm uninstall zod      # hapus dependency
npm update             # perbarui sesuai aturan semver
npm ci                 # pasang persis sesuai lockfile (CI)
`),
          h("2. npx: Menjalankan Paket Tanpa Install Global"),
          p(
            "<p><code>npx</code> menjalankan executable dari paket. Jika paket belum ada, npx mengunduhnya sementara. Ini lebih aman daripada <code>npm install -g</code>.</p>",
          ),
          bashCode(`
npx tsx src/index.ts
npx tsc --noEmit
npx prettier --check .
`),
          h("3. Struktur Folder node_modules"),
          p(
            "<p><code>node_modules</code> berisi kode paket yang terpasang. Folder ini tidak boleh di-commit; masukkan ke <code>.gitignore</code>. Yang di-commit adalah <code>package.json</code> dan <code>package-lock.json</code>.</p>",
          ),
          bashCode(`
# .gitignore
node_modules/
dist/
.env
`),
          h("4. Memeriksa Keamanan"),
          bashCode(`
npm audit
npm audit fix
`),
          p(
            "<p><code>npm audit</code> melaporkan kerentanan yang diketahui. Jangan langsung menjalankan <code>audit fix --force</code> tanpa membaca dampaknya, karena bisa menaikkan major version.</p>",
          ),
          callout(
            "info",
            "Di CI/CD, gunakan npm ci, bukan npm install. npm ci lebih cepat, deterministik, dan gagal jika lockfile tidak cocok dengan package.json.",
          ),
          h("Studi Kasus: Menambah Library Validasi"),
          tsCode(`
import { z } from "zod";

const skemaSiswa = z.object({
  nama: z.string().min(3),
  umur: z.number().int().min(10).max(100),
});

const hasil = skemaSiswa.safeParse({ nama: "Budi", umur: 20 });

if (hasil.success) {
  console.log("Valid:", hasil.data);
} else {
  console.error(hasil.error.flatten().fieldErrors);
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan field email dengan validasi format, lalu uji dengan input yang salah.",
          ),
          divider(),
        ],
      },
      {
        title: "Memilih Library & Membaca Dokumentasi",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menilai kualitas paket sebelum dipakai dan membaca dokumentasi dengan efisien agar tidak menambah dependency secara sembarangan.</p>",
          ),
          h("1. Kriteria Memilih Library"),
          p(
            "<ul><li><strong>Aktif dipelihara</strong> — commit dan rilis terbaru masih berjalan.</li><li><strong>Populer dan teruji</strong> — jumlah unduhan dan penggunaan di proyek nyata.</li><li><strong>Dukungan TypeScript</strong> — tipe bawaan atau <code>@types</code> resmi.</li><li><strong>Dokumentasi</strong> — contoh jelas, changelog, dan panduan migrasi.</li><li><strong>Lisensi</strong> — sesuai kebutuhan proyek.</li><li><strong>Ukuran dan dependency</strong> — tidak membawa terlalu banyak paket lain.</li></ul>",
          ),
          h("2. Melihat Informasi Paket"),
          bashCode(`
npm view zod version
npm view zod repository.url
npm view zod license
npm view zod dependencies
`),
          h("3. Membaca Dokumentasi"),
          p(
            "<p>Mulai dari README: instalasi, contoh terkecil, lalu bagian API. Setelah itu cek changelog untuk perubahan yang merusak. Jangan langsung menyalin contoh besar tanpa memahami input dan output-nya.</p>",
          ),
          callout(
            "warning",
            "Hindari memasang library hanya untuk fungsi yang bisa ditulis dalam beberapa baris. Setiap dependency menambah beban pemeliharaan dan risiko keamanan.",
          ),
          h("4. Contoh Membandingkan Dua Pilihan"),
          p(
            "<p>Misalnya kita butuh validasi data. Dua kandidat umum adalah Zod dan Joi. Bandingkan dukungan TypeScript, ukuran, sintaks, dan ekosistem. Untuk proyek TypeScript modern, Zod sering dipilih karena tipe diturunkan langsung dari skema.</p>",
          ),
          tsCode(`
import { z } from "zod";

const SkemaCatatan = z.object({
  judul: z.string().min(1),
  isi: z.string().default(""),
});

type Catatan = z.infer<typeof SkemaCatatan>;

const catatan: Catatan = SkemaCatatan.parse({ judul: "Belajar Node" });
console.log(catatan);
`),
          callout(
            "info",
            "z.infer membuat tipe TypeScript otomatis dari skema. Satu sumber kebenaran untuk validasi runtime dan tipe statis.",
          ),
          h("Studi Kasus: Membaca Dokumentasi dengan Cermat"),
          p(
            "<p>Sebelum memakai fungsi baru, cari tahu: apa parameternya, apa nilai kembaliannya, bagaimana cara menangani error, dan apakah ada versi minimum Node yang dibutuhkan.</p>",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Pilih satu paket kecil di npm, lalu tulis ringkasan 5 baris tentang fungsi, ukuran dependency, lisensi, dan kualitas dokumentasinya.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis NPM & Library",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis NPM & Pengenalan Library"),
          p("<p>Uji pemahaman tentang package.json, semver, dan pengelolaan library.</p>"),
          quiz("Kuis NPM & Library", [
            {
              q: "File yang menjadi identitas dan konfigurasi proyek Node adalah...",
              options: ["tsconfig.json", "package.json", "node_modules", ".env"],
              answer: 1,
            },
            {
              q: "Paket yang hanya dibutuhkan saat pengembangan masuk ke...",
              options: ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"],
              answer: 1,
            },
            {
              q: "Arti versi ^4.6.7 adalah...",
              options: [
                "Hanya 4.6.7",
                "4.6.x saja",
                "4.x.x terbaru, tidak sampai 5.0.0",
                "Semua versi terbaru",
              ],
              answer: 2,
            },
            {
              q: "File yang mengunci versi persis seluruh dependency adalah...",
              options: ["package.json", "package-lock.json", "tsconfig.json", ".npmrc"],
              answer: 1,
            },
            {
              q: "Perintah yang tepat untuk CI agar versi sesuai lockfile adalah...",
              options: ["npm install", "npm update", "npm ci", "npm run"],
              answer: 2,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 3 — TYPESCRIPT DARI NOL UNTUK NODE.JS
  // ==========================================================
  {
    name: "TypeScript dari Nol untuk Node.js",
    description:
      "Mempelajari TypeScript dari dasar: tipe, interface, generics, setup Node.js, strict mode, typing async/error, dan debugging.",
    lessons: [
      {
        title: "Kenapa TypeScript & Tipe Dasar",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami manfaat TypeScript dan menguasai tipe dasar yang paling sering dipakai di kode Node.js.</p>",
          ),
          h("1. TypeScript = JavaScript + Tipe"),
          p(
            "<p>TypeScript adalah superset JavaScript. Kode TypeScript dikompilasi menjadi JavaScript sebelum dijalankan. Tipe membantu menangkap kesalahan saat menulis kode, bukan setelah aplikasi berjalan.</p><p>Di Node.js, TypeScript sangat berguna untuk kontrak data: parameter fungsi, bentuk response API, konfigurasi, dan model database.</p>",
          ),
          h("2. Tipe Primitif"),
          tsCode(`
const nama: string = "Budi";
const umur: number = 20;
const aktif: boolean = true;
const kosong: null = null;
const belumAda: undefined = undefined;

const hobi: string[] = ["membaca", "coding"];
const pasangan: [string, number] = ["Budi", 20];

console.log(nama, umur, aktif, hobi, pasangan);
`),
          h("3. any vs unknown"),
          p(
            "<p><code>any</code> mematikan pemeriksaan tipe. Hindari kecuali terpaksa. <code>unknown</code> adalah versi aman: nilainya bisa apa saja, tetapi harus diperiksa sebelum dipakai.</p>",
          ),
          tsCode(`
let data: unknown = "halo";

// console.log(data.toUpperCase()); // error
if (typeof data === "string") {
  console.log(data.toUpperCase());
}

function ambilNilai(): unknown {
  return JSON.parse('{"nama":"Budi"}');
}

const hasil = ambilNilai();
if (typeof hasil === "object" && hasil !== null && "nama" in hasil) {
  console.log((hasil as { nama: string }).nama);
}
`),
          h("4. void, never, dan Inferensi"),
          tsCode(`
function logPesan(pesan: string): void {
  console.log(pesan);
}

function gagalSelamanya(): never {
  throw new Error("Berhenti");
}

const angka = [1, 2, 3].map((n) => n * 2); // number[]
`),
          callout(
            "info",
            "Manfaatkan inferensi. Tidak semua variabel perlu anotasi manual; biarkan TypeScript menyimpulkan tipe dari nilai awal atau return fungsi.",
          ),
          h("Studi Kasus: Model Data Sederhana"),
          tsCode(`
type Status = "aktif" | "nonaktif";

interface Profil {
  id: number;
  nama: string;
  status: Status;
  hobi?: string[];
}

const profil: Profil = {
  id: 1,
  nama: "Budi",
  status: "aktif",
};

console.log(profil);
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan tipe untuk alamat dengan field jalan, kota, dan kodePos, lalu buat satu objek profil lengkap.",
          ),
          divider(),
        ],
      },
      {
        title: "Interface, Type Alias, Union & Literal",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memodelkan data dengan <code>interface</code> dan <code>type</code>, memakai union dan literal, serta mempersempit tipe dengan aman.</p>",
          ),
          h("1. Interface"),
          tsCode(`
interface User {
  id: number;
  name: string;
  email?: string;
  readonly createdAt: Date;
}

const user: User = {
  id: 1,
  name: "Budi",
  createdAt: new Date(),
};

// user.createdAt = new Date(); // error: readonly
`),
          h("2. Type Alias"),
          tsCode(`
type Id = string | number;

type User = {
  id: Id;
  name: string;
  email?: string;
};

type UserWithPassword = User & {
  password: string;
};
`),
          h("3. Union & Literal"),
          tsCode(`
type Status = "draft" | "published" | "archived";

function label(status: Status): string {
  switch (status) {
    case "draft":
      return "Draf";
    case "published":
      return "Terbit";
    case "archived":
      return "Arsip";
  }
}
`),
          h("4. Discriminated Union & Narrowing"),
          tsCode(`
type Hasil =
  | { ok: true; data: string }
  | { ok: false; error: string };

function tampilkan(hasil: Hasil) {
  if (hasil.ok) {
    console.log(hasil.data);
  } else {
    console.error(hasil.error);
  }
}
`),
          p(
            "<p>Discriminated union cocok untuk response API, hasil validasi, dan state aplikasi. Satu field pembeda (di sini <code>ok</code>) membuat TypeScript tahu cabang mana yang sedang dipakai.</p>",
          ),
          callout(
            "warning",
            "Hindari type assertion (as) untuk memaksa tipe yang tidak sesuai. Lebih baik validasi data di runtime, misalnya dengan Zod, lalu gunakan hasilnya.",
          ),
          h("Studi Kasus: Status Pengiriman"),
          tsCode(`
type Pengiriman =
  | { status: "menunggu"; estimasiHari: number }
  | { status: "dikirim"; resi: string }
  | { status: "diterima"; diterimaOleh: string };

function ringkasan(data: Pengiriman): string {
  switch (data.status) {
    case "menunggu":
      return \`Menunggu, estimasi \${data.estimasiHari} hari\`;
    case "dikirim":
      return \`Dikirim dengan resi \${data.resi}\`;
    case "diterima":
      return \`Diterima oleh \${data.diterimaOleh}\`;
  }
}

console.log(ringkasan({ status: "dikirim", resi: "JNE123" }));
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan status \"dibatalkan\" dengan alasan pembatalan, lalu tangani di fungsi ringkasan.",
          ),
          divider(),
        ],
      },
      {
        title: "Generics & Utility Types",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menulis fungsi dan tipe yang fleksibel dengan generics, serta memakai utility types bawaan TypeScript untuk memanipulasi tipe.</p>",
          ),
          h("1. Generic Function"),
          tsCode(`
function pertama<T>(items: T[]): T | undefined {
  return items[0];
}

const angka = pertama([1, 2, 3]);          // number | undefined
const nama = pertama(["Budi", "Rina"]);    // string | undefined
const user = pertama([{ id: 1 }]);         // { id: number } | undefined
`),
          h("2. Generic dengan Constraint"),
          tsCode(`
function ambilProperti<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const profil = { nama: "Budi", umur: 20 };
const nama = ambilProperti(profil, "nama"); // string
const umur = ambilProperti(profil, "umur"); // number
`),
          h("3. Utility Types"),
          tsCode(`
interface User {
  id: number;
  name: string;
  email: string;
}

type UserDraft = Omit<User, "id">;
type UserPatch = Partial<UserDraft>;
type UserRingkas = Pick<User, "id" | "name">;
type PetaUser = Record<string, User>;

const patch: UserPatch = { name: "Rina" };
const ringkas: UserRingkas = { id: 1, name: "Budi" };
const peta: PetaUser = {
  budi: { id: 1, name: "Budi", email: "budi@contoh.id" },
};

console.log(patch, ringkas, peta);
`),
          h("4. Generic pada Interface"),
          tsCode(`
interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
}

function bungkus<T>(items: T[], page = 1): Paginated<T> {
  return { items, total: items.length, page };
}

const hasil = bungkus([{ id: 1 }, { id: 2 }]);
console.log(hasil.items[0]?.id);
`),
          callout(
            "info",
            "Generics membuat satu fungsi aman dipakai untuk banyak tipe tanpa kehilangan informasi tipe. Mulai sederhana: gunakan generic saat benar-benar ada kebutuhan fleksibilitas.",
          ),
          h("Studi Kasus: Fungsi Map yang Aman"),
          tsCode(`
function petakan<T, U>(items: T[], fn: (item: T, index: number) => U): U[] {
  return items.map(fn);
}

const harga = petakan(
  [{ nama: "Buku", harga: 50000 }],
  (item) => item.harga * 1.1,
);

console.log(harga);
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat fungsi filterAman<T>(items: T[], predicate: (item: T) => boolean): T[] dan gunakan pada array angka.",
          ),
          divider(),
        ],
      },
      {
        title: "Setup TypeScript di Node.js",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyiapkan proyek Node.js + TypeScript dari nol: instalasi, tsconfig, menjalankan development, dan build produksi.</p>",
          ),
          h("1. Instalasi"),
          bashCode(`
npm init -y
npm install -D typescript tsx @types/node
`),
          h("2. tsconfig.json"),
          p(
            "<p>Konfigurasi berikut memakai ESM modern, target ES2022, dan mode strict. <code>NodeNext</code> mengikuti aturan resolusi modul Node.js.</p>",
          ),
          jsonCode(`
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
`),
          h("3. package.json"),
          jsonCode(`
{
  "name": "latihan-node",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  }
}
`),
          h("4. Menjalankan"),
          bashCode(`
npx tsx src/index.ts
npm run dev
npm run build
npm start
`),
          p(
            "<p><code>tsx</code> menjalankan TypeScript langsung saat development. <code>tsc</code> menghasilkan file JavaScript di <code>dist</code> untuk produksi.</p>",
          ),
          callout(
            "warning",
            "Pada ESM + NodeNext, import antar file lokal memakai ekstensi .js, misalnya import { tambah } from \"./math.js\". Ini bukan salah ketik: output build memang bernama .js.",
          ),
          h("5. Verifikasi Build"),
          bashCode(`
npm run typecheck
npm run build
node dist/index.js
`),
          h("Studi Kasus: Struktur Awal"),
          tsCode(`
// src/index.ts
const port: number = Number(process.env.PORT ?? 3000);

console.log(\`Aplikasi siap di port \${port}\`);
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan file src/math.ts dengan satu fungsi, impor di index.ts, lalu pastikan build dan typecheck tetap lolos.",
          ),
          divider(),
        ],
      },
      {
        title: "Strict Mode & Typing Async/Error",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memanfaatkan strict mode dan mengetik operasi asynchronous serta error dengan aman.</p>",
          ),
          h("1. Apa yang Diaktifkan strict?"),
          p(
            "<ul><li><code>noImplicitAny</code> — parameter tanpa tipe harus dianotasi.</li><li><code>strictNullChecks</code> — <code>null</code> dan <code>undefined</code> diperiksa terpisah.</li><li><code>strictFunctionTypes</code> — tanda tangan fungsi diperiksa lebih ketat.</li><li><code>useUnknownInCatchVariables</code> — nilai di <code>catch</code> bertipe <code>unknown</code>.</li></ul>",
          ),
          h("2. Typing Async"),
          tsCode(`
interface User {
  id: string;
  name: string;
}

async function ambilUser(id: string): Promise<User> {
  const res = await fetch(\`https://api.example.com/users/\${id}\`);

  if (!res.ok) {
    throw new Error(\`Gagal mengambil user: \${res.status}\`);
  }

  return (await res.json()) as User;
}
`),
          callout(
            "warning",
            "Type assertion as User tidak memvalidasi data runtime. Untuk API nyata, validasi response dengan Zod atau skema lain sebelum dipercaya.",
          ),
          h("3. Menangani Error unknown"),
          tsCode(`
async function jalankan() {
  try {
    const user = await ambilUser("1");
    console.log(user.name);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Terjadi error yang tidak diketahui");
    }
  }
}

void jalankan();
`),
          h("4. Pola Result"),
          p(
            "<p>Selain throw, kamu bisa mengembalikan objek hasil yang eksplisit. Pola ini berguna saat error adalah bagian normal dari alur bisnis.</p>",
          ),
          tsCode(`
type Hasil<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

async function parseAngka(input: string): Promise<Hasil<number>> {
  const angka = Number(input);
  if (Number.isNaN(angka)) {
    return { ok: false, error: "Bukan angka" };
  }
  return { ok: true, value: angka };
}
`),
          callout(
            "info",
            "Gunakan throw untuk error yang tidak terduga, dan hasil eksplisit untuk kegagalan yang memang diperkirakan. Konsistensi di seluruh proyek lebih penting daripada memilih salah satu saja.",
          ),
          h("Studi Kasus: Membaca JSON dengan Aman"),
          tsCode(`
type Config = { port: number; host: string };

function parseConfig(raw: string): Config {
  const data: unknown = JSON.parse(raw);
  if (
    typeof data !== "object" ||
    data === null ||
    typeof (data as Config).port !== "number" ||
    typeof (data as Config).host !== "string"
  ) {
    throw new Error("Config tidak valid");
  }
  return data as Config;
}

console.log(parseConfig('{"port":4000,"host":"localhost"}'));
`),
          callout(
            "success",
            "Tantangan Mandiri: Ubah parseConfig agar mengembalikan Hasil<Config> tanpa melempar error.",
          ),
          divider(),
        ],
      },
      {
        title: "Debugging TypeScript",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membaca error compiler, memakai source map, dan men-debug kode TypeScript dengan VS Code atau inspector Node.</p>",
          ),
          h("1. Membaca Error Compiler"),
          p(
            "<p>Error TypeScript punya kode dan lokasi. Contoh <code>TS2307</code> berarti modul tidak ditemukan, <code>TS2345</code> berarti argumen tidak cocok, dan <code>TS7006</code> berarti parameter implicit any.</p>",
          ),
          bashCode(`
npm run typecheck
# src/index.ts:3:15 - error TS2307: Cannot find module './math.js'
`),
          h("2. Source Map"),
          p(
            "<p>Aktifkan <code>sourceMap: true</code> di tsconfig agar stack trace menunjuk ke file <code>.ts</code> asli, bukan hasil build.</p>",
          ),
          jsonCode(`
{
  "compilerOptions": {
    "sourceMap": true
  }
}
`),
          h("3. Debug dengan VS Code"),
          p(
            "<p>Buat <code>.vscode/launch.json</code> untuk menjalankan file TypeScript aktif memakai tsx.</p>",
          ),
          jsonCode(`
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TSX",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["tsx", "\${file}"],
      "console": "integratedTerminal"
    }
  ]
}
`),
          h("4. Inspector Node"),
          bashCode(`
node --inspect-brk dist/index.js
# buka chrome://inspect atau VS Code Attach
`),
          callout(
            "info",
            "Saat error sulit, kecilkan masalah: jalankan satu fungsi, tambahkan console.log bertingkat, lalu periksa tipe data di batas modul.",
          ),
          h("Studi Kasus: Error Umum & Solusinya"),
          p(
            "<ul><li><strong>Cannot find module</strong> — cek path dan ekstensi <code>.js</code> pada import ESM.</li><li><strong>Object is possibly undefined</strong> — tangani dengan pengecekan atau nilai default.</li><li><strong>Type string is not assignable to number</strong> — konversi dengan <code>Number()</code> dan validasi hasilnya.</li><li><strong>Parameter implicitly has any type</strong> — beri anotasi atau biarkan inferensi dari konteks.</li></ul>",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Sengaja buat satu error tipe, baca pesannya, lalu perbaiki tanpa melihat solusi. Latihan ini melatih kemampuan membaca compiler.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis TypeScript",
        duration: 12,
        type: "QUIZ",
        blocks: [
          h("Kuis TypeScript dari Nol"),
          p("<p>Uji pemahaman tipe dasar, interface, generics, strict mode, dan setup Node.js.</p>"),
          quiz("Kuis TypeScript", [
            {
              q: "Tipe yang aman dipakai sebelum nilainya diperiksa adalah...",
              options: ["any", "unknown", "never", "object"],
              answer: 1,
            },
            {
              q: "Kata kunci untuk membuat tipe objek yang bisa di-extend adalah...",
              options: ["class", "interface", "enum", "namespace"],
              answer: 1,
            },
            {
              q: "Utility type untuk membuat semua properti opsional adalah...",
              options: ["Pick", "Omit", "Partial", "Record"],
              answer: 2,
            },
            {
              q: "Pada tsconfig NodeNext, import file lokal memakai ekstensi...",
              options: [".ts", ".js", ".mjs", "tanpa ekstensi"],
              answer: 1,
            },
            {
              q: "Nilai error di dalam catch pada strict mode bertipe...",
              options: ["any", "Error", "unknown", "string"],
              answer: 2,
            },
            {
              q: "Perintah untuk memeriksa tipe tanpa menghasilkan file adalah...",
              options: ["tsc --build", "tsc --noEmit", "tsc --watch", "tsc --outDir"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 4 — NODE CORE I: PROCESS, PATH & FILE SYSTEM
  // ==========================================================
  {
    name: "Node.js Core I: Process, Path & File System",
    description:
      "Menggunakan modul inti Node untuk membaca environment, memanipulasi path, serta membaca dan menulis file dengan aman.",
    lessons: [
      {
        title: "process, env & Argumen",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membaca informasi runtime, environment variable, argumen, dan mengatur exit code pada aplikasi Node.</p>",
          ),
          h("1. Informasi Runtime"),
          tsCode(`
console.log({
  versi: process.version,
  platform: process.platform,
  arsitektur: process.arch,
  pid: process.pid,
  cwd: process.cwd(),
  uptime: process.uptime(),
});
`),
          h("2. Environment Variable"),
          p(
            "<p>Environment variable menyimpan konfigurasi yang berbeda antar lingkungan, seperti port dan koneksi database. Jangan menaruh secret di kode.</p>",
          ),
          tsCode(`
const port = Number(process.env.PORT ?? 3000);
const nodeEnv = process.env.NODE_ENV ?? "development";

console.log({ port, nodeEnv });
`),
          bashCode(`
# macOS / Linux
PORT=4000 NODE_ENV=production node dist/index.js

# Windows PowerShell
$env:PORT=4000; $env:NODE_ENV="production"; node dist/index.js
`),
          callout(
            "warning",
            "Jangan pernah commit file .env. Sediakan .env.example berisi nama variabel tanpa nilai rahasia, lalu muat file .env dengan dotenv atau opsi --env-file milik Node.",
          ),
          h("3. Argumen & Exit Code"),
          tsCode(`
const [, , perintah, ...sisa] = process.argv;

if (!perintah) {
  console.error("Perintah wajib diisi");
  process.exitCode = 1;
} else {
  console.log({ perintah, sisa });
}
`),
          h("4. Stream Standar"),
          p(
            "<p><code>process.stdout</code> dan <code>process.stderr</code> adalah stream. Menulis ke stderr berguna untuk log error, sementara stdout untuk output normal yang mungkin diproses program lain.</p>",
          ),
          callout(
            "info",
            "Pisahkan log error ke stderr agar pipeline seperti node script.js | grep tetap bersih dan CI dapat membedakan error dari output biasa.",
          ),
          h("Studi Kasus: Konfigurasi Aplikasi"),
          tsCode(`
type Config = {
  port: number;
  host: string;
  isProduction: boolean;
};

function bacaConfig(): Config {
  const port = Number(process.env.PORT ?? 4000);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT tidak valid");
  }

  return {
    port,
    host: process.env.HOST ?? "0.0.0.0",
    isProduction: process.env.NODE_ENV === "production",
  };
}

console.log(bacaConfig());
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan variabel LOG_LEVEL dengan nilai default \"info\" dan validasi agar hanya menerima debug, info, warn, atau error.",
          ),
          divider(),
        ],
      },
      {
        title: "path & URL",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menggabungkan path lintas sistem operasi dan mengurai URL dengan modul <code>node:path</code> dan <code>node:url</code>.</p>",
          ),
          h("1. Mengapa Tidak Menyusun Path Manual?"),
          p(
            "<p>Windows memakai backslash, Linux dan macOS memakai slash. Modul <code>path</code> menangani perbedaan itu sehingga kode tetap portabel.</p>",
          ),
          tsCode(`
import path from "node:path";

const file = path.join("data", "catatan", "hari-1.json");

console.log(file);                      // data/catatan/hari-1.json (Linux)
console.log(path.basename(file));       // hari-1.json
console.log(path.extname(file));        // .json
console.log(path.dirname(file));        // data/catatan
console.log(path.resolve(file));        // path absolut dari cwd
`),
          h("2. Path Absolut dari import.meta.url"),
          p(
            "<p>Pada ESM tidak ada <code>__dirname</code>. Gunakan <code>import.meta.url</code> lalu konversi dengan <code>fileURLToPath</code>.</p>",
          ),
          tsCode(`
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "..", "data");
console.log(__dirname);
console.log(dataDir);
`),
          callout(
            "warning",
            "Jangan memakai path relatif terhadap process.cwd() untuk file internal aplikasi. Saat aplikasi dijalankan dari folder lain, path bisa salah. Gunakan lokasi modul atau konfigurasi eksplisit.",
          ),
          h("3. Modul URL"),
          tsCode(`
const url = new URL("https://example.com/blog?page=2&tag=node");

console.log(url.protocol);                    // https:
console.log(url.hostname);                    // example.com
console.log(url.pathname);                    // /blog
console.log(url.searchParams.get("page"));    // "2"
console.log(url.searchParams.get("tag"));     // "node"
`),
          h("4. URLSearchParams"),
          tsCode(`
const params = new URLSearchParams({
  search: "node js",
  page: "1",
});

console.log(params.toString()); // search=node+js&page=1

params.set("page", "2");
params.delete("search");
console.log(params.toString()); // page=2
`),
          callout(
            "info",
            "Gunakan URL dan URLSearchParams alih-alih memotong string secara manual. Keduanya menangani encoding karakter khusus dengan benar.",
          ),
          h("Studi Kasus: Menyusun Lokasi File Data"),
          tsCode(`
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(root, "data", "users.json");

console.log("File data:", dataFile);
console.log("Folder:", path.dirname(dataFile));
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat fungsi yang menerima URL lengkap lalu mengembalikan objek { host, path, query } yang sudah diurai.",
          ),
          divider(),
        ],
      },
      {
        title: "Membaca & Menulis File dengan fs/promises",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membaca dan menulis file secara asynchronous, menangani error file yang tidak ada, dan menyimpan data JSON dengan rapi.</p>",
          ),
          h("1. API Promise"),
          p(
            "<p>Gunakan <code>node:fs/promises</code> agar bisa memakai <code>await</code>. Hindari versi sinkron (<code>readFileSync</code>) di server karena memblokir event loop.</p>",
          ),
          tsCode(`
import { readFile, writeFile } from "node:fs/promises";

const isi = await readFile("catatan.txt", "utf8");
console.log(isi);

await writeFile("catatan-baru.txt", "Halo Node", "utf8");
`),
          h("2. Menangani File yang Tidak Ada"),
          tsCode(`
import { readFile } from "node:fs/promises";

async function bacaAtauKosong(path: string): Promise<string> {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    const kode = (error as NodeJS.ErrnoException).code;
    if (kode === "ENOENT") return "";
    throw error;
  }
}
`),
          h("3. Menyimpan JSON"),
          tsCode(`
import { readFile, writeFile } from "node:fs/promises";

type Catatan = { id: number; judul: string; selesai: boolean };

async function bacaCatatan(): Promise<Catatan[]> {
  try {
    const isi = await readFile("data/catatan.json", "utf8");
    return JSON.parse(isi) as Catatan[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function simpanCatatan(catatan: Catatan[]): Promise<void> {
  await writeFile(
    "data/catatan.json",
    JSON.stringify(catatan, null, 2),
    "utf8",
  );
}
`),
          callout(
            "warning",
            "Pastikan folder tujuan sudah ada sebelum menulis. writeFile tidak membuat folder induk secara otomatis; gunakan mkdir recursive terlebih dahulu.",
          ),
          h("4. Append & Encoding"),
          tsCode(`
import { appendFile, readFile } from "node:fs/promises";

await appendFile("log.txt", \`[\${new Date().toISOString()}] aplikasi mulai\\n\`, "utf8");

const log = await readFile("log.txt", "utf8");
console.log(log);
`),
          callout(
            "info",
            "Selalu tentukan encoding \"utf8\" saat membaca teks. Tanpa itu, hasilnya Buffer dan harus dikonversi manual.",
          ),
          h("Studi Kasus: Penyimpanan Catatan Sederhana"),
          tsCode(`
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), "data");
const file = path.join(dir, "catatan.json");

async function main() {
  await mkdir(dir, { recursive: true });

  let catatan: { id: number; judul: string }[] = [];
  try {
    catatan = JSON.parse(await readFile(file, "utf8"));
  } catch {
    catatan = [];
  }

  catatan.push({ id: Date.now(), judul: "Belajar fs/promises" });
  await writeFile(file, JSON.stringify(catatan, null, 2), "utf8");

  console.log("Tersimpan:", catatan.length, "catatan");
}

await main();
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan fungsi hapusCatatan(id) yang membaca file, menyaring data, lalu menulis ulang.",
          ),
          divider(),
        ],
      },
      {
        title: "Folder, stat & Buffer/Encoding",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengelola folder, memeriksa metadata file, serta memahami Buffer dan encoding untuk data biner.</p>",
          ),
          h("1. Membuat dan Membaca Folder"),
          tsCode(`
import { mkdir, readdir } from "node:fs/promises";

await mkdir("data/arsip", { recursive: true });

const entries = await readdir("data", { withFileTypes: true });

for (const entry of entries) {
  console.log(entry.name, entry.isDirectory() ? "folder" : "file");
}
`),
          h("2. Stat: Metadata File"),
          tsCode(`
import { stat } from "node:fs/promises";

const info = await stat("data/catatan.json");

console.log({
  ukuran: info.size,
  file: info.isFile(),
  folder: info.isDirectory(),
  diubah: info.mtime,
});
`),
          h("3. Rename, Copy & Hapus"),
          tsCode(`
import { copyFile, rename, rm } from "node:fs/promises";

await copyFile("data/catatan.json", "data/backup.json");
await rename("data/backup.json", "data/backup-lama.json");
await rm("data/backup-lama.json", { force: true });
`),
          callout(
            "warning",
            "rm dengan opsi recursive hanya untuk folder yang benar-benar boleh dihapus. Periksa path terlebih dahulu agar tidak menghapus data penting.",
          ),
          h("4. Buffer & Encoding"),
          p(
            "<p>Buffer adalah representasi byte. File, socket, dan stream menghasilkan Buffer. Untuk teks, konversikan dengan encoding yang sesuai.</p>",
          ),
          tsCode(`
const teks = "Halo Node";
const buffer = Buffer.from(teks, "utf8");

console.log(buffer);                        // <Buffer ...>
console.log(buffer.length);                 // jumlah byte
console.log(buffer.toString("base64"));     // encoding base64
console.log(buffer.toString("utf8"));       // kembali ke teks
`),
          h("5. Base64 untuk Data Kecil"),
          tsCode(`
function keBase64(teks: string): string {
  return Buffer.from(teks, "utf8").toString("base64");
}

function dariBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

const encoded = keBase64("rahasia");
console.log(encoded);
console.log(dariBase64(encoded));
`),
          callout(
            "info",
            "Base64 bukan enkripsi. Ia hanya mengubah representasi data. Jangan pernah menganggap base64 sebagai cara mengamankan secret.",
          ),
          h("Studi Kasus: Ringkasan Isi Folder"),
          tsCode(`
import { readdir, stat } from "node:fs/promises";

async function ringkasanFolder(folder: string) {
  const entries = await readdir(folder, { withFileTypes: true });
  let totalByte = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const info = await stat(\`\${folder}/\${entry.name}\`);
    totalByte += info.size;
  }

  return { jumlahFile: entries.length, totalByte };
}

console.log(await ringkasanFolder("data"));
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat fungsi yang menampilkan ukuran setiap file dalam KB dan MB, lalu urutkan dari yang terbesar.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Core I",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Node.js Core I"),
          p("<p>Uji pemahaman process, path, URL, file system, dan Buffer.</p>"),
          quiz("Kuis Core I", [
            {
              q: "Modul yang dipakai untuk menggabungkan path secara portabel adalah...",
              options: ["node:fs", "node:path", "node:url", "node:os"],
              answer: 1,
            },
            {
              q: "Pada ESM, folder file saat ini diperoleh dari...",
              options: ["__dirname", "process.cwd() saja", "import.meta.url", "require.main"],
              answer: 2,
            },
            {
              q: "API file system yang mendukung await adalah...",
              options: ["fs/promises", "fs.sync", "fs.callback", "fs.stream"],
              answer: 0,
            },
            {
              q: "Kode error saat file tidak ditemukan adalah...",
              options: ["EACCES", "ENOENT", "EEXIST", "EISDIR"],
              answer: 1,
            },
            {
              q: "Buffer.from(\"Halo\", \"utf8\").toString(\"base64\") menghasilkan...",
              options: ["Teks terenkripsi", "Representasi base64 dari byte teks", "Buffer baru", "Error"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },
];
