# Kalaila Photography - Quick Start Guide

Terima kasih telah memilih template Kalaila Photography! 🎉

## ⚡ Quick Start (5 Menit)

### 1. Buka Website
- Double-click file `index.html`
- Website akan terbuka di browser default Anda

### 2. Test di Mobile
- Tekan `F12` untuk buka DevTools
- Tekan `Ctrl+Shift+M` untuk lihat mobile view
- Website responsive dan berfungsi di semua ukuran

### 3. Customize Informasi
- Edit `index.html` untuk:
  - ✏️ Nama bisnis dan tagline
  - ✏️ Nomor telepon dan email
  - ✏️ Deskripsi layanan
  - ✏️ Link social media

- Edit `script.js` untuk:
  - ✏️ Nomor WhatsApp form (line 56)

- Edit `styles.css` untuk:
  - ✏️ Warna brand (line 1-8)

📖 Lihat file `CUSTOMIZATION.md` untuk panduan detail

### 4. Update Portfolio
- Ganti `https://via.placeholder.com` dengan link gambar Anda
- Hapus placeholder images
- Ganti kategori sesuai project Anda

### 5. Deploy
Pilih salah satu platform:
- **GitHub Pages** (FREE)
- **Netlify** (FREE)
- **Vercel** (FREE)
- **Server Lokal** (Sendiri)

📖 Lihat file `DEPLOYMENT.md` untuk panduan detail

---

## 📂 File Structure

```
kalaila/
├── index.html              ← Main website file
├── styles.css              ← Styling & design
├── script.js               ← Interactivity & functionality
├── README.md               ← Full documentation
├── CUSTOMIZATION.md        ← How to customize
├── DEPLOYMENT.md           ← How to deploy
├── QUICK_START.md          ← This file
└── images/ (optional)      ← Folder untuk menyimpan gambar lokal
```

---

## 🛠️ Local Setup (Recommended)

### Option A: Menggunakan Live Server (VS Code)
1. Install extension "Live Server"
2. Right-click `index.html`
3. Pilih "Open with Live Server"
4. Browser akan auto-open pada `http://127.0.0.1:5500`

### Option B: Python Built-in Server
```bash
# Di folder project, jalankan:
python -m http.server 8000

# Akses: http://localhost:8000
```

### Option C: PHP Built-in Server
```bash
# Di folder project, jalankan:
php -S localhost:8000

# Akses: http://localhost:8000
```

---

## 🎨 Customization Checklist

- [ ] Ubah nama bisnis (navbar)
- [ ] Ubah hero title & subtitle
- [ ] Update nomor telepon
- [ ] Update email kontak
- [ ] Update lokasi bisnis
- [ ] Update WhatsApp number di script.js
- [ ] Ganti placeholder images dengan gambar real
- [ ] Update statistics (500+ acara, dll)
- [ ] Update layanan sesuai bisnis
- [ ] Update testimonial dari klien
- [ ] Update social media links
- [ ] Test responsiveness di mobile
- [ ] Test form submission

---

## 🚀 Common Tasks

### Menambah Section Baru
1. Copy section HTML yang sudah ada
2. Modifikasi content
3. Update CSS jika diperlukan

### Mengganti Warna Brand
1. Buka `styles.css`
2. Ubah variable di `:root` (line 1-8)
3. Reload browser

### Menambah Google Analytics
```html
<!-- Tambahkan di dalam <head> di index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Enable WhatsApp Form
1. Buka `script.js`
2. Ubah nomor di line 56: `const whatsappPhone = '6281234567890';`
3. Format: 62 + nomor tanpa leading 0

---

## ✅ Testing Checklist

- [ ] Navigation links berfungsi
- [ ] Mobile menu hamburger berfungsi
- [ ] Form submit terintegrasi WhatsApp
- [ ] Semua images loading
- [ ] Responsive di 3 ukuran: mobile, tablet, desktop
- [ ] Smooth scroll berfungsi
- [ ] Social media links membuka di tab baru
- [ ] Tidak ada console errors (F12)
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 80

---

## 🔗 Important Links

| Resource | Link |
|----------|------|
| Font Awesome Icons | https://fontawesome.com/icons |
| Free Images | https://unsplash.com, https://pexels.com |
| Color Picker | https://htmlcolorcodes.com |
| Responsive Test | https://responsively.app |
| Compress Images | https://tinypng.com |
| GitHub Pages Help | https://pages.github.com |

---

## ⚙️ Browser Compatibility

✅ Works on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

---

## 📞 Need Help?

Jika ada pertanyaan, silakan:
1. Baca dokumentasi (README.md, CUSTOMIZATION.md)
2. Check browser console untuk error messages (F12)
3. Verify file paths dan image URLs
4. Clear browser cache dan reload

---

## 🎓 Learning Resources

Untuk belajar lebih lanjut:
- **HTML**: https://www.w3schools.com/html/
- **CSS**: https://www.w3schools.com/css/
- **JavaScript**: https://www.w3schools.com/js/
- **Responsive Design**: https://www.w3schools.com/css/css_rwd_intro.asp

---

## 📝 Version Info

- **Version**: 1.0
- **Last Updated**: June 2024
- **Browser Support**: All modern browsers
- **Mobile Friendly**: Yes ✓
- **SEO Ready**: Yes ✓

---

**Selamat menggunakan Kalaila Photography Landing Page! 📸✨**

Jangan lupa untuk:
- 📸 Update portfolio dengan project terbaru
- 💬 Collect testimonials dari klien
- 📱 Share link ke social media
- ⭐ Review and feedback appreciated!

---

**Happy Photography! 🎉**
