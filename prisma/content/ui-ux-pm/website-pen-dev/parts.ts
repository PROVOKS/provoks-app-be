import {
  callout,
  CoursePartDef,
  divider,
  h,
  p,
} from "../../helpers";
import { table } from "../table";

export const UIUX_WEBSITE_PENDEV_PARTS: CoursePartDef[] = [
  {
    name: "Fondasi & Referensi",
    description:
      "Memahami alasan membangun fondasi desain lebih dulu, alur kerja Pen.dev, dan cara mengumpulkan referensi.",
    lessons: [
      {
        title: "Mengapa Fondasi Dulu, Bukan Prompt Langsung",
        duration: 18,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Memahami alur kerja desain berbasis AI yang dimulai dari fondasi dan aturan visual, bukan dari prompt langsung ke halaman.</p>",
          ),
          h("1. Dua Pendekatan"),
          table(
            ["Jika langsung membuat halaman", "Jika membuat fondasi lebih dulu"],
            [
              [
                "Warna dan ukuran teks berubah-ubah.",
                "Semua halaman punya aturan visual yang sama.",
              ],
              [
                "Tombol atau card tiap halaman terlihat berbeda.",
                "Komponen dapat dipakai berulang kali.",
              ],
              [
                "AI bisa memilih gaya visual yang terlalu umum.",
                "Perubahan lebih mudah diterapkan.",
              ],
              [
                "Perubahan desain sulit dikendalikan.",
                "Hasil lebih terarah dan mudah dikembangkan.",
              ],
            ],
          ),
          h("2. Prinsip: Design First, Code After"),
          p(
            "<p>Tentukan aturan mainnya dahulu, baru mulai mendesain. AI dapat mempercepat proses, tetapi keputusan tentang warna, tipografi, jarak, dan komponen tetap perlu arahan manusia.</p>",
          ),
          callout(
            "info",
            "Fondasi yang baik membuat halaman berikutnya lebih cepat dibuat dan lebih konsisten. Jangan mulai dari halaman kosong tanpa aturan.",
          ),
          divider(),
        ],
      },
      {
        title: "Alur Kerja 7 Tahap",
        duration: 16,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengetahui urutan kerja dari menyiapkan file sampai melengkapi halaman lain.</p>",
          ),
          table(
            ["#", "Tahap", "Isi"],
            [
              ["1", "Setup", "Siapkan file dan Agent."],
              ["2", "Referensi", "Cari contoh desain."],
              ["3", "Foundation", "Buat aturan visual."],
              ["4", "Homepage", "Rancang halaman utama."],
              ["5", "Variasi", "Coba alternatif dan versi mobile."],
              ["6", "Components", "Buat komponen bersama."],
              ["7", "Lengkapi", "Desain halaman lain."],
            ],
          ),
          p(
            "<p>Setiap tahap menghasilkan sesuatu yang dipakai pada tahap berikutnya. Jangan melompat ke homepage sebelum fondasi visual selesai.</p>",
          ),
          callout(
            "warning",
            "Jika hasil AI terasa tidak konsisten, kembali ke design system dan periksa aturan warna, tipografi, jarak, serta komponen.",
          ),
          divider(),
        ],
      },
      {
        title: "Referensi Desain & Import ke Pen.dev",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Mengumpulkan referensi yang relevan dan memasukkannya ke kanvas Pen.dev untuk dipelajari, bukan disalin mentah.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Tools: <strong>Pen.dev</strong> dan browser. Siapkan akun Pen.dev yang diberikan mentor atau daftar sesuai panduan Pen.dev. Tidak perlu plugin tambahan. Perhatikan batas free plan, misalnya jumlah project atau fitur AI tertentu.</p>",
          ),
          p(
            "<p>Sumber referensi: <a href='https://saaspo.com'>SaaSpo</a> untuk inspirasi produk digital, <a href='https://mobbin.com'>Mobbin</a> untuk pola antarmuka nyata, dan <a href='https://x.ai'>x.ai</a> sebagai contoh gaya visual yang bersih.</p>",
          ),
          callout(
            "warning",
            "Gunakan referensi untuk mempelajari susunan, warna, tipografi, dan pola interaksi. Jangan menyalin tampilan secara utuh tanpa alasan dan tanpa memeriksa hak pakai.",
          ),
          h("1. Mencari Referensi"),
          p(
            "<ul><li>Pilih satu jenis produk yang dekat dengan ide website-mu.</li><li>Kumpulkan 2–3 referensi, bukan sepuluh.</li><li>Catat alasan memilih setiap referensi: layout, warna, atau pola interaksi.</li></ul>",
          ),
          h("2. Import ke Pen.dev"),
          p(
            "<ol><li>Buka browser bawaan Pen.dev.</li><li>Masukkan alamat website referensi, misalnya x.ai.</li><li>Atur ukuran tampilan ke Desktop.</li><li>Gunakan fitur Import untuk mengambil bagian tertentu, seperti navbar atau hero section.</li><li>Jika perlu, import seluruh halaman agar elemennya bisa dipelajari.</li><li>Tambahkan screenshot satu halaman penuh sebagai gambaran visual keseluruhan.</li></ol>",
          ),
          callout(
            "info",
            "Screenshot memberi AI gambaran visual yang utuh, sedangkan hasil import membantu melihat susunan elemen. Gunakan keduanya sebagai bahan belajar, bukan sebagai hasil akhir.",
          ),
          divider(),
        ],
      },
    ],
  },
  {
    name: "Homepage & Mobile",
    description:
      "Membangun design system foundation, merancang homepage, lalu membuat varian dan versi mobile.",
    lessons: [
      {
        title: "Design System Foundation",
        duration: 22,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat aturan visual dasar yang menjadi pedoman seluruh halaman website.</p>",
          ),
          h("1. Apa Itu Design System Foundation?"),
          p(
            "<p>Design system foundation adalah kumpulan aturan yang membuat semua bagian website terlihat seragam. Analoginya seperti panduan membangun rumah: ukuran, bahan, dan gaya ditentukan sebelum memasang pintu dan jendela.</p>",
          ),
          table(
            ["Komponen", "Isi"],
            [
              ["Color", "Warna utama dan pendukung."],
              ["Typography", "Jenis dan ukuran huruf."],
              ["Spacing", "Jarak antar-elemen."],
              ["Radius", "Tingkat lengkungan sudut."],
              ["Elevation", "Bayangan dan kedalaman."],
              ["Grid", "Aturan susunan layout."],
              ["Principles", "Prinsip desain yang diikuti."],
            ],
          ),
          h("Briefing Praktik"),
          p(
            "<p>Tools: <strong>Pen.dev</strong> yang sudah disiapkan. Tidak ada dependency baru. Buat satu set foundation sebelum membuat homepage; jangan mengubah-ubah warna dan font di tengah proses.</p>",
          ),
          h("3. Langkah Membuat Foundation"),
          p(
            "<ol><li>Tentukan satu warna utama dan satu warna netral.</li><li>Tentukan skala tipografi untuk judul, sub judul, dan isi.</li><li>Tentukan aturan jarak dan radius.</li><li>Tentukan grid dan prinsip visual.</li><li>Simpan foundation sebagai acuan di file Pen.dev.</li></ol>",
          ),
          callout(
            "warning",
            "Foundation bukan daftar gaya yang harus dihafal. Ia harus dipakai konsisten di homepage, halaman lain, dan komponen.",
          ),
          divider(),
        ],
      },
      {
        title: "Menyusun Homepage",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Merancang homepage pertama dengan fondasi yang sudah dibuat, lalu memeriksa hasil AI sebelum lanjut.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Tools: <strong>Pen.dev</strong> dengan design system foundation dari lesson sebelumnya. Tidak ada dependency baru. Pastikan frame foundation dipilih sebagai konteks sebelum meminta AI membuat halaman.</p>",
          ),
          h("1. Bagian Homepage"),
          table(
            ["Bagian", "Isi"],
            [
              [
                "Hero section",
                "Judul utama, penjelasan singkat, dan tombol tindakan.",
              ],
              [
                "Konten pendukung",
                "Pencapaian, produk, testimoni, tools, video, atau proyek.",
              ],
              [
                "Kontak / CTA",
                "Mengarahkan pengunjung untuk menghubungi atau melakukan tindakan.",
              ],
            ],
          ),
          h("2. Langkah Praktik"),
          p(
            "<ol><li>Pilih frame design system sebagai konteks.</li><li>Minta AI membuat satu halaman utama terlebih dahulu.</li><li>Periksa hierarki judul, tombol utama, dan jarak antar-section.</li><li>Pilih satu tema dulu, misalnya Light Mode.</li><li>Perbaiki bagian yang tidak sesuai fondasi sebelum menambah halaman.</li></ol>",
          ),
          callout(
            "info",
            "Untuk pemula, kerjakan homepage saja dan pilih satu tema. Fokus pada kualitas sebelum memperluas cakupan.",
          ),
          callout(
            "warning",
            "Jangan menerima hasil AI tanpa memeriksa kontras, ukuran teks, dan konsistensi tombol. AI membantu membuat variasi, bukan menggantikan keputusan desain.",
          ),
          divider(),
        ],
      },
      {
        title: "Varian Desain & Versi Mobile",
        duration: 20,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat alternatif layout dan versi mobile yang tetap nyaman digunakan, bukan sekadar diperkecil.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Tools: <strong>Pen.dev</strong> dan referensi tambahan dari Mobbin. Tidak ada dependency baru. Gunakan homepage yang sudah disetujui sebagai dasar.</p>",
          ),
          h("1. Membuat Varian"),
          p(
            "<ul><li>Kumpulkan referensi tambahan dari Mobbin.</li><li>Minta AI membuat alternatif layout.</li><li>Bandingkan hierarki, kepadatan konten, dan penempatan CTA.</li><li>Pilih satu varian dengan alasan yang jelas, bukan hanya karena terlihat berbeda.</li></ul>",
          ),
          h("2. Versi Mobile"),
          p(
            "<p>Setelah desain desktop disetujui, minta AI menyesuaikan layout untuk layar ponsel. Periksa ukuran teks, tombol, card, dan susunan konten.</p>",
          ),
          table(
            ["Desktop", "Mobile"],
            [
              ["Banyak kolom", "Satu kolom utama"],
              ["Navigasi horizontal", "Menu ringkas atau bottom navigation"],
              ["Konten lebar", "Konten dipotong atau diurutkan ulang"],
              ["CTA besar di samping", "CTA penuh lebar di bawah konten"],
            ],
          ),
          callout(
            "info",
            "Responsive design bukan hanya mengecilkan elemen. Susunan mungkin perlu diubah agar tetap nyaman digunakan di layar kecil.",
          ),
          divider(),
        ],
      },
    ],
  },
  {
    name: "Components & Tugas Akhir",
    description:
      "Membuat komponen reusable dan menyelesaikan tugas akhir website desktop serta mobile.",
    lessons: [
      {
        title: "Reusable Components & Tugas Akhir",
        duration: 24,
        blocks: [
          h("Tujuan Pembelajaran"),
          p(
            "<p>Membuat komponen yang dipakai berulang dan menyelesaikan tugas akhir website dengan fondasi yang konsisten.</p>",
          ),
          h("Briefing Praktik"),
          p(
            "<p>Tools: <strong>Pen.dev</strong> dengan project yang sudah dibuat. Tidak ada dependency baru. Gunakan design system, homepage, dan versi mobile dari lesson sebelumnya.</p>",
          ),
          h("1. Reusable Components"),
          p(
            "<p>Komponen adalah elemen desain yang dibuat sekali lalu dipakai kembali di banyak halaman. Analoginya seperti cetakan kue: bentuk dan ukurannya sama, isinya bisa berbeda.</p>",
          ),
          table(
            ["Komponen", "Fungsi"],
            [
              ["Button", "Tombol dengan gaya dan ukuran yang sama."],
              ["Navigation bar", "Navigasi utama yang konsisten di setiap halaman."],
              ["Card & input", "Kotak informasi dan kolom isian dengan aturan visual seragam."],
            ],
          ),
          h("2. Kesimpulan"),
          p(
            "<p>Bangun fondasi desain, baru bangun websitenya. AI dapat mempercepat proses desain, tetapi hasil yang baik tetap membutuhkan arahan, referensi, pemeriksaan, dan keputusan manusia.</p>",
          ),
          p(
            "<p><code>Design system → Pages → Components → Code</code></p>",
          ),
          h("3. Tugas Akhir"),
          p(
            "<ol><li>Pilih satu website referensi.</li><li>Buat design system foundation dengan tujuh komponen: color, typography, spacing, radius, elevation, grid, dan principles.</li><li>Buat satu homepage versi desktop.</li><li>Buat satu homepage versi mobile.</li><li>Pastikan button, navigation bar, dan card memakai komponen yang konsisten.</li><li>Kumpulkan link project Pen.dev untuk direview mentor.</li></ol>",
          ),
          h("4. Checklist Penilaian"),
          table(
            ["Aspek", "Pertanyaan Review"],
            [
              ["Fondasi", "Apakah tujuh komponen design system terdokumentasi dan dipakai?"],
              ["Homepage", "Apakah hero, konten pendukung, dan CTA jelas?"],
              ["Mobile", "Apakah susunan berubah sesuai layar, bukan hanya diperkecil?"],
              ["Komponen", "Apakah button, navbar, card, dan input konsisten?"],
              ["Referensi", "Apakah referensi dipelajari, bukan disalin mentah?"],
            ],
          ),
          callout(
            "success",
            "Tugas akhir: serahkan link Pen.dev berisi design system foundation, homepage desktop, homepage mobile, dan komponen reusable.",
          ),
          divider(),
        ],
      },
    ],
  },
];
