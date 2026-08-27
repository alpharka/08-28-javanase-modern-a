# Arah Visual Undangan Digital

## Tiga pendekatan awal

### Theme Name: Modern Javanese Editorial
Very Brief Intro: Undangan terasa seperti arsip editorial pernikahan Jawa modern—hangat, taktil, dan berkarakter melalui tekstur kertas, pola kawung yang disederhanakan, serta komposisi asimetris.
Probability: 0.07

### Theme Name: Coastal Linen
Very Brief Intro: Arah airy dan tenang dengan palet pasir, biru laut pudar, serta ruang putih luas yang terasa seperti stationery linen di tepi pantai.
Probability: 0.04

### Theme Name: Botanical Nocturne
Very Brief Intro: Arah malam yang intim dengan botanical silhouette, tinta arang, dan aksen tembaga yang memberi rasa dramatis namun tetap lembut.
Probability: 0.02

## Pilihan utama: Modern Javanese Editorial

### Design Movement
Modern Javanese editorialism, memadukan keanggunan layout majalah dengan referensi material budaya Jawa secara subtil, bukan dekorasi literal.

### Core Principles
1. **Taktil dan berlapis:** ivory seperti kertas, grain halus, dan panel terracotta menjadi dasar pengalaman.
2. **Editorial asimetris:** teks, angka, dan foto bergerak dalam kolom tidak sejajar untuk menciptakan ritme.
3. **Motif sebagai navigasi:** garis arsitektural dan potongan kawung membantu pengguna memahami perpindahan section.
4. **Hangat tetapi tidak berlebihan:** animasi singkat, microcopy spesifik, dan ruang napas yang cukup.

### Color Philosophy
Ivory menjadi bidang napas dan simbol lembar undangan. Terracotta berfungsi sebagai tanda kehidupan dan kehangatan, sementara sawo matang/arang memberi bobot agar teks selalu terbaca. Aksen signature adalah **Cendana Burnt #B65F43**, warna tanah dan kayu yang terasa personal tanpa menjadi dekorasi berlebihan.

### Layout Paradigm
Satu halaman dibangun sebagai rangkaian panel horizontal yang bisa digeser dengan gesture swipe kanan–kiri. Di desktop, panel menjadi spread editorial dengan rail metadata vertikal; di mobile, panel diprioritaskan sebagai pengalaman satu kolom yang tetap bisa berpindah secara horizontal dengan snap.

### Signature Elements
- Garis tipis seperti denah arsitektur, dipakai sebagai separator dan progress rail.
- Motif kawung geometris yang sangat halus sebagai tekstur latar.
- Emblem lingkaran dengan dua bentuk daun/kelopak yang dipakai sebagai brand mark.

### Interaction Philosophy
Interaksi harus terasa seperti membuka album atau membalik spread, bukan berpindah halaman aplikasi. Swipe horizontal menjadi gestur utama; tombol sticky di bawah menjadi penunjuk arah yang tetap jelas dan mudah disentuh.

### Animation
Cover slide-up 700ms; panel swipe memakai transform dengan easing snappy; teks muncul melalui opacity dan translateY ringan; gambar masuk dengan scale 0.98; lightbox fade cepat. Non-essential motion dimatikan pada prefers-reduced-motion.

### Typography System
Display: **Cormorant Garamond**, 500–600, untuk nama pasangan, angka, dan judul utama. Body: **DM Sans**, 400–600, untuk detail acara, form, label, dan navigasi. Uppercase kecil dengan letter spacing dipakai sebagai metadata, bukan paragraf.

### Brand Essence
Undangan editorial yang mengubah kisah dua keluarga menjadi perjalanan visual yang bisa dijelajahi perlahan, untuk tamu yang menghargai detail dan kehangatan. Personality: **intimate, composed, tactile**.

### Brand Voice
Headline terdengar puitis tetapi spesifik; CTA terdengar mengundang tanpa generik; microcopy singkat dan manusiawi.
Contoh: “Dari satu percakapan, kami menemukan arah pulang.”
Contoh: “Geser perlahan, kami ingin berbagi beberapa halaman kecil.”

### Wordmark & Logo
Emblem grafis tanpa teks berupa lingkaran matahari kecil yang dipotong dua kelopak simetris, dengan satu garis vertikal seperti aksis arsitektur. Mark dipakai di cover, header, footer, dan favicon.

### Signature Brand Color
**Cendana Burnt — #B65F43**.

## Implementasi khusus

Data undangan akan dipusatkan dalam satu `CONFIG` object dengan placeholder yang mudah dicari. Navigasi akan memakai array section yang sama untuk sticky bottom navigation, dot progress, tombol keyboard, dan anchor fallback. RSVP dan guestbook menggunakan localStorage tanpa seed data, dan galeri memakai lightbox keyboard-accessible.

## Style Decisions

- Ivory paper menjadi permukaan dominan pada section terang; panel sawo dan terracotta dipakai sebagai momen kontras.
- Motif kawung geometris disederhanakan menjadi tekstur radial lembut pada panel terang, sementara emblem kelopak lingkaran dipakai berulang di cover, header, dan tanda kasih.
- Headline utama dan CTA memakai bahasa Indonesia-first; aksen bilingual hanya tersisa pada metadata pendek agar suara undangan tetap intim dan spesifik.
- Setiap section mempertahankan rail nomor vertikal, aturan tipis, dan komposisi offset untuk menjaga rasa album editorial.
