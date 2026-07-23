# Kalaila Photography - Configuration Guide

## 🎯 Quick Customization

Berikut adalah panduan cepat untuk mengkustomisasi website Kalaila sesuai kebutuhan Anda.

---

## 1️⃣ INFORMASI BISNIS

### Logo & Brand Name
**File: `index.html`**
- Line 39-42: Ubah logo dan nama di navbar

```html
<div class="logo">
    <h1>KALAILA</h1>          <!-- Ubah nama bisnis Anda -->
    <p>Photography</p>        <!-- Ubah tagline -->
</div>
```

### Tagline Hero
**File: `index.html`**
- Line 50-51: Ubah tagline utama

```html
<h2 class="hero-title">Abadikan Momen Berharga Anda</h2>
<p class="hero-subtitle">Fotografer profesional untuk acara spesial Anda</p>
```

---

## 2️⃣ INFORMASI KONTAK

### Nomor Telepon
**File: `index.html`** - Line 237
```html
<p>+62 812 3456 7890</p>
```

### Email
**File: `index.html`** - Line 244
```html
<p>info@kalaila.com</p>
```

### Lokasi
**File: `index.html`** - Line 251
```html
<p>Jakarta, Indonesia</p>
```

### Jam Operasional
**File: `index.html`** - Line 258
```html
<p>Senin - Minggu: 09:00 - 19:00</p>
```

### WhatsApp untuk Form
**File: `script.js`** - Line 56
```javascript
const whatsappPhone = '6281234567890'; // Format: 62 + nomor tanpa 0
```

---

## 3️⃣ STATISTIK BISNIS

**File: `index.html`** - Section About (Line 79-95)

```html
<div class="stat-item">
    <h3>500+</h3>              <!-- Ubah angka -->
    <p>Acara Terlayani</p>      <!-- Ubah label -->
</div>
```

---

## 4️⃣ LAYANAN (SERVICES)

**File: `index.html`** - Section Services (Line 142-200)

Setiap layanan memiliki struktur:
```html
<div class="service-card">
    <i class="fas fa-ring"></i>                    <!-- Icon (lihat Font Awesome) -->
    <h3>Fotografi Pernikahan</h3>                  <!-- Nama layanan -->
    <p>Deskripsi layanan Anda...</p>               <!-- Deskripsi -->
    <span class="service-price">Hubungi Kami</span><!-- Harga/CTA -->
</div>
```

### Font Awesome Icons
Gunakan dari: https://fontawesome.com/icons

Contoh icon populer:
- Pernikahan: `fa-ring`
- Keluarga: `fa-people-group`
- Portrait: `fa-user-tie`
- Kamera: `fa-camera`
- Hati: `fa-heart`
- Gambar: `fa-image`

---

## 5️⃣ PORTOFOLIO / GALERI

**File: `index.html`** - Section Portfolio (Line 112-140)

```html
<div class="portfolio-item">
    <div class="portfolio-image">
        <img src="URL_GAMBAR" alt="Deskripsi">
        <div class="overlay">
            <span>Kategori</span>
        </div>
    </div>
</div>
```

### Menambah Gambar:
1. Ganti `URL_GAMBAR` dengan link gambar Anda
2. Ubah kategori di `<span>Kategori</span>`

### Sumber Gambar Gratis:
- Unsplash: https://unsplash.com
- Pexels: https://pexels.com
- Pixabay: https://pixabay.com

---

## 6️⃣ TESTIMONIAL KLIEN

**File: `index.html`** - Section Testimonials (Line 207-235)

```html
<div class="testimonial-card">
    <div class="stars">
        <i class="fas fa-star"></i>    <!-- 5 bintang -->
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
    </div>
    <p>"Teks testimonial dari klien..."</p>    <!-- Review -->
    <h4>Nama Klien</h4>                        <!-- Nama -->
    <span>Kategori Project 2024</span>         <!-- Label -->
</div>
```

---

## 7️⃣ WARNA & STYLING

**File: `styles.css`** - Line 1-8

```css
:root {
    --primary-color: #2c3e50;      /* Warna biru gelap utama */
    --accent-color: #e74c3c;       /* Warna merah accent */
    --text-color: #333;            /* Warna teks normal */
    --light-text: #666;            /* Warna teks terang */
    --bg-color: #f8f9fa;           /* Background abu-abu terang */
}
```

### Mengubah Warna:
1. Buka `styles.css`
2. Ubah value warna hexadecimal
3. Contoh kombinasi warna populer:

| Nama | Primary | Accent | Cocok untuk |
|------|---------|--------|------------|
| Classic | #2c3e50 | #e74c3c | Umum |
| Gold | #1a1a1a | #d4af37 | Luxury |
| Modern | #1e3c72 | #2a9d8f | Contemporary |
| Warm | #8b4513 | #ff6b6b | Natural |

---

## 8️⃣ SOCIAL MEDIA

**File: `index.html`** - Section Social (Line 272-280)

```html
<a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
```

Ubah `href="#"` dengan link ke profil Anda:
```html
<a href="https://instagram.com/kalaila.photo" title="Instagram"><i class="fab fa-instagram"></i></a>
```

Platform yang tersedia:
- Instagram: `fab fa-instagram`
- Facebook: `fab fa-facebook`
- TikTok: `fab fa-tiktok`
- WhatsApp: `fab fa-whatsapp`
- YouTube: `fab fa-youtube`
- Twitter: `fab fa-twitter`

---

## 9️⃣ RESPONSIVE TESTING

### Test di berbagai device:
1. **Desktop**: Buka di browser normal
2. **Mobile**: Tekan `F12` → Toggle Device Toolbar (Ctrl+Shift+M)
3. **Tablet**: Adjust window size ke 768px

### Device sizes untuk test:
- Mobile: 375px x 667px (iPhone)
- Tablet: 768px x 1024px (iPad)
- Desktop: 1920px x 1080px

---

## 🔟 DEPLOY CHECKLIST

Sebelum deploy, pastikan:
- ✅ Nomor WhatsApp sudah benar
- ✅ Email contact sudah benar
- ✅ Semua link social media sudah benar
- ✅ Gambar portfolio sudah diupdate
- ✅ Testimoni sudah diupdate
- ✅ Informasi kontak sudah benar
- ✅ Website sudah ditest di mobile
- ✅ Semua link bekerja dengan baik

---

## 📚 RESOURCES BERGUNA

- **Font Awesome Icons**: https://fontawesome.com/icons
- **Color Picker**: https://htmlcolorcodes.com
- **Image Compression**: https://tinypng.com
- **CSS Gradient Generator**: https://cssgradient.io
- **Responsive Design Test**: https://responsively.app

---

## 💡 TIPS

1. **Backup File**: Selalu backup file sebelum edit besar
2. **Browser Cache**: Clear cache saat ada perubahan CSS
3. **Validation**: Test form sebelum production
4. **Performance**: Compress image untuk load lebih cepat
5. **SEO**: Tambah meta description di `<head>` untuk SEO

---

**Sudah siap? Mari kembangkan bisnis Kalaila Photography! 📸**
