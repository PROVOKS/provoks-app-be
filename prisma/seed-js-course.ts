/**
 * Seed course "Belajar JavaScript: Dari Nol sampai Async".
 *
 * Jalankan: npm run seed:js
 *
 * Idempotent: course dengan slug yang sama dibangun ulang bagiannya.
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
const code = (src: string, language = "javascript"): Block => ({
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
    name: "Pengenalan JavaScript",
    description:
      "Memahami peran JavaScript dan cara menjalankannya di browser maupun Node.js.",
    lessons: [
      {
        title: "Apa Itu JavaScript & Perannya",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menjelaskan peran JavaScript dan bedanya dengan HTML serta CSS.</p>",
          ),
          p(
            "<p><strong>HTML</strong> menyusun struktur, <strong>CSS</strong> mengatur tampilan, dan <strong>JavaScript</strong> menambahkan <em>perilaku</em>: merespons klik, memvalidasi form, mengambil data dari server, dan memperbarui halaman tanpa reload.</p>",
          ),
          code(`
<h1 id="judul">Halo</h1>
<button id="tombol">Ganti Judul</button>

<script>
  const tombol = document.getElementById("tombol");
  const judul = document.getElementById("judul");

  tombol.addEventListener("click", () => {
    judul.textContent = "Judul sudah diganti!";
  });
</script>
`, "html"),
          callout(
            "info",
            "JavaScript berjalan di browser (client) maupun di server lewat Node.js.",
          ),
          divider(),
        ],
      },
      {
        title: "Cara Menjalankan JavaScript",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menjalankan kode JS lewat console browser, tag script, dan Node.js.</p>"),
          h("1. Console browser"),
          p(
            "<p>Buka DevTools (<code>F12</code>) → tab <strong>Console</strong>, lalu ketik kode dan tekan Enter.</p>",
          ),
          code(`
console.log("Halo dari console");
`),
          h("2. Di dalam halaman HTML"),
          code(`
<body>
  <h1>Belajar JS</h1>
  <script>
    console.log("Script berjalan");
  </script>
</body>
`, "html"),
          h("3. File terpisah"),
          code(`
<script src="app.js"></script>

<!-- app.js -->
console.log("Dari file terpisah");
`),
          callout(
            "warning",
            "Kalau script butuh elemen HTML, letakkan di akhir body atau tambahkan atribut defer.",
          ),
          divider(),
        ],
      },
      {
        title: "console.log, Komentar & Debugging",
        duration: 10,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Melihat nilai variabel dan menulis komentar dengan benar.</p>"),
          code(`
// komentar satu baris
/* komentar
   beberapa baris */

const nama = "Budi";
const umur = 21;

console.log("Nama:", nama);
console.log("Umur:", umur, "tahun");

console.table([{ nama: "Budi", umur: 21 }]);
console.warn("Ini peringatan");
console.error("Ini error");
`),
          p(
            "<p><code>console.log</code> adalah alat debugging paling dasar. Untuk melihat isi object/array, <code>console.table</code> lebih rapi.</p>",
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
          p("<p>Uji pemahaman dasar tentang JS.</p>"),
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

  // ----------------------------------------------------------
  {
    name: "Dasar JavaScript",
    description:
      "Variabel, tipe data, operator, string, dan konversi tipe.",
    lessons: [
      {
        title: "Variabel: let, const, var",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Membuat variabel dengan cara yang benar dan tahu kapan memakai const.</p>"),
          code(`
const nama = "Budi";   // tidak bisa diisi ulang
let umur = 21;         // bisa diubah
umur = 22;

var lama = "hindari"; // cara lama, hindari di kode baru

console.log(nama, umur);
`),
          p(
            "<ul><li><code>const</code> — default pilihan pertama.</li><li><code>let</code> — kalau nilainya memang berubah.</li><li><code>var</code> — cara lama, punya perilaku scope yang membingungkan.</li></ul>",
          ),
          callout(
            "warning",
            "Objek/array yang disimpan di <code>const</code> masih bisa diubah isinya, hanya variabelnya yang tidak bisa diganti.",
          ),
          divider(),
        ],
      },
      {
        title: "Tipe Data",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengenal tipe data primitif dan object.</p>"),
          code(`
const teks = "Halo";          // string
const angka = 42;             // number
const benar = true;           // boolean
const kosong = null;          // null
let belumDiisi;               // undefined

const daftar = ["HTML", "CSS"];             // array (object)
const siswa = { nama: "Budi", umur: 21 };   // object

console.log(typeof teks);   // "string"
console.log(typeof angka);  // "number"
console.log(Array.isArray(daftar)); // true
`),
          callout(
            "info",
            "JavaScript tidak membedakan integer dan desimal — semuanya <code>number</code>.",
          ),
          divider(),
        ],
      },
      {
        title: "Operator",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memakai operator aritmatika, perbandingan, dan logika.</p>"),
          code(`
// aritmatika
console.log(10 + 3);  // 13
console.log(10 % 3);  // 1

// perbandingan
console.log(5 == "5");   // true  (longgar)
console.log(5 === "5");  // false (ketat, cek tipe)

// logika
console.log(true && false); // false
console.log(true || false); // true
console.log(!true);         // false
`),
          callout(
            "warning",
            "Selalu pakai <code>===</code> dan <code>!==</code> agar tipe data ikut dibandingkan.",
          ),
          divider(),
        ],
      },
      {
        title: "String & Template Literal",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menyusun teks dinamis dengan template literal dan method string.</p>"),
          code(`
const nama = "Budi";
const umur = 21;

const sapaan = \`Halo, \${nama}! Umurmu \${umur} tahun.\`;
console.log(sapaan);

const kalimat = "  Belajar JavaScript  ";
console.log(kalimat.trim().toUpperCase());
console.log("HTML,CSS,JS".split(","));
console.log(nama.repeat(3));
`),
          p(
            "<p>Template literal memakai backtick dan <code>${}</code> untuk menyisipkan nilai. Method umum: <code>trim</code>, <code>toUpperCase</code>, <code>slice</code>, <code>split</code>, <code>includes</code>, <code>replace</code>.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Konversi Tipe & NaN",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengubah tipe data dan mengenali <code>NaN</code>.</p>"),
          code(`
console.log(Number("42"));     // 42
console.log(Number("42px"));   // NaN
console.log(parseInt("42px")); // 42
console.log(String(42));       // "42"
console.log(Boolean(""));      // false

console.log(Number.isNaN(NaN)); // true
`),
          p(
            "<p><strong>NaN</strong> (Not a Number) muncul saat konversi gagal. Selalu cek dengan <code>Number.isNaN()</code>, bukan <code>=== NaN</code>.</p>",
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

  // ----------------------------------------------------------
  {
    name: "Kontrol Alur",
    description: "Percabangan dan perulangan.",
    lessons: [
      {
        title: "if / else if / else",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Membuat keputusan dengan kondisi.</p>"),
          code(`
const nilai = 82;

if (nilai >= 85) {
  console.log("A");
} else if (nilai >= 70) {
  console.log("B");
} else {
  console.log("C");
}

// ternary
const status = nilai >= 70 ? "lulus" : "belum lulus";
console.log(status);
`),
          callout(
            "info",
            "Ternary cocok untuk kondisi sederhana. Kalau bercabang banyak, pakai if/else atau switch agar mudah dibaca.",
          ),
          divider(),
        ],
      },
      {
        title: "switch",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memilih banyak kemungkinan nilai dengan switch.</p>"),
          code(`
const peran = "ADMIN";

switch (peran) {
  case "ADMIN":
    console.log("Akses penuh");
    break;
  case "INSTRUCTOR":
    console.log("Akses materi");
    break;
  case "STUDENT":
    console.log("Akses belajar");
    break;
  default:
    console.log("Peran tidak dikenal");
}
`),
          callout(
            "warning",
            "Jangan lupa <code>break</code>. Tanpa break, eksekusi akan lanjut ke case berikutnya.",
          ),
          divider(),
        ],
      },
      {
        title: "Loop: for, while, do-while",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengulang pekerjaan dengan tiga jenis loop.</p>"),
          code(`
for (let i = 1; i <= 5; i += 1) {
  console.log("Perulangan ke-" + i);
}

let hitung = 0;
while (hitung < 3) {
  console.log("while", hitung);
  hitung += 1;
}

let sekali = 0;
do {
  console.log("do-while", sekali);
  sekali += 1;
} while (sekali < 2);
`),
          p(
            "<p>Pakai <code>for</code> kalau jumlah perulangan diketahui, <code>while</code> kalau bergantung kondisi, dan <code>do-while</code> kalau blok harus jalan minimal sekali.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "for...of & for...in",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menelusuri array dan object.</p>"),
          code(`
const materi = ["HTML", "CSS", "JS"];

for (const item of materi) {
  console.log(item);
}

const siswa = { nama: "Budi", umur: 21 };

for (const key in siswa) {
  console.log(key, "=", siswa[key]);
}
`),
          p(
            "<p><code>for...of</code> untuk nilai (array, string, Map). <code>for...in</code> untuk key (object).</p>",
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

  // ----------------------------------------------------------
  {
    name: "Function & Scope",
    description: "Membuat fungsi, arrow function, parameter, dan scope.",
    lessons: [
      {
        title: "Function Declaration vs Expression",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Membuat fungsi dengan dua cara dan tahu bedanya.</p>"),
          code(`
// declaration — bisa dipanggil sebelum ditulis (hoisting)
function tambah(a, b) {
  return a + b;
}

// expression — disimpan di variabel
const kurang = function (a, b) {
  return a - b;
};

console.log(tambah(2, 3)); // 5
console.log(kurang(5, 2)); // 3
`),
          callout(
            "info",
            "Kalau fungsi tidak mengembalikan nilai, hasilnya <code>undefined</code>.",
          ),
          divider(),
        ],
      },
      {
        title: "Arrow Function",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menulis fungsi dengan sintaks ringkas.</p>"),
          code(`
const kali = (a, b) => a * b;

const sapa = (nama) => {
  return "Halo, " + nama;
};

const kuadrat = (n) => n * n;

console.log(kali(3, 4));
console.log(sapa("Budi"));
console.log([1, 2, 3].map((n) => n * 2));
`),
          p(
            "<p>Arrow function tidak punya <code>this</code> sendiri — berguna sebagai callback, tapi hindari untuk method object.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Parameter Default, Rest & Spread",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menangani parameter fleksibel dan menyalin data.</p>"),
          code(`
function sapa(nama = "Tamu") {
  return "Halo, " + nama;
}

function jumlahkan(...angka) {
  return angka.reduce((total, n) => total + n, 0);
}

const a = [1, 2];
const b = [3, 4];
const gabung = [...a, ...b];

const siswa = { nama: "Budi", umur: 21 };
const salinan = { ...siswa, umur: 22 };

console.log(sapa());
console.log(jumlahkan(1, 2, 3));
console.log(gabung, salinan);
`),
          divider(),
        ],
      },
      {
        title: "Scope & Closure",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memahami jangkauan variabel dan closure.</p>"),
          code(`
const global = "bisa diakses di mana saja";

function luar() {
  const pesan = "di dalam fungsi";

  function dalam() {
    console.log(pesan); // closure: mengingat variabel luar
  }

  return dalam;
}

const fn = luar();
fn();
`),
          p(
            "<p><code>let</code>/<code>const</code> memiliki block scope. Closure terjadi saat fungsi dalam tetap bisa mengakses variabel dari fungsi luar meski fungsi luar sudah selesai.</p>",
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

  // ----------------------------------------------------------
  {
    name: "Array & Object",
    description: "Method array penting, object, destructuring, dan JSON.",
    lessons: [
      {
        title: "Array Dasar",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menambah, menghapus, dan mengiris array.</p>"),
          code(`
const materi = ["HTML", "CSS"];

materi.push("JS");        // tambah di akhir
materi.unshift("Dasar");  // tambah di awal
materi.pop();             // hapus akhir
materi.shift();           // hapus awal

console.log(materi.length);
console.log(materi[0]);
console.log(materi.includes("CSS"));
console.log(materi.join(" | "));
console.log(materi.slice(0, 1)); // salinan, tidak mengubah asli
`),
          callout(
            "info",
            "<code>slice</code> menyalin, <code>splice</code> mengubah array asli.",
          ),
          divider(),
        ],
      },
      {
        title: "map, filter, find & reduce",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengolah array tanpa loop manual.</p>"),
          code(`
const angka = [1, 2, 3, 4, 5];

const kaliDua = angka.map((n) => n * 2);
const genap = angka.filter((n) => n % 2 === 0);
const pertamaBesar = angka.find((n) => n > 3);
const total = angka.reduce((acc, n) => acc + n, 0);

console.log(kaliDua);      // [2,4,6,8,10]
console.log(genap);        // [2,4]
console.log(pertamaBesar); // 4
console.log(total);        // 15
`),
          p(
            "<ul><li><code>map</code> mengubah setiap item.</li><li><code>filter</code> menyaring.</li><li><code>find</code> mengambil satu item pertama yang cocok.</li><li><code>reduce</code> merangkum jadi satu nilai.</li></ul>",
          ),
          divider(),
        ],
      },
      {
        title: "Object & Destructuring",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menyimpan data berpasangan dan membongkarnya dengan ringkas.</p>"),
          code(`
const siswa = {
  nama: "Budi",
  umur: 21,
  alamat: { kota: "Bandung" },
};

siswa.email = "budi@contoh.id";

const { nama, umur } = siswa;
const { kota } = siswa.alamat;

const { nama: namaSiswa, ...sisa } = siswa;

console.log(nama, umur, kota);
console.log(namaSiswa, sisa);
`),
          divider(),
        ],
      },
      {
        title: "JSON",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengubah object ke string JSON dan sebaliknya.</p>"),
          code(`
const siswa = { nama: "Budi", umur: 21 };

const teks = JSON.stringify(siswa);
console.log(teks); // {"nama":"Budi","umur":21}

const kembali = JSON.parse(teks);
console.log(kembali.nama);

const rapi = JSON.stringify(siswa, null, 2);
console.log(rapi);
`),
          callout(
            "warning",
            "JSON tidak mendukung function atau undefined. Field yang tidak didukung akan hilang.",
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
              options: ["const [a] = obj", "const { a } = obj", "const a = obj{a}", "const a <- obj"],
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

  // ----------------------------------------------------------
  {
    name: "DOM & Event",
    description: "Memanipulasi halaman: memilih elemen, mengubah konten, dan event.",
    lessons: [
      {
        title: "Memilih Elemen",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengambil elemen HTML lewat JavaScript.</p>"),
          code(`
<h1 id="judul">Halo</h1>
<p class="teks">Paragraf pertama</p>
<p class="teks">Paragraf kedua</p>

<script>
  const judul = document.getElementById("judul");
  const satuTeks = document.querySelector(".teks");
  const semuaTeks = document.querySelectorAll(".teks");

  console.log(judul.textContent);
  console.log(satuTeks.textContent);
  console.log(semuaTeks.length);
</script>
`, "html"),
          callout(
            "info",
            "<code>querySelector</code> mengembalikan elemen pertama, <code>querySelectorAll</code> mengembalikan NodeList semua yang cocok.",
          ),
          divider(),
        ],
      },
      {
        title: "Manipulasi Konten & Class",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengubah teks, HTML, style, dan class elemen.</p>"),
          code(`
const judul = document.querySelector("#judul");

judul.textContent = "Judul baru";
judul.innerHTML = "<em>Judul dengan miring</em>";

judul.classList.add("aktif");
judul.classList.remove("aktif");
judul.classList.toggle("aktif");

judul.style.color = "#e64a19";
judul.setAttribute("data-status", "selesai");
`),
          callout(
            "warning",
            "Hati-hati memakai <code>innerHTML</code> dengan data dari pengguna — bisa menjadi celah XSS. Untuk teks biasa, pakai <code>textContent</code>.",
          ),
          divider(),
        ],
      },
      {
        title: "Event Listener & Form",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Merespons klik dan submit form.</p>"),
          code(`
<form id="form">
  <input id="nama" placeholder="Nama">
  <button type="submit">Kirim</button>
</form>
<p id="hasil"></p>

<script>
  const form = document.querySelector("#form");
  const hasil = document.querySelector("#hasil");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nama = document.querySelector("#nama").value;
    hasil.textContent = "Halo, " + nama;
  });
</script>
`, "html"),
          p(
            "<p><code>event.preventDefault()</code> mencegah halaman reload saat form dikirim.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Membuat Elemen Dinamis",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menambahkan elemen baru dari data.</p>"),
          code(`
const daftar = document.querySelector("#daftar");
const materi = ["HTML", "CSS", "JavaScript"];

materi.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  li.className = "item";
  daftar.appendChild(li);
});
`, "javascript"),
          callout(
            "success",
            "Pola ini dipakai saat menampilkan data dari API ke halaman.",
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
              options: ["getElementById", "querySelector", "querySelectorAll", "getElementsByTag"],
              answer: 1,
            },
            {
              q: "Untuk mengubah teks tanpa risiko HTML dipakai...",
              options: ["innerHTML", "textContent", "outerHTML", "innerTextHTML"],
              answer: 1,
            },
            {
              q: "Untuk menambah class pada elemen dipakai...",
              options: ["classList.add()", "classList.push()", "addClass()", "style.class"],
              answer: 0,
            },
            {
              q: "Mencegah reload saat submit form memakai...",
              options: ["event.stop()", "event.preventDefault()", "return false saja", "event.reset()"],
              answer: 1,
            },
            {
              q: "Untuk membuat elemen baru dipakai...",
              options: ["document.new()", "document.createElement()", "document.append()", "new Element()"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  {
    name: "Asynchronous JavaScript",
    description:
      "Callback, Promise, async/await, dan menangani banyak request sekaligus.",
    lessons: [
      {
        title: "Sync vs Async & Event Loop",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memahami kenapa JavaScript butuh kode asynchronous.</p>"),
          code(`
console.log("1");

setTimeout(() => {
  console.log("2 - setelah 1 detik");
}, 1000);

console.log("3");

// output: 1, 3, 2
`),
          p(
            "<p>JavaScript menjalankan satu tugas pada satu waktu, tetapi operasi lambat (request jaringan, timer) diserahkan ke browser. Saat selesai, callback-nya masuk antrean dan dijalankan oleh <em>event loop</em>.</p>",
          ),
          callout(
            "info",
            "Karena itu <code>setTimeout(..., 0)</code> tetap berjalan setelah kode di bawahnya.",
          ),
          divider(),
        ],
      },
      {
        title: "Callback & Callback Hell",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengenal callback dan masalahnya.</p>"),
          code(`
function ambilData(callback) {
  setTimeout(() => {
    callback({ nama: "Budi" });
  }, 500);
}

ambilData((data) => {
  console.log("Data:", data.nama);
});

// callback bersarang -> sulit dibaca ("callback hell")
ambilData((a) => {
  ambilData((b) => {
    ambilData((c) => {
      console.log(a, b, c);
    });
  });
});
`),
          callout(
            "warning",
            "Callback bersarang membuat kode sulit dibaca dan rawan error. Promise dan async/await diciptakan untuk mengatasi ini.",
          ),
          divider(),
        ],
      },
      {
        title: "Promise",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memakai Promise untuk operasi yang selesai nanti.</p>"),
          code(`
function ambilData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const berhasil = true;
      if (berhasil) resolve({ nama: "Budi" });
      else reject(new Error("Gagal mengambil data"));
    }, 500);
  });
}

ambilData()
  .then((data) => {
    console.log("Sukses:", data.nama);
  })
  .catch((error) => {
    console.error(error.message);
  })
  .finally(() => {
    console.log("Selesai");
  });
`),
          p(
            "<p>Promise punya tiga status: <strong>pending</strong>, <strong>fulfilled</strong>, dan <strong>rejected</strong>.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "async / await & try/catch",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menulis kode async seperti kode biasa.</p>"),
          code(`
function ambilData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ nama: "Budi" }), 500);
  });
}

async function jalankan() {
  try {
    const data = await ambilData();
    console.log("Data:", data.nama);
  } catch (error) {
    console.error("Gagal:", error.message);
  }
}

jalankan();
`),
          callout(
            "warning",
            "<code>await</code> hanya bisa dipakai di dalam fungsi <code>async</code> (atau top-level di module).",
          ),
          divider(),
        ],
      },
      {
        title: "Promise.all & Promise.race",
        duration: 15,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Menjalankan beberapa operasi async sekaligus.</p>"),
          code(`
const a = Promise.resolve("A");
const b = Promise.resolve("B");

const hasil = await Promise.all([a, b]);
console.log(hasil); // ["A", "B"]

const cepat = await Promise.race([
  new Promise((r) => setTimeout(() => r("cepat"), 100)),
  new Promise((r) => setTimeout(() => r("lambat"), 500)),
]);
console.log(cepat); // "cepat"

const hasilAman = await Promise.allSettled([a, Promise.reject("gagal")]);
console.log(hasilAman);
`),
          p(
            "<p><code>Promise.all</code> gagal semua kalau satu gagal. <code>Promise.allSettled</code> tetap mengembalikan status tiap promise.</p>",
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
              options: ["Promise.race", "Promise.all", "Promise.any", "Promise.resolve"],
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

  // ----------------------------------------------------------
  {
    name: "Latihan API Eksternal",
    description:
      "Mengambil data dari API nyata dengan fetch, menampilkan ke halaman, dan menangani error.",
    lessons: [
      {
        title: "API & REST",
        duration: 12,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memahami istilah dasar API dan REST.</p>"),
          p(
            "<p><strong>API</strong> adalah perantara yang memungkinkan aplikasi meminta data ke server. <strong>REST</strong> adalah gaya API yang memakai HTTP method:</p><ul><li><code>GET</code> — mengambil data.</li><li><code>POST</code> — membuat data.</li><li><code>PUT</code>/<code>PATCH</code> — mengubah data.</li><li><code>DELETE</code> — menghapus data.</li></ul>",
          ),
          code(`
GET    https://jsonplaceholder.typicode.com/posts
GET    https://jsonplaceholder.typicode.com/posts/1
POST   https://jsonplaceholder.typicode.com/posts
`),
          p(
            "<p>Status code penting: <code>200</code> sukses, <code>201</code> dibuat, <code>400</code> permintaan salah, <code>404</code> tidak ditemukan, <code>500</code> error server.</p>",
          ),
          divider(),
        ],
      },
      {
        title: "fetch GET + Render ke Halaman",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengambil data dari API dan menampilkannya di DOM.</p>"),
          code(`
<ul id="daftar"></ul>

<script>
  async function ambilData() {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=5"
    );

    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const data = await response.json();
    const daftar = document.querySelector("#daftar");

    data.forEach((post) => {
      const li = document.createElement("li");
      li.textContent = post.title;
      daftar.appendChild(li);
    });
  }

  ambilData();
</script>
`, "html"),
          callout(
            "info",
            "JSONPlaceholder adalah API gratis untuk latihan: tidak butuh API key dan mendukung GET/POST/PUT/DELETE.",
          ),
          divider(),
        ],
      },
      {
        title: "Loading & Error Handling",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Memberi umpan balik saat data dimuat atau gagal.</p>"),
          code(`
<div id="status">Memuat data...</div>
<ul id="daftar"></ul>

<script>
  const status = document.querySelector("#status");
  const daftar = document.querySelector("#daftar");

  async function ambilData() {
    try {
      status.textContent = "Memuat data...";

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5"
      );
      if (!response.ok) throw new Error("HTTP " + response.status);

      const data = await response.json();
      status.textContent = "";

      data.forEach((post) => {
        const li = document.createElement("li");
        li.textContent = post.title;
        daftar.appendChild(li);
      });
    } catch (error) {
      status.textContent = "Gagal memuat data: " + error.message;
    }
  }

  ambilData();
</script>
`, "html"),
          callout(
            "warning",
            "Selalu cek <code>response.ok</code>. fetch tidak otomatis melempar error untuk status 404 atau 500.",
          ),
          divider(),
        ],
      },
      {
        title: "POST, PUT & DELETE",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p("<p>Mengirim data ke API dengan method selain GET.</p>"),
          code(`
const baru = {
  title: "Belajar fetch",
  body: "Mengirim data dengan POST",
  userId: 1,
};

const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(baru),
});

const hasil = await response.json();
console.log("Dibuat:", hasil);
`),
          p(
            "<p>Untuk <code>PUT</code> dan <code>DELETE</code>, ganti nilai <code>method</code> dan sesuaikan URL-nya. JSONPlaceholder hanya meniru perubahan (data tidak benar-benar tersimpan permanen).</p>",
          ),
          divider(),
        ],
      },
      {
        title: "Mini Project — Daftar Pengguna",
        duration: 25,
        blocks: [
          h("Tujuan Praktik"),
          p("<p>Menggabungkan fetch, render, loading, dan error handling.</p>"),
          code(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daftar Pengguna</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-6">
  <h1 class="text-2xl font-bold text-gray-900">Daftar Pengguna</h1>
  <p id="status" class="mt-2 text-sm text-gray-500">Memuat...</p>
  <div id="daftar" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>

  <script>
    const status = document.querySelector("#status");
    const daftar = document.querySelector("#daftar");

    async function muatPengguna() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        if (!response.ok) throw new Error("HTTP " + response.status);

        const users = await response.json();
        status.textContent = users.length + " pengguna ditemukan";

        users.forEach((user) => {
          const kartu = document.createElement("article");
          kartu.className = "rounded-xl border bg-white p-4 shadow-sm";

          const nama = document.createElement("h2");
          nama.className = "font-semibold text-gray-900";
          nama.textContent = user.name;

          const email = document.createElement("p");
          email.className = "mt-1 text-sm text-gray-600";
          email.textContent = user.email;

          kartu.append(nama, email);
          daftar.appendChild(kartu);
        });
      } catch (error) {
        status.textContent = "Gagal memuat: " + error.message;
      }
    }

    muatPengguna();
  </script>
</body>
</html>
`, "html"),
          callout(
            "success",
            "Coba ubah URL ke endpoint yang salah untuk melihat tampilan error.",
          ),
        ],
      },
      {
        title: "Kuis Akhir JavaScript",
        duration: 15,
        type: "QUIZ",
        blocks: [
          h("Ujian Akhir JavaScript"),
          p("<p>Kuis campuran dari seluruh materi.</p>"),
          quiz("Ujian Akhir JavaScript", [
            {
              q: "Keyword untuk variabel yang tidak bisa diganti adalah...",
              options: ["let", "const", "var", "static"],
              answer: 1,
            },
            {
              q: "`typeof 42` menghasilkan...",
              options: ["\"int\"", "\"number\"", "\"integer\"", "\"digit\""],
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
              options: ["getElementById", "querySelector", "querySelectorAll", "createElement"],
              answer: 1,
            },
            {
              q: "Mencegah reload pada submit form memakai...",
              options: ["preventDefault()", "stopPropagation()", "return null", "reset()"],
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
              options: ["response.ok", "response.success", "response.status === 100", "response.error"],
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
        duration: 8,
        blocks: [
          h("Yang sudah kamu pelajari"),
          p(
            "<ul><li>Dasar JS: variabel, tipe data, operator, string.</li><li>Kontrol alur, fungsi, scope, dan closure.</li><li>Array method, object, dan JSON.</li><li>DOM dan event.</li><li>Asynchronous: callback, Promise, async/await.</li><li>Mengambil dan menampilkan data dari API nyata.</li></ul>",
          ),
          h("Langkah selanjutnya"),
          p(
            "<ol><li><strong>Framework</strong> — React/Next.js untuk UI berbasis komponen.</li><li><strong>TypeScript</strong> — JavaScript dengan tipe.</li><li><strong>Backend</strong> — Node.js + database.</li><li><strong>Git</strong> — simpan dan kolaborasi kode.</li></ol>",
          ),
          callout(
            "success",
            "Selamat! Kamu sudah punya fondasi JavaScript sampai async dan bisa mengambil data dari API.",
          ),
        ],
      },
    ],
  },
];

const COURSE_SLUG = "belajar-javascript-dari-nol-sampai-async";
const COURSE_TITLE = "Belajar JavaScript: Dari Nol sampai Async";
const COURSE_DESCRIPTION =
  "Kursus JavaScript lengkap: pengenalan, variabel dan tipe data, kontrol alur, fungsi, array dan object, DOM, asynchronous (Promise & async/await), sampai latihan mengambil data dari API eksternal dengan fetch.";

async function main() {
  const tag = await prisma.tag.upsert({
    where: { slug: "javascript" },
    update: {},
    create: { name: "JavaScript", slug: "javascript", category: "Language" },
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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
