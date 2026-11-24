import {
  callout,
  code,
  CoursePartDef,
  divider,
  h,
  p,
} from "../../helpers";
import { table } from "../table";

export const UIUX_INFORMATION_ARCHITECTURE_PARTS: CoursePartDef[] = [
  {
    name: "Dasar UI/UX & Fitur Umum",
    description:
      "Memahami posisi UI/UX dalam tim, perbedaan UI dan UX, serta fitur dan komponen yang sering dipakai.",
    lessons: [
      {
        title: "Dari PM ke UI/UX",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Setelah mempelajari materi ini, peserta memahami posisi UI/UX dalam tim produk dan tahu apa yang perlu diserahkan ke developer.</p>",
          ),
          h("1. Posisi UI/UX dalam Tim"),
          p(
            "<p>Product Manager (PM) merumuskan masalah dan prioritas fitur. UI/UX kemudian menata isi aplikasi, merancang alur pengguna, dan membuat sketsa layar. Hasilnya dipakai developer sebagai acuan membangun produk.</p>",
          ),
          table(
            ["Tahap", "Isi"],
            [
              [
                "Dari PM",
                "Problem statement dan fitur <em>Must Have</em>, misalnya login dan logout.",
              ],
              [
                "Kerja UI/UX",
                "Menata isi aplikasi, menggambar alur pengguna, dan membuat sketsa tiap layar.",
              ],
              [
                "Hasil",
                "User flow dan wireframe 3–4 layar yang siap dibaca developer.",
              ],
            ],
          ),
          h("2. UI dan UX: Dua Hal yang Berbeda"),
          table(
            ["Aspek", "User Interface (UI)", "User Experience (UX)"],
            [
              [
                "Fokus",
                "Tampilan yang dilihat dan disentuh: tombol, warna, teks, gambar.",
                "Pengalaman pengguna: apakah alurnya mudah, jelas, dan tidak membingungkan.",
              ],
              [
                "Pertanyaan kunci",
                "Apakah layar ini terlihat jelas dan konsisten?",
                "Apakah pengguna bisa mencapai tujuannya tanpa hambatan?",
              ],
              [
                "Contoh",
                "Warna tombol, ukuran huruf, jarak antar-elemen.",
                "Urutan layar login, pesan error, dan kemudahan menemukan fitur.",
              ],
            ],
          ),
          h("3. Alur Kerja UI/UX"),
          p(
            "<ol><li><strong>Riset</strong> — dikerjakan PM: memahami masalah dan pengguna.</li><li><strong>Information Architecture</strong> — menata isi dan fitur.</li><li><strong>User flow</strong> — menggambar jalur pengguna.</li><li><strong>Wireframe</strong> — sketsa susunan tiap layar.</li><li><strong>Mockup</strong> — menambah warna dan gaya visual.</li><li><strong>Prototype</strong> — layar dibuat bisa diklik.</li></ol>",
          ),
          callout(
            "info",
            "Course ini fokus ke Information Architecture, User Flow, Low-Fidelity, High-Fidelity di Figma, lalu membuat website dengan Pen.dev.",
          ),
          divider(),
        ],
      },
      {
        title: "Fitur Umum & Komponen UI",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengenali fitur yang sering muncul di aplikasi mobile dan web, komponen UI dasar, serta perbedaan pola tata letak keduanya.</p>",
          ),
          h("1. Fitur Umum di Mobile dan Web"),
          p(
            "<ol><li>Login dan daftar.</li><li>Pencarian.</li><li>Navigasi.</li><li>Form.</li><li>Notifikasi.</li><li>Profil.</li></ol>",
          ),
          h("2. Komponen UI Dasar"),
          p(
            "<ul><li><strong>Button</strong> — aksi utama, misalnya tombol Masuk.</li><li><strong>Input field</strong> — kolom isian teks.</li><li><strong>Card</strong> — kotak berisi ringkasan informasi.</li></ul>",
          ),
          p(
            "<p>Contoh layar <em>Masuk</em>: judul, teks pendamping (“Silakan masuk ke akun kamu”), kolom Email, kolom Password, dan tombol Masuk.</p>",
          ),
          code(
            `
+------------------------------+
|            Masuk             |
| Silakan masuk ke akun kamu   |
|                              |
| [ Email                    ] |
| [ Password                 ] |
|                              |
| [          Masuk           ] |
+------------------------------+
`,
            "markdown",
          ),
          callout(
            "info",
            "Wireframe di atas hanya contoh susunan. Fokusnya adalah urutan informasi dan aksi, bukan warna atau detail visual.",
          ),
          h("3. Pola Mobile vs Web"),
          table(
            ["Aspek", "Aplikasi Mobile", "Website"],
            [
              [
                "Layar",
                "Sempit, umumnya satu kolom.",
                "Lebar, bisa banyak kolom.",
              ],
              [
                "Menu",
                "Di bawah (bottom navigation) agar terjangkau jempol, maksimal 5 menu.",
                "Di atas (navbar) atau di samping (sidebar).",
              ],
              [
                "Isi",
                "Lebih ringkas dan fokus ke aksi utama.",
                "Bisa menampilkan lebih banyak informasi sekaligus.",
              ],
            ],
          ),
          callout(
            "success",
            "Latihan observasi: buka satu aplikasi favoritmu. Catat 3 fitur utama, 3 komponen UI yang terlihat, dan letak navigasinya.",
          ),
          divider(),
        ],
      },
    ],
  },
  {
    name: "Information Architecture & User Flow",
    description:
      "Menata isi aplikasi dengan IA dan menggambar jalur pengguna dengan user flow.",
    lessons: [
      {
        title: "Information Architecture",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami cara mengelompokkan dan menamai fitur agar mudah ditemukan, lalu menyusun IA sederhana untuk satu aplikasi.</p>",
          ),
          h("1. Apa Itu Information Architecture?"),
          p(
            "<p><strong>Information Architecture (IA)</strong> adalah cara fitur dikelompokkan dan diberi nama agar mudah dicari. Analoginya seperti denah rumah sebelum dibangun: kamu menentukan ruang apa saja yang ada dan di mana letaknya.</p>",
          ),
          h("2. Contoh IA: Aplikasi Belajar Tutor"),
          table(
            ["Beranda", "Chat", "Profil"],
            [
              ["Cari tutor", "Daftar percakapan", "Login dan akun"],
              ["Pilih mata pelajaran", "Chat dengan tutor", "Riwayat belajar"],
            ],
          ),
          h("3. Cara Menyusun IA"),
          p(
            "<ol><li>Daftar semua fitur dan konten yang dibutuhkan.</li><li>Kelompokkan fitur yang saling berhubungan.</li><li>Beri nama yang jelas dan mudah dipahami pengguna.</li><li>Batasi menu utama agar tidak terlalu banyak; untuk mobile, maksimal 5 menu.</li></ol>",
          ),
          callout(
            "warning",
            "Nama menu yang terlalu teknis atau terlalu mirip satu sama lain membuat pengguna ragu. Uji nama menu dengan orang lain sebelum dipakai.",
          ),
          callout(
            "success",
            "Latihan 1: susun IA untuk aplikasi pilihanmu dengan maksimal 5 menu utama. Jelaskan isi setiap menu dalam satu baris.",
          ),
          divider(),
        ],
      },
      {
        title: "User Flow",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Menggambar jalur pengguna dari awal sampai tujuan, termasuk alur alternatif dan alur error.</p>",
          ),
          h("1. Apa Itu User Flow?"),
          p(
            "<p><strong>User flow</strong> adalah jalur pengguna menuju tujuannya. Contoh tujuan “berkonsultasi dengan tutor”: <code>Buka aplikasi → Login → Beranda → Pilih tutor → Chat</code>.</p>",
          ),
          h("2. Tiga Jenis User Flow"),
          table(
            ["Jenis", "Penjelasan", "Contoh"],
            [
              [
                "<strong>Primary flow</strong>",
                "Jalur standar yang paling lurus dan sukses.",
                "Siapkan perlengkapan → naik motor → tiba di kampus.",
              ],
              [
                "<strong>Alternative flow</strong>",
                "Cabang lain yang tetap mencapai tujuan.",
                "Motor tidak tersedia → pesan ojek online → tiba.",
              ],
              [
                "<strong>Error flow</strong>",
                "Jalur saat terjadi kondisi tidak normal atau gagal.",
                "Motor bermasalah → menepi dengan aman → pesan ojek online → tiba.",
              ],
            ],
          ),
          h("3. Simbol Dasar User Flow"),
          table(
            ["Simbol", "Fungsi"],
            [
              ["Flow direction (garis)", "Menghubungkan simbol satu dengan lainnya."],
              ["Terminator (oval)", "Awal (start) atau akhir (stop) kegiatan."],
              ["Processing (persegi)", "Pengolahan yang dilakukan komputer."],
              ["Decision (belah ketupat)", "Pemilihan proses berdasarkan kondisi."],
              ["Input-Output (jajar genjang)", "Proses input dan output."],
              ["Connector", "Menyambungkan proses dalam halaman yang sama atau berbeda."],
            ],
          ),
          callout(
            "info",
            "Slide asli memuat simbol tambahan seperti manual input, preparation, predefined process, dan display. Gunakan sesuai kebutuhan diagram.",
          ),
          callout(
            "success",
            "Latihan 2: buat primary flow login dan logout, lalu tambahkan satu error flow (misalnya password salah). Tandai start, keputusan, dan end.",
          ),
          divider(),
        ],
      },
    ],
  },
  {
    name: "Low-Fidelity & Praktik",
    description:
      "Membuat wireframe low-fidelity sederhana lalu mempraktikkan IA, user flow, dan wireframe di Figma.",
    lessons: [
      {
        title: "Low-Fidelity Wireframe",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat sketsa awal layar yang fokus pada alur dan susunan, bukan pada warna atau detail visual.</p>",
          ),
          h("1. Apa Itu Low-Fidelity?"),
          p(
            "<p><strong>Low-fidelity</strong> adalah representasi atau rancangan awal yang sederhana, kasar, dan berpresisi rendah. Biasanya berupa kotak dan garis hitam putih yang berfokus pada alur dan susunan layar.</p>",
          ),
          h("2. Isi Wireframe dari Sebuah Flow"),
          table(
            ["Elemen", "Fungsi"],
            [
              ["Judul layar", "Pengguna tahu sedang berada di mana."],
              ["Konten utama", "Informasi yang dicari pengguna."],
              ["Aksi utama", "Satu tombol penting per layar."],
              ["Navigasi", "Cara pindah ke layar lain."],
            ],
          ),
          h("3. Contoh Wireframe"),
          code(
            `
+----------------------------------+
| < Kembali        Detail Tutor    |
+----------------------------------+
| [ Foto Tutor                   ] |
| Nama Tutor                       |
| Mata Pelajaran                   |
| Rating                           |
|                                  |
| [       Mulai Chat             ] |
+----------------------------------+
| Beranda | Chat | Profil          |
+----------------------------------+
`,
            "markdown",
          ),
          h("4. Prinsip Low-Fidelity"),
          p(
            "<ul><li>Fokus ke struktur dan alur, bukan estetika.</li><li>Gunakan satu aksi utama per layar.</li><li>Pastikan navigasi kembali dan lanjut jelas.</li><li>Buat versi mobile dan web jika produk mendukung keduanya.</li></ul>",
          ),
          callout(
            "warning",
            "Jangan menghabiskan waktu memilih warna atau font di tahap low-fidelity. Perbaiki alurnya dulu sebelum masuk ke high-fidelity.",
          ),
          divider(),
        ],
      },
      {
        title: "Praktik: IA, User Flow & Wireframe di Figma",
        duration: 28,
        blocks: [
          h("Tujuan Praktik"),
          p(
            "<p>Menyusun IA, user flow, dan wireframe low-fidelity 3–4 layar di Figma berdasarkan alur login dan logout.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Tools yang dibutuhkan: <strong>akun Figma gratis</strong> dan browser atau aplikasi Figma Desktop. Tidak perlu plugin berbayar. File praktik memakai satu file bernama <code>Latihan UI-UX</code> dengan halaman terpisah.</p>",
          ),
          code(
            `
Figma file: Latihan UI-UX
├─ 01-IA
├─ 02-User Flow
└─ 03-Wireframe
`,
            "markdown",
          ),
          callout(
            "info",
            "Buat akun di figma.com, lalu buat file baru. Figma menyimpan perubahan otomatis; beri nama file dan halaman agar mudah dicari.",
          ),
          h("1. Latihan IA"),
          p(
            "<p>Di halaman <code>01-IA</code>, buat daftar menu utama (maksimal 5) untuk aplikasi pilihanmu. Gunakan teks dan kotak sederhana. Setiap menu dijelaskan dalam satu baris.</p>",
          ),
          h("2. Latihan User Flow"),
          p(
            "<p>Di halaman <code>02-User Flow</code>, gambar primary flow login dan logout. Tambahkan satu error flow, misalnya password salah. Gunakan bentuk oval untuk start/end, persegi untuk proses, dan belah ketupat untuk keputusan.</p>",
          ),
          h("3. Wireframe Low-Fidelity"),
          p(
            "<p>Di halaman <code>03-Wireframe</code>, buat 3–4 frame layar. Gunakan frame berukuran 390 × 844 untuk mobile atau 1440 × 1024 untuk web. Cukup gunakan rectangle, text, dan garis; belum perlu warna.</p>",
          ),
          p(
            "<p>Setiap layar wajib memuat judul layar, konten utama, satu aksi utama, dan navigasi. Contoh urutan: Login → Beranda → Detail Tutor → Chat.</p>",
          ),
          h("4. Checklist Praktik"),
          p(
            "<ul><li>IA maksimal 5 menu dan mudah dipahami.</li><li>Primary flow dan error flow tergambar jelas.</li><li>3–4 wireframe sesuai alur.</li><li>Satu aksi utama per layar.</li><li>Navigasi antar-layar terlihat.</li></ul>",
          ),
          callout(
            "warning",
            "Jika frame sulit dipindah, pastikan kamu memilih frame, bukan grup. Jika teks tidak muncul, periksa layer dan urutan tumpukan.",
          ),
          callout(
            "success",
            "Tugas akhir modul: kumpulkan link file Figma berisi IA, user flow, dan wireframe low-fidelity untuk direview mentor.",
          ),
          divider(),
        ],
      },
    ],
  },
];
