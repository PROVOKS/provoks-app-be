import {
  bashCode,
  callout,
  CoursePartDef,
  cssCode,
  divider,
  h,
  jsonCode,
  p,
  quiz,
  tsCode,
} from "../../helpers";

export const REACT_PARTS_1_4: CoursePartDef[] = [
  // ==========================================================
  // PART 1 — PENGENALAN REACT & SETUP
  // ==========================================================
  {
    name: "Pengenalan React & Setup",
    description:
      "Memahami cara berpikir React, menyiapkan proyek Vite + React + TypeScript, serta menulis komponen dan JSX pertama.",
    lessons: [
      {
        title: "Apa Itu React & Cara Berpikir Komponen",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Setelah mempelajari materi ini, kamu mampu menjelaskan peran React, membedakan pendekatan deklaratif dan imperatif, serta memecah UI menjadi komponen.</p>",
          ),
          callout(
            "info",
            "Lesson ini bersifat konseptual. Contoh kode di bawah adalah ilustrasi dan belum tentu lengkap. Praktik serta pemasangan dependency dimulai di Lesson 2 “Menyiapkan Vite + React + TypeScript”. Pastikan Node.js 20 LTS atau lebih baru dan npm tersedia sebelum mengikuti praktik.",
          ),
          h("1. React Adalah Library untuk UI"),
          p(
            "<p>React bukan framework penuh dan bukan bahasa baru. React adalah library JavaScript untuk membangun antarmuka berbasis <strong>komponen</strong>. Setiap komponen adalah fungsi yang menerima data (props) dan mengembalikan markup (JSX).</p><p>React mengurus proses memperbarui tampilan saat data berubah. Kamu cukup mendeskripsikan <em>tampilan untuk state tertentu</em>, bukan memanipulasi DOM satu per satu.</p>",
          ),
          h("2. Imperatif vs Deklaratif"),
          p(
            "<p>Dengan DOM manual, kita memberi instruksi langkah demi langkah. Dengan React, kita mendeklarasikan hasil akhir yang diinginkan.</p>",
          ),
          tsCode(`
// Imperatif: mengubah DOM secara manual
const judul = document.getElementById("judul");
const tombol = document.getElementById("tombol");
let jumlah = 0;

tombol?.addEventListener("click", () => {
  jumlah += 1;
  if (judul) judul.textContent = \`Diklik \${jumlah} kali\`;
});
`),
          tsCode(`
// Deklaratif: React menghitung tampilan dari state
import { useState } from "react";

function TombolHitung() {
  const [jumlah, setJumlah] = useState(0);

  return (
    <button onClick={() => setJumlah(jumlah + 1)}>
      Diklik {jumlah} kali
    </button>
  );
}
`),
          callout(
            "info",
            "React tidak menghapus DOM. React mengelola DOM untukmu berdasarkan hasil render komponen. Fokusmu berpindah dari 'cara mengubah' menjadi 'apa yang ditampilkan'.",
          ),
          h("3. Cara Berpikir Komponen"),
          p(
            "<p>Pecah halaman menjadi bagian kecil yang punya tanggung jawab jelas: header, kartu, daftar, tombol, dan form. Komponen bisa digunakan ulang dan dikomposisikan seperti fungsi.</p>",
          ),
          tsCode(`
function KartuProduk() {
  return (
    <article>
      <h2>Kopi Susu</h2>
      <p>Rp 18.000</p>
      <button>Tambahkan</button>
    </article>
  );
}

function DaftarProduk() {
  return (
    <section>
      <h1>Menu Hari Ini</h1>
      <KartuProduk />
      <KartuProduk />
    </section>
  );
}
`),
          h("4. Satu Arah Data"),
          p(
            "<p>Data mengalir dari komponen induk ke anak melalui props. Interaksi dari anak dikirim kembali lewat callback. Alur satu arah ini membuat perubahan state lebih mudah dilacak.</p>",
          ),
          callout(
            "warning",
            "Jangan menganggap React sebagai template engine. Kalau kamu terbiasa mengubah DOM dengan querySelector, di React perubahan tampilan selalu dipicu oleh perubahan state atau props.",
          ),
          h("Studi Kasus: Memecah Halaman Profil"),
          p(
            "<p>Halaman profil bisa dipecah menjadi <code>ProfilHeader</code>, <code>StatistikPengguna</code>, dan <code>DaftarAktivitas</code>. Masing-masing menerima props yang dibutuhkan dan tidak saling mengakses DOM secara langsung.</p>",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Ambil satu halaman web yang sering kamu buka, lalu tuliskan 5 komponen yang mungkin menyusunnya beserta props yang dibutuhkan.",
          ),
          divider(),
        ],
      },
      {
        title: "Menyiapkan Vite + React + TypeScript",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat proyek React 19 + TypeScript dengan Vite, memahami file hasil scaffold, dan menjalankan development server.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini membuat proyek baru bernama <code>react-latihan</code>. Dependency React, ReactDOM, TypeScript, dan Vite dibuat otomatis oleh template. Yang kamu butuhkan hanya <strong>Node.js 20 LTS atau lebih baru</strong> dan npm.</p>",
          ),
          bashCode(`
node -v
npm -v

npm create vite@latest react-latihan -- --template react-ts
cd react-latihan
npm install
npm run dev
`),
          callout(
            "warning",
            "Jika npm create menanyakan izin memasang create-vite, jawab yes. Setelah dev server berjalan, buka URL yang muncul di terminal, biasanya http://localhost:5173.",
          ),
          h("1. Perintah Scaffold"),
          p(
            "<p>Opsi <code>-- --template react-ts</code> memilih template React dengan TypeScript. Tanpa opsi itu, Vite akan menanyakan framework dan varian secara interaktif.</p>",
          ),
          bashCode(`
npm create vite@latest react-latihan -- --template react-ts
cd react-latihan
npm install
`),
          h("2. Struktur Hasil Scaffold"),
          bashCode(`
react-latihan/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ App.tsx
│  ├─ App.css
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
└─ vite.config.ts
`),
          h("3. Script yang Tersedia"),
          jsonCode(`
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
`),
          p(
            "<p>Tambahkan script <code>typecheck</code> agar kamu bisa memeriksa tipe tanpa build penuh. Buka <code>package.json</code> lalu sesuaikan bagian scripts.</p>",
          ),
          jsonCode(`
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -p tsconfig.app.json --noEmit"
  }
}
`),
          h("4. Verifikasi"),
          bashCode(`
npm run dev
npm run typecheck
`),
          callout(
            "info",
            "Vite menyediakan hot module replacement. Setiap kali file disimpan, browser diperbarui tanpa reload penuh.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Hentikan dev server dengan Ctrl+C, jalankan npm run build, lalu npm run preview. Pastikan hasil build bisa dibuka.",
          ),
          divider(),
        ],
      },
      {
        title: "Struktur Proyek & Komponen Pertama",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat komponen TypeScript pertama, memakainya di <code>App.tsx</code>, dan memberi styling dengan CSS Modules.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code> dari lesson sebelumnya. <strong>Tidak ada dependency baru</strong>; CSS Modules sudah didukung Vite secara bawaan.</p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang akan dibuat: src/components/Salam.tsx dan src/components/Salam.module.css. File yang diubah: src/App.tsx.",
          ),
          h("1. Membuat Komponen"),
          p(
            "<p>Buat folder <code>src/components</code>, lalu tambahkan file berikut. Nama komponen diawali huruf kapital karena React memperlakukannya sebagai komponen, bukan tag HTML biasa.</p>",
          ),
          tsCode(`
// src/components/Salam.tsx
export function Salam() {
  return (
    <section>
      <h1>Halo, React!</h1>
      <p>Ini komponen TypeScript pertamaku.</p>
    </section>
  );
}
`),
          h("2. Memakai Komponen di App"),
          tsCode(`
// src/App.tsx
import { Salam } from "./components/Salam";

export default function App() {
  return (
    <main>
      <Salam />
    </main>
  );
}
`),
          h("3. Styling dengan CSS Modules"),
          p(
            "<p>CSS Modules membuat nama class unik per file sehingga tidak bentrok dengan komponen lain. File diberi akhiran <code>.module.css</code>.</p>",
          ),
          cssCode(`
/* src/components/Salam.module.css */
.kotak {
  border: 1px solid #d4d4d8;
  border-radius: 16px;
  padding: 24px;
  background: #ffffff;
}

.judul {
  margin: 0 0 8px;
  font-size: 24px;
}
`),
          tsCode(`
// src/components/Salam.tsx
import styles from "./Salam.module.css";

export function Salam() {
  return (
    <section className={styles.kotak}>
      <h1 className={styles.judul}>Halo, React!</h1>
      <p>Ini komponen TypeScript pertamaku.</p>
    </section>
  );
}
`),
          callout(
            "warning",
            "Jika TypeScript mengeluh soal import CSS Module, pastikan file src/vite-env.d.ts masih ada. File itu membawa deklarasi tipe dari Vite.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan komponen SalamPagi dan SalamMalam, lalu tampilkan keduanya di App dengan CSS Module yang sama.",
          ),
          divider(),
        ],
      },
      {
        title: "JSX & Aturan Markup",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menulis markup dengan JSX, menyisipkan ekspresi JavaScript, memakai atribut yang benar, serta merender list dengan key.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini melanjutkan proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong> Semua contoh bisa dicoba di komponen baru atau langsung di <code>App.tsx</code>.</p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang disarankan: src/components/Profil.tsx dan src/components/Profil.module.css.",
          ),
          h("1. Ekspresi di Dalam Kurung Kurawal"),
          tsCode(`
const nama = "Budi";
const umur = 20;
const hobi = ["membaca", "coding"];

export function Profil() {
  return (
    <div>
      <h1>{nama}</h1>
      <p>Umur: {umur} tahun</p>
      <p>Total hobi: {hobi.length}</p>
      <p>Hobi favorit: {hobi[0]}</p>
    </div>
  );
}
`),
          h("2. Atribut, className, dan Style"),
          p(
            "<p>JSX memakai <code>className</code>, bukan <code>class</code>, dan <code>htmlFor</code>, bukan <code>for</code>. Atribut yang menerima nilai dinamis ditulis dengan kurung kurawal.</p>",
          ),
          tsCode(`
const aktif = true;

export function Tombol() {
  return (
    <button
      className={aktif ? "tombol aktif" : "tombol"}
      disabled={!aktif}
      style={{ padding: 12, borderRadius: 8 }}
    >
      {aktif ? "Aktif" : "Nonaktif"}
    </button>
  );
}
`),
          h("3. Fragment"),
          p(
            "<p>Komponen harus mengembalikan satu elemen induk. Jika tidak ingin menambah <code>div</code> ekstra, gunakan fragment <code>&lt;&gt;...&lt;/&gt;</code>.</p>",
          ),
          tsCode(`
export function Ringkasan() {
  return (
    <>
      <h2>Ringkasan</h2>
      <p>Belajar React itu menyenangkan.</p>
    </>
  );
}
`),
          h("4. List dan key"),
          tsCode(`
type Buku = { id: number; judul: string };

const daftarBuku: Buku[] = [
  { id: 1, judul: "Belajar React" },
  { id: 2, judul: "TypeScript Dasar" },
];

export function DaftarBuku() {
  return (
    <ul>
      {daftarBuku.map((buku) => (
        <li key={buku.id}>{buku.judul}</li>
      ))}
    </ul>
  );
}
`),
          callout(
            "warning",
            "Gunakan key yang stabil dan unik, biasanya id data. Jangan memakai index array jika urutan data bisa berubah, karena dapat menyebabkan state komponen tertukar.",
          ),
          h("5. Praktik: Kartu Profil"),
          tsCode(`
// src/components/Profil.tsx
import styles from "./Profil.module.css";

type ProfilProps = {
  nama: string;
  peran: string;
  hobi: string[];
};

export function Profil({ nama, peran, hobi }: ProfilProps) {
  return (
    <article className={styles.kartu}>
      <h2 className={styles.nama}>{nama}</h2>
      <p className={styles.peran}>{peran}</p>
      <ul>
        {hobi.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
`),
          cssCode(`
/* src/components/Profil.module.css */
.kartu {
  max-width: 360px;
  border: 1px solid #e4e4e7;
  border-radius: 16px;
  padding: 20px;
  background: #fff;
}

.nama {
  margin: 0;
  font-size: 20px;
}

.peran {
  margin: 4px 0 12px;
  color: #71717a;
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Tampilkan dua Profil dengan data berbeda di App, lalu tambahkan badge 'Online' memakai conditional rendering.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis React & Setup",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis React & Setup"),
          p("<p>Uji pemahaman dasar React, setup Vite, komponen, dan JSX.</p>"),
          quiz("Kuis React & Setup", [
            {
              q: "React adalah...",
              options: [
                "Bahasa pemrograman baru",
                "Library JavaScript untuk membangun UI berbasis komponen",
                "Database",
                "Web server",
              ],
              answer: 1,
            },
            {
              q: "Perintah yang tepat untuk membuat proyek React + TypeScript dengan Vite adalah...",
              options: [
                "npm create react",
                "npm create vite@latest react-latihan -- --template react-ts",
                "npx react new",
                "npm install react-ts",
              ],
              answer: 1,
            },
            {
              q: "Atribut yang benar untuk class CSS di JSX adalah...",
              options: ["class", "className", "cssClass", "styleName"],
              answer: 1,
            },
            {
              q: "Agar CSS tidak bentrok antar komponen, Vite mendukung...",
              options: ["CSS Modules", "SASS wajib", "Tailwind wajib", "Inline CSS saja"],
              answer: 0,
            },
            {
              q: "Key pada list digunakan untuk...",
              options: [
                "Menentukan warna",
                "Membantu React mengenali item yang berubah",
                "Mengurutkan otomatis",
                "Menghapus item",
              ],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 2 — KOMPONEN, PROPS & RENDER
  // ==========================================================
  {
    name: "Komponen, Props & Render",
    description:
      "Menyusun komponen reusable dengan props bertipe, children, conditional rendering, dan list yang benar.",
    lessons: [
      {
        title: "Function Component & Komposisi",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat komponen fungsi yang dapat dikomposisikan dan memahami pemisahan tanggung jawab antar komponen.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/components/Card.tsx dan src/components/Card.module.css.",
          ),
          h("1. Komponen Kecil, Tanggung Jawab Jelas"),
          tsCode(`
// src/components/Card.tsx
import type { ReactNode } from "react";
import styles from "./Card.module.css";

type CardProps = {
  judul: string;
  children: ReactNode;
};

export function Card({ judul, children }: CardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.judul}>{judul}</h2>
      <div>{children}</div>
    </article>
  );
}
`),
          cssCode(`
/* src/components/Card.module.css */
.card {
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  padding: 18px;
  background: #fff;
}

.judul {
  margin: 0 0 10px;
  font-size: 18px;
}
`),
          h("2. Mengomposisikan Komponen"),
          tsCode(`
// src/App.tsx
import { Card } from "./components/Card";

export default function App() {
  return (
    <main>
      <Card judul="Pengumuman">
        <p>Kelas React dimulai minggu depan.</p>
      </Card>

      <Card judul="Tugas">
        <ul>
          <li>Menyiapkan Vite</li>
          <li>Membuat komponen pertama</li>
        </ul>
      </Card>
    </main>
  );
}
`),
          callout(
            "info",
            "Komposisi berarti komponen besar menyusun komponen kecil. Ini berbeda dari inheritance: React mendorong komposisi, bukan pewarisan class.",
          ),
          h("3. Kapan Memecah Komponen?"),
          p(
            "<ul><li>Bagian UI dipakai di lebih dari satu tempat.</li><li>File komponen mulai terlalu panjang dan menangani banyak hal.</li><li>Sebagian UI punya state atau efek sendiri.</li><li>Kamu ingin menguji bagian UI secara terpisah.</li></ul>",
          ),
          callout(
            "warning",
            "Jangan memecah semua hal menjadi komponen terlalu dini. Mulai dari komponen yang jelas dibutuhkan, lalu refactor ketika kompleksitas meningkat.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Buat komponen Badge dengan props teks dan warna, lalu gunakan di dalam Card.",
          ),
          divider(),
        ],
      },
      {
        title: "Props & Typing dengan TypeScript",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengirim data melalui props, memberi tipe yang tepat, serta menangani props opsional dan callback.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini melanjutkan proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang diubah: src/components/Card.tsx dan src/App.tsx.",
          ),
          h("1. Props Bertipe"),
          tsCode(`
type TombolProps = {
  label: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
};

export function Tombol({ label, variant = "primary", onClick }: TombolProps) {
  return (
    <button className={variant} onClick={onClick}>
      {label}
    </button>
  );
}
`),
          h("2. Props Opsional & Default"),
          p(
            "<p>Tanda <code>?</code> membuat props opsional. Nilai default bisa diberikan langsung saat destructuring parameter.</p>",
          ),
          tsCode(`
type AvatarProps = {
  nama: string;
  ukuran?: number;
  src?: string;
};

export function Avatar({ nama, ukuran = 48, src }: AvatarProps) {
  return src ? (
    <img src={src} alt={nama} width={ukuran} height={ukuran} />
  ) : (
    <span aria-label={nama} style={{ width: ukuran, height: ukuran }}>
      {nama.charAt(0).toUpperCase()}
    </span>
  );
}
`),
          h("3. Callback sebagai Props"),
          tsCode(`
type TombolSukaProps = {
  total: number;
  onSuka: () => void;
};

export function TombolSuka({ total, onSuka }: TombolSukaProps) {
  return (
    <button onClick={onSuka}>
      Suka ({total})
    </button>
  );
}
`),
          h("4. Memakai Props di App"),
          tsCode(`
import { useState } from "react";
import { TombolSuka } from "./components/TombolSuka";

export default function App() {
  const [total, setTotal] = useState(0);

  return (
    <TombolSuka total={total} onSuka={() => setTotal(total + 1)} />
  );
}
`),
          callout(
            "warning",
            "Jangan mengubah props di dalam komponen anak. Props bersifat read-only; perubahan data harus terjadi di komponen yang memiliki state.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan prop disabled pada TombolSuka dan tampilkan tombol nonaktif ketika total mencapai 5.",
          ),
          divider(),
        ],
      },
      {
        title: "children & Komponen Reusable",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai <code>children</code> untuk membuat komponen pembungkus yang fleksibel dan reusable.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/components/Panel.tsx dan src/components/Panel.module.css.",
          ),
          h("1. children"),
          tsCode(`
// src/components/Panel.tsx
import type { ReactNode } from "react";
import styles from "./Panel.module.css";

type PanelProps = {
  judul: string;
  children: ReactNode;
};

export function Panel({ judul, children }: PanelProps) {
  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <h2>{judul}</h2>
      </header>
      <div className={styles.isi}>{children}</div>
    </section>
  );
}
`),
          cssCode(`
/* src/components/Panel.module.css */
.panel {
  border: 1px solid #d4d4d8;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.header {
  padding: 12px 16px;
  background: #f4f4f5;
  border-bottom: 1px solid #e4e4e7;
}

.isi {
  padding: 16px;
}
`),
          h("2. Mengisi children"),
          tsCode(`
import { Panel } from "./components/Panel";

export default function App() {
  return (
    <main>
      <Panel judul="Profil">
        <p>Nama: Budi</p>
        <p>Peran: Frontend Developer</p>
      </Panel>

      <Panel judul="Aktivitas">
        <ul>
          <li>Menyelesaikan materi props</li>
          <li>Membuat komponen Panel</li>
        </ul>
      </Panel>
    </main>
  );
}
`),
          h("3. Slot Tambahan"),
          p(
            "<p>Selain <code>children</code>, kamu bisa membuat props khusus untuk area tertentu, misalnya <code>aksi</code> di kanan header.</p>",
          ),
          tsCode(`
type PanelProps = {
  judul: string;
  aksi?: ReactNode;
  children: ReactNode;
};

export function Panel({ judul, aksi, children }: PanelProps) {
  return (
    <section>
      <header>
        <h2>{judul}</h2>
        {aksi}
      </header>
      <div>{children}</div>
    </section>
  );
}
`),
          callout(
            "info",
            "Pola children dan slot membuat komponen dapat dipakai ulang tanpa harus menambah banyak props boolean.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan prop footer pada Panel dan isi dengan tombol aksi di App.",
          ),
          divider(),
        ],
      },
      {
        title: "Conditional Rendering & List/Key",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menampilkan UI berbeda berdasarkan state dan merender list secara efisien dengan key yang tepat.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/components/DaftarTugas.tsx dan src/data/tugas.ts.",
          ),
          h("1. Empat Pola Conditional"),
          tsCode(`
function Status({ selesai }: { selesai: boolean }) {
  // 1. if + early return
  if (selesai) return <p>Selesai</p>;

  // 2. ternary
  return <p>{selesai ? "Selesai" : "Belum selesai"}</p>;
}
`),
          tsCode(`
function Notifikasi({ jumlah }: { jumlah: number }) {
  return (
    <div>
      {/* 3. operator && */}
      {jumlah > 0 && <span>Ada {jumlah} notifikasi</span>}

      {/* 4. null untuk tidak menampilkan apa pun */}
      {jumlah === 0 ? null : <button>Buka</button>}
    </div>
  );
}
`),
          h("2. Data List"),
          tsCode(`
// src/data/tugas.ts
export type Tugas = {
  id: string;
  judul: string;
  selesai: boolean;
};

export const tugasAwal: Tugas[] = [
  { id: "t1", judul: "Membaca materi props", selesai: true },
  { id: "t2", judul: "Membuat komponen Panel", selesai: false },
  { id: "t3", judul: "Latihan list dan key", selesai: false },
];
`),
          h("3. Merender List"),
          tsCode(`
// src/components/DaftarTugas.tsx
import type { Tugas } from "../data/tugas";

type DaftarTugasProps = {
  items: Tugas[];
};

export function DaftarTugas({ items }: DaftarTugasProps) {
  if (items.length === 0) {
    return <p>Belum ada tugas.</p>;
  }

  return (
    <ul>
      {items.map((tugas) => (
        <li key={tugas.id}>
          {tugas.judul} {tugas.selesai ? "✓" : "•"}
        </li>
      ))}
    </ul>
  );
}
`),
          h("4. Key yang Tepat"),
          p(
            "<ul><li>Gunakan id stabil dari data.</li><li>Jangan memakai index jika list bisa diurutkan, difilter, atau dihapus.</li><li>Key hanya untuk React; tidak diteruskan sebagai props ke komponen anak.</li></ul>",
          ),
          callout(
            "warning",
            "Key duplikat dapat membuat React salah mencocokkan komponen dan menampilkan state yang tertukar.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan filter untuk hanya menampilkan tugas yang belum selesai, lengkap dengan empty state.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Komponen & Props",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Komponen & Props"),
          p("<p>Uji pemahaman komponen, props, children, conditional rendering, dan key.</p>"),
          quiz("Kuis Komponen & Props", [
            {
              q: "Props di React bersifat...",
              options: ["Bisa diubah anak", "Read-only", "Selalu opsional", "Hanya untuk teks"],
              answer: 1,
            },
            {
              q: "Cara mengetik children yang bisa berisi JSX adalah...",
              options: ["ReactNode", "string", "Element", "JSX.Element"],
              answer: 0,
            },
            {
              q: "Untuk menampilkan UI saat kondisi benar, pola umum yang dipakai adalah...",
              options: ["kondisi && <Komponen />", "kondisi || null", "if di dalam JSX", "switch di dalam JSX"],
              answer: 0,
            },
            {
              q: "Key yang disarankan untuk list adalah...",
              options: ["index", "Math.random()", "id stabil dari data", "nama komponen"],
              answer: 2,
            },
            {
              q: "Komposisi komponen berarti...",
              options: [
                "Mewarisi class",
                "Menyusun komponen besar dari komponen kecil",
                "Mengubah props anak",
                "Menghapus state",
              ],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 3 — STATE & INTERAKSI
  // ==========================================================
  {
    name: "State & Interaksi",
    description:
      "Memberi komponen memori dengan useState, menangani event, memahami snapshot state, dan membuat form terkontrol.",
    lessons: [
      {
        title: "useState & Re-render",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menambahkan state pada komponen, memahami kapan komponen dirender ulang, dan mengelola beberapa state sederhana.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/components/Counter.tsx.",
          ),
          h("1. State Pertama"),
          tsCode(`
import { useState } from "react";

export function Counter() {
  const [angka, setAngka] = useState(0);

  return (
    <div>
      <p>Total: {angka}</p>
      <button onClick={() => setAngka(angka + 1)}>Tambah</button>
      <button onClick={() => setAngka(angka - 1)}>Kurangi</button>
      <button onClick={() => setAngka(0)}>Reset</button>
    </div>
  );
}
`),
          h("2. Re-render"),
          p(
            "<p>Saat <code>setAngka</code> dipanggil, React menjadwalkan render ulang komponen. Nilai <code>angka</code> di render berikutnya adalah nilai state terbaru, bukan nilai yang diubah langsung.</p>",
          ),
          tsCode(`
export function Contoh() {
  const [aktif, setAktif] = useState(false);
  const [nama, setNama] = useState("");

  console.log("render", { aktif, nama });

  return (
    <div>
      <button onClick={() => setAktif(!aktif)}>
        {aktif ? "Matikan" : "Nyalakan"}
      </button>
      <input value={nama} onChange={(e) => setNama(e.target.value)} />
    </div>
  );
}
`),
          h("3. State Lokal per Komponen"),
          p(
            "<p>Jika komponen yang sama dirender beberapa kali, setiap instance memiliki state sendiri.</p>",
          ),
          tsCode(`
import { Counter } from "./components/Counter";

export default function App() {
  return (
    <>
      <Counter />
      <Counter />
      <Counter />
    </>
  );
}
`),
          callout(
            "warning",
            "Jangan menyimpan data yang bisa dihitung dari state lain. Misalnya total item cukup dihitung dari array item, tidak perlu state terpisah.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan tombol +5 dan -5, lalu tampilkan pesan khusus saat angka negatif.",
          ),
          divider(),
        ],
      },
      {
        title: "Event Handler & Form Events",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menangani event click, change, dan submit, meneruskan handler sebagai props, serta mencegah perilaku bawaan form.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/components/FormNama.tsx.",
          ),
          h("1. Handler Tanpa Memanggil Fungsi"),
          tsCode(`
function Tombol() {
  function handleClick() {
    alert("Diklik!");
  }

  // benar: berikan referensi fungsi
  return <button onClick={handleClick}>Klik</button>;
}
`),
          h("2. Event Object"),
          tsCode(`
import type { ChangeEvent } from "react";

function InputNama() {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
  }

  return <input onChange={handleChange} />;
}
`),
          h("3. Submit Form"),
          tsCode(`
import type { FormEvent } from "react";
import { useState } from "react";

export function FormNama() {
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nama.trim()) {
      setPesan("Nama wajib diisi");
      return;
    }
    setPesan(\`Halo, \${nama}!\`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={nama} onChange={(e) => setNama(e.target.value)} />
      <button type="submit">Kirim</button>
      <p>{pesan}</p>
    </form>
  );
}
`),
          callout(
            "warning",
            "event.preventDefault() wajib pada submit form jika tidak ingin halaman reload. React tetap memakai perilaku form HTML biasa.",
          ),
          h("4. Handler sebagai Props"),
          tsCode(`
type TombolProps = { onKlik: () => void };

function Tombol({ onKlik }: TombolProps) {
  return <button onClick={onKlik}>Simpan</button>;
}

// Di komponen induk
<Tombol onKlik={() => console.log("disimpan")} />
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan validasi minimal 3 karakter dan tampilkan error di bawah input.",
          ),
          divider(),
        ],
      },
      {
        title: "State Snapshot & Updater Function",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami state sebagai snapshot, queue pembaruan, dan memakai updater function untuk update yang bergantung pada nilai sebelumnya.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang diubah: src/components/Counter.tsx.",
          ),
          h("1. Nilai State Adalah Snapshot"),
          tsCode(`
function Counter() {
  const [angka, setAngka] = useState(0);

  function tambahTiga() {
    // Semua baris ini membaca angka yang sama (snapshot saat render)
    setAngka(angka + 1);
    setAngka(angka + 1);
    setAngka(angka + 1);
  }

  return <button onClick={tambahTiga}>{angka}</button>;
}
`),
          p(
            "<p>Hasil klik pertama hanya menambah 1, bukan 3. Setiap <code>setAngka</code> menerima nilai <code>angka</code> dari snapshot render yang sama.</p>",
          ),
          h("2. Updater Function"),
          tsCode(`
function tambahTiga() {
  setAngka((sebelumnya) => sebelumnya + 1);
  setAngka((sebelumnya) => sebelumnya + 1);
  setAngka((sebelumnya) => sebelumnya + 1);
}
`),
          p(
            "<p>Dengan updater function, React meneruskan nilai terbaru dari antrean pembaruan. Hasilnya bertambah 3.</p>",
          ),
          h("3. Batching"),
          p(
            "<p>React menggabungkan beberapa pembaruan state dalam satu event menjadi satu render ulang. Ini alasan state tidak berubah seketika setelah pemanggilan setter.</p>",
          ),
          tsCode(`
function Contoh() {
  const [jumlah, setJumlah] = useState(0);

  console.log("render dengan jumlah", jumlah);

  function handleKlik() {
    setJumlah(jumlah + 1);
    console.log("setelah setJumlah:", jumlah); // masih nilai lama
  }

  return <button onClick={handleKlik}>{jumlah}</button>;
}
`),
          callout(
            "warning",
            "Jangan membaca state tepat setelah setter dan berharap nilainya langsung berubah. Gunakan updater function atau useEffect jika perlu bereaksi setelah render.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Ubah Counter menjadi dua tombol, satu menambah 1 dan satu menambah 3 memakai updater function.",
          ),
          divider(),
        ],
      },
      {
        title: "Controlled Input & Validasi Dasar",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat form terkontrol dengan state, menangani berbagai tipe input, dan menampilkan validasi sederhana.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/components/FormPendaftaran.tsx dan src/components/FormPendaftaran.module.css.",
          ),
          h("1. Controlled Input"),
          tsCode(`
import { useState } from "react";

export function FormPendaftaran() {
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState(17);

  return (
    <form>
      <label>
        Nama
        <input value={nama} onChange={(e) => setNama(e.target.value)} />
      </label>

      <label>
        Umur
        <input
          type="number"
          value={umur}
          onChange={(e) => setUmur(Number(e.target.value))}
        />
      </label>
    </form>
  );
}
`),
          h("2. Select, Checkbox, dan Radio"),
          tsCode(`
const [kelas, setKelas] = useState("reguler");
const [setuju, setSetuju] = useState(false);

<select value={kelas} onChange={(e) => setKelas(e.target.value)}>
  <option value="reguler">Reguler</option>
  <option value="fast">Fast Track</option>
</select>

<label>
  <input
    type="checkbox"
    checked={setuju}
    onChange={(e) => setSetuju(e.target.checked)}
  />
  Saya setuju
</label>
`),
          h("3. Validasi"),
          tsCode(`
function validasi(nama: string, umur: number): string[] {
  const error: string[] = [];
  if (nama.trim().length < 3) error.push("Nama minimal 3 karakter");
  if (umur < 17 || umur > 100) error.push("Umur harus 17-100");
  return error;
}
`),
          h("4. Form Lengkap"),
          tsCode(`
import type { FormEvent } from "react";

export function FormPendaftaran() {
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState(17);
  const [error, setError] = useState<string[]>([]);
  const [sukses, setSukses] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const daftarError = validasi(nama, umur);
    setError(daftarError);
    setSukses(daftarError.length === 0);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={nama} onChange={(e) => setNama(e.target.value)} />
      <input
        type="number"
        value={umur}
        onChange={(e) => setUmur(Number(e.target.value))}
      />
      <button type="submit">Daftar</button>

      {error.map((pesan) => (
        <p key={pesan}>{pesan}</p>
      ))}
      {sukses ? <p>Pendaftaran berhasil!</p> : null}
    </form>
  );
}
`),
          callout(
            "info",
            "Controlled input membuat state menjadi satu sumber kebenaran. Nilai input selalu mencerminkan state, sehingga validasi dan reset lebih mudah.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan field email dan validasi format sederhana memakai includes('@').",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis State & Interaksi",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis State & Interaksi"),
          p("<p>Uji pemahaman useState, event, snapshot state, dan controlled input.</p>"),
          quiz("Kuis State & Interaksi", [
            {
              q: "Hook untuk memberi state pada function component adalah...",
              options: ["useContext", "useState", "useEffect", "useRef"],
              answer: 1,
            },
            {
              q: "Cara benar memasang handler klik adalah...",
              options: ["onClick={handleClick()}", "onClick={handleClick}", "onClick=\"handleClick\"", "onClick={handleClick;}"],
              answer: 1,
            },
            {
              q: "Mengapa setAngka(angka + 1) tiga kali berturut-turut hanya menambah 1?",
              options: [
                "React mengabaikan setter",
                "State dibaca dari snapshot render yang sama",
                "Angka tidak boleh ditambah",
                "Harus memakai useEffect",
              ],
              answer: 1,
            },
            {
              q: "Cara aman menambah berdasarkan nilai sebelumnya adalah...",
              options: ["setAngka(angka + 1)", "setAngka((n) => n + 1)", "angka++", "setAngka(++angka)"],
              answer: 1,
            },
            {
              q: "Pada controlled input, nilai input diambil dari...",
              options: ["DOM", "State", "Props", "localStorage"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 4 — MENGELOLA STATE LEBIH BESAR
  // ==========================================================
  {
    name: "Mengelola State Lebih Besar",
    description:
      "Lifting state, update immutable, useReducer, Context, dan menyusun state agar tidak berlebihan.",
    lessons: [
      {
        title: "Lifting State Up",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memindahkan state ke komponen induk bersama agar beberapa komponen membaca dan mengubah data yang sama.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/components/Angka.tsx dan src/components/PanelAngka.tsx.",
          ),
          h("1. Masalah State Terpisah"),
          tsCode(`
function Angka() {
  const [nilai, setNilai] = useState(0);
  return <button onClick={() => setNilai(nilai + 1)}>{nilai}</button>;
}

function Ringkasan() {
  const [nilai] = useState(0); // state berbeda, tidak terhubung
  return <p>Total: {nilai}</p>;
}
`),
          h("2. Angkat State ke Induk"),
          tsCode(`
function App() {
  const [nilai, setNilai] = useState(0);

  return (
    <>
      <Angka nilai={nilai} onTambah={() => setNilai(nilai + 1)} />
      <Ringkasan nilai={nilai} />
    </>
  );
}

function Angka({ nilai, onTambah }: { nilai: number; onTambah: () => void }) {
  return <button onClick={onTambah}>{nilai}</button>;
}

function Ringkasan({ nilai }: { nilai: number }) {
  return <p>Total: {nilai}</p>;
}
`),
          h("3. Satu Sumber Kebenaran"),
          p(
            "<p>State dimiliki komponen terdekat yang membungkus semua komponen yang membutuhkannya. Anak menerima nilai lewat props dan mengirim aksi lewat callback.</p>",
          ),
          callout(
            "warning",
            "Jangan menduplikasi state yang sama di dua komponen. Jika dua tempat perlu data yang sama, angkat state ke induk bersama.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Buat dua tombol yang menampilkan angka berbeda, tetapi satu ringkasan total di induk.",
          ),
          divider(),
        ],
      },
      {
        title: "Update Object & Array secara Immutable",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memperbarui object dan array di state tanpa memutasi nilai lama, sehingga React dapat mendeteksi perubahan.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/components/DaftarBelanja.tsx.",
          ),
          h("1. Update Object"),
          tsCode(`
const [profil, setProfil] = useState({ nama: "Budi", kota: "Bandung" });

// salah: memutasi object lama
profil.kota = "Jakarta";

// benar: membuat object baru
setProfil({ ...profil, kota: "Jakarta" });
`),
          h("2. Update Array"),
          tsCode(`
const [buah, setBuah] = useState(["apel", "jeruk"]);

// tambah
setBuah([...buah, "mangga"]);

// hapus
setBuah(buah.filter((item) => item !== "jeruk"));

// ubah item
setBuah(buah.map((item) => (item === "apel" ? "apel hijau" : item)));
`),
          h("3. Array of Objects"),
          tsCode(`
type Tugas = { id: string; judul: string; selesai: boolean };

const [tugas, setTugas] = useState<Tugas[]>([]);

function toggle(id: string) {
  setTugas((items) =>
    items.map((item) =>
      item.id === id ? { ...item, selesai: !item.selesai } : item,
    ),
  );
}
`),
          callout(
            "warning",
            "Jangan memakai push, splice, atau sort langsung pada state array. Method tersebut memutasi array lama dan sering membuat UI tidak diperbarui.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Buat form untuk menambah item belanja, tombol hapus per item, dan total item yang dihitung dari array.",
          ),
          divider(),
        ],
      },
      {
        title: "useReducer & Action",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memindahkan logika state yang kompleks ke reducer dengan action yang eksplisit.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/components/TodoReducer.tsx.",
          ),
          h("1. Reducer Sederhana"),
          tsCode(`
type State = { count: number };
type Action = { type: "tambah" } | { type: "kurang" } | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "tambah":
      return { count: state.count + 1 };
    case "kurang":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
  }
}
`),
          h("2. useReducer"),
          tsCode(`
import { useReducer } from "react";

export function CounterReducer() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "tambah" })}>+</button>
      <button onClick={() => dispatch({ type: "kurang" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}
`),
          h("3. Reducer untuk Todo"),
          tsCode(`
type Todo = { id: string; judul: string; selesai: boolean };

type Aksi =
  | { type: "tambah"; judul: string }
  | { type: "toggle"; id: string }
  | { type: "hapus"; id: string };

function reducer(state: Todo[], aksi: Aksi): Todo[] {
  switch (aksi.type) {
    case "tambah":
      return [...state, { id: crypto.randomUUID(), judul: aksi.judul, selesai: false }];
    case "toggle":
      return state.map((item) =>
        item.id === aksi.id ? { ...item, selesai: !item.selesai } : item,
      );
    case "hapus":
      return state.filter((item) => item.id !== aksi.id);
  }
}
`),
          callout(
            "info",
            "useReducer cocok ketika transisi state saling berkaitan atau melibatkan banyak field. Untuk state sederhana, useState lebih ringkas.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan aksi \"ubah\" untuk mengganti judul todo dan aksi \"bersihkan\" untuk menghapus semua yang selesai.",
          ),
          divider(),
        ],
      },
      {
        title: "Context & Menghindari Prop Drilling",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membagikan data ke banyak komponen tanpa melewatkan props melalui setiap level, serta membuat custom hook untuk context.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/context/TemaContext.tsx dan src/components/TombolTema.tsx.",
          ),
          h("1. Membuat Context"),
          tsCode(`
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Tema = "terang" | "gelap";

type TemaContextValue = {
  tema: Tema;
  gantiTema: () => void;
};

const TemaContext = createContext<TemaContextValue | null>(null);

export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>("terang");

  const value: TemaContextValue = {
    tema,
    gantiTema: () => setTema(tema === "terang" ? "gelap" : "terang"),
  };

  return <TemaContext.Provider value={value}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error("useTema harus dipakai di dalam TemaProvider");
  }
  return context;
}
`),
          h("2. Memakai Context"),
          tsCode(`
import { useTema } from "../context/TemaContext";

export function TombolTema() {
  const { tema, gantiTema } = useTema();

  return (
    <button onClick={gantiTema}>
      Mode {tema === "terang" ? "gelap" : "terang"}
    </button>
  );
}
`),
          h("3. Membungkus Aplikasi"),
          tsCode(`
import { TemaProvider } from "./context/TemaContext";
import { TombolTema } from "./components/TombolTema";

export default function App() {
  return (
    <TemaProvider>
      <TombolTema />
    </TemaProvider>
  );
}
`),
          callout(
            "warning",
            "Context bukan pengganti semua state. Gunakan untuk data yang memang dibutuhkan banyak komponen, seperti tema, user login, atau bahasa. Untuk state lokal, tetap pakai useState.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan context kedua untuk bahasa (Indonesia/English) dan tombol untuk menggantinya.",
          ),
          divider(),
        ],
      },
      {
        title: "Menyusun State yang Efisien",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menghindari state berlebih, memakai derived state, dan menempatkan state sedekat mungkin dengan komponen yang membutuhkannya.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "Praktik ini berupa refactor. File yang diubah: src/components/DaftarBelanja.tsx atau komponen serupa yang sudah kamu buat.",
          ),
          h("1. Derived State"),
          tsCode(`
// kurang baik: total disimpan sebagai state terpisah
const [items, setItems] = useState<string[]>([]);
const [total, setTotal] = useState(0);

// lebih baik: total dihitung dari items
const [items, setItems] = useState<string[]>([]);
const total = items.length;
`),
          h("2. State Minimal"),
          p(
            "<ul><li>Simpan data mentah, hitung turunannya saat render.</li><li>Jangan simpan duplikat data yang sama di dua state.</li><li>Jangan simpan status loading terpisah jika bisa diturunkan dari data dan error.</li></ul>",
          ),
          tsCode(`
type Status = "idle" | "loading" | "sukses" | "error";

const [status, setStatus] = useState<Status>("idle");
const [data, setData] = useState<string[]>([]);
// status merepresentasikan keseluruhan alur, tidak perlu boolean terpisah
`),
          h("3. Colocation"),
          p(
            "<p>Tempatkan state di komponen terdekat yang membutuhkannya. Naikkan hanya jika ada komponen lain yang perlu berbagi data. Ini mengurangi prop drilling dan render yang tidak perlu.</p>",
          ),
          callout(
            "warning",
            "Terlalu banyak state global membuat aplikasi sulit dilacak. Mulai dari state lokal, lalu angkat atau gunakan Context hanya saat ada kebutuhan nyata.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Audit satu komponen yang kamu buat. Hapus state yang sebenarnya bisa dihitung dari props atau state lain.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis State Management",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis State Management"),
          p("<p>Uji pemahaman lifting state, immutable update, reducer, Context, dan efisiensi state.</p>"),
          quiz("Kuis State Management", [
            {
              q: "Lifting state up berarti...",
              options: [
                "Menghapus state",
                "Memindahkan state ke komponen induk bersama",
                "Menyimpan state ke localStorage",
                "Mengubah props",
              ],
              answer: 1,
            },
            {
              q: "Cara menambah item ke array state yang benar adalah...",
              options: ["state.push(item)", "setState([...state, item])", "state = item", "setState(state.push(item))"],
              answer: 1,
            },
            {
              q: "useReducer cocok dipakai ketika...",
              options: [
                "State sangat sederhana",
                "Ada banyak transisi state yang saling berkaitan",
                "Tidak ada state",
                "Hanya butuh styling",
              ],
              answer: 1,
            },
            {
              q: "Context berguna untuk...",
              options: [
                "Menggantikan semua useState",
                "Membagikan data ke banyak komponen tanpa prop drilling",
                "Mengubah DOM langsung",
                "Membuat CSS",
              ],
              answer: 1,
            },
            {
              q: "Derived state sebaiknya...",
              options: [
                "Disimpan sebagai state terpisah",
                "Dihitung dari state yang ada saat render",
                "Selalu memakai Context",
                "Ditulis ke localStorage",
              ],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },
];
