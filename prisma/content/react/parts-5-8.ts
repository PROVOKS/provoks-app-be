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
} from "../helpers";

export const REACT_PARTS_5_8: CoursePartDef[] = [
  // ==========================================================
  // PART 5 — COMPONENT LIFE CYCLE, EFFECTS & DATA
  // ==========================================================
  {
    name: "Component Life Cycle, Effects & Data",
    description:
      "Memahami life cycle komponen fungsi, useEffect, cleanup, fetching data, AbortController, dan custom hook.",
    lessons: [
      {
        title: "Component Life Cycle: Mount, Update, Unmount",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami tahap mount, update, dan unmount pada function component serta bagaimana useEffect memetakan life cycle tersebut.</p>",
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
            "File yang dibuat: src/components/LogLifecycle.tsx dan src/components/PanelToggle.tsx.",
          ),
          h("1. Tiga Fase Utama"),
          p(
            "<ul><li><strong>Mount</strong> — komponen pertama kali dirender dan dipasang ke DOM.</li><li><strong>Update</strong> — state atau props berubah sehingga komponen dirender ulang.</li><li><strong>Unmount</strong> — komponen dilepas dari DOM.</li></ul>",
          ),
          h("2. useEffect sebagai Jembatan Life Cycle"),
          tsCode(`
import { useEffect } from "react";

export function LogLifecycle({ nama }: { nama: string }) {
  useEffect(() => {
    console.log("mount / nama berubah:", nama);

    return () => {
      console.log("cleanup sebelum effect berikutnya atau unmount");
    };
  }, [nama]);

  return <p>Halo, {nama}</p>;
}
`),
          h("3. Mount dan Unmount"),
          tsCode(`
import { useState } from "react";
import { LogLifecycle } from "./LogLifecycle";

export function PanelToggle() {
  const [tampil, setTampil] = useState(true);

  return (
    <div>
      <button onClick={() => setTampil(!tampil)}>
        {tampil ? "Sembunyikan" : "Tampilkan"}
      </button>
      {tampil ? <LogLifecycle nama="Budi" /> : null}
    </div>
  );
}
`),
          callout(
            "info",
            "Di React modern, kita tidak memakai method componentDidMount atau componentWillUnmount. Effect dengan dependency array kosong berjalan setelah mount; cleanup-nya berjalan saat unmount.",
          ),
          h("4. Strict Mode saat Development"),
          p(
            "<p>React Strict Mode menjalankan effect dua kali saat development untuk membantu menemukan cleanup yang salah. Ini normal dan tidak terjadi di production.</p>",
          ),
          tsCode(`
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`),
          callout(
            "warning",
            "Jika effect berjalan dua kali dan memicu request ganda, itu tanda bahwa cleanup atau dependency perlu diperiksa. Jangan mematikan StrictMode hanya untuk menyembunyikan masalah.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan tombol untuk mengganti nama dan amati urutan log mount, cleanup, lalu update.",
          ),
          divider(),
        ],
      },
      {
        title: "useEffect, Dependency & Cleanup",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai useEffect untuk sinkronisasi dengan sistem eksternal, mengatur dependency, dan membersihkan resource.</p>",
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
            "File yang dibuat: src/components/JudulDokumen.tsx dan src/components/DeteksiLebar.tsx.",
          ),
          h("1. Effect untuk Sinkronisasi"),
          tsCode(`
import { useEffect } from "react";

export function JudulDokumen({ judul }: { judul: string }) {
  useEffect(() => {
    const judulLama = document.title;
    document.title = judul;

    return () => {
      document.title = judulLama;
    };
  }, [judul]);

  return <p>Judul dokumen: {judul}</p>;
}
`),
          h("2. Dependency Array"),
          tsCode(`
useEffect(() => {
  console.log("jalan setiap render");
});

useEffect(() => {
  console.log("jalan sekali setelah mount");
}, []);

useEffect(() => {
  console.log("jalan saat userId berubah");
}, [userId]);
`),
          h("3. Cleanup Event Listener"),
          tsCode(`
import { useEffect, useState } from "react";

export function DeteksiLebar() {
  const [lebar, setLebar] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setLebar(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <p>Lebar: {lebar}px</p>;
}
`),
          callout(
            "info",
            "Cleanup mencegah kebocoran memori dan listener ganda. Setiap kali memasang listener, timer, atau koneksi, sediakan fungsi pembersihnya.",
          ),
          h("4. Kapan Tidak Perlu Effect"),
          p(
            "<p>Jangan memakai effect untuk menghitung nilai turunan atau merespons event yang sudah punya handler. Hitung langsung saat render atau ubah state di event handler.</p>",
          ),
          callout(
            "warning",
            "Effect yang mengubah state berdasarkan state lain sering menyebabkan render berantai. Turunkan nilai langsung dari state yang ada.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Buat effect yang mencatat posisi scroll dan membersihkan listener saat komponen unmount.",
          ),
          divider(),
        ],
      },
      {
        title: "Fetch Data: Loading, Error & Empty",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengambil data dari API dengan fetch, menampilkan status loading, error, dan empty state secara jelas.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru</strong>; fetch sudah tersedia di browser. Praktik memakai API publik JSONPlaceholder sehingga membutuhkan koneksi internet.</p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/components/DaftarPengguna.tsx dan src/data/pengguna-lokal.ts sebagai fallback offline.",
          ),
          h("1. Tipe Data Response"),
          tsCode(`
// src/types/user.ts
export type User = {
  id: number;
  name: string;
  email: string;
};
`),
          h("2. Fetch dengan Status"),
          tsCode(`
import { useEffect, useState } from "react";
import type { User } from "../types/user";

export function DaftarPengguna() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function ambilData() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data = (await res.json()) as User[];
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }

    void ambilData();
  }, []);

  if (loading) return <p>Memuat...</p>;
  if (error) return <p>Error: {error}</p>;
  if (users.length === 0) return <p>Belum ada pengguna.</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} — {user.email}
        </li>
      ))}
    </ul>
  );
}
`),
          h("3. Tiga State yang Harus Jelas"),
          p(
            "<ul><li><strong>Loading</strong> — beri indikator, jangan tampilkan data kosong.</li><li><strong>Error</strong> — tampilkan pesan yang bisa dipahami dan tombol coba lagi.</li><li><strong>Empty</strong> — bedakan antara belum ada data dan gagal memuat.</li></ul>",
          ),
          h("4. Fallback Offline"),
          p(
            "<p>Jika peserta offline, gunakan data lokal dan jelaskan perbedaannya. Kode fetching tetap sama; hanya sumber datanya yang diganti.</p>",
          ),
          tsCode(`
// src/data/pengguna-lokal.ts
import type { User } from "../types/user";

export const penggunaLokal: User[] = [
  { id: 1, name: "Budi", email: "budi@contoh.id" },
  { id: 2, name: "Rina", email: "rina@contoh.id" },
];
`),
          callout(
            "warning",
            "Jangan lupa menangani response yang bukan JSON. Periksa res.ok sebelum memanggil res.json(), dan tangkap error jaringan di catch.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan tombol \"Coba lagi\" yang mengulang fetch, serta tampilkan skeleton sederhana saat loading.",
          ),
          divider(),
        ],
      },
      {
        title: "AbortController & Race Condition",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membatalkan request yang tidak lagi dibutuhkan dan mencegah race condition saat parameter pencarian berubah cepat.</p>",
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
            "File yang dibuat: src/components/CariPengguna.tsx.",
          ),
          h("1. Masalah Race Condition"),
          p(
            "<p>Jika dua request berjalan dan yang lebih lambat selesai terakhir, hasil lama bisa menimpa hasil baru. Batalkan request sebelumnya saat input berubah.</p>",
          ),
          h("2. AbortController"),
          tsCode(`
import { useEffect, useState } from "react";

export function CariPengguna() {
  const [query, setQuery] = useState("");
  const [hasil, setHasil] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function cari() {
      try {
        const res = await fetch(
          \`https://jsonplaceholder.typicode.com/users?name_like=\${query}\`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Gagal mencari");
        const data = (await res.json()) as { name: string }[];
        setHasil(data.map((item) => item.name));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setHasil([]);
      }
    }

    if (query.trim()) void cari();
    else setHasil([]);

    return () => controller.abort();
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {hasil.map((nama) => (
          <li key={nama}>{nama}</li>
        ))}
      </ul>
    </div>
  );
}
`),
          h("3. Cleanup Wajib"),
          p(
            "<p>Fungsi cleanup memanggil <code>controller.abort()</code>. Dengan begitu, request lama dibatalkan ketika query berubah atau komponen unmount.</p>",
          ),
          callout(
            "info",
            "AbortError bukan error aplikasi. Abaikan error tersebut agar UI tidak menampilkan pesan gagal palsu.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan debounce 300ms sebelum fetch agar request tidak dikirim setiap ketikan.",
          ),
          divider(),
        ],
      },
      {
        title: "Custom Hook useFetch",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengekstrak logika fetching ke custom hook yang reusable, lengkap dengan status dan pembatalan request.</p>",
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
            "File yang dibuat: src/hooks/useFetch.ts dan src/components/DaftarPenggunaHook.tsx.",
          ),
          h("1. Hook useFetch"),
          tsCode(`
import { useEffect, useState } from "react";

type HasilFetch<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T>(url: string): HasilFetch<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function ambil() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        setData((await res.json()) as T);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Gagal memuat");
      } finally {
        setLoading(false);
      }
    }

    void ambil();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
`),
          h("2. Memakai Hook"),
          tsCode(`
import { useFetch } from "../hooks/useFetch";
import type { User } from "../types/user";

export function DaftarPenggunaHook() {
  const { data, loading, error } = useFetch<User[]>(
    "https://jsonplaceholder.typicode.com/users",
  );

  if (loading) return <p>Memuat...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data?.length) return <p>Belum ada pengguna.</p>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
`),
          h("3. Aturan Custom Hook"),
          p(
            "<ul><li>Nama diawali <code>use</code>.</li><li>Hanya memanggil hook lain di top level, bukan di dalam kondisi atau loop.</li><li>Kembalikan nilai yang jelas: data, status, dan aksi.</li><li>Jangan menyembunyikan terlalu banyak logika sampai sulit dipahami.</li></ul>",
          ),
          callout(
            "warning",
            "Custom hook bukan pengganti semua fungsi. Jika logika tidak memakai hook lain, cukup jadikan fungsi utilitas biasa.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan opsi refetch pada useFetch dan tombol untuk memuat ulang data.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Life Cycle & Data",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Life Cycle, Effects & Data"),
          p("<p>Uji pemahaman life cycle, useEffect, cleanup, fetch, dan custom hook.</p>"),
          quiz("Kuis Life Cycle & Data", [
            {
              q: "Effect dengan dependency array kosong berjalan...",
              options: ["Setiap render", "Sekali setelah mount", "Saat unmount saja", "Tidak pernah"],
              answer: 1,
            },
            {
              q: "Fungsi yang dikembalikan useEffect berguna untuk...",
              options: ["Menambah state", "Cleanup", "Membuat komponen", "Mengubah props"],
              answer: 1,
            },
            {
              q: "Status yang perlu ditampilkan saat fetch adalah...",
              options: ["Hanya data", "Loading, error, dan empty", "Hanya error", "Hanya loading"],
              answer: 1,
            },
            {
              q: "AbortController dipakai untuk...",
              options: ["Mempercepat render", "Membatalkan request", "Menyimpan data", "Membuat CSS"],
              answer: 1,
            },
            {
              q: "Nama custom hook harus diawali...",
              options: ["use", "get", "fetch", "hook"],
              answer: 0,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 6 — HOOKS LANJUTAN & PERFORMA
  // ==========================================================
  {
    name: "Hooks Lanjutan & Performa",
    description:
      "useRef, useMemo, useCallback, memo, custom hooks praktis, Error Boundary, Suspense, dan lazy loading.",
    lessons: [
      {
        title: "useRef: Nilai Mutable & DOM",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memakai useRef untuk menyimpan nilai tanpa memicu render dan mengakses elemen DOM secara langsung.</p>",
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
            "File yang dibuat: src/components/FokusInput.tsx.",
          ),
          h("1. Ref ke Elemen DOM"),
          tsCode(`
import { useRef } from "react";

export function FokusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  function fokus() {
    inputRef.current?.focus();
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Nama" />
      <button onClick={fokus}>Fokus ke input</button>
    </div>
  );
}
`),
          h("2. Nilai Mutable Tanpa Render"),
          tsCode(`
import { useRef, useState } from "react";

export function PenghitungRender() {
  const [nilai, setNilai] = useState(0);
  const jumlahRender = useRef(0);

  jumlahRender.current += 1;

  return (
    <div>
      <p>Nilai: {nilai}</p>
      <p>Render ke: {jumlahRender.current}</p>
      <button onClick={() => setNilai(nilai + 1)}>Tambah</button>
    </div>
  );
}
`),
          callout(
            "info",
            "Mengubah ref.current tidak memicu render ulang. Gunakan ref untuk data yang tidak ditampilkan langsung di UI, seperti timer id, nilai sebelumnya, atau instance library.",
          ),
          h("3. Kapan Bukan Ref"),
          p(
            "<p>Jika nilai perlu ditampilkan dan perubahannya harus memperbarui UI, gunakan state. Jangan memakai ref untuk menggantikan state hanya agar tidak re-render.</p>",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Buat tombol yang mengosongkan input dan mengembalikan fokus ke input memakai ref.",
          ),
          divider(),
        ],
      },
      {
        title: "useMemo, useCallback & memo",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami kapan memoization membantu, cara memakainya dengan benar, dan mengapa optimasi dini bisa merugikan.</p>",
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
            "File yang dibuat: src/components/DaftarMahal.tsx.",
          ),
          h("1. useMemo"),
          tsCode(`
import { useMemo, useState } from "react";

export function DaftarMahal({ angka }: { angka: number[] }) {
  const [filter, setFilter] = useState("");

  const hasil = useMemo(() => {
    return angka
      .filter((n) => n % 2 === 0)
      .sort((a, b) => a - b);
  }, [angka]);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <p>{hasil.length} angka genap</p>
    </div>
  );
}
`),
          h("2. useCallback"),
          tsCode(`
import { useCallback } from "react";

const handlePilih = useCallback((id: string) => {
  console.log("dipilih", id);
}, []);
`),
          h("3. memo"),
          tsCode(`
import { memo } from "react";

type ItemProps = {
  judul: string;
  onPilih: () => void;
};

export const Item = memo(function Item({ judul, onPilih }: ItemProps) {
  console.log("render item", judul);
  return <button onClick={onPilih}>{judul}</button>;
});
`),
          callout(
            "warning",
            "Jangan membungkus semua komponen dengan memo. Optimasi ini hanya berguna jika props stabil dan render komponen memang mahal. Ukur dulu dengan React DevTools Profiler.",
          ),
          h("4. React Compiler"),
          p(
            "<p>React Compiler dapat mengoptimalkan banyak kasus secara otomatis. Tetap pahami konsep memoization agar kamu bisa membaca kode dan menangani kasus yang tidak tercakup compiler.</p>",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Ukur render Item dengan dan tanpa memo saat induk berubah state yang tidak terkait.",
          ),
          divider(),
        ],
      },
      {
        title: "Custom Hooks: useLocalStorage & useDebounce",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat custom hook praktis untuk menyimpan state di localStorage dan menunda nilai yang berubah cepat.</p>",
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
            "File yang dibuat: src/hooks/useLocalStorage.ts, src/hooks/useDebounce.ts, dan src/components/PencarianTertunda.tsx.",
          ),
          h("1. useLocalStorage"),
          tsCode(`
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, awal: T) {
  const [nilai, setNilai] = useState<T>(() => {
    try {
      const tersimpan = localStorage.getItem(key);
      return tersimpan ? (JSON.parse(tersimpan) as T) : awal;
    } catch {
      return awal;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(nilai));
  }, [key, nilai]);

  return [nilai, setNilai] as const;
}
`),
          h("2. useDebounce"),
          tsCode(`
import { useEffect, useState } from "react";

export function useDebounce<T>(nilai: T, delay = 300): T {
  const [tertunda, setTertunda] = useState(nilai);

  useEffect(() => {
    const timer = setTimeout(() => setTertunda(nilai), delay);
    return () => clearTimeout(timer);
  }, [nilai, delay]);

  return tertunda;
}
`),
          h("3. Memakai Keduanya"),
          tsCode(`
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function PencarianTertunda() {
  const [kata, setKata] = useState("");
  const kataTertunda = useDebounce(kata, 300);
  const [riwayat, setRiwayat] = useLocalStorage<string[]>("riwayat", []);

  useEffect(() => {
    if (kataTertunda.trim()) {
      setRiwayat((items) => [...new Set([kataTertunda, ...items])].slice(0, 5));
    }
  }, [kataTertunda, setRiwayat]);

  return (
    <div>
      <input value={kata} onChange={(e) => setKata(e.target.value)} />
      <p>Mencari: {kataTertunda}</p>
      <ul>
        {riwayat.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
`),
          callout(
            "warning",
            "localStorage hanya tersedia di browser. Jangan memanggilnya saat server-side rendering tanpa pengecekan typeof window.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Buat hook useToggle yang mengembalikan [nilai, toggle] dan simpan preferensi tema memakai useLocalStorage.",
          ),
          divider(),
        ],
      },
      {
        title: "Error Boundary, Suspense & Lazy Loading",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menangani error render, menampilkan fallback saat komponen dimuat malas, dan memecah bundle dengan lazy.</p>",
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
            "File yang dibuat: src/components/ErrorBoundary.tsx dan src/components/HalamanBerat.tsx.",
          ),
          h("1. Error Boundary"),
          p(
            "<p>Error Boundary menangkap error saat render. Ini salah satu kasus yang masih memerlukan class component.</p>",
          ),
          tsCode(`
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error boundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return <p>Terjadi kesalahan: {this.state.error.message}</p>;
    }
    return this.props.children;
  }
}
`),
          h("2. Lazy & Suspense"),
          tsCode(`
import { lazy, Suspense, useState } from "react";

const HalamanBerat = lazy(() => import("./components/HalamanBerat"));

export function ContohLazy() {
  const [tampil, setTampil] = useState(false);

  return (
    <div>
      <button onClick={() => setTampil(true)}>Buka halaman</button>
      {tampil ? (
        <Suspense fallback={<p>Memuat halaman...</p>}>
          <HalamanBerat />
        </Suspense>
      ) : null}
    </div>
  );
}
`),
          tsCode(`
// src/components/HalamanBerat.tsx
export default function HalamanBerat() {
  return <p>Komponen ini dimuat terpisah.</p>;
}
`),
          callout(
            "warning",
            "Komponen lazy harus memiliki default export. Error saat loading harus ditangani di level lain, misalnya Error Boundary.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan tombol reset pada ErrorBoundary yang mengembalikan state error ke null.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Hooks Lanjutan",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Hooks Lanjutan"),
          p("<p>Uji pemahaman useRef, memoization, custom hooks, dan lazy loading.</p>"),
          quiz("Kuis Hooks Lanjutan", [
            {
              q: "Mengubah ref.current akan...",
              options: ["Memicu render", "Tidak memicu render", "Menghapus state", "Mengubah props"],
              answer: 1,
            },
            {
              q: "useMemo berguna untuk...",
              options: [
                "Menyimpan hasil perhitungan yang mahal",
                "Mengambil data dari API",
                "Membuat CSS",
                "Mengganti state",
              ],
              answer: 0,
            },
            {
              q: "Nama custom hook harus diawali use agar...",
              options: [
                "React dapat menerapkan aturan hook",
                "Lebih cepat",
                "Bisa dipakai di class",
                "Tidak perlu diimpor",
              ],
              answer: 0,
            },
            {
              q: "Komponen lazy harus memiliki...",
              options: ["named export", "default export", "class", "props wajib"],
              answer: 1,
            },
            {
              q: "Error Boundary menangkap error pada...",
              options: ["Event handler", "Saat render", "Fetch", "Semua error"],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 7 — ROUTING, FORM & STRUKTUR APLIKASI
  // ==========================================================
  {
    name: "Routing, Form & Struktur Aplikasi",
    description:
      "Menambahkan React Router, params, search params, form modern, struktur folder, dan mini project daftar-detail.",
    lessons: [
      {
        title: "React Router: Route, Layout & Outlet",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memasang React Router, membuat layout bersama, dan menavigasi antar halaman tanpa reload penuh.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Dependency baru: <code>react-router-dom</code>. Jalankan perintah berikut dari folder proyek.</p>",
          ),
          bashCode(`
cd react-latihan
npm install react-router-dom
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/layouts/AppLayout.tsx, src/pages/Beranda.tsx, src/pages/Tentang.tsx, dan src/router.tsx.",
          ),
          h("1. Setup Router"),
          tsCode(`
// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { Beranda } from "./pages/Beranda";
import { Tentang } from "./pages/Tentang";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Beranda /> },
      { path: "tentang", element: <Tentang /> },
    ],
  },
]);
`),
          tsCode(`
// src/main.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
`),
          h("2. Layout & Outlet"),
          tsCode(`
// src/layouts/AppLayout.tsx
import { Link, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div>
      <nav>
        <Link to="/">Beranda</Link>
        <Link to="/tentang">Tentang</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
`),
          h("3. Halaman"),
          tsCode(`
// src/pages/Beranda.tsx
export function Beranda() {
  return <h1>Beranda</h1>;
}

// src/pages/Tentang.tsx
export function Tentang() {
  return <h1>Tentang</h1>;
}
`),
          callout(
            "warning",
            "Jika memakai createBrowserRouter, jangan membungkus RouterProvider dengan BrowserRouter lagi. Pilih salah satu pendekatan agar tidak terjadi konflik router.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan halaman Kontak dan tautan navigasinya, lalu pastikan layout tetap tampil.",
          ),
          divider(),
        ],
      },
      {
        title: "Params, Search Params & Navigasi",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membaca parameter URL, mengelola query string, dan berpindah halaman secara programatik.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru</strong> karena React Router sudah terpasang di lesson sebelumnya.</p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/pages/PenggunaDetail.tsx dan src/pages/DaftarPenggunaPage.tsx.",
          ),
          h("1. Route Params"),
          tsCode(`
import { useParams } from "react-router-dom";

export function PenggunaDetail() {
  const { id } = useParams();
  return <p>ID pengguna: {id}</p>;
}
`),
          tsCode(`
// tambahkan di router
{ path: "pengguna/:id", element: <PenggunaDetail /> }
`),
          h("2. Search Params"),
          tsCode(`
import { useSearchParams } from "react-router-dom";

export function DaftarPenggunaPage() {
  const [params, setParams] = useSearchParams();
  const kata = params.get("q") ?? "";

  return (
    <div>
      <input
        value={kata}
        onChange={(e) => setParams({ q: e.target.value })}
      />
      <p>Mencari: {kata}</p>
    </div>
  );
}
`),
          h("3. Navigasi Programatik"),
          tsCode(`
import { useNavigate } from "react-router-dom";

function TombolKembali() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Kembali</button>;
}
`),
          callout(
            "info",
            "Simpan filter dan pencarian di URL agar bisa dibagikan dan bertahan saat halaman di-refresh.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan tautan dari daftar pengguna ke /pengguna/:id dan tombol kembali ke daftar.",
          ),
          divider(),
        ],
      },
      {
        title: "Form: Controlled vs React 19 Actions & Validasi",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membandingkan controlled form dengan form actions React 19, serta menambahkan validasi dan status pending.</p>",
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
            "File yang dibuat: src/components/FormKontak.tsx dan src/components/FormKontakAction.tsx.",
          ),
          h("1. Controlled Form"),
          tsCode(`
import { useState } from "react";

export function FormKontak() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input value={nama} onChange={(e) => setNama(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={!nama || !email.includes("@")}>Kirim</button>
    </form>
  );
}
`),
          h("2. React 19 Actions"),
          tsCode(`
import { useActionState } from "react";

type FormState = { error: string | null; sukses: boolean };

async function kirim(_state: FormState, formData: FormData): Promise<FormState> {
  const nama = String(formData.get("nama") ?? "");
  const email = String(formData.get("email") ?? "");

  if (!nama.trim()) return { error: "Nama wajib diisi", sukses: false };
  if (!email.includes("@")) return { error: "Email tidak valid", sukses: false };

  return { error: null, sukses: true };
}

export function FormKontakAction() {
  const [state, action, pending] = useActionState(kirim, {
    error: null,
    sukses: false,
  });

  return (
    <form action={action}>
      <input name="nama" />
      <input name="email" />
      <button disabled={pending}>{pending ? "Mengirim..." : "Kirim"}</button>
      {state.error ? <p>{state.error}</p> : null}
      {state.sukses ? <p>Terkirim!</p> : null}
    </form>
  );
}
`),
          callout(
            "info",
            "Form actions mengurangi boilerplate state. Untuk form yang sangat interaktif dan butuh validasi per ketikan, controlled form masih lebih fleksibel.",
          ),
          callout(
            "warning",
            "Validasi di client bukan pengganti validasi di server. Saat memakai API nyata, validasi ulang input di backend.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan field pesan dan validasi minimal 10 karakter pada kedua versi form.",
          ),
          divider(),
        ],
      },
      {
        title: "Struktur Folder, Komposisi & Data Flow",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menata folder aplikasi berdasarkan fitur dan menjaga aliran data tetap jelas saat aplikasi membesar.</p>",
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
            "Praktik ini berupa refactor struktur folder. Tidak ada file baru yang wajib; sesuaikan dengan proyekmu.",
          ),
          h("1. Struktur Berdasarkan Fitur"),
          bashCode(`
src/
├─ components/
│  ├─ ui/
│  └─ shared/
├─ features/
│  ├─ users/
│  │  ├─ UserCard.tsx
│  │  ├─ UserList.tsx
│  │  └─ useUsers.ts
│  └─ favorites/
│     ├─ FavoriteButton.tsx
│     └─ useFavorites.ts
├─ pages/
├─ layouts/
├─ hooks/
├─ data/
└─ test/
`),
          h("2. Aturan Arah Dependency"),
          p(
            "<ul><li>Halaman boleh mengimpor fitur dan komponen UI.</li><li>Fitur boleh mengimpor hook/data, tetapi sebaiknya tidak mengimpor halaman.</li><li>Komponen UI generik tidak boleh bergantung pada fitur tertentu.</li><li>Data dan tipe bersama diletakkan di folder yang mudah diakses.</li></ul>",
          ),
          h("3. Data Flow"),
          tsCode(`
// pages/PenggunaPage.tsx
import { useUsers } from "../features/users/useUsers";
import { UserList } from "../features/users/UserList";

export function PenggunaPage() {
  const { users, loading } = useUsers();
  return loading ? <p>Memuat...</p> : <UserList users={users} />;
}
`),
          callout(
            "info",
            "Tidak ada satu struktur folder yang sempurna. Yang penting konsisten, mudah dicari, dan arah dependency tidak melingkar.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Pindahkan satu komponen dari src/components ke folder fitur yang sesuai tanpa mengubah perilakunya.",
          ),
          divider(),
        ],
      },
      {
        title: "Mini Project: Daftar & Detail",
        duration: 28,
        blocks: [
          h("Tujuan Proyek"),
          p(
            "<p>Membangun halaman daftar pengguna dan detail pengguna dengan React Router, fetch API, loading/error, dan CSS Modules.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. Dependency yang dibutuhkan: <code>react-router-dom</code> (sudah dipasang di Part 7). Tidak ada paket baru.</p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
`),
          callout(
            "info",
            "File yang dibuat: src/pages/PenggunaPage.tsx, src/pages/PenggunaDetailPage.tsx, src/features/users/UserCard.tsx, dan src/features/users/users.module.css.",
          ),
          h("1. Tipe & Fetch"),
          tsCode(`
// src/features/users/types.ts
export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
};
`),
          tsCode(`
// src/features/users/useUsers.ts
import { useEffect, useState } from "react";
import type { User } from "./types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://jsonplaceholder.typicode.com/users", {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json() as Promise<User[]>;
      })
      .then(setUsers)
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Gagal memuat");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { users, loading, error };
}
`),
          h("2. Kartu Pengguna"),
          tsCode(`
// src/features/users/UserCard.tsx
import { Link } from "react-router-dom";
import type { User } from "./types";
import styles from "./users.module.css";

export function UserCard({ user }: { user: User }) {
  return (
    <article className={styles.card}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <Link to={\`/pengguna/\${user.id}\`}>Lihat detail</Link>
    </article>
  );
}
`),
          cssCode(`
/* src/features/users/users.module.css */
.card {
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  padding: 16px;
  background: #fff;
  margin-bottom: 12px;
}
`),
          h("3. Halaman Daftar"),
          tsCode(`
// src/pages/PenggunaPage.tsx
import { useUsers } from "../features/users/useUsers";
import { UserCard } from "../features/users/UserCard";

export function PenggunaPage() {
  const { users, loading, error } = useUsers();

  if (loading) return <p>Memuat...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section>
      <h1>Daftar Pengguna</h1>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </section>
  );
}
`),
          h("4. Halaman Detail"),
          tsCode(`
// src/pages/PenggunaDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { User } from "../features/users/types";

export function PenggunaDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`)
      .then((res) => {
        if (!res.ok) throw new Error("Tidak ditemukan");
        return res.json() as Promise<User>;
      })
      .then(setUser)
      .catch(() => setUser(null));
  }, [id]);

  if (!user) return <p>Memuat atau data tidak ditemukan...</p>;

  return (
    <article>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Telepon: {user.phone}</p>
    </article>
  );
}
`),
          h("5. Daftarkan Route"),
          tsCode(`
{
  path: "/",
  element: <AppLayout />,
  children: [
    { index: true, element: <Beranda /> },
    { path: "pengguna", element: <PenggunaPage /> },
    { path: "pengguna/:id", element: <PenggunaDetailPage /> },
  ],
}
`),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan search params q untuk memfilter nama pengguna dan tombol kembali dari detail.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Routing & Form",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Routing & Form"),
          p("<p>Uji pemahaman React Router, params, form, dan struktur aplikasi.</p>"),
          quiz("Kuis Routing & Form", [
            {
              q: "Komponen yang merender halaman anak pada nested route adalah...",
              options: ["Link", "Outlet", "Navigate", "Router"],
              answer: 1,
            },
            {
              q: "Hook untuk membaca parameter dinamis dari URL adalah...",
              options: ["useSearchParams", "useParams", "useNavigate", "useLocation"],
              answer: 1,
            },
            {
              q: "Hook untuk mengubah query string adalah...",
              options: ["useParams", "useSearchParams", "useNavigate", "useRoute"],
              answer: 1,
            },
            {
              q: "Keunggulan menyimpan filter di URL adalah...",
              options: [
                "Lebih cepat",
                "Bisa dibagikan dan bertahan saat refresh",
                "Mengurangi dependency",
                "Membuat CSS lebih rapi",
              ],
              answer: 1,
            },
            {
              q: "Validasi input di client sebaiknya...",
              options: [
                "Menggantikan validasi server",
                "Tetap diulang di server",
                "Tidak perlu",
                "Hanya untuk form kecil",
              ],
              answer: 1,
            },
          ]),
        ],
      },
    ],
  },

  // ==========================================================
  // PART 8 — TESTING, DEPLOY & PROYEK AKHIR
  // ==========================================================
  {
    name: "Testing, Deploy & Proyek Akhir",
    description:
      "Menyiapkan Vitest + React Testing Library, menguji async UI, build/deploy, dan menyelesaikan proyek akhir React.",
    lessons: [
      {
        title: "Testing dengan Vitest & React Testing Library",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyiapkan pengujian komponen dengan Vitest dan React Testing Library, lalu menulis test yang berfokus pada perilaku pengguna.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Dependency baru berupa devDependencies. Jalankan perintah berikut, lalu tambahkan script test pada <code>package.json</code>.</p>",
          ),
          bashCode(`
cd react-latihan
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
`),
          callout(
            "info",
            "Dependency yang dipasang: vitest (test runner), jsdom (DOM browser), React Testing Library, jest-dom matchers, dan user-event untuk simulasi interaksi.",
          ),
          h("1. Konfigurasi Vitest"),
          tsCode(`
// vite.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
`),
          tsCode(`
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
`),
          h("2. Script Test"),
          jsonCode(`
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -p tsconfig.app.json --noEmit",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
`),
          h("3. Test Pertama"),
          tsCode(`
// src/components/Counter.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("menambah angka saat tombol diklik", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole("button", { name: /tambah/i }));

    expect(screen.getByText(/total: 1/i)).toBeInTheDocument();
  });
});
`),
          callout(
            "info",
            "Query yang disarankan adalah getByRole, getByLabelText, dan getByText. Hindari query berdasarkan class CSS karena test menjadi rapuh saat styling berubah.",
          ),
          callout(
            "warning",
            "Jika TypeScript belum mengenali matcher jest-dom, pastikan file setup diimpor dan tambahkan tipe yang sesuai di tsconfig.",
          ),
          bashCode(`
npm run test
npm run test:run
`),
          callout(
            "success",
            "Tantangan Mandiri: Tulis test yang memastikan tombol reset mengembalikan angka ke 0.",
          ),
          divider(),
        ],
      },
      {
        title: "Mocking Fetch & Menguji Async UI",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menguji komponen yang memuat data asynchronous dengan memalsukan fetch, termasuk status loading dan error.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru</strong>; Vitest dan React Testing Library sudah terpasang di lesson sebelumnya.</p>",
          ),
          bashCode(`
cd react-latihan
npm run test
`),
          callout(
            "info",
            "File yang dibuat: src/components/DaftarPengguna.test.tsx.",
          ),
          h("1. Mock fetch"),
          tsCode(`
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DaftarPengguna } from "./DaftarPengguna";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("DaftarPengguna", () => {
  it("menampilkan data setelah loading", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: 1, name: "Budi", email: "budi@contoh.id" }],
      }),
    );

    render(<DaftarPengguna />);

    expect(screen.getByText(/memuat/i)).toBeInTheDocument();
    expect(await screen.findByText("Budi")).toBeInTheDocument();
  });
});
`),
          h("2. Menguji Error"),
          tsCode(`
it("menampilkan pesan error saat fetch gagal", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: false, status: 500 }),
  );

  render(<DaftarPengguna />);

  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
`),
          callout(
            "info",
            "findByText menunggu elemen muncul secara asynchronous. Gunakan findBy untuk UI yang muncul setelah fetch selesai, bukan getBy.",
          ),
          callout(
            "warning",
            "Selalu pulihkan mock setelah test agar test lain tidak terpengaruh. vi.restoreAllMocks() membantu menjaga isolasi.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan test untuk empty state saat API mengembalikan array kosong.",
          ),
          divider(),
        ],
      },
      {
        title: "Build & Deploy",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat build produksi, memeriksa hasilnya secara lokal, dan men-deploy aplikasi React statis.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. <strong>Tidak ada dependency baru.</strong> Deploy memakai Vercel/Netlify; opsional menjalankan <code>npx vercel</code>.</p>",
          ),
          bashCode(`
cd react-latihan
npm run typecheck
npm run test:run
npm run build
npm run preview
`),
          callout(
            "info",
            "Folder hasil build adalah dist/. Untuk SPA dengan React Router, hosting perlu mengarahkan semua route ke index.html agar refresh di /pengguna/1 tidak 404.",
          ),
          h("1. Build Produksi"),
          bashCode(`
npm run build
npm run preview
`),
          h("2. Deploy ke Vercel"),
          bashCode(`
npx vercel
npx vercel --prod
`),
          p(
            "<p><code>npx vercel</code> mengunduh CLI sementara tanpa instalasi global. Ikuti prompt login dan pilih folder proyek. Alternatif lain: hubungkan repository GitHub ke Vercel/Netlify dan atur build command <code>npm run build</code> serta output directory <code>dist</code>.</p>",
          ),
          h("3. Konfigurasi SPA"),
          jsonCode(`
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
`),
          callout(
            "warning",
            "Jangan commit file .env berisi secret. Untuk Vite, variabel yang aman dipakai di browser harus diawali VITE_ dan tetap dianggap publik.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Deploy aplikasi ke Vercel atau Netlify, lalu buka salah satu route detail dan refresh halaman untuk memastikan konfigurasi SPA benar.",
          ),
          divider(),
        ],
      },
      {
        title: "Proyek Akhir: Aplikasi React + Router + API + CSS Modules",
        duration: 30,
        blocks: [
          h("Tujuan Proyek"),
          p(
            "<p>Menggabungkan seluruh materi menjadi aplikasi React lengkap: routing, fetch API, state, custom hook, form, CSS Modules, dan test.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Praktik ini memakai proyek <code>react-latihan</code>. Dependency yang dibutuhkan sudah terpasang: <code>react-router-dom</code>, <code>vitest</code>, dan React Testing Library. <strong>Tidak ada paket baru.</strong></p>",
          ),
          bashCode(`
cd react-latihan
npm run dev
npm run test
npm run build
`),
          callout(
            "info",
            "Fitur wajib: daftar pengguna, detail pengguna, pencarian, favorit tersimpan di localStorage, dan halaman favorit.",
          ),
          h("1. Struktur Fitur"),
          bashCode(`
src/
├─ features/
│  ├─ users/
│  │  ├─ UserCard.tsx
│  │  ├─ UserList.tsx
│  │  ├─ UserDetail.tsx
│  │  ├─ useUsers.ts
│  │  └─ types.ts
│  └─ favorites/
│     ├─ useFavorites.ts
│     └─ FavoriteButton.tsx
├─ pages/
│  ├─ UserListPage.tsx
│  ├─ UserDetailPage.tsx
│  └─ FavoritesPage.tsx
├─ layouts/AppLayout.tsx
├─ test/setup.ts
└─ router.tsx
`),
          h("2. Favorit dengan useLocalStorage"),
          tsCode(`
// src/features/favorites/useFavorites.ts
import { useLocalStorage } from "../../hooks/useLocalStorage";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<number[]>("favorit", []);

  function toggle(id: number) {
    setFavorites((items) =>
      items.includes(id)
        ? items.filter((item) => item !== id)
        : [...items, id],
    );
  }

  return { favorites, toggle, isFavorite: (id: number) => favorites.includes(id) };
}
`),
          tsCode(`
// src/features/favorites/FavoriteButton.tsx
import { useFavorites } from "./useFavorites";

export function FavoriteButton({ id }: { id: number }) {
  const { isFavorite, toggle } = useFavorites();
  const aktif = isFavorite(id);

  return (
    <button onClick={() => toggle(id)}>
      {aktif ? "Hapus dari favorit" : "Tambah ke favorit"}
    </button>
  );
}
`),
          h("3. Halaman Favorit"),
          tsCode(`
// src/pages/FavoritesPage.tsx
import { useFavorites } from "../features/favorites/useFavorites";
import { useUsers } from "../features/users/useUsers";

export function FavoritesPage() {
  const { favorites } = useFavorites();
  const { users, loading } = useUsers();

  if (loading) return <p>Memuat...</p>;

  const daftar = users.filter((user) => favorites.includes(user.id));

  return (
    <section>
      <h1>Favorit</h1>
      {daftar.length === 0 ? (
        <p>Belum ada pengguna favorit.</p>
      ) : (
        <ul>
          {daftar.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
`),
          h("4. Router"),
          tsCode(`
// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { UserListPage } from "./pages/UserListPage";
import { UserDetailPage } from "./pages/UserDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <UserListPage /> },
      { path: "pengguna/:id", element: <UserDetailPage /> },
      { path: "favorit", element: <FavoritesPage /> },
    ],
  },
]);
`),
          h("5. Test Akhir"),
          tsCode(`
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FavoriteButton } from "./FavoriteButton";

describe("FavoriteButton", () => {
  it("menampilkan status favorit", async () => {
    const user = userEvent.setup();
    render(<FavoriteButton id={1} />);

    const tombol = screen.getByRole("button");
    await user.click(tombol);

    expect(screen.getByText(/favorit/i)).toBeInTheDocument();
  });
});
`),
          callout(
            "info",
            "Fokus pada fitur yang bisa didemonstrasikan. Kualitas lebih penting daripada jumlah file. Pastikan loading, error, empty state, dan navigasi berjalan.",
          ),
          callout(
            "success",
            "Tantangan Mandiri: Tambahkan filter pencarian yang disimpan di URL, tombol favorit di kartu dan detail, serta test untuk useFavorites.",
          ),
          divider(),
        ],
      },
      {
        title: "Kuis Testing & Deploy",
        duration: 10,
        type: "QUIZ",
        blocks: [
          h("Kuis Testing & Deploy"),
          p("<p>Uji pemahaman testing React, mocking, build, dan deploy SPA.</p>"),
          quiz("Kuis Testing & Deploy", [
            {
              q: "Library yang dipakai untuk merender komponen di test adalah...",
              options: ["React Testing Library", "Vitest UI", "Storybook", "Cypress"],
              answer: 0,
            },
            {
              q: "Query yang paling disarankan untuk mencari tombol adalah...",
              options: ["getByClass", "getByRole", "getByTestId", "querySelector"],
              answer: 1,
            },
            {
              q: "Fungsi untuk menunggu elemen muncul setelah fetch adalah...",
              options: ["getByText", "findByText", "queryByText", "getAllByText"],
              answer: 1,
            },
            {
              q: "Folder hasil build Vite secara default adalah...",
              options: ["build", "out", "dist", "public"],
              answer: 2,
            },
            {
              q: "Agar route SPA tidak 404 saat refresh, hosting perlu...",
              options: [
                "Menonaktifkan JavaScript",
                "Mengarahkan semua route ke index.html",
                "Menghapus React Router",
                "Memakai hash di semua URL",
              ],
              answer: 1,
            },
          ]),
        ],
      },
      {
        title: "Ujian Akhir React",
        duration: 20,
        type: "QUIZ",
        blocks: [
          h("Ujian Akhir React.js & TypeScript"),
          p(
            "<p>Kuis campuran dari seluruh materi: komponen, props, state, hooks, life cycle, data fetching, routing, testing, dan deploy.</p>",
          ),
          quiz(
            "Ujian Akhir React.js",
            [
              {
                q: "React adalah library untuk...",
                options: ["Database", "UI berbasis komponen", "Web server", "Bahasa pemrograman"],
                answer: 1,
              },
              {
                q: "Cara mengetik props pada function component adalah...",
                options: ["type Props = { ... }", "interface()", "props: any", "class Props"],
                answer: 0,
              },
              {
                q: "State pada function component dibuat dengan...",
                options: ["useState", "useEffect", "useRef", "useContext"],
                answer: 0,
              },
              {
                q: "Nilai state dibaca dari snapshot render, sehingga update berulang sebaiknya memakai...",
                options: ["setState(nilai + 1) berulang", "updater function", "variabel global", "DOM langsung"],
                answer: 1,
              },
              {
                q: "Effect dengan dependency [] berjalan...",
                options: ["Setiap render", "Sekali setelah mount", "Saat unmount", "Tidak pernah"],
                answer: 1,
              },
              {
                q: "Cleanup pada useEffect dipakai untuk...",
                options: ["Menambah state", "Membersihkan listener/timer", "Membuat props", "Menghapus komponen"],
                answer: 1,
              },
              {
                q: "Status UI saat fetch sebaiknya mencakup...",
                options: ["Loading, error, empty", "Hanya data", "Hanya error", "Hanya loading"],
                answer: 0,
              },
              {
                q: "AbortController berguna untuk...",
                options: ["Mempercepat render", "Membatalkan request", "Menyimpan state", "Membuat CSS"],
                answer: 1,
              },
              {
                q: "Nama custom hook harus diawali...",
                options: ["use", "get", "set", "hook"],
                answer: 0,
              },
              {
                q: "Komponen lazy memerlukan...",
                options: ["default export", "class", "Context", "Redux"],
                answer: 0,
              },
              {
                q: "Hook untuk membaca parameter URL adalah...",
                options: ["useParams", "useSearchParams", "useNavigate", "useLocation"],
                answer: 0,
              },
              {
                q: "Query testing yang disarankan adalah...",
                options: ["getByClass", "getByRole", "getByTestId", "querySelector"],
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
            "<ul><li>Dasar React: komponen, JSX, props, komposisi, conditional rendering, dan list/key.</li><li>State dan interaksi: `useState`, event, snapshot state, controlled form, dan validasi.</li><li>State management: lifting state, immutable update, `useReducer`, Context, dan derived state.</li><li>Component life cycle dan effects: mount/update/unmount, dependency, cleanup, Strict Mode.</li><li>Data fetching: loading/error/empty, `AbortController`, race condition, dan custom hook.</li><li>Hooks lanjutan: `useRef`, `useMemo`, `useCallback`, `memo`, custom hooks, Error Boundary, Suspense, lazy.</li><li>Routing dan struktur aplikasi: React Router, params, search params, form actions, dan mini project.</li><li>Testing, build, deploy, dan proyek akhir React + TypeScript + CSS Modules.</li></ul>",
          ),
          h("Contoh Rangkaian Skill Lengkap"),
          tsCode(`
import { useEffect, useState } from "react";

type User = { id: number; name: string };

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://jsonplaceholder.typicode.com/users", {
      signal: controller.signal,
    })
      .then((res) => res.json() as Promise<User[]>)
      .then(setUsers)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { users, loading };
}
`),
          h("Langkah Selanjutnya"),
          p(
            "<ol><li><strong>Next.js</strong> — App Router, Server Components, dan rendering server untuk aplikasi produksi.</li><li><strong>State server</strong> — TanStack Query untuk caching, refetch, dan mutation.</li><li><strong>Form lanjutan</strong> — React Hook Form + Zod untuk validasi yang lebih kompleks.</li><li><strong>Testing lebih dalam</strong> — MSW, integration test, dan end-to-end test.</li><li><strong>Aksesibilitas & performa</strong> — audit keyboard, fokus, kontras, dan React DevTools Profiler.</li></ol>",
          ),
          callout(
            "success",
            "Selamat! Kamu sudah menyelesaikan fondasi React 19 + TypeScript: dari komponen, state, life cycle, hooks, data fetching, routing, testing, hingga proyek akhir.",
          ),
          divider(),
        ],
      },
    ],
  },
];
