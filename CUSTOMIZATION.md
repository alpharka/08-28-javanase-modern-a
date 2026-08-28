# Panduan Customization Undangan Digital

Dokumen ini menjelaskan cara mengubah isi, tampilan, media, dan perilaku undangan digital. Website menggunakan React + TypeScript + Vite. Sebagian besar perubahan sehari-hari cukup dilakukan pada `client/src/pages/Home.tsx` dan `client/src/index.css`.

> **Catatan penting:** Isi pada `CONFIG`, galeri, dan URL acara saat ini masih berupa data contoh. Ganti seluruh data contoh sebelum undangan dibagikan.

## 1. Menjalankan proyek

Pastikan Node.js dan pnpm tersedia, lalu jalankan perintah berikut dari root repository:

```bash
pnpm install
pnpm dev
```

Untuk pemeriksaan TypeScript dan production build:

```bash
pnpm check
pnpm build
```

Website berjalan di alamat lokal yang ditampilkan Vite. Jangan mengubah folder `server/` untuk kebutuhan customization frontend biasa.

## 2. Mengubah data pasangan dan acara

Semua data utama berada pada objek `CONFIG` di bagian atas `client/src/pages/Home.tsx`.

| Properti | Kegunaan | Contoh format |
| --- | --- | --- |
| `couple` | Nama pasangan | `"Ayu & Raka"` |
| `shortNames` | Nama ringkas pada header | `"Ayu · Raka"` |
| `parents` | Nama dan keterangan orang tua | Teks biasa |
| `dateLabel` | Tanggal yang tampil kepada tamu | `"Sabtu, 24 Oktober 2026"` |
| `eventDate` | Dasar countdown | ISO date dengan timezone |
| `akadTime` | Waktu akad | `"15.30 WIB"` |
| `receptionTime` | Waktu resepsi | `"18.30 WIB"` |
| `venue` | Nama tempat | `"Pendopo Djogja"` |
| `address` | Alamat acara | Teks alamat lengkap |
| `mapsUrl` | Link Google Maps | URL publik |
| `calendarUrl` | Link Google Calendar | URL template kalender |
| `walletProvider` | Nama dompet digital | `"GoPay"` |
| `walletNumber` | Nomor dompet digital | Teks nomor |
| `accountBank` | Nama bank | `"BCA"` |
| `accountNumber` | Nomor rekening | Teks nomor |
| `accountName` | Nama pemilik rekening | Teks nama |
| `paymentLink` | Link pembayaran atau hadiah | URL publik |
| `ambientTrack` | URL file musik | URL audio, kosongkan jika belum ada |

Gunakan format ISO dengan timezone pada `eventDate`, misalnya `2027-06-12T16:00:00+07:00`. Nilai ini dipakai oleh countdown sehingga harus benar-benar sesuai waktu acara.

## 3. Personalisasi nama tamu

Nama tamu dibaca dari query parameter `to`. Contoh URL:

```text
https://domain-anda.manus.space/?to=Bapak%20Budi%20dan%20Keluarga
```

Spasi dapat ditulis sebagai `%20`. Contoh lain:

```text
https://domain-anda.manus.space/?to=Keluarga%20Santoso
```

Nama dibatasi panjangnya agar tampilan tetap aman. Jika parameter `to` tidak diberikan, website menampilkan `Tamu undangan`.

## 4. Mengubah teks undangan

Teks setiap panel ditulis langsung di JSX pada `Home.tsx`. Section utama saat ini adalah:

| Section | ID navigasi | Isi |
| --- | --- | --- |
| Pembuka | — | Kalimat pengantar sebelum cerita |
| Cerita | `cerita` | Kisah pasangan |
| Acara | `acara` | Akad, resepsi, countdown, lokasi |
| Galeri | `galeri` | Foto dan caption |
| RSVP | `rsvp` | Konfirmasi kehadiran dan ucapan |
| Tanda kasih | `kasih` | Informasi rekening, dompet digital, dan QR |

Saat menambah section baru, tambahkan tiga hal: elemen `<section>` dengan `id` unik, entry baru pada array `NAV`, dan ref pada `sectionRefs`. Pastikan `id` yang digunakan sama persis agar sticky navigation dan IntersectionObserver tetap sinkron.

## 5. Mengganti foto galeri

Daftar foto berada pada konstanta `GALLERY` di `Home.tsx`. Setiap item memiliki `src`, `alt`, dan `caption`.

```tsx
const GALLERY = [
  {
    src: "https://alamat-file-anda/foto-01.jpg",
    alt: "Deskripsi foto untuk aksesibilitas",
    caption: "01 / hari yang kami pilih",
  },
];
```

Gunakan deskripsi `alt` yang menjelaskan isi foto, bukan hanya nama file. Untuk deployment, jangan menaruh foto besar di `client/public/` atau `client/src/assets/`. Simpan file sumber di luar folder proyek, unggah melalui asset storage WebDev, lalu gunakan URL hasil upload di `src`.

Foto pada class seperti `.story-photo` berada di `client/src/index.css`. Jika ingin memakai foto khusus untuk cerita, ubah URL pada `background` class tersebut atau ubah komponen menjadi elemen `<img>` agar lebih mudah dikelola.

## 6. Menambahkan musik

Isi `CONFIG.ambientTrack` dengan URL file audio publik:

```tsx
ambientTrack: "https://alamat-file-anda/ambient.mp3",
```

Browser dapat memblokir autoplay. Website sudah mencoba memulai musik setelah tombol **Buka Undangan** ditekan dan menyediakan tombol musik pada header. Jika musik belum siap, biarkan nilainya kosong: `ambientTrack: ""`.

Gunakan file audio yang memiliki hak penggunaan yang sesuai. Jangan menyimpan file audio besar di dalam repository frontend.

## 7. Mengubah warna dan tipografi

Token visual utama berada di baris `:root` pada `client/src/index.css`.

| Token | Fungsi |
| --- | --- |
| `--paper` | Latar ivory utama |
| `--paper-deep` | Variasi permukaan kertas |
| `--ink` | Warna teks gelap |
| `--muted` | Teks sekunder |
| `--clay` | Warna aksen terracotta |
| `--clay-dark` | Aksen terracotta gelap |
| `--sawo` | Panel cokelat gelap |
| `--line` | Garis pemisah |
| `--topbar-h` | Tinggi header fixed untuk perhitungan offset |

Font display menggunakan **Cormorant Garamond**, sedangkan teks antarmuka menggunakan **DM Sans**. Link font berada di `client/index.html`. Jika mengganti font, perbarui link Google Fonts dan semua deklarasi font terkait di `index.css`.

Pertahankan `--topbar-h` karena digunakan untuk memastikan isi section tidak tertutup header. Pada breakpoint mobile, nilainya diturunkan menjadi `62px`.

## 8. Memahami navigasi horizontal dan scroll vertikal

Undangan memakai dua arah navigasi yang berbeda:

1. Swipe kanan-kiri pada `.spread` memindahkan pengguna antar-section.
2. Scroll atas-bawah pada masing-masing `<section>` membaca konten yang lebih panjang.

Jangan mengubah `.spread` menjadi `overflow-y: hidden` tanpa memastikan child section tetap memiliki `overflow-y: auto`. Jangan memberi `height: 100vh` dan `overflow-y: auto` kembali pada `.panel` jika tidak diperlukan, karena nested scrollport dapat membuat gesture desktop dan trackpad terasa macet.

Navigasi sticky berada pada `.bottom-nav`. Fungsi `goTo()` memakai `target.offsetLeft` dan `spreadRef.current.scrollTo()` agar klik navigasi hanya mengubah posisi horizontal.

## 9. RSVP dan guestbook

Form RSVP saat ini menyimpan data pada `localStorage` browser dengan key `ayu-raka-guestbook`. Artinya, data hanya tersedia pada perangkat dan browser yang sama. Data belum dikirim ke server atau database.

Untuk kebutuhan produksi lintas perangkat, website perlu di-upgrade ke full-stack dan fungsi `submitRsvp` perlu diarahkan ke API/database. Jangan mengandalkan `localStorage` untuk rekap tamu resmi.

Jangan menambahkan review, rating, atau testimonial buatan. Guestbook hanya boleh menampilkan pesan yang benar-benar dikirim melalui form.

## 10. Mengubah navigasi sticky

Label navigasi diatur pada array `NAV`:

```tsx
const NAV = [
  { id: "cerita", label: "Cerita", short: "Kisah" },
  { id: "acara", label: "Acara", short: "Acara" },
];
```

`label` dipakai pada tampilan desktop dan `short` dipakai pada tampilan mobile. Gunakan label singkat agar lima item tetap muat pada layar kecil. Jika menambah item, periksa kembali ukuran tombol pada breakpoint `max-width:700px`.

## 11. Menambahkan atau mengubah section

Pola dasar section:

```tsx
<section
  id="cerita"
  ref={(el) => {
    sectionRefs.current.cerita = el;
  }}
  className="story-panel panel-light"
>
  <div className="rail-label">CERITA — 01</div>
  <div className="story-grid">...</div>
</section>
```

Gunakan class panel yang sudah tersedia bila memungkinkan: `.panel-light`, `.panel-paper`, `.panel-clay`, dan `.panel-ink`. Semua section harus memiliki kontras teks yang cukup, padding atas yang memperhitungkan header, serta padding bawah agar tidak tertutup sticky navigation.

## 12. Checklist sebelum membagikan undangan

Pastikan nama pasangan, nama orang tua, tanggal, timezone, venue, alamat, link Maps, link Calendar, rekening, dan nomor dompet digital sudah diganti. Periksa seluruh foto dan `alt` text, lalu uji URL personalisasi dengan beberapa nama tamu.

Buka undangan pada ukuran mobile dan desktop. Uji swipe kanan-kiri, scroll atas-bawah pada section panjang, tombol sticky navigation, tombol musik, lightbox galeri, link Maps, link Calendar, tombol salin, validasi RSVP, dan tampilan setelah refresh.

Jalankan pemeriksaan teknis berikut sebelum checkpoint:

```bash
pnpm check
pnpm build
```

Jika semua lolos, simpan perubahan melalui checkpoint proyek agar tersinkron ke repository GitHub.

## 13. File yang paling sering diedit

| File | Kapan diedit |
| --- | --- |
| `client/src/pages/Home.tsx` | Data, copywriting, section, galeri, RSVP, dan navigasi |
| `client/src/index.css` | Warna, tipografi, spacing, responsive layout, dan scroll |
| `client/index.html` | Judul halaman dan Google Fonts |
| `CUSTOMIZATION.md` | Panduan penggunaan dan keputusan customization |

Untuk perubahan frontend biasa, hindari mengedit `server/index.ts`, folder `server/`, dan folder kompatibilitas `shared/`.
