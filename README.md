# 📝 Web Task Manager

Aplikasi manajemen tugas (Task Manager) sederhana berbasis web yang dilengkapi dengan penentuan *deadline*, indikator warna prioritas, serta pengurutan tugas otomatis. 

Proyek ini dibangun menggunakan pendekatan **Vibe Coding** dengan memanfaatkan file `agent.md` sebagai panduan aturan koding (*system prompt* lokal) untuk AI Agent (Kilo Code di VS Code).

---

## 📌 1. Kebutuhan (Requirements)

### Prasyarat Sistem
* **Browser:** Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari versi terbaru.

### Fitur Utama
* **CRUD Task:** Menambah, melihat, menandai selesai, dan menghapus tugas.
* **Deadline & Categorization:** Setiap tugas memiliki tenggat waktu (*date*) dan kategori (Pribadi, Kerja, Kuliah).
* **Automatic Sorting:** Tugas diurutkan otomatis berdasarkan *deadline* terdekat. Tugas yang sudah selesai akan berpindah ke bagian paling bawah.
* **Visual Status Indicator:**
  * 🔴 **Merah:** *Deadline* hari ini atau sudah lewat (*overdue*).
  * 🟡 **Kuning/Orange:** *Deadline* mendesak (H-1 / H-2).
  * ⚪ **Abu-abu:** *Deadline* masih lama.
* **Filter Status:** Memfilter tampilan tugas berdasarkan tab (Semua, Aktif, Selesai).
* **Data Persistence:** Menggunakan browser `localStorage`, sehingga data tersimpan di perangkat lokal tanpa perlu *database* server.

---

## 🚀 2. Cara Menjalankan Aplikasi
🔗 **Buka Di Browser:** [https://web-task-manager-five.vercel.app/]