# Ruang Riset Fisika Kuantum — situs pribadi (GitHub-only)

Situs statis untuk memamerkan progress penelitian, progress harian, paper,
komputasi, catatan kuliah, catatan mengajar, dan buku — dengan panel admin
untuk upload konten, dan halaman publik untuk membaca/mengunduh. Semua
di-host lewat **GitHub Pages**, tanpa server tambahan.

## Cara kerja singkat

- **Publik**: setiap halaman (`research.html`, `papers.html`, dst.) membaca
  file `data/<kategori>.json` langsung dari repo dan menampilkannya sebagai
  daftar entri, lengkap tombol **Lihat** dan **Unduh** yang mengarah ke file
  di folder `uploads/`.
- **Admin** (`admin.html`): Anda "login" memakai **GitHub Personal Access
  Token (PAT)**. Token dipakai browser Anda untuk memanggil GitHub API dan
  langsung commit perubahan (tambah entri baru, upload file, hapus entri)
  ke repo ini.
- Tidak ada database maupun server — repo GitHub Anda **adalah**
  databasenya.

## ⚠️ Penting soal privasi

GitHub Pages gratis mengharuskan repo bersifat **publik**. Artinya semua
file yang Anda upload otomatis bisa dilihat siapa pun yang tahu URL-nya —
ini memang sesuai kebutuhan Anda (pembaca boleh lihat & unduh). Tapi
konsekuensinya:

- Jangan upload dokumen yang belum siap dipublikasikan.
- Token PAT **jangan pernah** dicommit ke repo. Situs ini sudah didesain
  supaya token hanya tersimpan di `sessionStorage` browser (hilang saat tab
  ditutup) dan tidak pernah ditulis ke file apa pun.
- Jika suatu saat perlu benar-benar privat, opsi ke depan adalah memakai
  repo privat + GitHub Pro/Team (Pages di repo privat butuh paket
  berbayar), di luar cakupan setup ini.

## Langkah setup (sekali saja)

1. **Buat repo baru** di GitHub, misal `situs-riset-kuantum`. Bisa lewat
   web GitHub atau `git init` dari folder ini.
2. **Unggah semua file di folder ini** ke repo tersebut (root repo, bukan
   di dalam subfolder), lalu push ke branch `main`.
3. **Aktifkan GitHub Pages**: buka *Settings → Pages* pada repo → *Build
   and deployment* → Source: **Deploy from a branch** → Branch: `main`,
   folder `/ (root)` → Save. Tunggu 1–2 menit, situs akan tersedia di
   `https://<username-anda>.github.io/<nama-repo>/`.
4. **Edit `assets/js/config.js`**: isi `owner` dengan username GitHub
   Anda, `repo` dengan nama repo, lalu commit. Sesuaikan juga bagian
   `SITE_PROFILE` (nama, afiliasi IPB, kerja sama BRIN, bio) sesuai
   identitas Anda.
5. **Buat Personal Access Token** untuk login admin:
   - Buka [GitHub → Settings → Developer settings → Fine-grained tokens](https://github.com/settings/tokens?type=beta).
   - *Generate new token* → beri nama, atur masa berlaku.
   - *Repository access* → pilih **Only select repositories** → pilih repo
     situs ini.
   - *Permissions* → **Repository permissions** → **Contents** → set ke
     **Read and write**.
   - Generate, lalu **simpan token di tempat aman** (mis. password
     manager) — token hanya ditampilkan sekali.
6. Buka `https://<username-anda>.github.io/<nama-repo>/admin.html`,
   tempelkan token, klik **Masuk**. Anda siap menambah konten.

## Struktur folder

```
index.html               ← beranda publik
research.html, daily.html, papers.html, computation.html,
lecture-notes.html, teaching-notes.html, books.html   ← 7 halaman kategori
admin.html                ← panel admin (login token + kelola konten)
assets/css/style.css      ← semua styling
assets/js/config.js       ← ISI INI: username GitHub, nama repo, profil Anda
assets/js/common.js       ← navigasi & footer bersama
assets/js/github-api.js   ← pemanggilan GitHub API dari admin panel
assets/js/public-list.js  ← render daftar entri di halaman publik
data/*.json                ← manifest tiap kategori (dikelola otomatis lewat admin)
uploads/                   ← file yang Anda upload akan tersimpan di sini per kategori
```

## Menambah / menghapus konten

Semua dilakukan dari `admin.html`, tidak perlu menyentuh kode:
- Pilih kategori di tab atas.
- Isi judul, tanggal, deskripsi, tag, dan (opsional) file untuk diunggah.
- Klik **Simpan & Publikasikan** — ini membuat 1–2 commit langsung ke repo
  Anda (upload file + update manifest JSON).
- Perubahan biasanya tampil di halaman publik dalam beberapa detik hingga
  1 menit setelah GitHub Pages membangun ulang situs.

## Menjalankan pratinjau lokal (opsional)

Karena situs ini statis, cukup buka `index.html` di browser, atau jalankan
server lokal sederhana:

```bash
python3 -m http.server 8000
```

lalu buka `http://localhost:8000`. Catatan: halaman publik tetap mengambil
data dari `raw.githubusercontent.com`, jadi pratinjau lokal baru
menampilkan data setelah Anda push ke GitHub minimal satu kali.
