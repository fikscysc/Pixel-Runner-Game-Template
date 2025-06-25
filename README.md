# Pixel Runner Game 🏃💨

**[🎮 Mainkan Gamenya di Sini! 🎮](https://pixel-runner-game.vercel.app/)**

Selamat datang di Pixel Runner, sebuah game *endless runner* yang dibuat dengan HTML, CSS, dan JavaScript murni. Proyek ini adalah sebuah perjalanan pengembangan, mulai dari kanvas kosong hingga menjadi aplikasi web penuh dengan backend, leaderboard online, dan desain yang responsif.

## ✨ Fitur Utama

* **Gameplay Klasik:** Lompat untuk menghindari rintangan pohon yang muncul secara dinamis.
* **Grafis Pixel Art:** Semua elemen visual, mulai dari pemain hingga lingkungan, digambar langsung menggunakan HTML5 Canvas.
* **Siklus Siang-Malam:** Latar belakang langit berubah secara indah dari siang, sore, malam, hingga pagi berdasarkan skor pemain.
* **Efek Visual Modern:** Menampilkan langit dengan gradien halus, awan bergerak dengan efek parallax, matahari/bulan, dan layar Game Over yang dramatis.
* **Leaderboard Online:** Terhubung dengan Google Sheets sebagai database untuk menampilkan 10 skor tertinggi dari semua pemain.
* **Backend Aman:** Menggunakan Vercel Serverless Function sebagai "Penjaga Gerbang" (proxy) untuk melindungi URL Google Apps Script dan Kunci API.
* **Desain Responsif:** Tata letak yang menyesuaikan diri untuk pengalaman bermain yang optimal di desktop maupun perangkat mobile.
* **Efek Suara & Musik:** Dilengkapi dengan musik latar dan efek suara untuk lompatan dan game over.

## 🛠️ Teknologi yang Digunakan

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend & Database:** Google Sheets + Google Apps Script
* **Deployment & Hosting:** GitHub + Vercel

## 📁 Struktur Folder

Berikut adalah struktur folder untuk proyek ini:

/
├── 📄 index.html        (Struktur utama halaman web)
├── 📄 style.css         (Semua gaya visual dan animasi)
├── 📄 script.js         (Logika inti game dan interaksi frontend)
├── 📄 package.json      (Manifest proyek untuk Vercel)
├── 📁 api/
│   └── 📄 submit-score.js (Backend "Penjaga Gerbang" yang berjalan di Vercel)
│
└── 📁 macro-App-Script/
└── 📄 Code.gs (Code untuk app script)
## 🚀 Panduan Instalasi & Setup

Ingin menjalankan versi Anda sendiri dari game ini? Ikuti langkah-langkah berikut:

### Bagian 1: Backend (Google Sheets & Apps Script)

1.  **Buat Google Sheet:** Buat spreadsheet baru. Di dalamnya, buat sebuah tab (sheet) dan beri nama `Skor`. Buat tiga judul kolom di baris pertama: `Timestamp`, `Nama Pemain`, `Skor Tertinggi`.
2.  **Buat Apps Script:** Buka **Ekstensi > Apps Script**. Hapus kode contoh dan salin semua kode dari file [macro-App-Script/Code.gs](./macro-App-Script/Code.gs) ke dalamnya.
3.  **Atur Kunci Rahasia:** Di dalam kode Apps Script yang baru saja Anda tempel, ganti nilai `SECRET_KEY` dengan kunci rahasia unik buatan Anda sendiri.
4.  **Deploy Web App:**
    * Klik **Deploy > New deployment**.
    * Atur konfigurasinya: **Type** ke `Web app`, **Execute as** ke `Me`, dan **Who has access** ke `Anyone`.
    * Klik **Deploy** dan **salin URL Web App (`.../exec`)** yang muncul. Simpan baik-baik.
5.  **(Opsional) Atur Trigger Harian:** Di menu Apps Script, buka bagian **Triggers** (ikon jam) dan atur trigger berbasis waktu (`Time-driven`) untuk menjalankan fungsi `resetSkorHarian` setiap tengah malam.

### Bagian 2: Frontend (GitHub & Vercel)

1.  **Fork atau Gunakan Template Ini:** Klik tombol **"Use this template"** di bagian atas repository GitHub ini untuk membuat salinan di akun Anda.
2.  **Hubungkan ke Vercel:** Buka [Vercel](https://vercel.com), login dengan akun GitHub Anda, dan impor repository yang baru saja Anda buat.
3.  **Atur Environment Variables:** Di pengaturan proyek Vercel, buka bagian **Environment Variables** dan tambahkan dua rahasia:
    * `GOOGLE_SCRIPT_URL`: Isi dengan URL Web App dari Langkah 1.4.
    * `API_SECRET_KEY`: Isi dengan Kunci Rahasia yang Anda buat di Langkah 1.3.
4.  **Deploy:** Klik tombol **Deploy**. Vercel akan membangun proyek Anda dan memberikan URL live.

## 🎮 Cara Bermain

1.  Buka link game yang sudah di-deploy.
2.  Masukkan nama Anda di jendela yang muncul.
3.  Klik "Mulai Main".
4.  Gunakan **Spasi / Klik Kiri / Sentuhan Layar** untuk melompat dan menghindari pohon.
5.  Capai skor setinggi-tingginya!

---

Terima kasih telah mengunjungi proyek ini. Semoga bisa menjadi inspirasi!
