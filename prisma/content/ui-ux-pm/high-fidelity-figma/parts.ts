import {
  callout,
  code,
  CoursePartDef,
  divider,
  h,
  p,
} from "../../helpers";
import { table } from "../table";

export const UIUX_HIGH_FIDELITY_PARTS: CoursePartDef[] = [
  {
    name: "Fondasi High-Fidelity",
    description:
      "Mengubah wireframe menjadi desain high-fidelity dengan fondasi warna, tipografi, spasi, ikon, dan gambar.",
    lessons: [
      {
        title: "Dari Low-Fidelity ke High-Fidelity",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami perbedaan low-fidelity dan high-fidelity serta alur kerja untuk mengubah wireframe menjadi desain yang meyakinkan.</p>",
          ),
          h("1. Perbandingan Low-Fidelity dan High-Fidelity"),
          table(
            ["Aspek", "Low-Fidelity", "High-Fidelity"],
            [
              [
                "Wujud",
                "Kotak dan garis hitam putih.",
                "Warna, font, ikon, dan foto.",
              ],
              [
                "Fokus",
                "Alur dan susunan layar.",
                "Tampilan yang meyakinkan dan mudah dipakai.",
              ],
              [
                "Tahap",
                "Eksplorasi awal dan validasi struktur.",
                "Penyempurnaan visual sebelum prototype dan handoff.",
              ],
            ],
          ),
          h("2. Alur Kerja High-Fidelity"),
          p(
            "<ol><li>Gaya visual.</li><li>Style guide.</li><li>Desain layar.</li><li>Review.</li><li>Prototype.</li><li>Serahkan (handoff).</li></ol>",
          ),
          h("3. Modal dari Modul Sebelumnya"),
          p(
            "<p>High-fidelity dimulai dari wireframe low-fidelity yang sudah disetujui. Jangan mengubah alur saat mempercantik tampilan; selesaikan dulu struktur, baru visual.</p>",
          ),
          callout(
            "info",
            "High-fidelity bukan sekadar menambahkan warna. Ia harus punya aturan visual yang konsisten dan mudah dipahami developer.",
          ),
          divider(),
        ],
      },
      {
        title: "Warna & Tipografi",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menyusun palet warna dan hierarki tipografi yang konsisten untuk seluruh layar.</p>",
          ),
          h("1. Warna"),
          p(
            "<p>Warna memberi identitas dan menandai aksi penting. Gunakan proporsi 60-30-10 agar layar tidak terasa penuh.</p>",
          ),
          table(
            ["Proporsi", "Peran", "Contoh Pemakaian"],
            [
              ["60%", "Netral", "Latar layar, area konten, ruang kosong."],
              ["30%", "Utama", "Header, tombol utama, elemen brand."],
              ["10%", "Aksen", "Penanda kecil, status, tautan penting."],
            ],
          ),
          h("2. Tipografi"),
          p(
            "<p>Tipografi mengatur jenis dan ukuran huruf agar mudah dibaca. Gunakan tiga level: judul layar, sub judul, dan isi teks.</p>",
          ),
          p(
            "<ul><li>Pakai satu jenis font, paling banyak dua.</li><li>Bedakan level dengan ukuran dan ketebalan.</li><li>Jaga kontras teks terhadap latar.</li><li>Hindari terlalu banyak ukuran berbeda dalam satu layar.</li></ul>",
          ),
          h("3. Color Styles dan Text Styles di Figma"),
          p(
            "<p>Simpan warna dan tipografi sebagai styles agar konsisten. Jika satu warna berubah, semua elemen yang memakai style tersebut ikut berubah.</p>",
          ),
          callout(
            "warning",
            "Jangan memilih warna hanya karena terlihat bagus. Pastikan teks tetap terbaca, tombol utama menonjol, dan status error/success mudah dibedakan.",
          ),
          divider(),
        ],
      },
      {
        title: "Spasi, Ikon & Gambar",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengatur jarak antar-elemen dan memakai ikon/gambar secara fungsional, bukan sekadar hiasan.</p>",
          ),
          h("1. Spasi"),
          p(
            "<p>Spasi membuat layar terasa lega dan membantu pengguna mengelompokkan informasi. Gunakan margin tepi yang sama di semua layar, serta jarak yang konsisten antar-elemen.</p>",
          ),
          p(
            "<ul><li>Tentukan skala jarak, misalnya 4, 8, 12, 16, 24, dan 32.</li><li>Gunakan jarak lebih besar antar-kelompok informasi.</li><li>Jangan menaruh semua elemen terlalu rapat.</li></ul>",
          ),
          h("2. Ikon"),
          p(
            "<p>Ikon membantu mempercepat pemahaman. Namun ikon yang kurang umum perlu label teks di sebelahnya agar tidak menimbulkan tebakan.</p>",
          ),
          table(
            ["Penggunaan", "Contoh"],
            [
              ["Ikon umum + label", "Ikon pencarian dengan teks “Cari”."],
              ["Ikon umum tanpa label", "Ikon panah kembali yang sudah lazim."],
              ["Ikon khusus", "Wajib diberi label agar maknanya jelas."],
            ],
          ),
          h("3. Gambar"),
          p(
            "<p>Gunakan foto atau ilustrasi hanya jika relevan, ringan, dan memiliki hak pakai. Gambar harus mendukung pesan, bukan memenuhi ruang kosong.</p>",
          ),
          callout(
            "info",
            "Konsistensi lebih penting daripada banyak variasi. Lebih baik satu set ikon dan satu aturan jarak yang dipakai di semua layar.",
          ),
          divider(),
        ],
      },
    ],
  },
  {
    name: "Praktik & Review",
    description:
      "Menerapkan fondasi visual ke layar high-fidelity dan melakukan review dengan checklist.",
    lessons: [
      {
        title: "Praktik Figma: Style Guide & High-Fidelity",
        duration: 28,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Mengubah wireframe dari course sebelumnya menjadi high-fidelity dan membuat style guide satu halaman di Figma.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Tools: <strong>Figma</strong> (akun gratis, tanpa plugin berbayar). Gunakan file <code>Latihan UI-UX</code> dari course sebelumnya atau salin file tersebut. Tambahkan dua halaman baru.</p>",
          ),
          code(
            `
Figma file: Latihan UI-UX
├─ 01-IA
├─ 02-User Flow
├─ 03-Wireframe
├─ 04-Style Guide
└─ 05-High-Fidelity
`,
            "markdown",
          ),
          h("1. Buat Style Guide"),
          p(
            "<p>Di halaman <code>04-Style Guide</code>, tentukan palet warna 60-30-10 dan tiga level teks. Simpan warna sebagai color styles dan tipografi sebagai text styles.</p>",
          ),
          p(
            "<ol><li>Tentukan warna netral, utama, dan aksen.</li><li>Buat color styles di Figma.</li><li>Tentukan font, ukuran, dan ketebalan untuk judul, sub judul, dan isi.</li><li>Buat text styles.</li><li>Tetapkan aturan margin dan jarak.</li></ol>",
          ),
          h("2. Desain High-Fidelity"),
          p(
            "<p>Di halaman <code>05-High-Fidelity</code>, ubah 3–4 wireframe dari Modul 1 menjadi layar berwarna. Pertahankan susunan dan alur; fokus pada konsistensi visual.</p>",
          ),
          h("3. Prototype"),
          p(
            "<p>Hubungkan layar utama sesuai user flow. Gunakan prototype interaction sederhana: klik tombol menuju layar berikutnya, dan tombol kembali ke layar sebelumnya.</p>",
          ),
          h("4. Checklist"),
          p(
            "<ul><li>Palet 60-30-10 terlihat seimbang.</li><li>Maksimal dua font.</li><li>Margin dan jarak konsisten.</li><li>Ikon khusus diberi label.</li><li>Satu aksi utama per layar.</li><li>Kontras teks cukup jelas.</li></ul>",
          ),
          callout(
            "warning",
            "Jika style tidak berubah di semua elemen, periksa apakah elemen memakai style atau warna manual. Ganti warna manual dengan color style yang sudah dibuat.",
          ),
          divider(),
        ],
      },
      {
        title: "Checklist Review & Tugas Akhir",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Melakukan review mandiri sebelum menyerahkan hasil high-fidelity kepada mentor atau developer.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Tools: <strong>Figma</strong>, memakai file dan style guide dari praktik sebelumnya. Tidak ada dependency baru.</p>",
          ),
          code(
            `
Figma file: Latihan UI-UX
├─ 04-Style Guide
└─ 05-High-Fidelity
`,
            "markdown",
          ),
          h("1. Checklist Penilaian"),
          table(
            ["Aspek", "Pertanyaan Review"],
            [
              ["Warna", "Apakah proporsi 60-30-10 terlihat dan aksen dipakai secukupnya?"],
              ["Tipografi", "Apakah maksimal dua font dan hierarki judul/sub judul/isi jelas?"],
              ["Spasi", "Apakah margin dan jarak konsisten antar-layar?"],
              ["Ikon", "Apakah ikon yang kurang umum diberi label?"],
              ["Aksi", "Apakah setiap layar punya satu aksi utama yang jelas?"],
              ["Kontras", "Apakah teks dan tombol mudah dibaca?"],
              ["Alur", "Apakah prototype mengikuti user flow utama?"],
            ],
          ),
          h("2. Review Mandiri"),
          p(
            "<ol><li>Buka setiap layar dan bandingkan dengan style guide.</li><li>Periksa teks yang terlalu kecil atau kontrasnya rendah.</li><li>Pastikan tombol kembali dan lanjut berfungsi di prototype.</li><li>Minta satu orang mencoba alur dan catat kebingungannya.</li><li>Perbaiki temuan sebelum menyerahkan tugas.</li></ol>",
          ),
          h("3. Tugas Akhir"),
          p(
            "<p>Kumpulkan link Figma berisi style guide satu halaman dan 3–4 layar high-fidelity yang terhubung menjadi prototype. Sertakan catatan singkat tentang keputusan warna, font, dan alasan perubahan dari wireframe.</p>",
          ),
          callout(
            "success",
            "Gunakan checklist yang sama saat menilai pekerjaan teman. Review yang spesifik lebih membantu daripada komentar “kurang bagus”.",
          ),
          divider(),
        ],
      },
    ],
  },
];
