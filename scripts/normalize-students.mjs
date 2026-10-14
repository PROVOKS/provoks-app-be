// Normalisasi students.csv -> students.normalized.csv (siap import)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

/** Parser CSV sederhana yang menghormati tanda kutip. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (ch !== "\r") {
      cur += ch;
    }
  }
  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (ch) => ch.toUpperCase());
}

/** "Web Dev" -> "web-dev", "UI/UX & PM" -> "ui-ux-pm" */
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const PATH_SLUGS = {
  "Web Dev": "web-dev",
  "UI/UX & PM": "ui-ux-pm",
  IOT: "iot",
  "Game Dev": "game-dev",
  Mobile: "mobile",
};

const source = readFileSync(join(root, "students.csv"), "utf8");
const rows = parseCsv(source);

// baris data = kolom pertama berupa angka
const dataRows = rows
  .slice(4)
  .filter((row) => /^\d+$/.test((row[0] ?? "").trim()));

const seen = new Map();
const parsed = [];

for (const row of dataRows) {
  const name = titleCase((row[1] ?? "").trim());
  let nim = (row[2] ?? "").trim();
  const prodi = (row[3] ?? "").trim();
  const path = (row[4] ?? "").trim();
  const sumber = (row[5] ?? "").trim();
  const catatanAsli = (row[6] ?? "").trim();

  if (!name || !nim || !path) continue;

  const key = `${nim}|${name}`;
  if (seen.has(key)) continue; // buang blok duplikat
  seen.set(key, true);

  parsed.push({ name, nim, prodi, path, sumber, catatanAsli });
}

// ---- deteksi NIM kembar (satu NIM dipakai lebih dari satu nama) ----
const namesByNim = new Map();
for (const item of parsed) {
  const set = namesByNim.get(item.nim) ?? new Set();
  set.add(item.name);
  namesByNim.set(item.nim, set);
}

const twinNims = new Set(
  [...namesByNim.entries()]
    .filter(([, names]) => names.size > 1)
    .map(([nim]) => nim),
);

// ---- susun output (NIM kembar di-skip) ----
const output = [];
const notes = [];
const skipped = [];

for (const item of parsed) {
  if (twinNims.has(item.nim)) {
    skipped.push({
      nim: item.nim,
      names: [...(namesByNim.get(item.nim) ?? [])],
    });
    continue;
  }

  let nim = item.nim;
  const flags = [];
  if (item.catatanAsli) flags.push(item.catatanAsli);

  // NIM: 14 digit -> tambah leading zero, selain 15 digit -> tandai
  if (nim.length === 14) {
    nim = `0${nim}`;
    flags.push("NIM 14 digit: leading zero ditambahkan");
  } else if (nim.length !== 15) {
    flags.push(`NIM ${nim.length} digit: perlu dicek manual`);
  }

  const pathSlug = PATH_SLUGS[item.path];
  if (!pathSlug) flags.push(`Path "${item.path}" tidak dikenali`);

  output.push({
    nama: item.name,
    nim,
    email: `${nim}@student.provoks.id`,
    prodi: item.prodi,
    path: item.path,
    path_slug: pathSlug ?? "",
    sumber_path: item.sumber,
    perlu_review: flags.length > 0 ? "ya" : "",
    catatan: flags.join("; "),
  });

  if (flags.length) notes.push(`${nim} ${item.name} -> ${flags.join("; ")}`);
}

const header = [
  "nama",
  "nim",
  "email",
  "prodi",
  "path",
  "path_slug",
  "sumber_path",
  "perlu_review",
  "catatan",
];

const csv = [
  header.join(","),
  ...output.map((item) => header.map((key) => csvCell(item[key])).join(",")),
].join("\n");

writeFileSync(join(root, "students.normalized.csv"), `${csv}\n`, "utf8");

// ringkasan
const byPath = {};
const byProdi = {};
for (const item of output) {
  byPath[item.path] = (byPath[item.path] ?? 0) + 1;
  byProdi[item.prodi] = (byProdi[item.prodi] ?? 0) + 1;
}

console.log("✅ students.normalized.csv dibuat");
console.log("   total baris asli :", dataRows.length);
console.log("   siswa unik       :", output.length);
console.log("   di-skip (kembar) :", skipped.length);
console.log("   perlu review     :", output.filter((i) => i.perlu_review).length);
console.log("   per path         :", JSON.stringify(byPath));
console.log("   per prodi        :", JSON.stringify(byProdi));
if (skipped.length) {
  const uniqueSkipped = [...new Map(skipped.map((item) => [item.nim, item])).values()];
  console.log("\n   NIM kembar (di-skip):");
  for (const item of uniqueSkipped) {
    console.log(`     - ${item.nim}: ${item.names.join(" / ")}`);
  }
}
if (notes.length) {
  console.log("\n   catatan:");
  for (const note of notes) console.log("     -", note);
}
