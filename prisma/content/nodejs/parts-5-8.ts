import {
  bashCode,
  callout,
  CoursePartDef,
  divider,
  h,
  jsonCode,
  p,
  quiz,
  tsCode,
} from "../helpers";

export const NODE_PARTS_5_8: CoursePartDef[] = [
  // ==========================================================
  // PART 5 — NODE.JS CORE II: ASYNC, EVENT & STREAM
  // ==========================================================
  {
    name: "Node.js Core II: Async, Event & Stream",
    description:
      "Memahami event loop Node.js, EventEmitter, stream, backpressure, serta menangani error asynchronous dan graceful shutdown.",
    lessons: [
      {
        title: "Event Loop & Blocking vs Non-Blocking",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami cara kerja event loop Node.js, urutan eksekusi timer dan microtask, serta dampak kode blocking terhadap server.</p>",
          ),
          h("1. Single Thread, Banyak Tugas"),
          p(
            "<p>JavaScript di Node berjalan pada satu thread utama. Operasi I/O seperti membaca file atau memanggil jaringan diserahkan ke libuv, lalu hasilnya dikembalikan lewat callback atau Promise. Selama menunggu, thread utama tetap bisa melayani pekerjaan lain.</p>",
          ),
          h("2. Urutan Eksekusi"),
          tsCode(`
console.log("1 — sinkron");

setTimeout(() => console.log("2 — timers"), 0);
setImmediate(() => console.log("3 — check"));

Promise.resolve().then(() => console.log("4 — promise microtask"));
process.nextTick(() => console.log("5 — nextTick"));

console.log("6 — sinkron");

// Perkiraan output:
// 1, 6, 5, 4, 2, 3
`),
          p(
            "<p>Kode sinkron selesai lebih dulu. Setelah itu microtask (<code>process.nextTick</code> lalu Promise) dijalankan sebelum event loop lanjut ke fase timers dan check.</p>",
          ),
          h("3. Blocking vs Non-Blocking"),
          tsCode(`
import { readFile } from "node:fs/promises";

// Non-blocking: thread utama bebas selama file dibaca
const isi = await readFile("data.txt", "utf8");
console.log(isi.length);
`),
          tsCode(`
// Blocking: seluruh server berhenti sampai loop selesai
function hitungBerat(): number {
  let total = 0;
  for (let i = 0; i < 5_000_000_000; i += 1) {
    total += i;
  }
  return total;
}

console.log(hitungBerat());
`),
          callout(
            "warning",
            "Satu operasi CPU berat dapat menahan semua permintaan lain. Untuk pekerjaan seperti kompresi, hashing besar, atau pengolahan gambar, gunakan worker_threads atau proses terpisah.",
          ),
          h("4. Timer & setImmediate"),
          tsCode(`
const id = setTimeout(() => console.log("timer"), 1000);
clearTimeout(id);

const interval = setInterval(() => {
  console.log("tick");
}, 1000);

setTimeout(() => clearInterval(interval), 3500);
`),
          callout(
            "info",
            "Jangan memakai setTimeout untuk menunggu operasi I/O. Gunakan Promise atau event yang memang menandakan selesainya pekerjaan.",
          ),
          h("Studi Kasus: Mengukur Dampak Blocking"),
          tsCode(`
import { createServer } from "node:http";

const server = createServer((req, res) => {
  const mulai = Date.now();

  if (req.url === "/berat") {
    let total = 0;
    for (let i = 0; i < 2_000_000_000; i += 1) total += i;
    res.end(\`berat selesai dalam \${Date.now() - mulai} ms\`);
    return;
  }

  res.end("ringan selesai");
});

server.listen(4000, () => console.log("http://localhost:4000"));
`),
          p(
            "<p>Buka <code>/berat</code> di satu tab, lalu buka <code>/</code> di tab lain. Permintaan ringan akan tertahan sampai loop selesai. Inilah gejala blocking.</p>",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Ubah contoh timer agar menampilkan urutan eksekusi lengkap dengan label, lalu jelaskan mengapa urutannya demikian.",
          ),
          divider(),
        ],
      },
      {
        title: "EventEmitter",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat dan memakai EventEmitter untuk komunikasi antar bagian aplikasi dengan pola event.</p>",
          ),
          h("1. Dasar EventEmitter"),
          tsCode(`
import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

emitter.on("pesan", (teks: string) => {
  console.log("Pesan diterima:", teks);
});

emitter.emit("pesan", "Halo");
`),
          h("2. on, once, off"),
          tsCode(`
const emitter = new EventEmitter();

function handler(teks: string) {
  console.log("handler:", teks);
}

emitter.on("pesan", handler);
emitter.once("pesan", () => console.log("hanya sekali"));

emitter.emit("pesan", "pertama");
emitter.emit("pesan", "kedua");

emitter.off("pesan", handler);
`),
          h("3. Event Error"),
          p(
            "<p>Event <code>error</code> istimewa: jika tidak ada listener, Node akan melempar error dan dapat menghentikan proses. Selalu pasang listener error pada emitter yang bisa gagal.</p>",
          ),
          tsCode(`
const emitter = new EventEmitter();

emitter.on("error", (error: Error) => {
  console.error("Terjadi error:", error.message);
});

emitter.emit("error", new Error("Koneksi gagal"));
`),
          h("4. EventEmitter dalam Class"),
          tsCode(`
import { EventEmitter } from "node:events";

class Toko extends EventEmitter {
  beli(item: string): void {
    console.log("Memproses pembelian:", item);
    this.emit("pembelian", item);
  }
}

const toko = new Toko();

toko.on("pembelian", (item: string) => {
  console.log("Notifikasi:", item, "terjual");
});

toko.beli("Buku");
`),
          callout(
            "info",
            "EventEmitter cocok untuk alur internal aplikasi, bukan pengganti antrean pesan antar server. Untuk komunikasi lintas proses, gunakan message broker.",
          ),
          h("Studi Kasus: Notifikasi Sederhana"),
          tsCode(`
import { EventEmitter } from "node:events";

type Pesanan = { id: string; total: number };

class PesananService extends EventEmitter {
  buat(pesanan: Pesanan) {
    this.emit("dibuat", pesanan);
  }

  selesai(pesanan: Pesanan) {
    this.emit("selesai", pesanan);
  }
}

const service = new PesananService();

service.on("dibuat", (pesanan: Pesanan) => {
  console.log("Kirim email untuk pesanan", pesanan.id);
});

service.on("selesai", (pesanan: Pesanan) => {
  console.log("Minta ulasan untuk pesanan", pesanan.id);
});

service.buat({ id: "A1", total: 50000 });
service.selesai({ id: "A1", total: 50000 });
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan event \"dibatalkan\" beserta alasannya, lalu pasang listener untuk mencatat pembatalan.",
          ),
          divider(),
        ],
      },
      {
        title: "Stream & pipeline",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membaca dan menulis data secara bertahap dengan stream, memakai pipeline, dan memahami backpressure.</p>",
          ),
          h("1. Mengapa Stream?"),
          p(
            "<p>Membaca file 2 GB sekaligus ke memori tidak efisien. Stream memproses data dalam potongan kecil (chunk), sehingga penggunaan memori tetap rendah dan data bisa diproses sambil mengalir.</p>",
          ),
          tsCode(`
import { createReadStream } from "node:fs";

const stream = createReadStream("data.txt", { encoding: "utf8" });

stream.on("data", (chunk: string) => {
  console.log("chunk:", chunk.length, "karakter");
});

stream.on("end", () => console.log("selesai"));
stream.on("error", (error: Error) => console.error(error.message));
`),
          h("2. Menulis dengan Stream"),
          tsCode(`
import { createWriteStream } from "node:fs";

const output = createWriteStream("output.txt", { encoding: "utf8" });

output.write("baris pertama\\n");
output.write("baris kedua\\n");
output.end("selesai\\n");
`),
          h("3. pipeline"),
          p(
            "<p><code>pipeline</code> menghubungkan beberapa stream dan menangani error serta penutupan resource secara otomatis.</p>",
          ),
          tsCode(`
import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

const upper = new Transform({
  transform(chunk, _encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

await pipeline(
  createReadStream("input.txt"),
  upper,
  createWriteStream("output.txt"),
);

console.log("Selesai mengubah isi file");
`),
          h("4. Backpressure"),
          p(
            "<p>Jika tujuan menulis lebih lambat daripada sumber membaca, data menumpuk. Stream memberi sinyal melalui nilai kembalian <code>write()</code> dan event <code>drain</code>. <code>pipeline</code> menangani ini otomatis, jadi utamakan pipeline daripada menyambung event manual.</p>",
          ),
          callout(
            "warning",
            "Jangan memakai pola baca-semua-lalu-tulis untuk file besar. Gunakan stream dan pipeline agar memori tetap stabil.",
          ),
          h("Studi Kasus: Menyalin File dengan Progress"),
          tsCode(`
import { createReadStream, createWriteStream, statSync } from "node:fs";
import { pipeline } from "node:stream/promises";

const sumber = "besar.zip";
const tujuan = "salinan.zip";
const total = statSync(sumber).size;
let terkirim = 0;

const baca = createReadStream(sumber);

baca.on("data", (chunk: Buffer) => {
  terkirim += chunk.length;
  const persen = Math.round((terkirim / total) * 100);
  process.stdout.write(\`\\r\${persen}%\`);
});

await pipeline(baca, createWriteStream(tujuan));
console.log("\\nSelesai");
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat pipeline yang membaca file teks, mengubah setiap baris menjadi format JSON, lalu menyimpannya ke file baru.",
          ),
          divider(),
        ],
      },
      {
        title: "Error Handling Async & Graceful Shutdown",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menangani error pada kode asynchronous, memberi batas waktu pada operasi jaringan, dan menutup server dengan rapi saat proses dihentikan.</p>",
          ),
          h("1. try/catch dengan await"),
          tsCode(`
async function ambilData(): Promise<string> {
  try {
    const res = await fetch("https://api.example.com/data");
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.text();
  } catch (error: unknown) {
    const pesan = error instanceof Error ? error.message : "Error tidak diketahui";
    throw new Error(\`Gagal mengambil data: \${pesan}\`);
  }
}
`),
          h("2. Timeout dengan AbortController"),
          tsCode(`
async function fetchDenganTimeout(url: string, ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

try {
  const data = await fetchDenganTimeout("https://example.com", 5000);
  console.log(data.length);
} catch (error) {
  console.error("Permintaan gagal atau timeout");
}
`),
          h("3. Graceful Shutdown"),
          p(
            "<p>Saat server menerima sinyal berhenti (misalnya dari Docker atau Kubernetes), hentikan penerimaan koneksi baru, selesaikan permintaan yang sedang berjalan, lalu tutup resource seperti koneksi database.</p>",
          ),
          tsCode(`
import { createServer } from "node:http";

const server = createServer((_req, res) => {
  res.end("OK");
});

server.listen(4000);

let sedangTutup = false;

function shutdown(signal: string) {
  if (sedangTutup) return;
  sedangTutup = true;
  console.log(\`\${signal} diterima, menutup server...\`);

  server.close(() => {
    console.log("Server ditutup dengan rapi");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Timeout, keluar paksa");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
`),
          callout(
            "info",
            "unref() pada timer timeout membuat timer tidak menahan proses tetap hidup. Ini pola umum agar shutdown tidak menggantung.",
          ),
          h("4. Error yang Tidak Tertangani"),
          tsCode(`
process.on("unhandledRejection", (reason) => {
  console.error("Promise rejection tanpa catch:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Exception tidak tertangani:", error);
  process.exitCode = 1;
});
`),
          callout(
            "warning",
            "Listener di atas berguna untuk logging, tetapi bukan izin mengabaikan error. Setelah uncaughtException, keadaan proses mungkin tidak lagi aman; biasanya lebih baik keluar lalu dibiarkan di-restart oleh process manager.",
          ),
          h("Studi Kasus: Menutup Koneksi Database"),
          tsCode(`
type Database = { tutup: () => Promise<void> };

async function shutdown(
  server: { close: (cb: () => void) => void },
  db: Database,
) {
  server.close(async () => {
    await db.tutup();
    process.exit(0);
  });
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan graceful shutdown yang juga menghentikan interval logging, lalu uji dengan Ctrl+C.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Core II",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Node.js Core II"),
          p("<p>Uji pemahaman event loop, EventEmitter, stream, dan penanganan shutdown.</p>"),
          quiz("Kuis Core II", [
            {
              q: "Microtask dijalankan...",
              options: [
                "Setelah setiap fase event loop",
                "Sebelum event loop lanjut ke fase berikutnya",
                "Hanya di akhir proses",
                "Bersamaan dengan timers",
              ],
              answer: 1,
            },
            {
              q: "Event yang istimewa karena tanpa listener dapat menghentikan proses adalah...",
              options: ["data", "end", "error", "close"],
              answer: 2,
            },
            {
              q: "Fungsi yang menghubungkan stream dan menangani error otomatis adalah...",
              options: ["stream.pipe saja", "pipeline", "readFile", "writeFile"],
              answer: 1,
            },
            {
              q: "Sinyal yang umum dikirim saat container dihentikan adalah...",
              options: ["SIGINT", "SIGTERM", "SIGHUP", "SIGKILL"],
              answer: 1,
            },
            {
              q: "Tujuan graceful shutdown adalah...",
              options: [
                "Langsung mematikan proses",
                "Menutup koneksi baru dan menyelesaikan pekerjaan yang berjalan",
                "Menghapus database",
                "Mengulang semua permintaan",
              ],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 6 — BASIC SERVER & HTTP
  // ==========================================================
  {
    name: "Basic Server & HTTP",
    description:
      "Membangun server HTTP dengan modul inti Node, memahami routing, query, body, struktur proyek, dan membuat REST API sederhana.",
    lessons: [
      {
        title: "Anatomi HTTP & REST",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami request-response HTTP, method, status code, header, body, serta prinsip dasar REST.</p>",
          ),
          h("1. Request dan Response"),
          p(
            "<p>Klien mengirim request berisi method, path, header, dan body. Server membalas dengan status code, header, dan body. Pada API modern, body umumnya JSON.</p>",
          ),
          tsCode(`
POST /api/notes HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Authorization: Bearer token

{
  "judul": "Belajar Node",
  "isi": "Membuat server pertama"
}
`),
          h("2. Method HTTP"),
          p(
            "<ul><li><strong>GET</strong> — mengambil data, tidak mengubah state.</li><li><strong>POST</strong> — membuat resource baru.</li><li><strong>PUT</strong> — mengganti resource secara keseluruhan.</li><li><strong>PATCH</strong> — mengubah sebagian field.</li><li><strong>DELETE</strong> — menghapus resource.</li></ul>",
          ),
          h("3. Status Code Penting"),
          p(
            "<ul><li><code>200 OK</code> — berhasil.</li><li><code>201 Created</code> — resource baru dibuat.</li><li><code>204 No Content</code> — berhasil tanpa body.</li><li><code>400 Bad Request</code> — input tidak valid.</li><li><code>401 Unauthorized</code> — belum login.</li><li><code>403 Forbidden</code> — login tetapi tidak punya akses.</li><li><code>404 Not Found</code> — resource tidak ada.</li><li><code>500 Internal Server Error</code> — kesalahan server.</li></ul>",
          ),
          h("4. Prinsip REST"),
          p(
            "<p>REST memodelkan data sebagai resource dengan URL yang jelas, memakai method HTTP sesuai maksud, dan menjaga server tetap stateless: setiap request membawa informasi yang dibutuhkan.</p>",
          ),
          tsCode(`
GET    /notes
GET    /notes/1
POST   /notes
PUT    /notes/1
DELETE /notes/1
`),
          callout(
            "info",
            "Gunakan kata benda pada URL (/notes), bukan kata kerja (/getNotes). Kata kerja sudah diwakili method HTTP.",
          ),
          h("Studi Kasus: Merancang Endpoint Catatan"),
          p(
            "<ul><li><code>GET /notes?search=node</code> — daftar catatan dengan filter.</li><li><code>GET /notes/:id</code> — detail satu catatan.</li><li><code>POST /notes</code> — buat catatan; balas 201 dan data baru.</li><li><code>PATCH /notes/:id</code> — ubah judul atau isi.</li><li><code>DELETE /notes/:id</code> — hapus; balas 204.</li></ul>",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Rancang endpoint REST untuk resource \"buku\" lengkap dengan method, path, dan status code yang sesuai.",
          ),
          divider(),
        ],
      },
      {
        title: "Server Pertama dengan http.createServer",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat server HTTP tanpa framework, membaca method dan URL, mengirim JSON, serta menangani route yang tidak ada.</p>",
          ),
          h("1. Server Minimal"),
          tsCode(`
import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Halo dari Node.js");
});

server.listen(4000, () => {
  console.log("Server berjalan di http://localhost:4000");
});
`),
          h("2. Membaca Method & URL"),
          tsCode(`
import { createServer } from "node:http";

const server = createServer((req, res) => {
  console.log(req.method, req.url);
  res.end("OK");
});

server.listen(4000);
`),
          h("3. Mengirim JSON"),
          tsCode(`
import { createServer } from "node:http";

const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: true, waktu: new Date().toISOString() }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Endpoint tidak ditemukan" }));
});

server.listen(4000, () => console.log("http://localhost:4000"));
`),
          h("4. Header & Status"),
          p(
            "<p>Gunakan <code>res.writeHead(status, headers)</code> sebelum menulis body. Header <code>Content-Type</code> memberi tahu klien cara membaca body.</p>",
          ),
          callout(
            "warning",
            "Jangan memanggil res.end() dua kali untuk satu request. Setelah response selesai, koneksi tidak bisa menulis body lagi.",
          ),
          h("Studi Kasus: Endpoint Waktu Server"),
          tsCode(`
import { createServer } from "node:http";

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", \`http://\${req.headers.host}\`);

  if (url.pathname === "/waktu") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      iso: new Date().toISOString(),
      zona: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }));
    return;
  }

  res.writeHead(404).end();
});

server.listen(4000);
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan endpoint /halo?nama=Budi yang membalas JSON berisi sapaan sesuai query nama.",
          ),
          divider(),
        ],
      },
      {
        title: "Routing, Query & Body Manual",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membangun routing sederhana, membaca query string, dan mem-parsing body JSON dengan batas ukuran yang aman.</p>",
          ),
          h("1. Routing Manual"),
          tsCode(`
import { createServer } from "node:http";

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", \`http://\${req.headers.host}\`);

  if (req.method === "GET" && url.pathname === "/") {
    res.end("Beranda");
    return;
  }

  if (req.method === "GET" && url.pathname === "/notes") {
    res.end(JSON.stringify({ items: [] }));
    return;
  }

  res.writeHead(404).end("Tidak ditemukan");
});

server.listen(4000);
`),
          h("2. Query String"),
          tsCode(`
const url = new URL("/notes?search=node&page=2", "http://localhost");

const search = url.searchParams.get("search") ?? "";
const page = Number(url.searchParams.get("page") ?? 1);

console.log({ search, page });
`),
          h("3. Membaca Body JSON"),
          p(
            "<p>Body request adalah stream. Kumpulkan chunk sampai selesai, batasi ukurannya, lalu parse JSON. Jangan percaya input tanpa validasi.</p>",
          ),
          tsCode(`
import type { IncomingMessage } from "node:http";

async function bacaJson(req: IncomingMessage): Promise<unknown> {
  const batas = 1_000_000; // 1 MB
  let total = 0;
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    total += chunk.length;
    if (total > batas) throw new Error("Body terlalu besar");
    chunks.push(Buffer.from(chunk));
  }

  if (chunks.length === 0) return null;

  const teks = Buffer.concat(chunks).toString("utf8");
  try {
    return JSON.parse(teks);
  } catch {
    throw new Error("JSON tidak valid");
  }
}
`),
          h("4. Validasi Sederhana"),
          tsCode(`
type CatatanInput = { judul: string; isi: string };

function validasiCatatan(data: unknown): CatatanInput {
  if (typeof data !== "object" || data === null) {
    throw new Error("Body harus objek");
  }

  const { judul, isi } = data as Record<string, unknown>;

  if (typeof judul !== "string" || judul.trim().length < 1) {
    throw new Error("Judul wajib diisi");
  }

  return {
    judul: judul.trim(),
    isi: typeof isi === "string" ? isi : "",
  };
}
`),
          callout(
            "info",
            "Untuk proyek nyata, gunakan validator seperti Zod agar aturan validasi dan tipe TypeScript tetap sinkron.",
          ),
          h("Studi Kasus: POST /notes"),
          tsCode(`
if (req.method === "POST" && url.pathname === "/notes") {
  try {
    const body = await bacaJson(req);
    const input = validasiCatatan(body);
    const baru = { id: crypto.randomUUID(), ...input };

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(baru));
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      error: error instanceof Error ? error.message : "Input tidak valid",
    }));
  }
  return;
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan validasi panjang maksimum judul 120 karakter dan balas 400 jika dilanggar.",
          ),
          divider(),
        ],
      },
      {
        title: "Struktur Proyek Server TypeScript",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menata proyek server agar mudah dirawat: memisahkan konfigurasi, routing, logika bisnis, dan tipe data.</p>",
          ),
          h("1. Struktur yang Disarankan"),
          bashCode(`
src/
├─ config/
│  └─ env.ts
├─ routes/
│  └─ notes.routes.ts
├─ services/
│  └─ notes.service.ts
├─ types/
│  └─ note.ts
├─ utils/
│  └─ http.ts
└─ server.ts
`),
          h("2. Konfigurasi Terpusat"),
          tsCode(`
// src/config/env.ts
type Env = { port: number; nodeEnv: string };

function bacaEnv(): Env {
  const port = Number(process.env.PORT ?? 4000);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT tidak valid");
  }

  return {
    port,
    nodeEnv: process.env.NODE_ENV ?? "development",
  };
}

export const env = bacaEnv();
`),
          h("3. Memisahkan Service"),
          tsCode(`
// src/types/note.ts
export type Note = {
  id: string;
  judul: string;
  isi: string;
  createdAt: string;
};
`),
          tsCode(`
// src/services/notes.service.ts
import type { Note } from "../types/note.js";

const notes: Note[] = [];

export const notesService = {
  list(): Note[] {
    return notes;
  },

  create(input: { judul: string; isi: string }): Note {
    const note: Note = {
      id: crypto.randomUUID(),
      judul: input.judul,
      isi: input.isi,
      createdAt: new Date().toISOString(),
    };
    notes.push(note);
    return note;
  },
};
`),
          h("4. Helper Response"),
          tsCode(`
// src/utils/http.ts
import type { ServerResponse } from "node:http";

export function kirimJson(
  res: ServerResponse,
  status: number,
  data: unknown,
): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}
`),
          callout(
            "info",
            "Pisahkan lapisan HTTP dari logika bisnis. Dengan begitu, service bisa diuji tanpa menjalankan server, dan route tetap tipis.",
          ),
          h("Studi Kasus: Route Tipis"),
          tsCode(`
// src/routes/notes.routes.ts
import type { IncomingMessage, ServerResponse } from "node:http";
import { notesService } from "../services/notes.service.js";
import { kirimJson } from "../utils/http.js";

export function notesRoute(req: IncomingMessage, res: ServerResponse): boolean {
  if (req.method === "GET" && req.url?.startsWith("/notes")) {
    kirimJson(res, 200, { items: notesService.list() });
    return true;
  }

  return false;
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Pindahkan fungsi validasi ke folder utils dan pastikan route tidak lagi berisi logika validasi panjang.",
          ),
          divider(),
        ],
      },
      {
        title: "Mini Project: REST API Catatan",
        duration: 28,
        blocks: [
          h("Tujuan Proyek"),
          p(
            "<p>Membangun REST API catatan dengan modul <code>http</code> dan TypeScript: list, detail, create, update, dan delete. Data disimpan di memori agar fokus pada alur HTTP.</p>",
          ),
          h("1. Struktur"),
          bashCode(`
src/
├─ config/env.ts
├─ routes/notes.routes.ts
├─ services/notes.service.ts
├─ types/note.ts
├─ utils/http.ts
└─ server.ts
`),
          h("2. Service"),
          tsCode(`
// src/services/notes.service.ts
import type { Note } from "../types/note.js";

let notes: Note[] = [];

export const notesService = {
  list(search?: string): Note[] {
    if (!search) return notes;
    const kata = search.toLowerCase();
    return notes.filter((note) => note.judul.toLowerCase().includes(kata));
  },

  find(id: string): Note | undefined {
    return notes.find((note) => note.id === id);
  },

  create(input: { judul: string; isi: string }): Note {
    const note: Note = {
      id: crypto.randomUUID(),
      judul: input.judul,
      isi: input.isi,
      createdAt: new Date().toISOString(),
    };
    notes = [...notes, note];
    return note;
  },

  update(id: string, input: { judul?: string; isi?: string }): Note | undefined {
    const existing = notes.find((note) => note.id === id);
    if (!existing) return undefined;

    const updated: Note = {
      ...existing,
      judul: input.judul ?? existing.judul,
      isi: input.isi ?? existing.isi,
    };
    notes = notes.map((note) => (note.id === id ? updated : note));
    return updated;
  },

  remove(id: string): boolean {
    const sebelum = notes.length;
    notes = notes.filter((note) => note.id !== id);
    return notes.length < sebelum;
  },
};
`),
          h("3. Router"),
          tsCode(`
// src/routes/notes.routes.ts
import type { IncomingMessage, ServerResponse } from "node:http";
import { notesService } from "../services/notes.service.js";
import { kirimJson } from "../utils/http.js";

async function bacaBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export async function notesRoute(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", \`http://\${req.headers.host}\`);
  const segments = url.pathname.split("/").filter(Boolean);
  const id = segments[1];

  if (segments[0] !== "notes") return false;

  if (req.method === "GET" && !id) {
    kirimJson(res, 200, { items: notesService.list(url.searchParams.get("search") ?? undefined) });
    return true;
  }

  if (req.method === "GET" && id) {
    const note = notesService.find(id);
    if (!note) { kirimJson(res, 404, { error: "Catatan tidak ditemukan" }); return true; }
    kirimJson(res, 200, note);
    return true;
  }

  if (req.method === "POST" && !id) {
    try {
      const body = await bacaBody(req);
      if (typeof body.judul !== "string" || body.judul.trim() === "") {
        kirimJson(res, 400, { error: "Judul wajib diisi" });
        return true;
      }
      const note = notesService.create({
        judul: body.judul.trim(),
        isi: typeof body.isi === "string" ? body.isi : "",
      });
      kirimJson(res, 201, note);
    } catch {
      kirimJson(res, 400, { error: "JSON tidak valid" });
    }
    return true;
  }

  if (req.method === "PUT" && id) {
    try {
      const body = await bacaBody(req);
      const updated = notesService.update(id, {
        judul: typeof body.judul === "string" ? body.judul : undefined,
        isi: typeof body.isi === "string" ? body.isi : undefined,
      });
      if (!updated) { kirimJson(res, 404, { error: "Catatan tidak ditemukan" }); return true; }
      kirimJson(res, 200, updated);
    } catch {
      kirimJson(res, 400, { error: "JSON tidak valid" });
    }
    return true;
  }

  if (req.method === "DELETE" && id) {
    const ok = notesService.remove(id);
    if (!ok) { kirimJson(res, 404, { error: "Catatan tidak ditemukan" }); return true; }
    res.writeHead(204).end();
    return true;
  }

  return false;
}
`),
          h("4. Server"),
          tsCode(`
// src/server.ts
import { createServer } from "node:http";
import { env } from "./config/env.js";
import { notesRoute } from "./routes/notes.routes.js";
import { kirimJson } from "./utils/http.js";

const server = createServer(async (req, res) => {
  try {
    const ditangani = await notesRoute(req, res);
    if (!ditangani) kirimJson(res, 404, { error: "Endpoint tidak ditemukan" });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      kirimJson(res, 500, { error: "Terjadi kesalahan pada server" });
    }
  }
});

server.listen(env.port, () => {
  console.log(\`API catatan: http://localhost:\${env.port}/notes\`);
});
`),
          h("5. Uji Cepat"),
          bashCode(`
# buat catatan
curl -X POST http://localhost:4000/notes \\
  -H "Content-Type: application/json" \\
  -d '{"judul":"Belajar Node","isi":"Membuat REST API"}'

# daftar catatan
curl http://localhost:4000/notes

# ubah catatan (ganti ID sesuai hasil POST)
curl -X PUT http://localhost:4000/notes/ID \\
  -H "Content-Type: application/json" \\
  -d '{"judul":"Belajar Node.js"}'

# hapus
curl -X DELETE http://localhost:4000/notes/ID
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan pagination (page, perPage) dan endpoint /notes/:id dengan format error yang konsisten.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Basic Server",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Basic Server & HTTP"),
          p("<p>Uji pemahaman HTTP, routing, body request, dan struktur proyek server.</p>"),
          quiz("Kuis Basic Server", [
            {
              q: "Status code untuk resource yang berhasil dibuat adalah...",
              options: ["200", "201", "204", "400"],
              answer: 1,
            },
            {
              q: "Method untuk mengubah sebagian field resource adalah...",
              options: ["GET", "POST", "PUT", "PATCH"],
              answer: 3,
            },
            {
              q: "Body request di Node.js dibaca sebagai...",
              options: ["String langsung", "Stream", "Array", "File"],
              answer: 1,
            },
            {
              q: "Modul inti untuk membuat server HTTP adalah...",
              options: ["node:fs", "node:http", "node:url", "node:events"],
              answer: 1,
            },
            {
              q: "Status code 204 berarti...",
              options: ["Created", "No Content", "Bad Request", "Unauthorized"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 7 — PENGENALAN MONOREPO
  // ==========================================================
  {
    name: "Pengenalan Monorepo",
    description:
      "Memahami monorepo, menyiapkan npm workspaces, berbagi paket internal, serta menjalankan script dan versioning lintas workspace.",
    lessons: [
      {
        title: "Monorepo vs Polyrepo",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membedakan monorepo dan polyrepo, memahami kelebihan serta risikonya, dan mengetahui kapan monorepo tepat dipakai.</p>",
          ),
          h("1. Definisi"),
          p(
            "<p><strong>Polyrepo</strong> menyimpan setiap aplikasi atau paket di repository terpisah. <strong>Monorepo</strong> menyimpan beberapa aplikasi dan paket dalam satu repository, biasanya dalam folder <code>apps/</code> dan <code>packages/</code>.</p>",
          ),
          h("2. Kelebihan Monorepo"),
          p(
            "<ul><li>Perubahan lintas paket bisa dilakukan dalam satu commit dan satu pull request.</li><li>Berbagi kode internal lebih mudah, misalnya tipe data dan utilitas.</li><li>Versi dependency lebih mudah diseragamkan.</li><li>CI dapat menjalankan pengujian yang terdampak saja.</li></ul>",
          ),
          h("3. Kekurangan Monorepo"),
          p(
            "<ul><li>Setup tooling lebih rumit.</li><li>Repository bisa membesar dan waktu clone/build meningkat.</li><li>Perlu disiplin batas antar paket agar tidak menjadi kode spaghetti.</li><li>Hak akses per paket lebih sulit diatur dibanding polyrepo.</li></ul>",
          ),
          h("4. Kapan Memilih Monorepo?"),
          p(
            "<p>Monorepo masuk akal jika aplikasi dan paket saling bergantung erat, dikerjakan tim yang sama, dan kamu ingin perubahan kontrak langsung teruji. Jika setiap layanan benar-benar independen dan dimiliki tim berbeda, polyrepo bisa lebih sederhana.</p>",
          ),
          bashCode(`
# polyrepo
repo-api/
repo-web/
repo-shared/

# monorepo
provoks/
├─ apps/api/
├─ apps/web/
└─ packages/shared/
`),
          callout(
            "info",
            "Monorepo bukan tujuan akhir. Ia adalah pilihan organisasi kode. Mulai dari satu aplikasi jika belum ada kebutuhan nyata untuk berbagi paket.",
          ),
          h("Studi Kasus: Paket Tipe Bersama"),
          p(
            "<p>API dan web membutuhkan tipe <code>User</code> dan <code>Note</code> yang sama. Di polyrepo, tipe ini disalin atau diterbitkan sebagai paket npm. Di monorepo, keduanya bisa mengimpor dari <code>packages/shared</code> secara langsung.</p>",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tulis dua skenario proyek nyata dan tentukan apakah lebih cocok monorepo atau polyrepo, beserta alasannya.",
          ),
          divider(),
        ],
      },
      {
        title: "npm Workspaces: Setup & Hoisting",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyiapkan monorepo dengan npm workspaces, memahami hoisting node_modules, dan menjalankan perintah pada workspace tertentu.</p>",
          ),
          h("1. package.json Root"),
          p(
            "<p>Satu repository memiliki satu <code>package.json</code> root yang menandai folder workspace. Root sebaiknya <code>private</code> dan tidak dipublikasikan.</p>",
          ),
          jsonCode(`
{
  "name": "provoks-monorepo",
  "private": true,
  "type": "module",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "npm run build -ws --if-present",
    "typecheck": "npm run typecheck -ws --if-present"
  }
}
`),
          h("2. Membuat Workspace"),
          bashCode(`
mkdir -p apps packages
npm init -w apps/api -y
npm init -w packages/shared -y
`),
          h("3. Hoisting node_modules"),
          p(
            "<p>npm mengangkat dependency bersama ke <code>node_modules</code> root (hoisting) agar tidak diduplikasi. Workspace tetap bisa punya <code>node_modules</code> sendiri jika ada konflik versi.</p>",
          ),
          bashCode(`
# pasang dependency ke workspace tertentu
npm install zod -w @provoks/api
npm install -D typescript -w @provoks/api

# lihat struktur workspace
npm ls -ws --depth=0
`),
          h("4. Menjalankan Script Workspace"),
          bashCode(`
npm run dev -w @provoks/api
npm run build -ws --if-present
npm run test -w @provoks/api
`),
          callout(
            "warning",
            "Nama workspace diambil dari field name pada package.json masing-masing. Pastikan unik, misalnya @provoks/api dan @provoks/shared.",
          ),
          h("Studi Kasus: Dua Workspace Sederhana"),
          jsonCode(`
// apps/api/package.json
{
  "name": "@provoks/api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "typecheck": "tsc --noEmit"
  }
}
`),
          jsonCode(`
// packages/shared/package.json
{
  "name": "@provoks/shared",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  }
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan workspace ketiga bernama @provoks/cli dan pastikan npm run build -ws menjalankan script yang tersedia tanpa error.",
          ),
          divider(),
        ],
      },
      {
        title: "Struktur apps/ & packages/ + Shared Package",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menata aplikasi dan paket internal, membuat shared package, serta mengimpor paket tersebut dari aplikasi lain.</p>",
          ),
          h("1. Struktur Folder"),
          bashCode(`
provoks/
├─ apps/
│  ├─ api/
│  │  ├─ src/index.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ cli/
│     ├─ src/index.ts
│     └─ package.json
├─ packages/
│  └─ shared/
│     ├─ src/index.ts
│     └─ package.json
└─ package.json
`),
          h("2. Shared Package"),
          tsCode(`
// packages/shared/src/index.ts
export type Note = {
  id: string;
  judul: string;
  isi: string;
};

export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID");
}
`),
          jsonCode(`
// packages/shared/package.json
{
  "name": "@provoks/shared",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  }
}
`),
          h("3. Memakai Shared Package"),
          p(
            "<p>Tambahkan dependency workspace pada aplikasi. Karena berada dalam satu repository, npm akan menautkannya secara lokal.</p>",
          ),
          jsonCode(`
// apps/api/package.json
{
  "name": "@provoks/api",
  "private": true,
  "type": "module",
  "dependencies": {
    "@provoks/shared": "*"
  },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "typecheck": "tsc --noEmit"
  }
}
`),
          tsCode(`
// apps/api/src/index.ts
import { formatTanggal, type Note } from "@provoks/shared";

const note: Note = {
  id: "1",
  judul: "Belajar Monorepo",
  isi: "Berbagi tipe antar workspace",
};

console.log(note.judul, formatTanggal(new Date().toISOString()));
`),
          bashCode(`
npm install
npm run typecheck -w @provoks/api
`),
          h("4. Batas Antar Paket"),
          p(
            "<p>Jaga arah dependency: aplikasi boleh bergantung pada paket bersama, tetapi paket bersama tidak boleh mengimpor kode aplikasi. Aturan ini mencegah siklus dan membuat paket tetap bisa dipakai ulang.</p>",
          ),
          callout(
            "info",
            "Untuk proyek yang lebih besar, pertimbangkan build step dan conditional exports agar paket bisa dikonsumsi sebagai JavaScript hasil kompilasi, bukan TypeScript mentah.",
          ),
          h("Studi Kasus: Validator Bersama"),
          tsCode(`
// packages/shared/src/validasi.ts
export function wajibDiisi(nilai: string, label: string): string {
  if (!nilai.trim()) throw new Error(\`\${label} wajib diisi\`);
  return nilai.trim();
}
`),
          tsCode(`
// packages/shared/src/index.ts
export * from "./validasi.js";
`),
          tsCode(`
// apps/api/src/index.ts
import { wajibDiisi } from "@provoks/shared";

console.log(wajibDiisi("  Budi  ", "Nama"));
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan fungsi slugify di shared package dan pakai di aplikasi api.",
          ),
          divider(),
        ],
      },
      {
        title: "Menjalankan Script & Versioning Lintas Workspace",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menjalankan script secara selektif, mengelola urutan build, dan memahami pendekatan versioning pada monorepo.</p>",
          ),
          h("1. Script Selektif"),
          bashCode(`
npm run dev -w @provoks/api
npm run build -w @provoks/shared -w @provoks/api
npm run typecheck -ws --if-present
`),
          p(
            "<p>Opsi <code>--if-present</code> mencegah error jika sebuah workspace tidak memiliki script tersebut. Ini berguna untuk perintah lintas workspace.</p>",
          ),
          h("2. Urutan Build"),
          p(
            "<p>Jika aplikasi memakai hasil build paket shared, build shared terlebih dahulu. Untuk proyek yang lebih besar, tool seperti Turborepo atau Nx dapat mengurus urutan dan cache secara otomatis.</p>",
          ),
          bashCode(`
npm run build -w @provoks/shared
npm run build -w @provoks/api
`),
          h("3. Versioning"),
          p(
            "<p>Dua pendekatan umum:</p><ul><li><strong>Fixed version</strong> — semua paket memakai versi yang sama. Cocok jika paket selalu dirilis bersama.</li><li><strong>Independent version</strong> — setiap paket punya versi sendiri. Cocok jika paket dipakai proyek lain secara terpisah.</li></ul><p>Untuk paket internal yang tidak dipublikasikan, <code>private: true</code> sudah cukup dan versioning bisa disederhanakan.</p>",
          ),
          h("4. Perintah yang Sering Dipakai"),
          bashCode(`
npm ls -ws --depth=0
npm outdated -ws
npm run lint -ws --if-present
npm run test -ws --if-present
`),
          callout(
            "warning",
            "Hindari menjalankan semua script secara paralel jika ada dependency build antar workspace. Urutan yang salah bisa menghasilkan error \"module not found\".",
          ),
          h("Studi Kasus: CI Monorepo"),
          bashCode(`
npm ci
npm run typecheck -ws --if-present
npm run build -ws --if-present
npm run test -ws --if-present
`),
          callout(
            "info",
            "Pada CI, gunakan npm ci di root. Satu lockfile root mengunci dependency seluruh workspace.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Buat script root \"check\" yang menjalankan typecheck lalu build semua workspace secara berurutan.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Monorepo",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Pengenalan Monorepo"),
          p("<p>Uji pemahaman monorepo, npm workspaces, shared package, dan script lintas workspace.</p>"),
          quiz("Kuis Monorepo", [
            {
              q: "Monorepo adalah...",
              options: [
                "Satu aplikasi di banyak repository",
                "Banyak aplikasi/paket dalam satu repository",
                "Satu paket npm",
                "Database terpusat",
              ],
              answer: 1,
            },
            {
              q: "Field package.json root untuk mendefinisikan workspace adalah...",
              options: ["workspaces", "packages", "folders", "monorepo"],
              answer: 0,
            },
            {
              q: "Mengangkat dependency bersama ke node_modules root disebut...",
              options: ["linking", "hoisting", "bundling", "caching"],
              answer: 1,
            },
            {
              q: "Perintah menjalankan script build di semua workspace adalah...",
              options: ["npm run build -ws", "npm build --all", "npm run build -g", "npm workspace build"],
              answer: 0,
            },
            {
              q: "Arah dependency yang sehat adalah...",
              options: [
                "Shared package mengimpor aplikasi",
                "Aplikasi mengimpor shared package",
                "Semua saling mengimpor",
                "Tidak boleh ada dependency",
              ],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 8 — SCAFFOLDING, GIT/GITHUB & PROYEK AKHIR
  // ==========================================================
  {
    name: "Scaffolding, Git/GitHub & Proyek Akhir",
    description:
      "Menyiapkan proyek dari nol, memakai Git dan GitHub, lalu menggabungkan seluruh materi menjadi monorepo API TypeScript.",
    lessons: [
      {
        title: "Git Dasar: Init, Commit & Branch",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai Git untuk melacak perubahan: inisialisasi, staging, commit, melihat riwayat, dan bekerja dengan branch.</p>",
          ),
          h("1. Inisialisasi & Status"),
          bashCode(`
git init
git status
`),
          h("2. Add & Commit"),
          tsCode(`
# menambahkan file tertentu
git add src/index.ts
git add package.json tsconfig.json

# menambahkan semua perubahan
git add .

# menyimpan snapshot
git commit -m "feat: inisialisasi proyek Node.js"
`),
          h("3. Melihat Riwayat & Perbedaan"),
          bashCode(`
git log --oneline --graph --decorate
git diff
git diff --staged
git show HEAD
`),
          h("4. Branch & Merge"),
          bashCode(`
git branch
git switch -c feat/notes-api
# ...kerjakan perubahan...
git add .
git commit -m "feat: tambah endpoint notes"
git switch main
git merge feat/notes-api
`),
          callout(
            "info",
            "Commit kecil dan fokus lebih mudah ditinjau daripada satu commit raksasa. Gunakan pesan yang menjelaskan alasan perubahan, bukan hanya apa yang diubah.",
          ),
          h("5. .gitignore"),
          bashCode(`
node_modules/
dist/
.env
coverage/
*.log
`),
          callout(
            "warning",
            "Jika file .env terlanjur ter-commit, menghapusnya di commit berikutnya tidak cukup karena riwayat masih menyimpannya. Rotasi secret dan bersihkan riwayat dengan hati-hati.",
          ),
          h("Studi Kasus: Melacak Perubahan Kecil"),
          bashCode(`
git add src/services/notes.service.ts
git commit -m "fix: validasi judul kosong pada create"

git switch -c fix/validasi
git commit -am "fix: balas 400 saat judul kosong"
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat repository lokal untuk proyek latihan, lakukan tiga commit bermakna, lalu tampilkan riwayatnya dengan git log --oneline.",
          ),
          divider(),
        ],
      },
      {
        title: "GitHub: Remote, Push & Pull Request",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menghubungkan repository lokal ke GitHub, mendorong perubahan, dan berkolaborasi lewat pull request.</p>",
          ),
          h("1. Menambahkan Remote"),
          bashCode(`
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git branch -M main
git push -u origin main
`),
          p(
            "<p>Opsi <code>-u</code> menyimpan remote dan branch default, sehingga berikutnya cukup <code>git push</code>.</p>",
          ),
          h("2. Clone & Pull"),
          bashCode(`
git clone https://github.com/USERNAME/NAMA-REPO.git
git fetch origin
git pull origin main
`),
          h("3. Pull Request"),
          p(
            "<ul><li>Buat branch fitur dari <code>main</code>.</li><li>Commit perubahan dengan pesan jelas.</li><li>Push branch ke GitHub.</li><li>Buka pull request dan jelaskan perubahan serta cara mengujinya.</li><li>Minta review, perbaiki jika perlu, lalu merge.</li></ul>",
          ),
          bashCode(`
git switch -c feat/notes-api
git push -u origin feat/notes-api
`),
          h("4. Konvensi Pesan Commit"),
          bashCode(`
feat: tambah endpoint POST /notes
fix: tangani body JSON tidak valid
docs: perbarui cara menjalankan proyek
refactor: pisahkan service dan route
test: tambah pengujian notes service
chore: perbarui dependency
`),
          callout(
            "info",
            "Conventional Commits memudahkan pembuatan changelog dan memahami riwayat. Konsistensi lebih penting daripada aturan yang rumit.",
          ),
          h("5. Sinkronisasi Sebelum PR"),
          bashCode(`
git fetch origin
git rebase origin/main
# selesaikan konflik jika ada
git push --force-with-lease
`),
          callout(
            "warning",
            "Gunakan --force-with-lease, bukan --force, agar tidak menimpa pekerjaan orang lain yang baru masuk ke branch.",
          ),
          h("Studi Kasus: Alur Kontribusi"),
          bashCode(`
git switch -c docs/readme-setup
# edit README
git add README.md
git commit -m "docs: tambah langkah setup"
git push -u origin docs/readme-setup
# buka pull request di GitHub
`),
          callout(
            "success",
            "Tantangan Mandiri: Buat branch, ubah README, push, lalu buka pull request. Tulis deskripsi berisi tujuan dan langkah pengujian.",
          ),
          divider(),
        ],
      },
      {
        title: "Scaffolding Proyek Node.js + TypeScript",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyiapkan proyek baru yang siap dikembangkan: struktur folder, konfigurasi TypeScript, environment, dan dokumentasi.</p>",
          ),
          h("1. Struktur Dasar"),
          bashCode(`
proyek/
├─ src/
│  ├─ config/env.ts
│  ├─ routes/
│  ├─ services/
│  ├─ types/
│  ├─ utils/
│  └─ index.ts
├─ .env.example
├─ .gitignore
├─ package.json
├─ tsconfig.json
└─ README.md
`),
          h("2. Inisialisasi"),
          bashCode(`
mkdir proyek && cd proyek
npm init -y
npm install -D typescript tsx @types/node
`),
          jsonCode(`
{
  "name": "proyek-node",
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
          h("3. Konfigurasi & Environment"),
          jsonCode(`
// tsconfig.json
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
    "sourceMap": true
  },
  "include": ["src/**/*.ts"]
}
`),
          bashCode(`
# .env.example
PORT=4000
NODE_ENV=development
LOG_LEVEL=info
`),
          h("4. README yang Berguna"),
          p(
            "<p>README minimal berisi: deskripsi singkat, prasyarat, cara instalasi, cara menjalankan, daftar script, dan contoh environment. Ini menghemat waktu setiap orang yang bergabung.</p>",
          ),
          bashCode(`
# Nama Proyek

Deskripsi singkat.

## Menjalankan

1. cp .env.example .env
2. npm install
3. npm run dev

## Script

- npm run dev
- npm run build
- npm run typecheck
`),
          callout(
            "info",
            "Tambahkan ESLint dan Prettier setelah struktur dasar berjalan. Jangan menumpuk tooling sebelum proyek bisa dijalankan.",
          ),
          h("Studi Kasus: Menyiapkan Folder"),
          bashCode(`
mkdir -p src/config src/routes src/services src/types src/utils
touch src/index.ts src/config/env.ts
`),
          callout(
            "success",
            "Tantangan Mandiri: Lengkapi proyek scaffold dengan endpoint /health, konfigurasi env yang tervalidasi, dan README.",
          ),
          divider(),
        ],
      },
      {
        title: "Proyek Akhir: Monorepo API Sederhana",
        duration: 30,
        blocks: [
          h("Tujuan Proyek"),
          p(
            "<p>Menggabungkan seluruh materi: monorepo npm workspaces, TypeScript, server HTTP, shared package, environment, dan Git.</p>",
          ),
          h("1. Struktur Akhir"),
          bashCode(`
provoks-node/
├─ apps/
│  └─ api/
│     ├─ src/config/env.ts
│     ├─ src/routes/notes.routes.ts
│     ├─ src/services/notes.service.ts
│     ├─ src/utils/http.ts
│     ├─ src/index.ts
│     ├─ package.json
│     └─ tsconfig.json
├─ packages/
│  └─ shared/
│     ├─ src/index.ts
│     └─ package.json
├─ .gitignore
├─ package.json
└─ tsconfig.base.json
`),
          h("2. Root Workspace"),
          jsonCode(`
{
  "name": "provoks-node",
  "private": true,
  "type": "module",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev -w @provoks/api",
    "typecheck": "npm run typecheck -ws --if-present",
    "build": "npm run build -ws --if-present"
  }
}
`),
          h("3. Shared Package"),
          tsCode(`
// packages/shared/src/index.ts
export type Note = {
  id: string;
  judul: string;
  isi: string;
  createdAt: string;
};

export function validasiJudul(judul: unknown): string {
  if (typeof judul !== "string" || judul.trim().length === 0) {
    throw new Error("Judul wajib diisi");
  }
  return judul.trim();
}
`),
          jsonCode(`
// packages/shared/package.json
{
  "name": "@provoks/shared",
  "private": true,
  "type": "module",
  "exports": { ".": "./src/index.ts" }
}
`),
          h("4. API"),
          jsonCode(`
// apps/api/package.json
{
  "name": "@provoks/api",
  "private": true,
  "type": "module",
  "dependencies": { "@provoks/shared": "*" },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "typecheck": "tsc --noEmit"
  }
}
`),
          tsCode(`
// apps/api/src/index.ts
import { createServer } from "node:http";
import { validasiJudul, type Note } from "@provoks/shared";
import { kirimJson } from "./utils/http.js";

const notes: Note[] = [];

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", \`http://\${req.headers.host}\`);
  const segments = url.pathname.split("/").filter(Boolean);
  const id = segments[1];

  if (req.method === "GET" && url.pathname === "/health") {
    kirimJson(res, 200, { ok: true });
    return;
  }

  if (segments[0] === "notes" && req.method === "GET" && !id) {
    kirimJson(res, 200, { items: notes });
    return;
  }

  if (segments[0] === "notes" && req.method === "POST" && !id) {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));

      const note: Note = {
        id: crypto.randomUUID(),
        judul: validasiJudul(body.judul),
        isi: typeof body.isi === "string" ? body.isi : "",
        createdAt: new Date().toISOString(),
      };

      notes.push(note);
      kirimJson(res, 201, note);
    } catch (error) {
      kirimJson(res, 400, {
        error: error instanceof Error ? error.message : "Input tidak valid",
      });
    }
    return;
  }

  kirimJson(res, 404, { error: "Endpoint tidak ditemukan" });
});

server.listen(4000, () => console.log("API: http://localhost:4000"));
`),
          h("5. Jalankan & Uji"),
          bashCode(`
npm install
npm run typecheck
npm run dev

curl http://localhost:4000/health
curl -X POST http://localhost:4000/notes \\
  -H "Content-Type: application/json" \\
  -d '{"judul":"Proyek akhir","isi":"Monorepo Node.js"}'
`),
          h("6. Simpan ke Git"),
          bashCode(`
git init
git add .
git commit -m "feat: monorepo API catatan dengan TypeScript"
git remote add origin https://github.com/USERNAME/provoks-node.git
git branch -M main
git push -u origin main
`),
          callout(
            "success",
            "Tantangan Mandiri: Lengkapi endpoint GET /notes/:id, PUT, dan DELETE. Tambahkan juga test sederhana dengan node:test untuk service validasi.",
          ),
          callout(
            "info",
            "Ini adalah fondasi yang sama dengan backend produksi. Langkah berikutnya adalah validasi dengan Zod, database, autentikasi, dan pengujian integrasi.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Git & Scaffolding",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Git & Scaffolding"),
          p("<p>Uji pemahaman Git, GitHub, dan penyiapan proyek Node.js + TypeScript.</p>"),
          quiz("Kuis Git & Scaffolding", [
            {
              q: "Perintah untuk menyimpan snapshot perubahan adalah...",
              options: ["git add", "git commit", "git push", "git pull"],
              answer: 1,
            },
            {
              q: "File yang tidak boleh di-commit adalah...",
              options: ["README.md", "package-lock.json", ".env", "tsconfig.json"],
              answer: 2,
            },
            {
              q: "Perintah membuat branch baru lalu berpindah ke sana adalah...",
              options: ["git branch baru", "git switch -c baru", "git checkout baru", "git merge baru"],
              answer: 1,
            },
            {
              q: "Opsi npm install yang membuat dependency lokal workspace tertaut adalah...",
              options: ["npm install", "npm ci", "npm link", "npm pack"],
              answer: 0,
            },
            {
              q: "Script npm untuk memeriksa tipe tanpa menghasilkan file adalah...",
              options: ["tsc", "tsc --noEmit", "tsc --outDir", "tsc --build"],
              answer: 1,
            },
          ]),
        ],
      },
      {
        title: "Ujian Akhir Node.js",
        duration: 20,
        type: "QUIZ",
        blocks: [
          h("Ujian Akhir Node.js & TypeScript"),
          p(
            "<p>Kuis campuran dari seluruh materi: runtime, npm, TypeScript, core module, async, HTTP, monorepo, dan Git.</p>",
          ),
          quiz(
            "Ujian Akhir Node.js",
            [
              {
                q: "Runtime JavaScript yang berjalan di luar browser adalah...",
                options: ["Deno", "Node.js", "Vite", "Webpack"],
                answer: 1,
              },
              {
                q: "Komponen Node.js yang menangani event loop dan I/O adalah...",
                options: ["V8", "libuv", "npm", "tsc"],
                answer: 1,
              },
              {
                q: "Arti ^1.4.2 pada dependency adalah...",
                options: [
                  "Hanya 1.4.2",
                  "1.4.x saja",
                  "1.x.x terbaru, tidak sampai 2.0.0",
                  "Semua versi",
                ],
                answer: 2,
              },
              {
                q: "Tipe yang harus diperiksa sebelum dipakai adalah...",
                options: ["any", "unknown", "never", "void"],
                answer: 1,
              },
              {
                q: "Utility type untuk mengambil sebagian properti adalah...",
                options: ["Omit", "Pick", "Partial", "Record"],
                answer: 1,
              },
              {
                q: "Modul untuk menggabungkan path secara portabel adalah...",
                options: ["node:fs", "node:path", "node:http", "node:events"],
                answer: 1,
              },
              {
                q: "Kode error saat file tidak ditemukan adalah...",
                options: ["EACCES", "ENOENT", "EEXIST", "EISDIR"],
                answer: 1,
              },
              {
                q: "Fungsi yang menghubungkan stream dan menangani error otomatis adalah...",
                options: ["pipe", "pipeline", "readFile", "writeFile"],
                answer: 1,
              },
              {
                q: "Status code untuk resource yang berhasil dibuat adalah...",
                options: ["200", "201", "204", "404"],
                answer: 1,
              },
              {
                q: "Body request HTTP di Node.js dibaca sebagai...",
                options: ["String langsung", "Stream", "Array", "Buffer tunggal"],
                answer: 1,
              },
              {
                q: "Field package.json root untuk monorepo adalah...",
                options: ["workspaces", "packages", "monorepo", "folders"],
                answer: 0,
              },
              {
                q: "Perintah Git untuk mengirim branch ke remote adalah...",
                options: ["git commit", "git push", "git pull", "git merge"],
                answer: 1,
              },
            ],
            { timeLimitMinutes: 30, maxAttempts: 2 },
          ),
        ],
      },
      {
        title: "Ringkasan & Langkah Selanjutnya",
        duration: 10,
        blocks: [
          h("Yang Sudah Kamu Pelajari"),
          p(
            "<ul><li>Perbedaan Node.js dan browser JavaScript, serta cara menjalankan TypeScript di Node.</li><li>Pengelolaan proyek dengan npm: package.json, semver, lockfile, dan pemilihan library.</li><li>TypeScript dari nol: tipe, interface, union, generics, strict mode, dan typing async/error.</li><li>Modul inti Node: <code>process</code>, <code>path</code>, <code>fs/promises</code>, Buffer, dan encoding.</li><li>Event loop, EventEmitter, stream, pipeline, dan graceful shutdown.</li><li>Membangun REST API dengan modul <code>http</code>, routing, query, body, dan struktur proyek.</li><li>Monorepo dengan npm workspaces, shared package, dan script lintas workspace.</li><li>Scaffolding proyek, Git, GitHub, pull request, dan proyek akhir monorepo.</li></ul>",
          ),
          h("Contoh Rangkaian Skill Lengkap"),
          tsCode(`
// packages/shared/src/index.ts
export type Note = { id: string; judul: string };

// apps/api/src/index.ts
import { createServer } from "node:http";
import type { Note } from "@provoks/shared";

const notes: Note[] = [];

const server = createServer((req, res) => {
  if (req.url === "/notes") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
    return;
  }
  res.writeHead(404).end();
});

server.listen(4000);
`),
          h("Langkah Selanjutnya"),
          p(
            "<ol><li><strong>Express atau Fastify</strong> — framework HTTP yang menghilangkan boilerplate routing dan middleware.</li><li><strong>Database</strong> — PostgreSQL/Prisma atau SQLite untuk menyimpan data secara permanen.</li><li><strong>Validasi & autentikasi</strong> — Zod, hashing password, JWT, dan role-based access.</li><li><strong>Testing</strong> — <code>node:test</code>, Supertest, dan integration test.</li><li><strong>Deployment</strong> — Docker, environment produksi, logging, dan health check.</li></ol>",
          ),
          callout(
            "success",
            "Selamat! Kamu sudah menyelesaikan fondasi Node.js & TypeScript: dari runtime, modul inti, server HTTP, hingga monorepo dan Git.",
          ),
          divider(),
        ],
      },
    ],
  },
];
