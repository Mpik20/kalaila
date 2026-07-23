# Kalaila Photography - Landing Page

Selamat datang di website Kalaila Photography! Ini adalah landing page profesional untuk bisnis fotografi dengan desain modern dan responsif.

## 📁 Struktur File

```
kalaila/
├── index.html       # File HTML utama
├── styles.css       # Stylesheet dengan desain responsif
├── script.js        # JavaScript untuk interaktivitas
└── README.md        # File dokumentasi ini
```

## 🚀 Fitur Utama

✅ **Desain Responsif** - Optimal di desktop, tablet, dan mobile
✅ **Modern & Elegan** - Menggunakan gradient dan animasi smooth
✅ **SEO Friendly** - Struktur HTML yang proper
✅ **Fast Loading** - CSS dan JS yang efisien
✅ **Interactive** - Navigasi smooth dan form yang fungsional
✅ **Mobile Menu** - Hamburger menu untuk device kecil

## 📋 Bagian-Bagian Website

### 1. **Navigation Bar**
   - Logo dengan branding Kalaila
   - Menu navigasi yang responsif
   - Hamburger menu untuk mobile

### 2. **Hero Section**
   - Background gradient yang menarik
   - Call-to-action button untuk booking
   - Tagline profesional

### 3. **About Section**
   - Tentang Kalaila Photography
   - Statistics counter (500+ acara, 10+ tahun pengalaman, dll)

### 4. **Portfolio Section**
   - Galeri 6 project fotografi
   - Hover effect dengan overlay
   - Category label (Wedding, Pre-wedding, Event, dll)

### 5. **Services Section**
   - 6 layanan utama dengan icon
   - Deskripsi detail setiap layanan
   - Hover effect yang menarik

### 6. **Testimonials Section**
   - Review dari klien terpuasan
   - Rating bintang 5
   - Nama klien dan kategori project

### 7. **Contact Section**
   - Informasi kontak lengkap (telepon, email, lokasi, jam operasional)
   - Form kontak yang terintegrasi dengan WhatsApp
   - Validasi form otomatis

### 8. **Social Media & Footer**
   - Link ke social media (Instagram, Facebook, TikTok, WhatsApp)
   - Copyright footer

## 🎨 Customization Guide

### Mengubah Warna Utama
Edit warna di `styles.css` di bagian `:root`:
```css
:root {
    --primary-color: #2c3e50;    /* Warna utama (biru gelap) */
    --accent-color: #e74c3c;     /* Warna accent (merah) */
    --text-color: #333;          /* Warna teks */
    --light-text: #666;          /* Warna teks lebih terang */
    --bg-color: #f8f9fa;         /* Background color */
}
```

### Mengubah Informasi Kontak
Di `index.html`, cari bagian Contact Section:
```html
<p>+62 812 3456 7890</p>        <!-- Ubah nomor telepon -->
<p>info@kalaila.com</p>          <!-- Ubah email -->
<p>Jakarta, Indonesia</p>         <!-- Ubah lokasi -->
```

### Mengubah Nomor WhatsApp untuk Form
Di `script.js`, cari bagian "Create WhatsApp link":
```javascript
const whatsappPhone = '6281234567890'; // Ubah dengan nomor Anda
```

### Menambah/Mengubah Portfolio Items
Di `index.html`, duplikat div dengan class `portfolio-item`:
```html
<div class="portfolio-item">
    <div class="portfolio-image">
        <img src="URL_GAMBAR_ANDA" alt="Deskripsi">
        <div class="overlay">
            <span>Kategori</span>
        </div>
    </div>
</div>
```

### Menambah/Mengubah Testimonial
Di `index.html`, duplikat div dengan class `testimonial-card`:
```html
<div class="testimonial-card">
    <div class="stars">
        <!-- 5 bintang menggunakan <i class="fas fa-star"></i> -->
    </div>
    <p>"Teks testimonial dari klien"</p>
    <h4>Nama Klien</h4>
    <span>Kategori Project</span>
</div>
```

## 📱 Responsive Breakpoints

- **Desktop**: Full layout dengan semua fitur
- **Tablet** (768px ke bawah): Menu hamburger, grid 2 kolom menjadi 1
- **Mobile** (480px ke bawah): Layout yang lebih compact

## 🔧 Instalasi & Setup

### Metode 1: Buka Langsung di Browser
1. Buka file `index.html` di browser favorit Anda
2. Website siap digunakan!

### Metode 2: Menggunakan Local Server (Recommended)

**Menggunakan Python:**
```bash
# Python 3.x
python -m http.server 8000

# atau Python 2.x
python -m SimpleHTTPServer 8000
```

**Menggunakan Node.js:**
```bash
# Install http-server secara global
npm install -g http-server

# Jalankan server
http-server
```

**Menggunakan PHP:**
```bash
php -S localhost:8000
```

Kemudian akses: `http://localhost:8000`

## 📦 Dependencies

Semua dependencies sudah include via CDN:
- **Font Awesome 6.4.0** - Icon library
- **Google Fonts** - Segoe UI (system font)

Tidak perlu install package tambahan!

## ✨ Features JavaScript

### 1. **Mobile Menu Toggle**
   - Hamburger menu yang responsive
   - Auto-close saat link diklik

### 2. **Smooth Scroll**
   - Navigation link ke section yang smooth
   - Scroll behavior yang elegan

### 3. **Form Validation**
   - Validasi input sebelum dikirim
   - Validasi format email
   - Terintegrasi dengan WhatsApp

### 4. **Scroll Animation**
   - Fade-in animation saat scroll
   - Counter animation untuk statistik
   - Intersection Observer untuk performance

### 5. **Active Nav Link**
   - Highlight nav link berdasarkan section yang sedang dilihat

## 🐛 Troubleshooting

### Form tidak mengirim ke WhatsApp
- Pastikan nomor WhatsApp di `script.js` sudah benar dengan format 62XXXXXXXXXX
- Check browser console untuk error messages

### Icon tidak tampil
- Pastikan internet connection aktif (Font Awesome via CDN)
- Clear browser cache dan reload

### CSS tidak loading
- Periksa path file `styles.css` di `index.html`
- Pastikan file berada di folder yang sama

## 🚀 Deployment

### GitHub Pages
1. Push semua file ke repository GitHub
2. Go to Settings → Pages
3. Set source ke main branch
4. Website akan live di `https://username.github.io/kalaila`

### Netlify
1. Drag & drop folder ke Netlify
2. Instant deploy tanpa config

### Vercel
1. Import project ke Vercel
2. Auto-deploy dari Git repository

## 📝 License

Free to use untuk keperluan pribadi dan komersial. Attribution appreciated!

## 📧 Support

Untuk pertanyaan atau customization tambahan, hubungi tim Kalaila Photography.

---

**Happy Photography! 📸**
Kalaila Photography Team
