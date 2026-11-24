import {
  bashCode,
  callout,
  code,
  CoursePartDef,
  divider,
  h,
  jsonCode,
  p,
  quiz,
  tsCode,
} from "../../helpers";

export const REST_API_PARTS_1_2: CoursePartDef[] = [
  // ==========================================================
  // PART 1 — EXPRESS & LAYER DASAR
  // ==========================================================
  {
    name: "Express & Layer Dasar",
    description:
      "Recap HTTP, lalu langsung membangun REST API dengan Express: routing, controller, dan service menggunakan data in-memory.",
    lessons: [
      {
        title: "Recap HTTP & Setup Express 5 + TypeScript",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengingat kembali alur request-response HTTP, lalu menyiapkan proyek Express 5 + TypeScript yang bisa dijalankan dengan npm.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini membuat proyek baru <code>rest-api-latihan</code>. Dependency yang dibutuhkan: Express, TypeScript, tsx, dan tipe Node/Express. Pastikan <strong>Node.js 20 LTS atau lebih baru</strong> dan npm sudah tersedia.</p>",
          ),
          bashCode(`
node -v
npm -v

mkdir rest-api-latihan
cd rest-api-latihan
npm init -y
npm install express
npm install -D typescript tsx @types/node @types/express
`),
          callout(
            "info",
            "Tidak ada database di Part 1. Semua data latihan disimpan di memori agar fokus ke HTTP, routing, controller, dan service.",
          ),
          h("1. Recap Singkat HTTP"),
          p(
            "<p>Klien mengirim request berisi method, path, header, dan body. Server membalas dengan status code, header, dan body. REST API memakai JSON sebagai format pertukaran data yang paling umum.</p>",
          ),
          tsCode(`
POST /notes HTTP/1.1
Content-Type: application/json

{
  "title": "Belajar REST API",
  "content": "Controller dan service"
}
`),
          h("2. Atur package.json"),
          p(
            "<p>Tambahkan <code>\"type\": \"module\"</code> dan script development/build. Express 5 dipakai pada course ini.</p>",
          ),
          jsonCode(`
{
  "name": "rest-api-latihan",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit"
  }
}
`),
          h("3. tsconfig.json"),
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
    "sourceMap": true
  },
  "include": ["src/**/*.ts"]
}
`),
          h("4. App dan Server"),
          p(
            "<p>Pisahkan pembuatan aplikasi dari proses <code>listen</code>. Pemisahan ini penting agar aplikasi bisa diuji dengan Supertest tanpa membuka port.</p>",
          ),
          tsCode(`
// src/app.ts
import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "rest-api-latihan" });
  });

  return app;
}
`),
          tsCode(`
// src/server.ts
import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log("API berjalan di http://localhost:" + port);
});
`),
          bashCode(`
npm run dev
curl http://localhost:4000/health
`),
          callout(
            "warning",
            "Jika muncul error Cannot find module, jalankan npm install. Jika port 4000 dipakai proses lain, jalankan dengan PORT=4001 npm run dev (Linux/macOS) atau $env:PORT=4001; npm run dev (PowerShell).",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan endpoint GET /info yang mengembalikan nama aplikasi dan versi Node.js dari process.version.",
          ),
          divider(),
        ],
      },
      {
        title: "HTTP Method & Desain Resource",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memilih method HTTP yang tepat, memahami status code, dan merancang URL resource yang konsisten.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini tidak membutuhkan dependency npm baru. Kita akan mengamati perilaku method HTTP pada API publik memakai <code>curl</code> (tersedia di Windows 10+, macOS, dan Linux). Alternatif: Postman, Insomnia, atau Thunder Client.</p>",
          ),
          bashCode(`
curl https://jsonplaceholder.typicode.com/posts/1
curl -X POST https://jsonplaceholder.typicode.com/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Latihan","body":"Method POST","userId":1}'
`),
          callout(
            "warning",
            "JSONPlaceholder hanya simulasi. Data POST/PUT/DELETE tidak benar-benar tersimpan permanen, tetapi status dan bentuk response tetap membantu memahami method.",
          ),
          h("1. Empat Method Utama"),
          p(
            "<ul><li><strong>GET</strong> — mengambil data, tidak mengubah state.</li><li><strong>POST</strong> — membuat resource baru.</li><li><strong>PUT</strong> — mengganti seluruh resource.</li><li><strong>DELETE</strong> — menghapus resource.</li><li><strong>PATCH</strong> — mengubah sebagian field (pelengkap).</li></ul>",
          ),
          tsCode(`
GET    /notes
GET    /notes/1
POST   /notes
PUT    /notes/1
DELETE /notes/1
`),
          h("2. Status Code yang Sering Dipakai"),
          p(
            "<ul><li><code>200 OK</code> — berhasil.</li><li><code>201 Created</code> — resource baru dibuat.</li><li><code>204 No Content</code> — berhasil tanpa body.</li><li><code>400 Bad Request</code> — request tidak valid.</li><li><code>404 Not Found</code> — resource tidak ada.</li><li><code>422 Unprocessable Entity</code> — validasi input gagal.</li><li><code>500 Internal Server Error</code> — kesalahan server.</li></ul>",
          ),
          h("3. Desain Resource"),
          p(
            "<p>Gunakan kata benda jamak pada URL, bukan kata kerja. Method sudah mewakili aksi. Hubungan resource ditulis sebagai nested path yang masuk akal, bukan URL acak.</p>",
          ),
          tsCode(`
# baik
GET /notes
POST /notes
GET /notes/12
GET /users/3/notes

# kurang baik
GET /getAllNotes
POST /createNote
GET /notes/delete/12
`),
          h("4. Idempotency"),
          p(
            "<p>GET, PUT, dan DELETE bersifat idempotent: hasil akhirnya sama jika request diulang. POST tidak idempotent karena setiap request dapat membuat resource baru.</p>",
          ),
          callout(
            "info",
            "Latihan desain: buat tabel endpoint untuk resource books (list, detail, create, update, delete) beserta method dan status code yang diharapkan.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Rancang endpoint untuk resource users dan notes milik user, lalu tentukan status code untuk setiap aksi.",
          ),
          divider(),
        ],
      },
      {
        title: "Routing dengan Express Router",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memisahkan route ke Express Router, membaca params dan query, serta mengatur urutan route dengan benar.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>rest-api-latihan</code> dari lesson sebelumnya. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd rest-api-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/routes/notes.routes.ts. File yang diubah: src/app.ts.",
          ),
          h("1. Membuat Router"),
          p(
            "<p>Untuk sementara, handler ditulis langsung di route agar alur routing terlihat jelas. Di lesson berikutnya handler dipindahkan ke controller.</p>",
          ),
          tsCode(`
// src/routes/notes.routes.ts
import { Router } from "express";

type Note = {
  id: number;
  title: string;
  content: string;
};

const notes: Note[] = [
  { id: 1, title: "Belajar REST API", content: "Routing dasar" },
];
let nextId = 2;

export const notesRouter = Router();

notesRouter.get("/", (req, res) => {
  const search = String(req.query.search ?? "").toLowerCase();
  const hasil = search
    ? notes.filter((note) => note.title.toLowerCase().includes(search))
    : notes;

  res.json({ data: hasil });
});

notesRouter.get("/:id", (req, res) => {
  const note = notes.find((item) => item.id === Number(req.params.id));
  if (!note) {
    res.status(404).json({ error: "Catatan tidak ditemukan" });
    return;
  }
  res.json({ data: note });
});

notesRouter.post("/", (req, res) => {
  const { title, content } = req.body as { title?: string; content?: string };
  if (!title) {
    res.status(422).json({ error: "Title wajib diisi" });
    return;
  }

  const note: Note = {
    id: nextId,
    title,
    content: content ?? "",
  };
  nextId += 1;
  notes.push(note);

  res.status(201).json({ data: note });
});
`),
          h("2. Mount ke App"),
          tsCode(`
// src/app.ts
import express from "express";
import { notesRouter } from "./routes/notes.routes.js";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/notes", notesRouter);

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  return app;
}
`),
          h("3. Params dan Query"),
          p(
            "<ul><li><code>req.params.id</code> — segmen dinamis pada path, selalu string.</li><li><code>req.query.search</code> — query string, bisa string atau array.</li><li><code>req.body</code> — hasil parsing <code>express.json()</code>.</li></ul>",
          ),
          bashCode(`
curl http://localhost:4000/notes
curl "http://localhost:4000/notes?search=rest"
curl http://localhost:4000/notes/1
curl -X POST http://localhost:4000/notes \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Catatan baru","content":"Isi catatan"}'
`),
          callout(
            "warning",
            "Urutan route penting. Route statis seperti /notes/arsip harus didaftarkan sebelum /notes/:id jika ingin diprioritaskan. Express mencocokkan route sesuai urutan pendaftaran.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan route GET /notes/:id yang mengembalikan 404 jika id bukan angka atau catatan tidak ditemukan.",
          ),
          divider(),
        ],
      },
      {
        title: "Controller: Request, Service & Response",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memindahkan handler dari route ke controller agar route tetap tipis dan logika HTTP lebih terorganisir.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>rest-api-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd rest-api-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/controllers/notes.controller.ts. File yang diubah: src/routes/notes.routes.ts.",
          ),
          h("1. Pindahkan Handler ke Controller"),
          p(
            "<p>Controller bertanggung jawab menerima request, memanggil service, dan mengirim response. Ia tidak berisi aturan bisnis yang rumit.</p>",
          ),
          tsCode(`
// src/controllers/notes.controller.ts
import type { Request, Response } from "express";

type Note = { id: number; title: string; content: string };

const notes: Note[] = [
  { id: 1, title: "Belajar REST API", content: "Controller dasar" },
];
let nextId = 2;

export const notesController = {
  list(req: Request, res: Response) {
    const search = String(req.query.search ?? "").toLowerCase();
    const hasil = search
      ? notes.filter((note) => note.title.toLowerCase().includes(search))
      : notes;

    res.json({ data: hasil });
  },

  detail(req: Request, res: Response) {
    const note = notes.find((item) => item.id === Number(req.params.id));
    if (!note) {
      res.status(404).json({ error: "Catatan tidak ditemukan" });
      return;
    }
    res.json({ data: note });
  },

  create(req: Request, res: Response) {
    const { title, content } = req.body as { title?: string; content?: string };
    if (!title) {
      res.status(422).json({ error: "Title wajib diisi" });
      return;
    }

    const note: Note = { id: nextId, title, content: content ?? "" };
    nextId += 1;
    notes.push(note);

    res.status(201).json({ data: note });
  },
};
`),
          h("2. Route Menjadi Tipis"),
          tsCode(`
// src/routes/notes.routes.ts
import { Router } from "express";
import { notesController } from "../controllers/notes.controller.js";

export const notesRouter = Router();

notesRouter.get("/", notesController.list);
notesRouter.get("/:id", notesController.detail);
notesRouter.post("/", notesController.create);
`),
          h("3. Tanggung Jawab Controller"),
          p(
            "<ul><li>Membaca params, query, body, dan header.</li><li>Memanggil service dengan input yang sudah dinormalisasi.</li><li>Memilih status code dan format response.</li><li>Meneruskan error ke error handler.</li></ul>",
          ),
          callout(
            "warning",
            "Jangan menaruh query database atau aturan bisnis panjang di controller. Jika controller mulai berisi banyak kondisi, pindahkan ke service.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan method update dan remove di controller, lalu hubungkan ke route PUT /notes/:id dan DELETE /notes/:id.",
          ),
          divider(),
        ],
      },
      {
        title: "Service: Memisahkan Logika Bisnis",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengekstrak data dan aturan bisnis ke service sehingga controller hanya menangani HTTP.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>rest-api-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd rest-api-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/services/notes.service.ts. File yang diubah: src/controllers/notes.controller.ts.",
          ),
          h("1. Service In-Memory"),
          tsCode(`
// src/services/notes.service.ts
export type Note = {
  id: number;
  title: string;
  content: string;
};

const notes: Note[] = [
  { id: 1, title: "Belajar REST API", content: "Service dasar" },
];
let nextId = 2;

export const notesService = {
  list(search?: string): Note[] {
    if (!search) return notes;
    const kata = search.toLowerCase();
    return notes.filter((note) => note.title.toLowerCase().includes(kata));
  },

  find(id: number): Note | undefined {
    return notes.find((note) => note.id === id);
  },

  create(input: { title: string; content?: string }): Note {
    const note: Note = {
      id: nextId,
      title: input.title,
      content: input.content ?? "",
    };
    nextId += 1;
    notes.push(note);
    return note;
  },

  update(id: number, input: { title?: string; content?: string }): Note | undefined {
    const note = notes.find((item) => item.id === id);
    if (!note) return undefined;
    if (input.title !== undefined) note.title = input.title;
    if (input.content !== undefined) note.content = input.content;
    return note;
  },

  remove(id: number): boolean {
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) return false;
    notes.splice(index, 1);
    return true;
  },
};
`),
          h("2. Controller Memanggil Service"),
          tsCode(`
// src/controllers/notes.controller.ts
import type { Request, Response } from "express";
import { notesService } from "../services/notes.service.js";

export const notesController = {
  list(req: Request, res: Response) {
    const search = req.query.search ? String(req.query.search) : undefined;
    res.json({ data: notesService.list(search) });
  },

  detail(req: Request, res: Response) {
    const note = notesService.find(Number(req.params.id));
    if (!note) {
      res.status(404).json({ error: "Catatan tidak ditemukan" });
      return;
    }
    res.json({ data: note });
  },

  create(req: Request, res: Response) {
    const { title, content } = req.body as { title?: string; content?: string };
    if (!title) {
      res.status(422).json({ error: "Title wajib diisi" });
      return;
    }
    res.status(201).json({ data: notesService.create({ title, content }) });
  },
};
`),
          h("3. Batas Tanggung Jawab"),
          p(
            "<ul><li><strong>Route</strong> — memetakan URL dan method ke controller.</li><li><strong>Controller</strong> — menerjemahkan HTTP ke pemanggilan service.</li><li><strong>Service</strong> — aturan bisnis dan akses data.</li></ul>",
          ),
          callout(
            "info",
            "Service tidak mengetahui Express. Ia menerima input biasa dan mengembalikan data. Ini membuat service mudah diuji tanpa HTTP.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Pindahkan route PUT dan DELETE ke controller + service, lalu uji dengan curl.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Part 1",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Part 1: Express & Layer Dasar"),
          p("<p>Uji pemahaman HTTP, method, routing, controller, dan service.</p>"),
          quiz("Kuis Part 1: Express & Layer Dasar", [
            {
              q: "Method yang tepat untuk membuat resource baru adalah...",
              options: ["GET", "POST", "PUT", "DELETE"],
              answer: 1,
            },
            {
              q: "Status code untuk resource yang berhasil dibuat adalah...",
              options: ["200", "201", "204", "404"],
              answer: 1,
            },
            {
              q: "Tugas utama controller adalah...",
              options: [
                "Mengatur query database",
                "Menerjemahkan request HTTP dan memanggil service",
                "Membuat migration",
                "Menjalankan server",
              ],
              answer: 1,
            },
            {
              q: "Service sebaiknya...",
              options: [
                "Mengakses req dan res langsung",
                "Berisi logika bisnis dan tidak bergantung pada Express",
                "Mengatur route",
                "Menyimpan konfigurasi CORS",
              ],
              answer: 1,
            },
            {
              q: "Keuntungan memisahkan route, controller, dan service adalah...",
              options: [
                "Kode lebih mudah diuji dan dirawat",
                "Tidak perlu TypeScript",
                "Tidak perlu validasi",
                "Semua error hilang",
              ],
              answer: 0,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 2 — PATTERN, MYSQL, CORS & TESTING
  // ==========================================================
  {
    name: "Pattern, MySQL, CORS & Testing",
    description:
      "Memantapkan Controller-Service Pattern, menyimpan data ke MySQL dengan Prisma, menambahkan CORS, serta unit dan integration testing.",
    lessons: [
      {
        title: "Controller-Service Pattern & Struktur Proyek",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Merapikan aplikasi dengan Controller-Service Pattern, lapisan repository, dan struktur folder yang siap diuji.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>rest-api-latihan</code>. <strong>Tidak ada dependency baru.</strong> Kita akan refactor struktur dari Part 1.</p>",
          ),
          bashCode(`
cd rest-api-latihan
npm run dev
`),
          callout(
            "info",
            "Folder yang disarankan: src/controllers, src/services, src/repositories, src/routes, src/middlewares, src/lib, src/types.",
          ),
          h("1. Struktur Folder"),
          bashCode(`
src/
├─ controllers/
│  └─ notes.controller.ts
├─ services/
│  └─ notes.service.ts
├─ repositories/
│  └─ notes.repository.ts
├─ routes/
│  └─ notes.routes.ts
├─ middlewares/
│  └─ error-handler.ts
├─ lib/
│  └─ prisma.ts
├─ types/
│  └─ note.ts
├─ app.ts
└─ server.ts
`),
          h("2. Interface Repository"),
          p(
            "<p>Service bergantung pada kontrak repository, bukan langsung pada Prisma. Ini membuat service bisa diuji dengan repository palsu.</p>",
          ),
          tsCode(`
// src/types/note.ts
export type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};
`),
          tsCode(`
// src/repositories/notes.repository.ts
import type { Note } from "../types/note.js";

export type CreateNoteInput = {
  title: string;
  content: string;
};

export type UpdateNoteInput = {
  title?: string;
  content?: string;
};

export interface NotesRepository {
  list(search?: string): Promise<Note[]>;
  find(id: number): Promise<Note | null>;
  create(input: CreateNoteInput): Promise<Note>;
  update(id: number, input: UpdateNoteInput): Promise<Note | null>;
  remove(id: number): Promise<boolean>;
}
`),
          h("3. Service Menerima Repository"),
          tsCode(`
// src/services/notes.service.ts
import type {
  CreateNoteInput,
  NotesRepository,
  UpdateNoteInput,
} from "../repositories/notes.repository.js";

export function createNotesService(repo: NotesRepository) {
  return {
    list(search?: string) {
      return repo.list(search);
    },

    find(id: number) {
      return repo.find(id);
    },

    create(input: CreateNoteInput) {
      if (!input.title.trim()) {
        throw new Error("Title wajib diisi");
      }
      return repo.create({
        title: input.title.trim(),
        content: input.content.trim(),
      });
    },

    update(id: number, input: UpdateNoteInput) {
      return repo.update(id, input);
    },

    remove(id: number) {
      return repo.remove(id);
    },
  };
}

export type NotesService = ReturnType<typeof createNotesService>;
`),
          h("4. App Menerima Repository"),
          p(
            "<p>Dengan factory, aplikasi bisa memakai repository Prisma di produksi dan repository palsu di test.</p>",
          ),
          tsCode(`
// src/app.ts
import express from "express";
import type { NotesRepository } from "./repositories/notes.repository.js";
import { createNotesService } from "./services/notes.service.js";
import { createNotesRouter } from "./routes/notes.routes.js";

export function createApp(repo: NotesRepository) {
  const app = express();
  const service = createNotesService(repo);

  app.use(express.json());
  app.use("/notes", createNotesRouter(service));

  return app;
}
`),
          callout(
            "info",
            "Controller-Service Pattern bukan berarti semua aplikasi harus punya repository terpisah. Lapisan ini membantu ketika kita ingin mengganti sumber data atau menguji logika tanpa database.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Buat implementasi repository in-memory sementara agar aplikasi tetap berjalan sebelum Prisma dipasang di lesson berikutnya.",
          ),
          divider(),
        ],
      },
      {
        title: "Setup Prisma 7 + MySQL",
        duration: 25,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menghubungkan aplikasi ke MySQL dengan Prisma 7, membuat schema, menjalankan migration, dan menginisialisasi Prisma Client memakai driver adapter.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini membutuhkan <strong>MySQL yang sudah berjalan</strong> (MySQL Community Server, XAMPP/Laragon, atau MySQL hosted). Dependency yang akan dipasang: <code>@prisma/client</code>, <code>@prisma/adapter-mariadb</code>, <code>mariadb</code>, <code>dotenv</code>, dan Prisma CLI. Tidak memakai Docker. User MySQL harus punya akses membuat database dan shadow database untuk migration.</p>",
          ),
          bashCode(`
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS provoks_rest_api CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"

cd rest-api-latihan
npm install @prisma/client@7 @prisma/adapter-mariadb mariadb dotenv
npm install -D prisma@7
npx prisma init --datasource-provider mysql --output ../generated/prisma
`),
          callout(
            "warning",
            "Jika user MySQL tidak punya izin CREATE, migration bisa gagal dengan error shadow database (P3014). Gunakan user yang memiliki izin atau buat database shadow secara manual.",
          ),
          h("1. Environment"),
          p(
            "<p>Isi <code>.env</code> dengan connection string dan variabel yang dipakai adapter.</p>",
          ),
          code(`
DATABASE_URL="mysql://root:password@localhost:3306/provoks_rest_api"
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=provoks_rest_api
`, "bash"),
          h("2. Schema Prisma"),
          code(`
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
}

model Note {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(191)
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`, "prisma"),
          h("3. Prisma Config"),
          p(
            "<p>Prisma 7 menghasilkan file konfigurasi. Pastikan schema dan URL database terbaca.</p>",
          ),
          tsCode(`
// prisma7.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
`),
          h("4. Prisma Client + Adapter MySQL"),
          p(
            "<p>Prisma 7 membutuhkan driver adapter. Untuk MySQL/MariaDB gunakan <code>@prisma/adapter-mariadb</code>.</p>",
          ),
          tsCode(`
// src/lib/prisma.ts
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client.js";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 3306),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });
`),
          h("5. Migration"),
          bashCode(`
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio
`),
          callout(
            "warning",
            "Error P1001 berarti MySQL tidak bisa dihubungi. Periksa service MySQL, host, port, dan kredensial. Pastikan database provoks_rest_api sudah dibuat.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan model Tag dan relasi many-to-many dengan Note, lalu jalankan migration baru.",
          ),
          divider(),
        ],
      },
      {
        title: "CRUD dengan Service + Prisma",
        duration: 25,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengganti repository in-memory dengan Prisma, lalu menghubungkan CRUD ke MySQL tanpa mengubah controller dan service.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>rest-api-latihan</code>. <strong>Tidak ada dependency baru</strong>, tetapi MySQL harus berjalan dan migration sudah dijalankan.</p>",
          ),
          bashCode(`
cd rest-api-latihan
npx prisma migrate dev
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/repositories/prisma-notes.repository.ts. File yang diubah: src/server.ts.",
          ),
          h("1. Repository Prisma"),
          tsCode(`
// src/repositories/prisma-notes.repository.ts
import { prisma } from "../lib/prisma.js";
import type {
  CreateNoteInput,
  NotesRepository,
  UpdateNoteInput,
} from "./notes.repository.js";

export const prismaNotesRepository: NotesRepository = {
  async list(search) {
    return prisma.note.findMany({
      where: search
        ? { title: { contains: search } }
        : undefined,
      orderBy: { createdAt: "desc" },
    });
  },

  async find(id) {
    return prisma.note.findUnique({ where: { id } });
  },

  async create(input: CreateNoteInput) {
    return prisma.note.create({ data: input });
  },

  async update(id: number, input: UpdateNoteInput) {
    const ada = await prisma.note.findUnique({ where: { id } });
    if (!ada) return null;

    return prisma.note.update({
      where: { id },
      data: input,
    });
  },

  async remove(id: number) {
    const ada = await prisma.note.findUnique({ where: { id } });
    if (!ada) return false;
    await prisma.note.delete({ where: { id } });
    return true;
  },
};
`),
          h("2. Rakit Aplikasi"),
          tsCode(`
// src/server.ts
import { createApp } from "./app.js";
import { prismaNotesRepository } from "./repositories/prisma-notes.repository.js";

const app = createApp(prismaNotesRepository);
const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log("API berjalan di http://localhost:" + port);
});
`),
          h("3. Controller Async"),
          p(
            "<p>Karena repository Prisma mengembalikan Promise, controller dan service memakai <code>await</code>. Pastikan error diteruskan ke error handler.</p>",
          ),
          tsCode(`
// src/controllers/notes.controller.ts
import type { Request, Response, NextFunction } from "express";
import type { NotesService } from "../services/notes.service.js";

export function createNotesController(service: NotesService) {
  return {
    async list(req: Request, res: Response, next: NextFunction) {
      try {
        const search = req.query.search ? String(req.query.search) : undefined;
        res.json({ data: await service.list(search) });
      } catch (error) {
        next(error);
      }
    },

    async detail(req: Request, res: Response, next: NextFunction) {
      try {
        const note = await service.find(Number(req.params.id));
        if (!note) {
          res.status(404).json({ error: "Catatan tidak ditemukan" });
          return;
        }
        res.json({ data: note });
      } catch (error) {
        next(error);
      }
    },
  };
}
`),
          h("4. Uji CRUD"),
          bashCode(`
curl -X POST http://localhost:4000/notes \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Catatan MySQL","content":"Tersimpan di database"}'

curl http://localhost:4000/notes
curl http://localhost:4000/notes/1
curl -X PUT http://localhost:4000/notes/1 \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Catatan diperbarui"}'
curl -X DELETE http://localhost:4000/notes/1
`),
          callout(
            "info",
            "MySQL memakai collation utf8mb4_0900_ai_ci yang umumnya case-insensitive. Prisma MySQL tidak memakai opsi mode: \"insensitive\" seperti PostgreSQL; pencarian mengikuti collation database.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan filter ?search= dan pastikan hasilnya sesuai. Restart server lalu pastikan data tetap ada karena tersimpan di MySQL.",
          ),
          divider(),
        ],
      },
      {
        title: "Validasi Zod & Error Handler",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memvalidasi input di batas API dengan Zod dan memusatkan format error agar konsisten.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini menambah dependency <code>zod</code>. Jalankan dari folder proyek.</p>",
          ),
          bashCode(`
cd rest-api-latihan
npm install zod
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/schemas/note.schema.ts, src/utils/api-error.ts, src/middlewares/error-handler.ts.",
          ),
          h("1. Schema Zod"),
          tsCode(`
// src/schemas/note.schema.ts
import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title wajib diisi").max(191),
  content: z.string().trim().min(1, "Content wajib diisi"),
});

export const updateNoteSchema = z.object({
  title: z.string().trim().min(1).max(191).optional(),
  content: z.string().trim().min(1).optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
`),
          h("2. ApiError"),
          tsCode(`
// src/utils/api-error.ts
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static notFound(message = "Data tidak ditemukan") {
    return new ApiError(404, message);
  }

  static unprocessable(message = "Validasi gagal", details?: unknown) {
    return new ApiError(422, message, details);
  }
}
`),
          h("3. Error Handler"),
          tsCode(`
// src/middlewares/error-handler.ts
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(422).json({
      error: "VALIDATION_ERROR",
      message: "Input tidak valid",
      details: error.flatten().fieldErrors,
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.statusCode === 404 ? "NOT_FOUND" : "REQUEST_ERROR",
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);
  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Terjadi kesalahan pada server",
  });
}
`),
          h("4. Pakai Validasi & Error Handler"),
          tsCode(`
// src/controllers/notes.controller.ts
import { createNoteSchema } from "../schemas/note.schema.js";
import { ApiError } from "../utils/api-error.js";

async create(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createNoteSchema.parse(req.body);
    const note = await service.create(input);
    res.status(201).json({ data: note });
  } catch (error) {
    next(error);
  }
},
`),
          tsCode(`
// src/app.ts (setelah route)
import { errorHandler } from "./middlewares/error-handler.js";

app.use(errorHandler);
`),
          callout(
            "warning",
            "Validasi client bukan pengganti validasi server. Schema Zod di API adalah batas keamanan data yang masuk ke database.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Kirim body tanpa title, lalu pastikan response 422 memiliki field details yang jelas.",
          ),
          divider(),
        ],
      },
      {
        title: "CORS & Middleware",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengonfigurasi CORS untuk frontend, memahami preflight, dan menambahkan middleware dasar.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini menambah dependency <code>cors</code> dan tipenya.</p>",
          ),
          bashCode(`
cd rest-api-latihan
npm install cors
npm install -D @types/cors
npm run dev
`),
          callout(
            "info",
            "File yang diubah: src/app.ts. File yang dibuat: src/middlewares/logger.ts.",
          ),
          h("1. Konfigurasi CORS"),
          p(
            "<p>Browser memblokir request lintas origin jika server tidak mengirim header CORS. Untuk frontend lokal, daftarkan origin secara eksplisit.</p>",
          ),
          tsCode(`
// src/app.ts
import cors from "cors";

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
`),
          h("2. Preflight OPTIONS"),
          p(
            "<p>Untuk request non-sederhana, browser mengirim preflight <code>OPTIONS</code>. Middleware CORS harus membalas header izin sebelum request sebenarnya dikirim.</p>",
          ),
          bashCode(`
curl -i -X OPTIONS http://localhost:4000/notes \\
  -H "Origin: http://localhost:5173" \\
  -H "Access-Control-Request-Method: POST" \\
  -H "Access-Control-Request-Headers: content-type"
`),
          h("3. Middleware Logger"),
          tsCode(`
// src/middlewares/logger.ts
import type { NextFunction, Request, Response } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  const mulai = Date.now();

  res.on("finish", () => {
    console.log(
      req.method + " " + req.originalUrl + " " + res.statusCode + " " + (Date.now() - mulai) + "ms",
    );
  });

  next();
}
`),
          tsCode(`
// src/app.ts
import { logger } from "./middlewares/logger.js";

app.use(logger);
`),
          callout(
            "warning",
            "Jangan memakai origin: \"*\" bersama credentials: true. Browser akan menolak kombinasi tersebut. Daftarkan origin frontend secara eksplisit.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Uji request dari origin yang tidak terdaftar dan pastikan header Access-Control-Allow-Origin tidak muncul.",
          ),
          divider(),
        ],
      },
      {
        title: "Unit Testing Service dengan Vitest",
        duration: 24,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menguji logika service secara terisolasi dengan Vitest dan repository palsu, tanpa membutuhkan MySQL.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini menambah dependency dev <code>vitest</code>. Tidak perlu database untuk unit test karena repository diganti dengan fake.</p>",
          ),
          bashCode(`
cd rest-api-latihan
npm install -D vitest
npm run test
`),
          callout(
            "info",
            "File yang dibuat: vitest.config.ts, src/services/notes.service.test.ts, dan fake repository di test.",
          ),
          h("1. Konfigurasi Vitest"),
          tsCode(`
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
`),
          jsonCode(`
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
`),
          h("2. Fake Repository"),
          tsCode(`
import type {
  CreateNoteInput,
  NotesRepository,
  UpdateNoteInput,
} from "../repositories/notes.repository.js";
import type { Note } from "../types/note.js";

export class FakeNotesRepository implements NotesRepository {
  private notes: Note[] = [];
  private nextId = 1;

  async list(search?: string) {
    if (!search) return this.notes;
    return this.notes.filter((note) => note.title.includes(search));
  }

  async find(id: number) {
    return this.notes.find((note) => note.id === id) ?? null;
  }

  async create(input: CreateNoteInput) {
    const now = new Date();
    const note: Note = {
      id: this.nextId++,
      title: input.title,
      content: input.content,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    return note;
  }

  async update(id: number, input: UpdateNoteInput) {
    const note = this.notes.find((item) => item.id === id);
    if (!note) return null;
    if (input.title !== undefined) note.title = input.title;
    if (input.content !== undefined) note.content = input.content;
    note.updatedAt = new Date();
    return note;
  }

  async remove(id: number) {
    const index = this.notes.findIndex((note) => note.id === id);
    if (index === -1) return false;
    this.notes.splice(index, 1);
    return true;
  }
}
`),
          h("3. Unit Test Service"),
          tsCode(`
// src/services/notes.service.test.ts
import { describe, expect, it } from "vitest";
import { createNotesService } from "./notes.service.js";
import { FakeNotesRepository } from "../repositories/fake-notes.repository.js";

describe("notesService", () => {
  it("membuat catatan dan menampilkannya di list", async () => {
    const service = createNotesService(new FakeNotesRepository());

    const note = await service.create({
      title: "Belajar testing",
      content: "Unit test service",
    });

    expect(note.id).toBe(1);
    expect(await service.list()).toHaveLength(1);
  });

  it("menolak title kosong", async () => {
    const service = createNotesService(new FakeNotesRepository());

    await expect(
      service.create({ title: "   ", content: "Isi" }),
    ).rejects.toThrow("Title wajib diisi");
  });

  it("mengembalikan false saat menghapus id yang tidak ada", async () => {
    const service = createNotesService(new FakeNotesRepository());
    expect(await service.remove(99)).toBe(false);
  });
});
`),
          bashCode(`
npm run test
npm run test:run
`),
          callout(
            "info",
            "Unit test tidak memanggil Express maupun MySQL. Fokusnya adalah aturan bisnis di service dan interaksi dengan repository.",
          ),
          callout(
            "warning",
            "Jika test gagal karena import .js, pastikan project memakai ESM dan tsconfig NodeNext. Import lokal tetap memakai ekstensi .js meskipun file sumber .ts.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan test untuk update, pencarian, dan kasus title berisi spasi di awal/akhir.",
          ),
          divider(),
        ],
      },
      {
        title: "Integration Testing & Mini Project",
        duration: 30,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menguji endpoint HTTP dengan Supertest, lalu menyelesaikan mini project REST API lengkap dengan validasi, CORS, dan testing.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini menambah dependency dev <code>supertest</code> dan tipenya. Integration test memakai fake repository, jadi tidak membutuhkan MySQL.</p>",
          ),
          bashCode(`
cd rest-api-latihan
npm install -D supertest @types/supertest
npm run test
`),
          callout(
            "info",
            "File yang dibuat: src/app.test.ts. Pastikan src/app.test.ts memakai createApp(fakeRepository).",
          ),
          h("1. Integration Test"),
          tsCode(`
// src/app.test.ts
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { FakeNotesRepository } from "./repositories/fake-notes.repository.js";

function appUji() {
  return createApp(new FakeNotesRepository());
}

describe("POST /notes", () => {
  it("membuat catatan", async () => {
    const res = await request(appUji())
      .post("/notes")
      .send({ title: "Catatan test", content: "Isi test" });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Catatan test");
  });

  it("mengembalikan 422 saat title kosong", async () => {
    const res = await request(appUji())
      .post("/notes")
      .send({ title: "", content: "Isi" });

    expect(res.status).toBe(422);
    expect(res.body.error).toBe("VALIDATION_ERROR");
  });
});

describe("GET /notes/:id", () => {
  it("mengembalikan 404 jika tidak ada", async () => {
    const res = await request(appUji()).get("/notes/999");
    expect(res.status).toBe(404);
  });
});
`),
          h("2. Mini Project Akhir"),
          p(
            "<p>Lengkapi REST API notes dengan fitur berikut:</p><ul><li>CRUD lengkap dengan controller-service-repository.</li><li>Validasi Zod untuk create dan update.</li><li>Error handler konsisten.</li><li>CORS untuk frontend lokal.</li><li>Pagination, filter search, dan sorting.</li><li>Unit test service + integration test endpoint.</li><li>README berisi cara menjalankan, dependency, endpoint, dan contoh curl.</li></ul>",
          ),
          h("3. Pagination & Filter"),
          tsCode(`
// src/repositories/prisma-notes.repository.ts
async list(params: { search?: string; page: number; perPage: number }) {
  const where = params.search
    ? { title: { contains: params.search } }
    : undefined;

  const [items, total] = await Promise.all([
    prisma.note.findMany({
      where,
      skip: (params.page - 1) * params.perPage,
      take: params.perPage,
      orderBy: { createdAt: "desc" },
    }),
    prisma.note.count({ where }),
  ]);

  return { items, total };
}
`),
          h("4. README Proyek"),
          bashCode(`
# REST API Notes

## Menjalankan
1. Pastikan MySQL berjalan.
2. Buat database provoks_rest_api.
3. cp .env.example .env dan sesuaikan kredensial.
4. npm install
5. npx prisma migrate dev
6. npm run dev

## Script
- npm run dev
- npm run test
- npm run test:run
- npm run build
`),
          callout(
            "info",
            "Pisahkan app factory dari server listen. Dengan begitu integration test bisa memakai Supertest tanpa membuka port dan tanpa database nyata.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan endpoint GET /notes/:id, PUT, DELETE, pagination, dan test untuk masing-masing status code.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Part 2",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Part 2: Pattern, MySQL, CORS & Testing"),
          p("<p>Uji pemahaman controller-service, Prisma, CORS, dan testing.</p>"),
          quiz("Kuis Part 2: Pattern, MySQL, CORS & Testing", [
            {
              q: "Lapisan yang bertugas mengakses database adalah...",
              options: ["Route", "Controller", "Service", "Repository"],
              answer: 3,
            },
            {
              q: "Prisma 7 untuk MySQL membutuhkan...",
              options: ["@prisma/adapter-mariadb", "mysql2", "sequelize", "mongodb"],
              answer: 0,
            },
            {
              q: "CORS preflight biasanya memakai method...",
              options: ["GET", "POST", "OPTIONS", "HEAD"],
              answer: 2,
            },
            {
              q: "Unit test service sebaiknya...",
              options: [
                "Memakai database production",
                "Memakai fake repository",
                "Menjalankan server Express",
                "Membuka port 4000",
              ],
              answer: 1,
            },
            {
              q: "Integration test endpoint umumnya memakai...",
              options: ["Supertest", "Jest DOM", "React Testing Library", "Prisma Studio"],
              answer: 0,
            },
          ]),
        ],
      },
      {
        title: "Ujian Akhir REST API",
        duration: 20,
        type: "QUIZ",
        blocks: [
          h("Ujian Akhir REST API"),
          p(
            "<p>Kuis campuran dari seluruh materi: HTTP, method, routing, controller, service, MySQL/Prisma, CORS, dan testing.</p>",
          ),
          quiz(
            "Ujian Akhir REST API",
            [
              {
                q: "Method untuk membuat resource adalah...",
                options: ["GET", "POST", "PUT", "DELETE"],
                answer: 1,
              },
              {
                q: "Status code untuk resource yang berhasil dibuat adalah...",
                options: ["200", "201", "204", "422"],
                answer: 1,
              },
              {
                q: "Route sebaiknya...",
                options: [
                  "Berisi query database",
                  "Hanya memetakan endpoint ke controller",
                  "Mengatur CORS",
                  "Menjalankan migration",
                ],
                answer: 1,
              },
              {
                q: "Controller bertanggung jawab pada...",
                options: [
                  "Logika bisnis",
                  "Request/response HTTP",
                  "Schema database",
                  "Konfigurasi Prisma",
                ],
                answer: 1,
              },
              {
                q: "Service sebaiknya independen dari...",
                options: ["Database", "Express", "TypeScript", "Repository"],
                answer: 1,
              },
              {
                q: "Prisma 7 membutuhkan...",
                options: ["Driver adapter", "Docker", "Postman", "Redis"],
                answer: 0,
              },
              {
                q: "MySQL case-insensitive search biasanya dipengaruhi oleh...",
                options: ["Collation", "Port", "CORS", "Controller"],
                answer: 0,
              },
              {
                q: "CORS credentials tidak boleh digabung dengan origin...",
                options: ["localhost", "frontend resmi", "*", "https"],
                answer: 2,
              },
              {
                q: "Preflight request memakai method...",
                options: ["GET", "POST", "OPTIONS", "PATCH"],
                answer: 2,
              },
              {
                q: "Unit test service sebaiknya memakai...",
                options: ["Database production", "Fake repository", "Server Express", "Port 4000"],
                answer: 1,
              },
              {
                q: "Integration test HTTP endpoint biasanya memakai...",
                options: ["Supertest", "Prisma Studio", "CORS", "Zod"],
                answer: 0,
              },
              {
                q: "Validasi input di API sebaiknya dilakukan...",
                options: ["Hanya di frontend", "Di batas API dengan schema", "Setelah data masuk database", "Tidak perlu"],
                answer: 1,
              },
            ],
            { timeLimitMinutes: 30, maxAttempts: 2 },
          ),
        ],
      },
    ],
  },
];
