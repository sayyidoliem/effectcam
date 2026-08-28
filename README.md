# EffectCam - Next.js App Router

Aplikasi kamera browser responsif dengan filter langsung, galeri lokal, pratinjau, unduh JPG, hapus foto, dan pergantian kamera depan/belakang.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`, lalu izinkan akses kamera.

## Build produksi

```bash
npm run build
npm start
```

## Catatan

- Kamera browser hanya dapat dipakai pada `localhost` atau koneksi HTTPS.
- Foto diproses di browser dan tidak dikirim ke server.
- Galeri hanya bertahan selama halaman masih terbuka.
- Tombol Simpan mengunduh foto JPG ke penyimpanan perangkat melalui mekanisme unduhan browser.
