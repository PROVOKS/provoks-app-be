# Provoks LMS — Backend API

Express 5 + TypeScript + Prisma 7 + PostgreSQL. Endpoint REST untuk Provoks LMS.

## Struktur

```
src/
├─ config/        env + konfigurasi
├─ db/            Prisma client
├─ controllers/   handler HTTP (tipis)
├─ middlewares/   auth · validate · error-handler
├─ routes/        definisi endpoint per modul
├─ services/      logika bisnis + akses Prisma
├─ utils/         ApiError · asyncHandler · pagination · slug
├─ validators/    skema zod per modul
├─ generated/     Prisma Client (hasil `prisma generate`)
├─ app.ts         setup express
└─ server.ts      bootstrap + graceful shutdown
```

## Domain

```
course
├── course_parts        (Getting Started, React Fundamentals, ...)
│   └── silabus_parts   (item silabus)
│       └── content_blocks  (heading, paragraph, image, divider, video, code, callout, quiz)
│           └── quiz_questions
├── tags                (via course_tags)
└── path                (Frontend / Backend / Full-Stack)

course.passingGrade = nilai minimum lulus (milik COURSE, bukan silabus part)
```

## Setup

```bash
npm install
cp .env.example .env      # sesuaikan DATABASE_URL
npm run db:up             # jalankan PostgreSQL via Docker
npm run prisma:migrate    # buat tabel
npm run dev               # http://localhost:4000/api/v1
```

## Scripts

| Script | Fungsi |
| --- | --- |
| `npm run dev` | tsx watch (hot reload) |
| `npm run build` | compile ke `dist/` |
| `npm run start` | jalankan hasil build |
| `npm run typecheck` | cek tipe tanpa emit |
| `npm run db:up` / `db:down` | Docker Compose Postgres |
| `npm run prisma:migrate` | migrasi database |
| `npm run prisma:studio` | Prisma Studio |

## Endpoint

Semua respons: `{ success, message, data }`.

### Auth
| Method | Path | Auth |
| --- | --- | --- |
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| GET | `/auth/me` | Bearer |

### Paths
`GET /paths` · `GET /paths/:id` · `POST /paths` · `PUT /paths/:id` · `DELETE /paths/:id`

### Tags
`GET /tags` · `GET /tags/:id` · `POST /tags` · `PUT /tags/:id` · `DELETE /tags/:id`

### Courses
`GET /courses` (filter: `search`, `status`, `pathId`, `tagId`, `page`, `perPage`) ·
`GET /courses/:id` (lengkap dengan parts → silabus parts → blocks) ·
`POST /courses` · `PUT /courses/:id` · `DELETE /courses/:id`

### Silabus
- `POST /silabus/course-parts` · `PUT /silabus/course-parts/:id` · `DELETE /silabus/course-parts/:id`
- `POST /silabus/silabus-parts` · `PUT /silabus/silabus-parts/:id` · `DELETE /silabus/silabus-parts/:id`
- `PUT /silabus/reorder` (drag & drop urutan)

### Content Blocks
`GET /blocks/silabus-part/:silabusPartId` · `POST /blocks` · `PUT /blocks/:id` · `DELETE /blocks/:id` · `PUT /blocks/reorder`

### Quiz
`GET /quiz/blocks/:blockId/questions` · `POST /quiz/questions` · `PUT /quiz/questions/:id` · `DELETE /quiz/questions/:id`
`POST /quiz/blocks/:blockId/import` (import JSON, `?replace=false` untuk menambah)

Contoh import JSON:
```json
{
  "title": "Kuis: Dasar JSX",
  "passing": 70,
  "questions": [
    { "q": "Apa kepanjangan dari JSX?", "options": ["JavaScript XML", "Java Syntax"], "answer": 0 }
  ]
}
```

## Catatan

- `passingGrade` sengaja diletakkan di `Course`, bukan di `SilabusPart`.
- `ContentBlock.content` bertipe `Json` supaya tiap tipe block punya payload sendiri
  (mis. `HEADING: { level, text }`, `VIDEO: { url, title }`, `CODE: { language, code }`).
- Role: `ADMIN`, `INSTRUCTOR`, `STUDENT`. Endpoint tulis butuh Bearer token.
