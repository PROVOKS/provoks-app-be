import { hash } from "bcryptjs";

import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";
import { getPagination, paginated } from "../utils/pagination";

/** Header CSV yang dikenali (lowercase) → nama field internal */
const HEADER_MAP: Record<string, string> = {
  nama: "nama",
  name: "nama",
  nim: "nim",
  email: "email",
  prodi: "prodi",
  "program studi": "prodi",
  path: "path",
  path_slug: "pathSlug",
  pathslug: "pathSlug",
  sumber_path: "sumberPath",
  perlu_review: "perluReview",
  catatan: "catatan",
  keterangan: "catatan",
  note: "catatan",
};

/** Parser CSV yang sadar tanda kutip ("" escape, koma & newline di dalam kutip) */
export function parseCsv(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];

    if (inQuotes) {
      if (char === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((entry) => entry.some((cell) => cell.trim() !== ""));
}

export type ImportRow = {
  line: number;
  nama: string;
  nim: string;
  email: string;
  prodi: string;
  pathSlug: string;
  pathName: string;
  perluReview: boolean;
  catatan: string;
  status: "ok" | "warning" | "error";
  action: "create" | "update";
  message: string;
};

export type ImportPreview = {
  rows: ImportRow[];
  summary: {
    total: number;
    ok: number;
    warning: number;
    error: number;
    create: number;
    update: number;
    paths: { slug: string; name: string; count: number }[];
  };
};

/** Parse + validasi CSV siswa (tanpa menulis ke DB) */
async function buildPreview(csv: string): Promise<ImportPreview> {
  const table = parseCsv(csv);
  if (table.length === 0) {
    throw ApiError.badRequest("File CSV kosong");
  }

  const header = table[0].map((cell) => cell.trim().toLowerCase());
  const index: Record<string, number> = {};
  header.forEach((name, position) => {
    const field = HEADER_MAP[name];
    if (field && index[field] === undefined) index[field] = position;
  });

  if (index.nama === undefined || index.nim === undefined) {
    throw ApiError.badRequest(
      'Header CSV wajib punya kolom "nama" dan "nim"',
    );
  }

  const cell = (row: string[], field: string) =>
    (index[field] === undefined ? "" : (row[index[field]] ?? "")).trim();

  const paths = await prisma.path.findMany({
    select: { id: true, name: true, slug: true },
  });
  const pathBySlug = new Map(paths.map((item) => [item.slug.toLowerCase(), item]));
  const pathByName = new Map(paths.map((item) => [item.name.toLowerCase(), item]));

  const rows: ImportRow[] = [];
  const seenNim = new Map<string, number>();

  for (let i = 1; i < table.length; i += 1) {
    const raw = table[i];
    const line = i + 1;
    const nama = cell(raw, "nama");
    const nimRaw = cell(raw, "nim");
    const emailRaw = cell(raw, "email");
    const prodi = cell(raw, "prodi");
    const pathSlugRaw = cell(raw, "pathSlug");
    const pathNameRaw = cell(raw, "path");
    const perluReviewRaw = cell(raw, "perluReview").toLowerCase();
    const catatan = cell(raw, "catatan");

    let nim = nimRaw;
    const problems: string[] = [];
    const warnings: string[] = [];

    if (!nama) problems.push("nama kosong");
    if (!nim) problems.push("nim kosong");

    if (nim) {
      if (!/^\d+$/.test(nim)) {
        problems.push("NIM harus angka");
      } else if (nim.length !== 15) {
        warnings.push(`NIM ${nim.length} digit (umumnya 15) — cek manual`);
      }
    }

    if (nim) {
      const previousLine = seenNim.get(nim);
      if (previousLine !== undefined) {
        problems.push(`NIM duplikat di file (baris ${previousLine})`);
      } else {
        seenNim.set(nim, line);
      }
    }

    let path = pathSlugRaw
      ? pathBySlug.get(pathSlugRaw.toLowerCase())
      : undefined;
    if (!path && pathNameRaw) {
      path = pathByName.get(pathNameRaw.toLowerCase());
    }
    if (!path) {
      problems.push(
        pathSlugRaw || pathNameRaw
          ? `Path "${pathSlugRaw || pathNameRaw}" tidak ditemukan`
          : "path kosong",
      );
    }

    const email = (emailRaw || (nim ? `${nim}@student.provoks.id` : "")).toLowerCase();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      problems.push("format email tidak valid");
    }

    const perluReview =
      perluReviewRaw === "ya" || perluReviewRaw === "true" || perluReviewRaw === "1";
    if (perluReview && catatan) warnings.push(catatan);

    let action: "create" | "update" = "create";
    if (!problems.length && (nim || email)) {
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            ...(nim ? [{ nim }] : []),
            ...(email ? [{ email }] : []),
          ],
        },
        select: { id: true },
      });
      if (existing) action = "update";
    }

    rows.push({
      line,
      nama,
      nim,
      email,
      prodi,
      pathSlug: path?.slug ?? pathSlugRaw,
      pathName: path?.name ?? pathNameRaw,
      perluReview,
      catatan,
      status: problems.length ? "error" : warnings.length ? "warning" : "ok",
      action,
      message: [...problems, ...warnings].join("; "),
    });
  }

  const pathCount = new Map<string, { slug: string; name: string; count: number }>();
  for (const row of rows) {
    if (row.status === "error" || !row.pathSlug) continue;
    const entry = pathCount.get(row.pathSlug) ?? {
      slug: row.pathSlug,
      name: row.pathName,
      count: 0,
    };
    entry.count += 1;
    pathCount.set(row.pathSlug, entry);
  }

  return {
    rows,
    summary: {
      total: rows.length,
      ok: rows.filter((row) => row.status === "ok").length,
      warning: rows.filter((row) => row.status === "warning").length,
      error: rows.filter((row) => row.status === "error").length,
      create: rows.filter((row) => row.status !== "error" && row.action === "create").length,
      update: rows.filter((row) => row.status !== "error" && row.action === "update").length,
      paths: [...pathCount.values()].sort((a, b) => b.count - a.count),
    },
  };
}

export const studentService = {
  preview: buildPreview,

  /** Import siswa: buat/perbarui user + enrollment path (APPROVED) */
  async import(csv: string) {
    const preview = await buildPreview(csv);
    const valid = preview.rows.filter((row) => row.status !== "error");

    const paths = await prisma.path.findMany({ select: { id: true, slug: true } });
    const pathBySlug = new Map(paths.map((item) => [item.slug.toLowerCase(), item.id]));

    const result = {
      total: preview.rows.length,
      imported: 0,
      created: 0,
      updated: 0,
      enrollments: 0,
      skipped: preview.summary.error,
      needReview: valid.filter((row) => row.perluReview).length,
      errors: [] as { line: number; nama: string; nim: string; message: string }[],
    };

    for (const row of valid) {
      const pathId = pathBySlug.get(row.pathSlug.toLowerCase());
      if (!pathId) {
        result.errors.push({
          line: row.line,
          nama: row.nama,
          nim: row.nim,
          message: "Path tidak ditemukan saat import",
        });
        continue;
      }

      try {
        const password = await hash(row.nim, 10);
        const existing = await prisma.user.findFirst({
          where: { OR: [{ nim: row.nim }, { email: row.email }] },
          select: { id: true },
        });

        const user = await prisma.user.upsert({
          where: { email: row.email },
          update: {
            name: row.nama,
            nim: row.nim,
            prodi: row.prodi || null,
            role: "STUDENT",
          },
          create: {
            name: row.nama,
            email: row.email,
            password,
            role: "STUDENT",
            nim: row.nim,
            prodi: row.prodi || null,
          },
        });

        if (existing) result.updated += 1;
        else result.created += 1;

        await prisma.pathEnrollment.upsert({
          where: { userId_pathId: { userId: user.id, pathId } },
          // status yang sudah ada tidak diturunkan (mis. sudah APPROVED)
          update: {},
          create: {
            userId: user.id,
            pathId,
            status: "APPROVED",
            note: "Dari import CSV",
          },
        });

        result.imported += 1;
        result.enrollments += 1;
      } catch (error) {
        result.errors.push({
          line: row.line,
          nama: row.nama,
          nim: row.nim,
          message: error instanceof Error ? error.message : "Gagal import",
        });
      }
    }

    return result;
  },

  /** Daftar siswa + path yang diikuti */
  async list(query: Record<string, unknown>) {
    const { page, perPage, skip, take } = getPagination(query);
    const search = String(query.search ?? "").trim();
    const pathId = String(query.pathId ?? "").trim();

    const where = {
      role: "STUDENT" as const,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { nim: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(pathId ? { pathEnrollments: { some: { pathId } } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          email: true,
          nim: true,
          prodi: true,
          createdAt: true,
          pathEnrollments: {
            include: { path: { select: { id: true, name: true, slug: true } } },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return paginated(
      items.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        nim: item.nim,
        prodi: item.prodi,
        createdAt: item.createdAt,
        paths: item.pathEnrollments.map((enrollment) => ({
          id: enrollment.path.id,
          name: enrollment.path.name,
          slug: enrollment.path.slug,
          status: enrollment.status,
          enrollmentId: enrollment.id,
        })),
      })),
      total,
      page,
      perPage,
    );
  },

  /** Permintaan masuk path (PENDING) */
  async listPathRequests(query: Record<string, unknown>) {
    const { page, perPage, skip, take } = getPagination(query);
    const status = String(query.status ?? "PENDING").toUpperCase();

    const where = {
      ...(status !== "ALL" ? { status: status as never } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.pathEnrollment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true, nim: true, prodi: true } },
          path: { select: { id: true, name: true, slug: true, isFastTrack: true } },
        },
      }),
      prisma.pathEnrollment.count({ where }),
    ]);

    return paginated(
      items.map((item) => ({
        id: item.id,
        status: item.status,
        note: item.note,
        createdAt: item.createdAt,
        reviewedAt: item.reviewedAt,
        student: item.user,
        path: item.path,
      })),
      total,
      page,
      perPage,
    );
  },

  /** Setujui / tolak permintaan path */
  async reviewPathRequest(
    id: string,
    status: "APPROVED" | "REJECTED",
    reviewerId: string,
    note?: string,
  ) {
    const enrollment = await prisma.pathEnrollment.findUnique({ where: { id } });
    if (!enrollment) throw ApiError.notFound("Permintaan tidak ditemukan");

    return prisma.pathEnrollment.update({
      where: { id },
      data: {
        status,
        note: note ?? enrollment.note,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });
  },
};
