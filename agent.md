# Agent Guidelines - Web Task Manager (SPA)

Pedoman ketat untuk pengembangan aplikasi Web Task Manager berbasis Single Page Application.

## Tech Stack

- **HTML5**: Struktur markup standar, semantic tags.
- **CSS**: Tailwind CSS (via CDN) untuk styling modern, bersih, dan responsif.
- **JavaScript**: Vanilla JavaScript (ES6+), tanpa framework eksternal.

## Data Scheme

Setiap tugas (task) HARUS berupa objek JavaScript dengan properti-properti berikut:

| Properti      | Tipe data | Keterangan                                  |
|---------------|-----------|---------------------------------------------|
| `id`          | string    | Timestamp/unique ID                         |
| `title`       | string    | Judul / deskripsi singkat tugas             |
| `category`    | string    | Kategori tugas: `'Pribadi'`, `'Kerja'`, `'Kuliah'` |
| `deadline`    | string    | Tanggal deadline dalam format `YYYY-MM-DD`  |
| `completed`   | boolean   | Status penyelesaian tugas (`true`/`false`)  |
| `created_at`  | string    | Tanggal pembuatan dalam format tanggal lokal |

### Contoh objek tugas:
```json
{
  "id": "1698278400000-abc123",
  "title": "Membuat laporan bulanan",
  "category": "Kerja",
  "deadline": "2023-10-30",
  "completed": false,
  "created_at": "27/10/2023 14:30:00"
}
```

## Storage

- Gunakan **`localStorage`** browser untuk persistensi data.
- **WAJIB** membuat **fungsi helper terpisah** untuk operasi baca/tulis ke `localStorage`.
- Key untuk menyimpan seluruh tugas: `tasks`.
- Format penyimpanan: JSON string (gunakan `JSON.stringify` dan `JSON.parse`).
- **Aturan:**
  - Buat fungsi `saveTasks(tasks)` untuk menulis array tugas ke `localStorage`.
  - Buat fungsi `getTasks()` untuk membaca dan mem-parsing array tugas dari `localStorage`.
  - Jika `localStorage` kosong atau belum pernah di-set, `getTasks()` HARUS mengembalikan array kosong `[]`.
  - Seluruh operasi CRUD (tambah, ubah status, hapus, filter) HARUS melewati helper ini.

## UI / UX Guidelines

### Desain Umum
- Tampilan **modern, bersih, dan responsif** menggunakan Tailwind CSS.
- Warna latar belakang yang nyaman, kartu tugas dengan bayangan (shadow), dan efek hover.
- Layout harus responsif untuk desktop dan mobile.

### Fitur Filter Tab
- Sediakan **tiga tab filter**:
  1. **Semua** - Menampilkan semua tugas.
  2. **Aktif** - Menampilkan hanya tugas yang belum selesai (`completed === false`).
  3. **Selesai** - Menampilkan hanya tugas yang sudah selesai (`completed === true`).
- Tab aktif HARUS memiliki gaya yang jelas (warna berbeda / border bawah tebal).
- Klik pada tab HARUS mem-filter tampilan tugas secara instan.

### Deadline
- Sediakan **input tanggal** (`<input type="date">`) pada form penambahan tugas di `index.html`.
- Setiap kartu tugas HARUS menampilkan informasi deadline.
- Berikan **indikator warna** pada tanggal deadline:
  * **Merah**: Deadline hari ini atau sudah lewat (overdue).
  * **Kuning/Orange**: Deadline H-1 atau H-2 (dekat).
  * **Abu-abu/Netral**: Deadline masih jauh (lebih dari 2 hari).
- Format tampilan tanggal deadline pada kartu: `DD/MM/YYYY`.

### Logika Pengurutan (Sorting)
- Urutkan array tugas secara otomatis berdasarkan tanggal `deadline` terdekat (ascending).
- Tugas yang belum selesai (`completed === false`) HARUS berada di atas.
- Tugas yang sudah selesai (`completed === true`) HARUS berada di bagian paling bawah.
- Terapkan aturan ini setelah setiap perubahan data (tambah/ubah/hapus).

### Statistik Ringkas
- Tampilkan statistik sederhana di bagian atas atau bawah:
  - **Total tugas** (jumlah semua tugas).
  - **Tugas selesai** (jumlah tugas dengan `completed === true`).
- Statistik HARUS diperbarui otomatis setiap kali ada perubahan pada tugas.

### Feedback Visual (Umpan Balik)
- Saat tugas dicentang (di-mark sebagai selesai):
  - Teks tugas HARUS memadat (line-through) dan berwarna abu-abu.
  - Berikan animasi transisi halus (durasi ~300ms).
- Saat tugas dihapus:
  - Tampilkan animasi hapus (misal: fade out / slide out) sebelum dihapus dari DOM.
  - Berikan notifikasi toast atau alert ringan yang memberi tahu tugas telah dihapus.
- Semua interaksi pengguna (tambah, centang, hapus, filter) HARUS memberikan umpan balik visual.

## Code Structure

| File         | Tanggung Jawab                                              |
|--------------|-------------------------------------------------------------|
| `index.html` | Struktur markup UI dan peng-load Tailwind CSS via CDN       |
| `app.js`     | Logika DOM manipulation, event handler, dan localStorage management |

### `index.html`
- Gunakan struktur HTML5 yang semantik (`<!DOCTYPE html>`, `<header>`, `<main>`, `<section>`, `<footer>`).
- Load Tailwind CSS via CDN:
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  ```
- Sertakan file `app.js` di bagian akhir `<body>` dengan atribut `defer`.
  - Buat elemen-elemen berikut:
    - Form input untuk judul, kategori, dan deadline (tanggal) tugas baru.
    - Tombol atau ikon untuk menambah tugas.
    - Kontainer daftar tugas.
    - Tab filter ('Semua', 'Aktif', 'Selesai').
    - Elemen statistik (total tugas, tugas selesai).
    - Tempat untuk notifikasi toast (feedback).

### `app.js`
- Gunakan **Immediate Invoked Function Expression (IIFE)** atau **module pattern** untuk menghindari poluting global scope.
- Inisialisasi aplikasi ketika DOM siap (`DOMContentLoaded`).
- **Aturan kode:**
  - Semua fungsi HARUS dideklarasikan dengan jelas dan memiliki tanggung jawab tunggal (Single Responsibility Principle).
  - Gunakan `const` dan `let`, jauhkan dari `var`.
  - Seluruh listener event HARUS menggunakan `addEventListener` (bukan inline onclick).
  - Manipulasi DOM HARUS menggunakan `document.querySelector` atau `document.getElementById`.
  - Setiap perubahan data (tambah/ubah/hapus) HARUS langsngi me-update localStorage melalui helper.
  - Render tugas HARUS dilakukan dari array tugas yang ada, bukan menambah elemen secara manual tanpa konsistensi data.

## Validation & Testing

- Pastikan tidak ada bug saat:
  - Menambahkan tugas baru.
  - Mengubah status selesai (centang / uncentang).
  - Memfilter tugas melalui tab.
  - Menghapus tugas.
- Data tugas HARUS persisten setelah halaman di-refresh (menggunakan `localStorage`).
