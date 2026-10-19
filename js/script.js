// ========== ELEGANT CUSTOM MODAL ALERT SYSTEM ==========
window.showCustomModal = function(options) {
    let title = "Pemberitahuan";
    let message = "";
    let type = "info";
    let iconClass = "fas fa-info-circle";
    let buttonText = "OK";
    let cancelText = "Batal";
    let showCancel = false;
    let onConfirm = null;

    if (typeof options === 'string') {
        message = options;
        const lower = message.toLowerCase();
        if (lower.includes('terima kasih') || lower.includes('berhasil') || lower.includes('diterbitkan') || lower.includes('sukses')) {
            type = 'success';
            title = 'Terima Kasih Banyak!';
            iconClass = 'fas fa-check-circle';
        } else if (lower.includes('mohon') || lower.includes('lengkapi') || lower.includes('isi seluruh') || lower.includes('periksa')) {
            type = 'warning';
            title = 'Mohon Lengkapi';
            iconClass = 'fas fa-exclamation-triangle';
        } else if (lower.includes('gagal') || lower.includes('error') || lower.includes('salah')) {
            type = 'error';
            title = 'Terjadi Kesalahan';
            iconClass = 'fas fa-times-circle';
        }
    } else if (typeof options === 'object' && options !== null) {
        message = options.message || '';
        title = options.title || (options.type === 'success' ? 'Berhasil!' : options.type === 'warning' ? 'Perhatian' : 'Pemberitahuan');
        type = options.type || 'info';
        buttonText = options.buttonText || 'OK';
        cancelText = options.cancelText || 'Batal';
        showCancel = options.showCancel || false;
        onConfirm = options.onConfirm || null;

        if (options.icon) {
            iconClass = options.icon;
        } else {
            if (type === 'success') iconClass = 'fas fa-check-circle';
            else if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';
            else if (type === 'error') iconClass = 'fas fa-times-circle';
            else iconClass = 'fas fa-info-circle';
        }
    }

    // Clean up existing modal if open
    const existingModal = document.getElementById('kalailaCustomModalOverlay');
    if (existingModal) {
        existingModal.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'kalailaCustomModalOverlay';
    overlay.className = `kalaila-modal-overlay kalaila-modal-type-${type}`;

    let footerHtml = `<button class="kalaila-modal-btn kalaila-modal-btn-primary kalaila-modal-btn-confirm">${buttonText}</button>`;
    if (showCancel || typeof onConfirm === 'function') {
        footerHtml = `
            <button class="kalaila-modal-btn kalaila-modal-btn-secondary kalaila-modal-btn-cancel">${cancelText}</button>
            <button class="kalaila-modal-btn kalaila-modal-btn-primary kalaila-modal-btn-confirm">${buttonText}</button>
        `;
    }

    overlay.innerHTML = `
        <div class="kalaila-modal-card">
            <button class="kalaila-modal-close" aria-label="Tutup">&times;</button>
            <div class="kalaila-modal-header">
                <div class="kalaila-modal-icon-wrapper">
                    <i class="${iconClass}"></i>
                </div>
            </div>
            <div class="kalaila-modal-body">
                <h3 class="kalaila-modal-title">${title}</h3>
                <div class="kalaila-modal-message">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="kalaila-modal-footer">
                ${footerHtml}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    const closeModal = (confirmed = false) => {
        overlay.classList.remove('active');
        overlay.classList.add('closing');
        setTimeout(() => {
            overlay.remove();
            if (confirmed && typeof onConfirm === 'function') {
                onConfirm();
            }
        }, 250);
    };

    const btnConfirm = overlay.querySelector('.kalaila-modal-btn-confirm');
    const btnCancel = overlay.querySelector('.kalaila-modal-btn-cancel');
    const btnClose = overlay.querySelector('.kalaila-modal-close');

    if (btnConfirm) btnConfirm.addEventListener('click', () => closeModal(true));
    if (btnCancel) btnCancel.addEventListener('click', () => closeModal(false));
    if (btnClose) btnClose.addEventListener('click', () => closeModal(false));

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(false);
        }
    });

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            document.removeEventListener('keydown', handleKeyDown);
            closeModal(false);
        }
    };
    document.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
        if (btnConfirm) btnConfirm.focus();
    }, 50);
};

// Global override for native browser alert
window.alert = function(message) {
    window.showCustomModal(message);
};

// ========== TESTIMONIAL DATA & MANAGEMENT GLOBALS ==========
window.defaultTestimonials = [];

if (!localStorage.getItem('kalaila_testimonials_cleared_v2')) {
    localStorage.setItem('kalaila_user_testimonials', JSON.stringify([]));
    localStorage.setItem('kalaila_testimonials_cleared_v2', 'true');
}

window.getStoredTestimonials = function() {
    const saved = localStorage.getItem('kalaila_user_testimonials');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }
    return [];
};

window.deleteTestimonial = function(index) {
    window.showCustomModal({
        title: 'Hapus Ulasan?',
        message: 'Apakah Anda yakin ingin menghapus ulasan testimoni ini dari tampilan web?',
        type: 'warning',
        showCancel: true,
        buttonText: 'Ya, Hapus',
        cancelText: 'Batal',
        onConfirm: function() {
            let list = window.getStoredTestimonials();
            if (index >= 0 && index < list.length) {
                list.splice(index, 1);
                localStorage.setItem('kalaila_user_testimonials', JSON.stringify(list));
                if (typeof window.renderTestimonials === 'function') {
                    window.renderTestimonials();
                }
                if (typeof window.renderAdminTestimonials === 'function') {
                    window.renderAdminTestimonials();
                }
                window.showCustomModal({
                    title: 'Berhasil Dihapus',
                    message: 'Ulasan testimoni telah berhasil dihapus.',
                    type: 'success'
                });
            }
        }
    });
};

window.editTestimonial = function(index) {
    const list = window.getStoredTestimonials();
    if (index < 0 || index >= list.length) return;
    const item = list[index];

    const existingModal = document.getElementById('kalailaEditModalOverlay');
    if (existingModal) {
        existingModal.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'kalailaEditModalOverlay';
    overlay.className = 'kalaila-modal-overlay active';

    overlay.innerHTML = `
        <div class="kalaila-modal-card" style="max-width: 480px; text-align: left;">
            <button class="kalaila-modal-close" id="closeEditModalBtn">&times;</button>
            <div class="kalaila-modal-header" style="justify-content: flex-start; margin-bottom: 16px;">
                <h3 class="kalaila-modal-title" style="margin-bottom: 0; font-size: 1.5rem;"><i class="fas fa-edit" style="color: var(--gold-accent); margin-right: 8px;"></i> Edit Ulasan Testimoni</h3>
            </div>
            <div class="kalaila-modal-body">
                <form id="kalailaEditForm" style="display: flex; flex-direction: column; gap: 14px;">
                    <div>
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary-color); display: block; margin-bottom: 4px;">Nama Pasangan / Client</label>
                        <input type="text" id="editClientName" value="${item.name.replace(/"/g, '&quot;')}" required style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color); font-family: var(--font-body); font-size: 0.9rem;">
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary-color); display: block; margin-bottom: 4px;">Acara & Lokasi</label>
                        <input type="text" id="editClientEvent" value="${item.event.replace(/"/g, '&quot;')}" required style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color); font-family: var(--font-body); font-size: 0.9rem;">
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary-color); display: block; margin-bottom: 4px;">Rating Bintang</label>
                        <select id="editRating" style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color); font-family: var(--font-body); font-size: 0.9rem; background: white;">
                            <option value="5" ${item.stars == 5 ? 'selected' : ''}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                            <option value="4" ${item.stars == 4 ? 'selected' : ''}>⭐⭐⭐⭐ (4 Bintang)</option>
                            <option value="3" ${item.stars == 3 ? 'selected' : ''}>⭐⭐⭐ (3 Bintang)</option>
                            <option value="2" ${item.stars == 2 ? 'selected' : ''}>⭐⭐ (2 Bintang)</option>
                            <option value="1" ${item.stars == 1 ? 'selected' : ''}>⭐ (1 Bintang)</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary-color); display: block; margin-bottom: 4px;">Pesan / Isi Ulasan</label>
                        <textarea id="editClientComment" rows="4" required style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color); font-family: var(--font-body); font-size: 0.9rem; resize: vertical;">${item.comment}</textarea>
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                        <button type="button" class="kalaila-modal-btn kalaila-modal-btn-secondary" id="cancelEditModalBtn">Batal</button>
                        <button type="submit" class="kalaila-modal-btn kalaila-modal-btn-primary"><i class="fas fa-save" style="margin-right: 6px;"></i> Simpan Perubahan</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeOverlay = () => {
        overlay.classList.remove('active');
        overlay.classList.add('closing');
        setTimeout(() => overlay.remove(), 250);
    };

    document.getElementById('closeEditModalBtn').addEventListener('click', closeOverlay);
    document.getElementById('cancelEditModalBtn').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });

    document.getElementById('kalailaEditForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newName = document.getElementById('editClientName').value.trim();
        const newEvent = document.getElementById('editClientEvent').value.trim();
        const newRating = parseInt(document.getElementById('editRating').value);
        const newComment = document.getElementById('editClientComment').value.trim();

        if (!newName || !newEvent || !newComment) return;

        let currentList = window.getStoredTestimonials();
        if (index >= 0 && index < currentList.length) {
            currentList[index].name = newName;
            currentList[index].event = newEvent;
            currentList[index].stars = newRating;
            currentList[index].comment = newComment;

            const parts = newName.split(/\s+/);
            currentList[index].avatar = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : newName.substring(0, 2).toUpperCase();

            localStorage.setItem('kalaila_user_testimonials', JSON.stringify(currentList));
            closeOverlay();

            if (typeof window.renderTestimonials === 'function') {
                window.renderTestimonials();
            }
            if (typeof window.renderAdminTestimonials === 'function') {
                window.renderAdminTestimonials();
            }

            window.showCustomModal({
                title: 'Berhasil Diperbarui',
                message: 'Ulasan testimoni telah berhasil diperbarui.',
                type: 'success'
            });
        }
    });
};

window.resetTestimonialsToDefault = function() {
    window.showCustomModal({
        title: 'Reset Testimoni?',
        message: 'Apakah Anda yakin ingin menghapus semua ulasan tambahan dan mengembalikan testimoni ke ulasan utama saja?',
        type: 'warning',
        showCancel: true,
        buttonText: 'Ya, Bersihkan',
        cancelText: 'Batal',
        onConfirm: function() {
            localStorage.setItem('kalaila_user_testimonials', JSON.stringify(window.defaultTestimonials));
            if (typeof window.renderTestimonials === 'function') {
                window.renderTestimonials();
            }
            if (typeof window.renderAdminTestimonials === 'function') {
                window.renderAdminTestimonials();
            }
            window.showCustomModal({
                title: 'Berhasil Dibersihkan',
                message: 'Semua ulasan tambahan telah dibersihkan dan dikembalikan ke testimoni utama.',
                type: 'success'
            });
        }
    });
};

// ========== GLOBAL PORTFOLIO CMS MANAGER ==========
window.defaultPortfolios = [
    {
        id: "port-1",
        name: "Rian & Maya",
        category: "prewedding",
        categoryName: "Pre-Wedding",
        location: "Pine Forest & Meadow • Bandung",
        cover: "images/prewed.jpg",
        photos: ["images/prewed.jpg", "images/profile.jpg", "images/prewed1.jpg", "images/wedding.jpg", "images/wedding1.jpg", "images/wedding2.jpg"]
    },
    {
        id: "port-2",
        name: "Dimas & Nadia",
        category: "wedding",
        categoryName: "Pernikahan (Wedding)",
        location: "Grand Ballroom & Garden Akad • Jakarta",
        cover: "images/wedding1.jpg",
        photos: ["images/wedding1.jpg", "images/wedding.jpg", "images/wedding2.jpg", "images/prewed.jpg", "images/profile.jpg", "images/prewed1.jpg"]
    },
    {
        id: "port-3",
        name: "Fikri & Aulia",
        category: "prewedding",
        categoryName: "Pre-Wedding",
        location: "Ranca Upas & Tea Plantation • Ciwidey",
        cover: "images/profile.jpg",
        photos: ["images/profile.jpg", "images/prewed1.jpg", "images/prewed.jpg", "images/wedding2.jpg", "images/wedding.jpg"]
    },
    {
        id: "port-4",
        name: "Reza & Kirana",
        category: "wedding",
        categoryName: "Pernikahan (Wedding)",
        location: "Glass House Indoor & Intimate Dinner • Bandung",
        cover: "images/wedding2.jpg",
        photos: ["images/wedding2.jpg", "images/wedding.jpg", "images/wedding1.jpg", "images/prewed1.jpg", "images/prewed.jpg", "images/profile.jpg"]
    },
    {
        id: "port-5",
        name: "Bagas & Cynthia",
        category: "engagement",
        categoryName: "Engagement & Sangjit",
        location: "Heritage House & Garden • Semarang",
        cover: "images/wedding.jpg",
        photos: ["images/wedding.jpg", "images/wedding2.jpg", "images/prewed.jpg", "images/wedding1.jpg"]
    },
    {
        id: "port-6",
        name: "Aris & Vina",
        category: "maternity",
        categoryName: "Maternity & Family",
        location: "Warm Sunset Studio & Outdoor • Bandung",
        cover: "images/prewed1.jpg",
        photos: ["images/prewed1.jpg", "images/profile.jpg", "images/prewed.jpg", "images/wedding2.jpg", "images/wedding1.jpg"]
    }
];

window.getStoredPortfolios = function() {
    const saved = localStorage.getItem('kalaila_portfolios');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch(e){}
    }
    return window.defaultPortfolios;
};

window.savePortfolios = function(list) {
    localStorage.setItem('kalaila_portfolios', JSON.stringify(list));
};

window.deletePortfolioItem = function(index, skipConfirm = false) {
    let list = window.getStoredPortfolios();
    if (index < 0 || index >= list.length) return;

    const doDelete = () => {
        const item = list[index];
        list.splice(index, 1);
        window.savePortfolios(list);
        if (typeof window.renderDynamicPortfolios === 'function') window.renderDynamicPortfolios();
        if (typeof window.renderAdminPortfolios === 'function') window.renderAdminPortfolios();
        if (!skipConfirm) {
            window.showCustomModal({
                title: 'Berhasil Dihapus',
                message: `Portofolio "${item ? item.name : ''}" telah dihapus.`,
                type: 'success'
            });
        }
    };

    if (skipConfirm) {
        doDelete();
    } else {
        window.showCustomModal({
            title: 'Hapus Karya Portofolio?',
            message: 'Apakah Anda yakin ingin menghapus portofolio pasangan ini dari galeri web?',
            type: 'warning',
            showCancel: true,
            buttonText: 'Ya, Hapus',
            cancelText: 'Batal',
            onConfirm: doDelete
        });
    }
};

function compressAndReadImage(file, maxDimension = 1000, quality = 0.75) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;

                if (w > maxDimension || h > maxDimension) {
                    if (w > h) {
                        h = Math.round((h * maxDimension) / w);
                        w = maxDimension;
                    } else {
                        w = Math.round((w * maxDimension) / h);
                        h = maxDimension;
                    }
                }

                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = () => resolve(e.target.result);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

window.openAddEditPortfolioModal = function(editIndex = -1) {
    const list = window.getStoredPortfolios();
    const isEdit = (editIndex >= 0 && editIndex < list.length);
    const item = isEdit ? list[editIndex] : {
        name: '',
        category: 'prewedding',
        location: '',
        cover: '',
        photos: []
    };

    let currentFormPhotos = [...(item.photos || [])];

    const existingModal = document.getElementById('kalailaPortfolioModalOverlay');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'kalailaPortfolioModalOverlay';
    overlay.className = 'kalaila-modal-overlay active';

    overlay.innerHTML = `
        <div class="kalaila-modal-card" style="max-width: 580px; text-align: left;">
            <button class="kalaila-modal-close" id="closePortModalBtn">&times;</button>
            <div class="kalaila-modal-header" style="justify-content: flex-start; margin-bottom: 16px;">
                <h3 class="kalaila-modal-title" style="margin-bottom: 0; font-size: 1.45rem;">
                    <i class="fas ${isEdit ? 'fa-edit' : 'fa-plus-circle'}" style="color: var(--gold-accent); margin-right: 8px;"></i>
                    ${isEdit ? 'Edit Karya Portofolio' : 'Tambah Portofolio Pasangan Baru'}
                </h3>
            </div>
            <div class="kalaila-modal-body">
                <form id="kalailaPortfolioForm" style="display: flex; flex-direction: column; gap: 14px;">
                    <div>
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary-color); display: block; margin-bottom: 4px;">Nama Pasangan / Judul Project</label>
                        <input type="text" id="portName" value="${item.name.replace(/"/g, '&quot;')}" placeholder="Contoh: Rian & Maya" required style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color); font-family: var(--font-body); font-size: 0.9rem;">
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary-color); display: block; margin-bottom: 4px;">Kategori Momen</label>
                        <select id="portCategory" style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color); font-family: var(--font-body); font-size: 0.9rem; background: white;">
                            <option value="prewedding" ${item.category === 'prewedding' ? 'selected' : ''}>Pre-Wedding</option>
                            <option value="wedding" ${item.category === 'wedding' ? 'selected' : ''}>Pernikahan (Wedding)</option>
                            <option value="engagement" ${item.category === 'engagement' ? 'selected' : ''}>Engagement & Sangjit</option>
                            <option value="maternity" ${item.category === 'maternity' ? 'selected' : ''}>Maternity & Family</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary-color); display: block; margin-bottom: 4px;">Lokasi & Tempat Acara</label>
                        <input type="text" id="portLoc" value="${item.location.replace(/"/g, '&quot;')}" placeholder="Contoh: Pine Forest & Meadow • Bandung" required style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color); font-family: var(--font-body); font-size: 0.9rem;">
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary-color); display: block; margin-bottom: 6px;">Upload Foto Galeri (Bisa Tambah s/d Maksimal 30 Foto)</label>
                        <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 16px; text-align: center; cursor: pointer; transition: all 0.2s ease;" onclick="document.getElementById('portPhotosFileInput').click()" onmouseover="this.style.borderColor='var(--gold-accent)'" onmouseout="this.style.borderColor='#cbd5e1'">
                            <i class="fas fa-cloud-upload-alt" style="font-size: 1.8rem; color: var(--gold-accent); margin-bottom: 6px;"></i>
                            <div style="font-size: 0.9rem; font-weight: 700; color: var(--primary-color);">📁 Klik untuk Tambah Foto dari Komputer Anda</div>
                            <div style="font-size: 0.76rem; color: var(--light-text);" id="photosFileStatus">Dapat memilih hingga maksimal 30 foto sekaligus dari folder lokal.</div>
                            <input type="file" id="portPhotosFileInput" accept="image/*" multiple style="display: none;">
                        </div>
                    </div>

                    <!-- Live Thumbnail Preview List -->
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary-color);">Daftar Foto Galeri Pasangan (<span id="photoCountNum">${currentFormPhotos.length}</span> / 30 Foto):</label>
                            <span style="font-size: 0.75rem; color: var(--light-text);">Klik ✕ untuk hapus | Klik 'Cover' untuk sampul</span>
                        </div>
                        <div id="portPhotosPreviewGrid" style="display: flex; gap: 10px; overflow-x: auto; padding: 10px; background: #f1f5f9; border-radius: 10px; min-height: 90px; align-items: center;"></div>
                    </div>

                    <div>
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary-color); display: block; margin-bottom: 4px;">Path Foto Sampul (Cover Utama)</label>
                        <input type="text" id="portCover" value="${item.cover.replace(/"/g, '&quot;')}" placeholder="Pilih dari tombol 'Cover' di atas..." style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-body); font-size: 0.8rem;">
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                        <button type="button" class="kalaila-modal-btn kalaila-modal-btn-secondary" id="cancelPortModalBtn">Batal</button>
                        <button type="submit" class="kalaila-modal-btn kalaila-modal-btn-primary"><i class="fas fa-save" style="margin-right: 6px;"></i> Simpan Portofolio</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeOverlay = () => {
        overlay.classList.remove('active');
        overlay.classList.add('closing');
        setTimeout(() => overlay.remove(), 250);
    };

    document.getElementById('closePortModalBtn').addEventListener('click', closeOverlay);
    document.getElementById('cancelPortModalBtn').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });

    function renderFormPhotoPreviews() {
        const grid = document.getElementById('portPhotosPreviewGrid');
        const countSpan = document.getElementById('photoCountNum');
        if (!grid) return;

        if (countSpan) countSpan.textContent = currentFormPhotos.length;

        if (currentFormPhotos.length === 0) {
            grid.innerHTML = '<p style="font-size: 0.78rem; color: var(--light-text); font-style: italic; width: 100%; text-align: center; margin: 0;">Belum ada foto. Klik kotak upload di atas untuk menambahkan foto dari komputer Anda.</p>';
            return;
        }

        let html = '';
        const currentCover = document.getElementById('portCover').value;

        currentFormPhotos.forEach((src, idx) => {
            const isCover = (currentCover === src);
            html += `
                <div style="position: relative; width: 75px; height: 75px; border-radius: 10px; overflow: hidden; border: 2px solid ${isCover ? 'var(--gold-accent)' : '#cbd5e1'}; background: #07080f; flex-shrink: 0;">
                    <img src="${src}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='images/wedding.jpg';">
                    <button type="button" class="btn-remove-photo" data-idx="${idx}" title="Hapus foto ini" style="position: absolute; top: 3px; right: 3px; background: rgba(220, 38, 38, 0.9); color: white; border: none; width: 20px; height: 20px; border-radius: 50%; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;">&times;</button>
                    <button type="button" class="btn-set-cover" data-src="${src.replace(/"/g, '&quot;')}" title="Jadikan Sampul Cover" style="position: absolute; bottom: 2px; left: 2px; right: 2px; background: ${isCover ? 'var(--gold-accent)' : 'rgba(0,0,0,0.65)'}; color: ${isCover ? 'var(--primary-color)' : 'white'}; border: none; border-radius: 4px; font-size: 0.6rem; font-weight: 700; cursor: pointer; padding: 2px 0; text-align: center;">
                        ${isCover ? '★ Cover' : 'Cover'}
                    </button>
                </div>
            `;
        });

        grid.innerHTML = html;

        grid.querySelectorAll('.btn-remove-photo').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.getAttribute('data-idx'));
                currentFormPhotos.splice(idx, 1);
                if (currentFormPhotos.length > 0 && !currentFormPhotos.includes(document.getElementById('portCover').value)) {
                    document.getElementById('portCover').value = currentFormPhotos[0];
                }
                renderFormPhotoPreviews();
            });
        });

        grid.querySelectorAll('.btn-set-cover').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const src = btn.getAttribute('data-src');
                document.getElementById('portCover').value = src;
                renderFormPhotoPreviews();
            });
        });
    }

    renderFormPhotoPreviews();

    document.getElementById('portPhotosFileInput').addEventListener('change', async function(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const availableSlot = Math.max(0, 30 - currentFormPhotos.length);

            if (availableSlot <= 0) {
                window.showCustomModal({
                    title: 'Batas Maksimal 30 Foto',
                    message: 'Galeri pasangan ini telah mencapai batas maksimal 30 foto. Hapus beberapa foto untuk menambahkan yang baru.',
                    type: 'warning'
                });
                return;
            }

            if (files.length > availableSlot) {
                window.showCustomModal({
                    title: 'Batas Maksimal 30 Foto',
                    message: `Anda memilih ${files.length} foto. Hanya ${availableSlot} foto pertama yang akan dimasukkan untuk memenuhi kuota maksimal 30 foto.`,
                    type: 'info'
                });
            }

            const filesToProcess = files.slice(0, availableSlot);
            document.getElementById('photosFileStatus').textContent = `Memproses & Mengompres ${filesToProcess.length} Foto Komputer...`;
            for (const file of filesToProcess) {
                const compressed = await compressAndReadImage(file, 800, 0.7);
                currentFormPhotos.push(compressed);
            }
            if (currentFormPhotos.length > 0 && !document.getElementById('portCover').value) {
                document.getElementById('portCover').value = currentFormPhotos[0];
            }
            document.getElementById('photosFileStatus').textContent = `✅ Total ${currentFormPhotos.length} / 30 Foto Terisi dalam Galeri!`;
            renderFormPhotoPreviews();
        }
    });

    document.getElementById('kalailaPortfolioForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('portName').value.trim();
        const category = document.getElementById('portCategory').value;
        const location = document.getElementById('portLoc').value.trim();
        let cover = document.getElementById('portCover').value.trim() || (currentFormPhotos.length > 0 ? currentFormPhotos[0] : 'images/prewed.jpg');

        let photos = currentFormPhotos.length > 0 ? currentFormPhotos : [cover];

        const catNames = {
            prewedding: 'Pre-Wedding',
            wedding: 'Pernikahan (Wedding)',
            engagement: 'Engagement & Sangjit',
            maternity: 'Maternity & Family'
        };

        let currentList = window.getStoredPortfolios();
        const newObj = {
            id: isEdit ? item.id : 'port-' + Date.now(),
            name: name,
            category: category,
            categoryName: catNames[category] || 'Galeri Foto',
            location: location,
            cover: cover,
            photos: photos
        };

        if (isEdit) {
            currentList[editIndex] = newObj;
        } else {
            currentList.unshift(newObj);
        }

        window.savePortfolios(currentList);
        closeOverlay();

        if (typeof window.renderDynamicPortfolios === 'function') window.renderDynamicPortfolios();
        if (typeof window.renderAdminPortfolios === 'function') window.renderAdminPortfolios();

        window.showCustomModal({
            title: isEdit ? 'Berhasil Diperbarui' : 'Berhasil Ditambahkan',
            message: `Portofolio "${name}" dengan ${photos.length} foto telah berhasil disimpan!`,
            type: 'success'
        });
    });
};

window.portfolioLimit = 6;

window.loadMorePortfolios = function() {
    window.portfolioLimit = (window.portfolioLimit || 6) + 6;
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const currentFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    window.renderDynamicPortfolios(currentFilter);
};

window.renderDynamicPortfolios = function(filter = 'all') {
    const grids = [document.getElementById('portfolioGrid'), document.getElementById('homePortfolioGrid')].filter(Boolean);
    if (grids.length === 0) return;

    const list = window.getStoredPortfolios();
    const isAdmin = sessionStorage.getItem('kalaila_admin_logged_in') === 'true';

    grids.forEach(grid => {
        const isHome = grid.id === 'homePortfolioGrid';
        let html = '';
        const filtered = filter === 'all' ? list : list.filter(item => item.category === filter);
        const limit = isHome ? 3 : (window.portfolioLimit || 6);
        const displayList = filtered.slice(0, limit);

        if (displayList.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--light-text); padding: 40px;">Belum ada karya portofolio untuk kategori ini.</p>';
        } else {
            displayList.forEach((item, index) => {
                const realIndex = list.findIndex(p => p.id === item.id);
                const photoCount = item.photos ? item.photos.length : 1;
                const rawPhotosJSON = JSON.stringify(item.photos || [item.cover]).replace(/'/g, '&apos;');
                const animDelay = (index * 0.05).toFixed(2);

                const adminBtns = isAdmin ? `
                    <div style="position: absolute; top: 12px; right: 12px; z-index: 20; display: flex; gap: 6px;">
                        <button onclick="event.stopPropagation(); window.openAddEditPortfolioModal(${realIndex})" class="admin-edit-testimonial-btn" style="position: static; padding: 4px 10px; font-size: 0.75rem;">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="event.stopPropagation(); window.deletePortfolioItem(${realIndex})" class="admin-delete-testimonial-btn" style="position: static; padding: 4px 10px; font-size: 0.75rem;">
                            <i class="fas fa-trash-alt"></i> Hapus
                        </button>
                    </div>
                ` : '';

                html += `
                    <div class="portfolio-item couple-card filtering-in" data-category="${item.category}"
                         style="animation-delay: ${animDelay}s;"
                         data-couple-id="${item.id}"
                         data-couple-name="${item.name.replace(/"/g, '&quot;')}"
                         data-couple-cat="${(item.categoryName || 'Galeri Foto').replace(/"/g, '&quot;')}"
                         data-couple-loc="${item.location.replace(/"/g, '&quot;')}"
                         data-couple-photos='${rawPhotosJSON}'>
                        ${adminBtns}
                        <div class="portfolio-image">
                            <span class="photo-count-badge"><i class="fas fa-images"></i> ${photoCount} Foto Galeri</span>
                            <img src="${item.cover}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='images/prewed.jpg';">
                            <div class="portfolio-overlay">
                                <span class="category-tag">${item.categoryName || 'Galeri Foto'}</span>
                                <h4>${item.name}</h4>
                                <p>${item.location}</p>
                                <button class="open-couple-btn"><i class="fas fa-search-plus"></i> Lihat Foto Pasangan</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            grid.innerHTML = html;
        }

        grid.querySelectorAll('.couple-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (typeof window.openCoupleModal === 'function') {
                    window.openCoupleModal(card);
                }
            });
        });

        if (!isHome) {
            const loadMoreContainer = document.getElementById('loadMorePortfoliosContainer');
            if (loadMoreContainer) {
                const remaining = filtered.length - displayList.length;
                if (remaining > 0) {
                    loadMoreContainer.innerHTML = `
                        <div style="text-align: center; margin-top: 48px; width: 100%;">
                            <button onclick="window.loadMorePortfolios()" class="cta-button primary" style="padding: 16px 40px; font-size: 1rem; border-radius: 50px; cursor: pointer; box-shadow: 0 8px 24px rgba(212, 175, 55, 0.35); transition: all 0.3s ease;">
                                <i class="fas fa-plus-circle" style="margin-right: 8px;"></i> Tampilkan Lebih Banyak Karya
                            </button>
                        </div>
                    `;
                } else if (filtered.length > 6) {
                    loadMoreContainer.innerHTML = `
                        <div style="text-align: center; margin-top: 40px; width: 100%;">
                            <span style="font-size: 0.88rem; color: var(--light-text); font-style: italic; background: rgba(0,0,0,0.04); padding: 10px 24px; border-radius: 50px; border: 1px solid var(--border-color);">
                                ✨ Menampilkan Seluruh ${filtered.length} Karya Portofolio Pasangan
                            </span>
                        </div>
                    `;
                } else {
                    loadMoreContainer.innerHTML = '';
                }
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {

    // ========== PAGE LOADER & TRANSITION HANDLER ==========
    const pageLoader = document.getElementById('pageLoader');
    const loaderProgress = document.querySelector('.loader-progress');

    function hidePageLoader() {
        if (pageLoader) {
            pageLoader.classList.add('fade-out');
        }
    }

    hidePageLoader();
    window.addEventListener('load', hidePageLoader);
    window.addEventListener('pageshow', hidePageLoader);
    setTimeout(hidePageLoader, 350);

    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = this.getAttribute('target');

            if (!href || href === '#' || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me') || target === '_blank') {
                return;
            }

            e.preventDefault();
            if (pageLoader) {
                pageLoader.classList.remove('fade-out');
                if (loaderProgress) {
                    loaderProgress.style.animation = 'none';
                    loaderProgress.offsetHeight;
                    loaderProgress.style.animation = 'loaderFill 0.35s ease forwards';
                }
                setTimeout(() => {
                    window.location.href = href;
                }, 350);
            } else {
                window.location.href = href;
            }
        });
    });

    // ========== PROMO COUNTDOWN TIMER ==========
    const promoTimerElement = document.getElementById('promoTimer');
    if (promoTimerElement) {
        // Set target date 3 days from now
        let targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
        
        setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            promoTimerElement.textContent = `${hours}j ${minutes}m ${seconds}d`;
        }, 1000);
    }

    // ========== CONCEPT & MOODBOARD QUIZ MATCHERS ==========
    let quizData = {
        event: 'Wedding Day (Akad & Resepsi)',
        tone: 'Warm Vintage & Tone Terang',
        location: 'Outdoor Nature & Garden'
    };

    const quizOptions = document.querySelectorAll('.quiz-option-card');
    const quizSteps = document.querySelectorAll('.quiz-step-content');
    const quizIndicators = document.querySelectorAll('.quiz-step-indicator');
    const btnNextQuiz = document.getElementById('btnNextQuiz');
    const btnClaimQuiz = document.getElementById('btnClaimQuiz');

    let currentQuizStep = 1;

    quizOptions.forEach(card => {
        card.addEventListener('click', function() {
            const step = this.closest('.quiz-step-content').getAttribute('data-step');
            const val = this.getAttribute('data-val');
            const type = this.getAttribute('data-type');

            // Remove selected in current step
            this.closest('.quiz-step-content').querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');

            quizData[type] = val;
        });
    });

    if (btnNextQuiz) {
        btnNextQuiz.addEventListener('click', () => {
            if (currentQuizStep < 3) {
                currentQuizStep++;
                updateQuizUI();
            } else if (currentQuizStep === 3) {
                // Finish quiz
                currentQuizStep = 4;
                updateQuizUI();
            }
        });
    }

    function updateQuizUI() {
        quizSteps.forEach(s => s.classList.remove('active'));
        const targetStep = document.querySelector(`.quiz-step-content[data-step="${currentQuizStep}"]`);
        if (targetStep) targetStep.classList.add('active');

        quizIndicators.forEach((ind, i) => {
            const stepNum = i + 1;
            ind.classList.remove('active', 'completed');
            if (stepNum === currentQuizStep) ind.classList.add('active');
            else if (stepNum < currentQuizStep) ind.classList.add('completed');
        });

        if (currentQuizStep === 4) {
            // Render Result
            const quizResultSummary = document.getElementById('quizResultSummary');
            if (quizResultSummary) {
                quizResultSummary.innerHTML = `
                    <p style="font-size: 1.05rem; margin-bottom: 16px; color: var(--primary-color); line-height: 1.6;">
                        Berdasarkan kuis, solusi konsep foto ideal Anda adalah <strong>${quizData.event}</strong> dengan nuansa <strong>${quizData.tone}</strong> di lokasi <strong>${quizData.location}</strong>.
                    </p>
                `;
            }

            if (btnClaimQuiz) {
                const message = `Halo Kalaila Photography, saya telah mengisi Kuis Solusi Konsep Foto:\n- Acara: ${quizData.event}\n- Tone Foto: ${quizData.tone}\n- Lokasi: ${quizData.location}\n\nSaya ingin mendapatkan Panduan PDF Moodboard & Referensi Konsep Kustom beserta konsultasi gratis!`;
                btnClaimQuiz.onclick = () => {
                    if (typeof window.showBookingToast === 'function') {
                        window.showBookingToast('Konsep Foto Terkonfirmasi!', `${quizData.event} • ${quizData.tone}`, 'Menghubungkan ke WA Admin');
                    }
                    window.open(`https://wa.me/6282318928400?text=${encodeURIComponent(message)}`, '_blank');
                };
            }
            if (btnNextQuiz) btnNextQuiz.style.display = 'none';
        }
    }

    // ========== BEFORE/AFTER COLOR GRADING SLIDER ==========
    const baContainer = document.querySelector('.ba-container');
    const baAfterImg = document.querySelector('.ba-img-after');
    const baSliderLine = document.querySelector('.ba-slider-line');

    if (baContainer && baAfterImg && baSliderLine) {
        let isDragging = false;

        function setSliderPosition(x) {
            const rect = baContainer.getBoundingClientRect();
            let offsetX = x - rect.left;
            if (offsetX < 0) offsetX = 0;
            if (offsetX > rect.width) offsetX = rect.width;

            const percentage = (offsetX / rect.width) * 100;
            baAfterImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
            baSliderLine.style.left = `${percentage}%`;
        }

        baContainer.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => {
            if (isDragging) setSliderPosition(e.clientX);
        });

        baContainer.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches[0]) setSliderPosition(e.touches[0].clientX);
        });
    }

    // ========== REAL-TIME ACTION BOOKING TOAST NOTIFICATION ==========
    const bookingToast = document.getElementById('bookingToast');
    const toastName = document.getElementById('toastName');
    const toastEvent = document.getElementById('toastEvent');
    const toastTime = document.getElementById('toastTime');

    window.showBookingToast = function(title, eventDetail, timeText = 'Baru saja terkonfirmasi') {
        if (bookingToast && toastName && toastEvent && toastTime) {
            toastName.textContent = title;
            toastEvent.textContent = eventDetail;
            toastTime.textContent = timeText;

            bookingToast.classList.add('show');
            setTimeout(() => {
                bookingToast.classList.remove('show');
            }, 5000);
        }
    };

    // ========== MOBILE MENU TOGGLE & DROPDOWN ==========
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const parent = this.closest('.nav-dropdown');
            if (parent) {
                parent.classList.toggle('open');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
        }
    });

    // ========== ADMIN LINK IN NAVBAR SYNC ==========
    const isAdminLoggedIn = sessionStorage.getItem('kalaila_admin_logged_in') === 'true';
    document.querySelectorAll('.nav-admin-link').forEach(link => {
        if (isAdminLoggedIn) {
            link.href = 'admin.html';
            link.innerHTML = '<i class="fas fa-user-shield"></i> Panel Admin <span class="admin-badge-online" title="Mode Admin Aktif"></span>';
            link.classList.add('logged-in');
            link.title = 'Buka Dashboard Admin (Sedang Login)';
        } else {
            link.href = 'admin-login.html';
            link.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            link.classList.remove('logged-in');
            link.title = 'Login Admin';
        }
    });

    // ========== NAVBAR BACKGROUND ON SCROLL ==========
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                navbar.style.backgroundColor = '#ffffff';
            } else {
                navbar.style.boxShadow = '0 1px 0 rgba(0, 0, 0, 0.04)';
                navbar.style.backgroundColor = '#ffffff';
            }
        });
    }

    // ========== PORTFOLIO INTERACTIVE CATEGORY FILTER ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            window.portfolioLimit = 6;
            const filterValue = this.getAttribute('data-filter');
            if (typeof window.renderDynamicPortfolios === 'function') {
                window.renderDynamicPortfolios(filterValue);
            }
        });
    });

    // ========== LIGHTBOX MODAL PREVIEW ==========
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxSub = document.getElementById('lightboxSub');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');

    let currentLightBoxIndex = 0;
    const lightboxTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));

    function openLightbox(index) {
        if (!lightboxTriggers[index]) return;
        currentLightBoxIndex = index;
        const trigger = lightboxTriggers[index];
        const src = trigger.getAttribute('data-fullsrc');
        const title = trigger.getAttribute('data-title');
        const sub = trigger.getAttribute('data-sub');

        lightboxImg.src = src;
        lightboxTitle.textContent = title || '';
        lightboxSub.textContent = sub || '';
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    lightboxTriggers.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(idx);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentLightBoxIndex = (currentLightBoxIndex - 1 + lightboxTriggers.length) % lightboxTriggers.length;
            openLightbox(currentLightBoxIndex);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentLightBoxIndex = (currentLightBoxIndex + 1) % lightboxTriggers.length;
            openLightbox(currentLightBoxIndex);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
            if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
        }
    });

    // ========== COUPLE GALLERY MODAL HANDLER ==========
    const coupleModal = document.getElementById('coupleModal');
    const coupleModalOverlay = document.getElementById('coupleModalOverlay');
    const coupleModalClose = document.getElementById('coupleModalClose');
    const coupleModalTitle = document.getElementById('coupleModalTitle');
    const coupleModalSub = document.getElementById('coupleModalSub');
    const coupleMainImg = document.getElementById('coupleMainImg');
    const coupleThumbsGrid = document.getElementById('coupleThumbsGrid');
    const coupleWaBtn = document.getElementById('coupleWaBtn');
    const couplePrevBtn = document.getElementById('couplePrevBtn');
    const coupleNextBtn = document.getElementById('coupleNextBtn');

    let currentCouplePhotos = [];
    let currentCouplePhotoIndex = 0;

    function switchCouplePhoto(index) {
        if (!currentCouplePhotos || currentCouplePhotos.length === 0) return;
        currentCouplePhotoIndex = (index + currentCouplePhotos.length) % currentCouplePhotos.length;
        const newSrc = currentCouplePhotos[currentCouplePhotoIndex];

        if (coupleMainImg) {
            coupleMainImg.style.opacity = '0.3';
            setTimeout(() => {
                coupleMainImg.src = newSrc;
                coupleMainImg.onerror = function() {
                    this.onerror = null;
                    this.src = 'images/wedding1.jpg';
                };
                coupleMainImg.style.opacity = '1';
            }, 150);
        }

        // Sync active thumb
        document.querySelectorAll('.couple-thumb-item').forEach((t, i) => {
            t.classList.toggle('active', i === currentCouplePhotoIndex);
        });
    }

    window.openCoupleModal = function(card) {
        const coupleModal = document.getElementById('coupleModal');
        const coupleModalTitle = document.getElementById('coupleModalTitle');
        const coupleModalSub = document.getElementById('coupleModalSub');
        const coupleMainImg = document.getElementById('coupleMainImg');
        const coupleThumbsGrid = document.getElementById('coupleThumbsGrid');
        const coupleWaBtn = document.getElementById('coupleWaBtn');

        if (!coupleModal) return;

        const coupleName = card.getAttribute('data-couple-name') || 'Galeri Pasangan';
        const coupleCat = card.getAttribute('data-couple-cat') || '';
        const coupleLoc = card.getAttribute('data-couple-loc') || '';
        const rawPhotos = card.getAttribute('data-couple-photos');

        try {
            currentCouplePhotos = JSON.parse(rawPhotos);
        } catch (e) {
            currentCouplePhotos = ['images/profile.jpg', 'images/prewed.jpg', 'images/wedding.jpg'];
        }
        currentCouplePhotoIndex = 0;

        if (coupleModalTitle) coupleModalTitle.textContent = `Galeri Foto: ${coupleName}`;
        if (coupleModalSub) coupleModalSub.textContent = `${coupleCat.toUpperCase()} • ${coupleLoc}`;

        if (coupleMainImg && currentCouplePhotos.length > 0) {
            coupleMainImg.src = currentCouplePhotos[0];
            coupleMainImg.onerror = function() {
                this.onerror = null;
                this.src = 'images/wedding1.jpg';
            };
            coupleMainImg.alt = `${coupleName} Photo`;
        }

        if (coupleThumbsGrid) {
            coupleThumbsGrid.innerHTML = '';
            currentCouplePhotos.forEach((src, idx) => {
                const thumb = document.createElement('div');
                thumb.className = `couple-thumb-item ${idx === 0 ? 'active' : ''}`;
                thumb.innerHTML = `<img src="${src}" alt="Foto ${idx + 1}" onerror="this.onerror=null; this.src='images/wedding.jpg';">`;
                thumb.addEventListener('click', () => {
                    switchCouplePhoto(idx);
                });
                coupleThumbsGrid.appendChild(thumb);
            });
        }

        if (coupleWaBtn) {
            coupleWaBtn.href = `https://wa.me/6282318928400?text=${encodeURIComponent(`Halo Kalaila Photography, saya sangat menyukai konsep foto galeri pasangan ${coupleName} (${coupleCat} di ${coupleLoc}). Bisakah konsultasi paket & konsep serupa?`)}`;
        }

        const activeCouple = {
            name: coupleName,
            categoryName: coupleCat,
            location: coupleLoc,
            photos: currentCouplePhotos
        };
        try {
            sessionStorage.setItem('kalaila_active_couple', JSON.stringify(activeCouple));
        } catch (e) {}

        const coupleDetailLink = document.getElementById('coupleDetailLink');
        if (coupleDetailLink) {
            coupleDetailLink.href = `couple-detail.html?name=${encodeURIComponent(coupleName)}`;
        }

        coupleModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeCoupleModal = function() {
        const coupleModal = document.getElementById('coupleModal');
        if (coupleModal) {
            coupleModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    if (couplePrevBtn) {
        couplePrevBtn.addEventListener('click', () => {
            switchCouplePhoto(currentCouplePhotoIndex - 1);
        });
    }

    if (coupleNextBtn) {
        coupleNextBtn.addEventListener('click', () => {
            switchCouplePhoto(currentCouplePhotoIndex + 1);
        });
    }

    document.querySelectorAll('.couple-card').forEach(card => {
        card.addEventListener('click', (e) => {
            window.openCoupleModal(card);
        });
    });

    if (coupleModalClose) coupleModalClose.addEventListener('click', window.closeCoupleModal);
    if (coupleModalOverlay) coupleModalOverlay.addEventListener('click', window.closeCoupleModal);

    document.addEventListener('keydown', (e) => {
        if (coupleModal && coupleModal.classList.contains('active')) {
            if (e.key === 'Escape') closeCoupleModal();
            if (e.key === 'ArrowLeft') switchCouplePhoto(currentCouplePhotoIndex - 1);
            if (e.key === 'ArrowRight') switchCouplePhoto(currentCouplePhotoIndex + 1);
        }
    });

    // ========== REAL 2026 CALENDAR SYSTEM & AVAILABILITY CHECKER ==========
    const availabilityForm = document.getElementById('availabilityForm');
    const availabilityResult = document.getElementById('availabilityResult');
    const calendarDatesGrid = document.getElementById('calendarDatesGrid');

    const monthNamesIndo = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    let clientCalYear = 2026;
    let clientCalMonth = 6; // July 2026 (0-indexed)

    // Initial default booked & limited slot maps for July 2026
    let defaultISOBooked = {
        "2026-07-06": 0, "2026-07-12": 0, "2026-07-18": 0, "2026-07-25": 0,
        "2026-07-03": 1, "2026-07-08": 1, "2026-07-14": 1, "2026-07-20": 1, "2026-07-27": 1, "2026-07-29": 1,
        "2026-07-02": 2, "2026-07-05": 2, "2026-07-09": 2, "2026-07-15": 2, "2026-07-22": 2, "2026-07-28": 2
    };

    function getISOSlotsMap() {
        const saved = localStorage.getItem('kalaila_iso_slots');
        if (saved) {
            try { return JSON.parse(saved); } catch(e){}
        }
        const oldSaved = localStorage.getItem('kalaila_day_slots');
        if (oldSaved) {
            try {
                const oldMap = JSON.parse(oldSaved);
                let migrated = { ...defaultISOBooked };
                Object.keys(oldMap).forEach(day => {
                    const isoKey = `2026-07-${String(day).padStart(2, '0')}`;
                    migrated[isoKey] = parseInt(oldMap[day]);
                });
                return migrated;
            } catch(e){}
        }
        return defaultISOBooked;
    }

    window.getRemainingSlotsISO = function(isoDate) {
        const map = getISOSlotsMap();
        if (map.hasOwnProperty(isoDate)) {
            return parseInt(map[isoDate]);
        }
        return 3;
    };

    window.renderRealCalendar = function(containerId, year, month, isAdminMode = false) {
        const gridContainer = document.getElementById(containerId);
        if (!gridContainer) return;

        const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 3 = Wed
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const todayObj = new Date();
        const curY = todayObj.getFullYear();
        const curM = todayObj.getMonth();
        const curD = todayObj.getDate();

        let gridHTML = '';

        // 1. First Day Offset Padding Chips
        for (let i = 0; i < firstDayIndex; i++) {
            gridHTML += `<div class="date-chip-empty"></div>`;
        }

        // 2. Real Days of Month
        for (let day = 1; day <= daysInMonth; day++) {
            const formattedISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const slots = window.getRemainingSlotsISO(formattedISO);

            let statusClass = 'status-available';
            let badgeText = `Sisa ${slots} Slot`;

            if (slots === 0) {
                statusClass = 'status-booked';
                badgeText = 'Full Booked';
            } else if (slots <= 2) {
                statusClass = 'status-limited';
                badgeText = `Sisa ${slots} Slot`;
            }

            const isToday = (year === curY && month === curM && day === curD);
            const chipClass = isAdminMode ? 'date-chip-admin' : 'date-chip';

            gridHTML += `
                <div class="${chipClass} ${statusClass} ${isToday ? 'is-today' : ''}" data-day="${day}" data-date="${formattedISO}">
                    <span class="day-num">${day}</span>
                    <span class="status-badge">${badgeText}</span>
                </div>
            `;
        }

        gridContainer.innerHTML = gridHTML;

        // Click listeners
        gridContainer.querySelectorAll('.date-chip, .date-chip-admin').forEach(chip => {
            chip.addEventListener('click', function() {
                const selectedISO = this.getAttribute('data-date');

                if (isAdminMode) {
                    let curSlots = window.getRemainingSlotsISO(selectedISO);
                    curSlots = (curSlots > 0) ? curSlots - 1 : 3;

                    let map = getISOSlotsMap();
                    map[selectedISO] = curSlots;
                    localStorage.setItem('kalaila_iso_slots', JSON.stringify(map));

                    window.renderRealCalendar(containerId, year, month, true);
                    if (typeof window.updateAdminStats === 'function') {
                        window.updateAdminStats();
                    }
                } else {
                    gridContainer.querySelectorAll('.date-chip').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');

                    const eventDateInput = document.getElementById('eventDate');
                    if (eventDateInput && selectedISO) {
                        eventDateInput.value = selectedISO;
                    }

                    const bannerContainer = document.getElementById('selectedDateBannerContainer');
                    if (bannerContainer) {
                        const dateObj = new Date(selectedISO);
                        const formattedFull = dateObj.toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        const slots = window.getRemainingSlotsISO(selectedISO);

                        let badgeColor = slots === 0 ? '#dc2626' : (slots <= 2 ? '#d35400' : '#16a34a');
                        let statusText = slots === 0 ? 'Full Booked (Slot Terisi Penuh)' : `Sisa ${slots} Slot Tersedia`;
                        let waText = slots === 0 
                            ? `Halo Kalaila Photography, saya mengecek tanggal ${formattedFull} dan terisi penuh. Bisakah konsultasi tanggal alternatif?`
                            : `Halo Kalaila Photography, saya tertarik booking liputan untuk tanggal ${formattedFull} (${statusText}). Bisakah bantu prosesnya?`;

                        bannerContainer.innerHTML = `
                            <div class="selected-date-banner">
                                <div class="date-info">
                                    <div class="date-icon" style="background: ${badgeColor};">
                                        <i class="${slots === 0 ? 'fas fa-calendar-times' : 'fas fa-calendar-check'}"></i>
                                    </div>
                                    <div>
                                        <h4>${formattedFull}</h4>
                                        <p style="color: ${badgeColor}; font-weight: 700;">Status: ${statusText}</p>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                    <a href="https://wa.me/6282318928400?text=${encodeURIComponent(waText)}" target="_blank" class="cta-button primary" style="padding: 10px 20px; font-size: 0.88rem; text-decoration: none;">
                                        <i class="fab fa-whatsapp"></i> ${slots === 0 ? 'Tanya Tanggal Alternatif' : 'Booking Tanggal Ini via WA'}
                                    </a>
                                </div>
                            </div>
                        `;
                    }
                }
            });
        });
    };

    // Custom Calendar Select Dropdown Component
    window.initCustomCalendarSelects = function() {
        const selects = document.querySelectorAll('.calendar-select');
        selects.forEach(select => {
            if (select.dataset.customized === 'true') return;
            select.dataset.customized = 'true';

            const wrapper = document.createElement('div');
            wrapper.className = 'custom-calendar-select-wrapper';

            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'custom-calendar-select-trigger';
            trigger.setAttribute('aria-haspopup', 'listbox');
            
            const label = document.createElement('span');
            label.className = 'custom-select-label';
            
            const arrow = document.createElement('i');
            arrow.className = 'fas fa-chevron-down custom-select-arrow';
            
            trigger.appendChild(label);
            trigger.appendChild(arrow);

            const menu = document.createElement('div');
            menu.className = 'custom-calendar-select-menu';

            function buildMenu() {
                menu.innerHTML = '';
                Array.from(select.options).forEach(opt => {
                    const item = document.createElement('div');
                    item.className = 'custom-calendar-select-option';
                    if (String(opt.value) === String(select.value)) {
                        item.classList.add('selected');
                    }
                    item.textContent = opt.textContent;
                    item.dataset.value = opt.value;

                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (String(select.value) !== String(opt.value)) {
                            select.value = opt.value;
                            select.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        closeMenu();
                    });
                    menu.appendChild(item);
                });
                updateLabel();
            }

            function updateLabel() {
                const selectedOpt = select.options[select.selectedIndex];
                if (selectedOpt) {
                    label.textContent = selectedOpt.textContent;
                }
                menu.querySelectorAll('.custom-calendar-select-option').forEach(item => {
                    if (String(item.dataset.value) === String(select.value)) {
                        item.classList.add('selected');
                    } else {
                        item.classList.remove('selected');
                    }
                });
            }

            function openMenu() {
                document.querySelectorAll('.custom-calendar-select-wrapper.open').forEach(w => {
                    if (w !== wrapper) w.classList.remove('open');
                });
                wrapper.classList.add('open');
                const selectedItem = menu.querySelector('.custom-calendar-select-option.selected');
                if (selectedItem) {
                    selectedItem.scrollIntoView({ block: 'nearest' });
                }
            }

            function closeMenu() {
                wrapper.classList.remove('open');
            }

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                if (wrapper.classList.contains('open')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            select._syncCustomSelect = updateLabel;

            select.addEventListener('change', () => {
                updateLabel();
            });

            select.parentNode.insertBefore(wrapper, select);
            wrapper.appendChild(select);
            wrapper.appendChild(trigger);
            wrapper.appendChild(menu);

            buildMenu();
        });
    };

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-calendar-select-wrapper')) {
            document.querySelectorAll('.custom-calendar-select-wrapper.open').forEach(w => {
                w.classList.remove('open');
            });
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof window.initCustomCalendarSelects === 'function') {
                window.initCustomCalendarSelects();
            }
        });
    } else {
        if (typeof window.initCustomCalendarSelects === 'function') {
            window.initCustomCalendarSelects();
        }
    }

    function updateClientCalendarHeader() {
        const mSelect = document.getElementById('clientMonthSelect');
        const ySelect = document.getElementById('clientYearSelect');
        if (mSelect) {
            mSelect.value = clientCalMonth;
            if (typeof mSelect._syncCustomSelect === 'function') mSelect._syncCustomSelect();
        }
        if (ySelect) {
            ySelect.value = clientCalYear;
            if (typeof ySelect._syncCustomSelect === 'function') ySelect._syncCustomSelect();
        }
    }

    function renderClientCalendar() {
        if (typeof window.initCustomCalendarSelects === 'function') {
            window.initCustomCalendarSelects();
        }
        updateClientCalendarHeader();
        window.renderRealCalendar('calendarDatesGrid', clientCalYear, clientCalMonth, false);
    }

    if (calendarDatesGrid) {
        renderClientCalendar();

        const prevClientBtn = document.getElementById('prevClientMonthBtn');
        const nextClientBtn = document.getElementById('nextClientMonthBtn');
        const clientMSelect = document.getElementById('clientMonthSelect');
        const clientYSelect = document.getElementById('clientYearSelect');

        if (prevClientBtn) {
            prevClientBtn.addEventListener('click', () => {
                if (clientCalMonth > 0) {
                    clientCalMonth--;
                } else {
                    clientCalMonth = 11;
                    clientCalYear--;
                }
                renderClientCalendar();
            });
        }

        if (nextClientBtn) {
            nextClientBtn.addEventListener('click', () => {
                if (clientCalMonth < 11) {
                    clientCalMonth++;
                } else {
                    clientCalMonth = 0;
                    clientCalYear++;
                }
                renderClientCalendar();
            });
        }

        if (clientMSelect) {
            clientMSelect.addEventListener('change', function() {
                clientCalMonth = parseInt(this.value);
                renderClientCalendar();
            });
        }

        if (clientYSelect) {
            clientYSelect.addEventListener('change', function() {
                clientCalYear = parseInt(this.value);
                renderClientCalendar();
            });
        }

        const todayJumpBtn = document.getElementById('todayJumpClientBtn');
        if (todayJumpBtn) {
            todayJumpBtn.addEventListener('click', () => {
                const now = new Date();
                clientCalYear = now.getFullYear();
                clientCalMonth = now.getMonth();
                renderClientCalendar();
            });
        }
    }

    if (availabilityForm && availabilityResult) {
        availabilityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dateVal = document.getElementById('eventDate').value;
            const typeVal = document.getElementById('eventType').value;
            const cityVal = document.getElementById('eventCity').value;

            if (!dateVal || !typeVal || !cityVal) {
                alert('Mohon lengkapi seluruh kolom pengecekan!');
                return;
            }

            const inputDate = new Date(dateVal);
            const formattedDate = inputDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const slots = window.getRemainingSlotsISO ? window.getRemainingSlotsISO(dateVal) : 3;

            if (slots === 0) {
                if (typeof window.showBookingToast === 'function') {
                    window.showBookingToast('Pengecekan Slot: FULL BOOKED', `${formattedDate}`, 'Slot Liputan Terisi Penuh');
                }

                availabilityResult.className = 'availability-result error';
                availabilityResult.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                        <div>
                            <span style="font-size: 1.1rem; color: #c0392b; font-weight: 700;"><i class="fas fa-times-circle"></i> Slot Terisi Penuh (Full Booked)!</span>
                            <p style="font-weight: 400; font-size: 0.92rem; margin-top: 4px; color: var(--text-color);">
                                Mohon maaf, pada tanggal <strong>${formattedDate}</strong> di <strong>${cityVal}</strong> slot tim liputan Kalaila Photography sudah <strong>TERISI PENUH (0 Slot Sisa)</strong>.
                            </p>
                        </div>
                        <a href="https://wa.me/6282318928400?text=${encodeURIComponent(`Halo Kalaila Photography, saya telah mengecek ketersediaan tanggal ${formattedDate} di ${cityVal} dan hasilnya Full Booked. Bisakah konsultasi tanggal alternatif?`)}" 
                           target="_blank" 
                           style="background: var(--gold-accent); color: var(--primary-color); text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.88rem;">
                           <i class="fab fa-whatsapp"></i> Tanya Tanggal Alternatif via WA
                        </a>
                    </div>
                `;
            } else if (slots === 1) {
                if (typeof window.showBookingToast === 'function') {
                    window.showBookingToast('Slot Terbatas!', `${formattedDate} • Sisa 1 Slot`, 'Segera amankan slot Anda!');
                }

                availabilityResult.className = 'availability-result success';
                availabilityResult.style.borderColor = '#d35400';
                availabilityResult.style.background = '#fff9f4';
                availabilityResult.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                        <div>
                            <span style="font-size: 1.1rem; color: #d35400; font-weight: 700;"><i class="fas fa-exclamation-triangle"></i> SLOT TERBATAS — SISA 1 SLOT KALAILA!</span>
                            <p style="font-weight: 400; font-size: 0.92rem; margin-top: 4px; color: var(--text-color);">
                                Perhatian! Tanggal <strong>${formattedDate}</strong> di <strong>${cityVal}</strong> untuk <strong>${typeVal}</strong> hanya menyisakan <strong>1 SLOT TERAKHIR</strong>. Mohon amankan sekarang sebelum terisi penuh.
                            </p>
                        </div>
                        <a href="https://wa.me/6282318928400?text=${encodeURIComponent(`Halo Kalaila Photography, saya mengecek ketersediaan tanggal ${formattedDate} di ${cityVal} untuk ${typeVal} dan sisa 1 slot terakhir! Saya ingin mengamankan slot ini sekarang.`)}" 
                           target="_blank" 
                           style="background: #d35400; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.88rem;">
                           <i class="fab fa-whatsapp"></i> Amankan 1 Slot Terakhir
                        </a>
                    </div>
                `;
            } else {
                if (typeof window.showBookingToast === 'function') {
                    window.showBookingToast('Pengecekan Slot Terverifikasi!', `${typeVal} • ${cityVal}`, `Sisa ${slots} Slot Tersedia`);
                }

                availabilityResult.className = 'availability-result success';
                availabilityResult.style.borderColor = '#2ecc71';
                availabilityResult.style.background = '#f0faf4';
                availabilityResult.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                        <div>
                            <span style="font-size: 1.1rem; color: #27ae60; font-weight: 700;"><i class="fas fa-check-circle"></i> Slot Masih Tersedia (Sisa ${slots} Slot)!</span>
                            <p style="font-weight: 400; font-size: 0.92rem; margin-top: 4px; color: var(--text-color);">
                                Kabar baik! Tanggal <strong>${formattedDate}</strong> di <strong>${cityVal}</strong> untuk <strong>${typeVal}</strong> masih tersedia <strong>SISA ${slots} SLOT</strong>.
                            </p>
                        </div>
                        <a href="https://wa.me/6282318928400?text=${encodeURIComponent(`Halo Kalaila Photography, saya mengecek ketersediaan tanggal ${formattedDate} di ${cityVal} untuk ${typeVal} (Sisa ${slots} slot). Saya ingin booking sekarang.`)}" 
                           target="_blank" 
                           style="background: #25d366; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.88rem;">
                           <i class="fab fa-whatsapp"></i> Amankan Slot Sekarang
                        </a>
                    </div>
                `;
            }
        });
    }

    // ========== COST ESTIMATOR & DP CALCULATOR ==========
    const calcBasePackage = document.getElementById('calcBasePackage');
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
    const summaryDetails = document.getElementById('summaryDetails');
    const calcTotalDisplay = document.getElementById('calcTotalDisplay');
    const dpAmountDisplay = document.getElementById('dpAmountDisplay');
    const finalAmountDisplay = document.getElementById('finalAmountDisplay');
    const btnSendCalc = document.getElementById('btnSendCalc');

    function updateCalculator() {
        if (!calcBasePackage || !summaryDetails || !calcTotalDisplay) return;

        const selectedOption = calcBasePackage.options[calcBasePackage.selectedIndex];
        const basePrice = parseInt(calcBasePackage.value) || 0;
        const baseName = selectedOption.getAttribute('data-name');

        let total = basePrice;
        let selectedAddons = [];

        let htmlDetails = `<div style="display:flex; justify-content:space-between;"><span>${baseName}</span> <span>Rp ${basePrice.toLocaleString('id-ID')}</span></div>`;

        addonCheckboxes.forEach(cb => {
            if (cb.checked) {
                const addOnPrice = parseInt(cb.value) || 0;
                const addOnName = cb.getAttribute('data-name');
                total += addOnPrice;
                selectedAddons.push(addOnName);
                htmlDetails += `<div style="display:flex; justify-content:space-between; color: var(--gold-accent);"><span>+ ${addOnName}</span> <span>Rp ${addOnPrice.toLocaleString('id-ID')}</span></div>`;
            }
        });

        summaryDetails.innerHTML = htmlDetails;
        calcTotalDisplay.textContent = `Rp ${total.toLocaleString('id-ID')}`;

        const dp30 = Math.round(total * 0.3);
        const final70 = total - dp30;

        if (dpAmountDisplay) dpAmountDisplay.textContent = `Rp ${dp30.toLocaleString('id-ID')}`;
        if (finalAmountDisplay) finalAmountDisplay.textContent = `Rp ${final70.toLocaleString('id-ID')}`;

        if (btnSendCalc) {
            const addonText = selectedAddons.length > 0 ? `\nAdd-on: ${selectedAddons.join(', ')}` : '';
            const message = `Halo Kalaila Photography, saya berminat memesan paket:\n- ${baseName}${addonText}\n- Total Estimasi: Rp ${total.toLocaleString('id-ID')}\n- Skema DP 30%: Rp ${dp30.toLocaleString('id-ID')}\n\nSaya ingin langsung konsultasi jadwal!`;
            btnSendCalc.onclick = () => {
                if (typeof window.showBookingToast === 'function') {
                    window.showBookingToast('Simulasi DP 30% Terkalkulasi!', baseName, 'Menghubungkan ke WA Admin');
                }
                window.open(`https://wa.me/6282318928400?text=${encodeURIComponent(message)}`, '_blank');
            };
        }
    }

    if (calcBasePackage) {
        calcBasePackage.addEventListener('change', updateCalculator);
        addonCheckboxes.forEach(cb => cb.addEventListener('change', updateCalculator));
        updateCalculator();
    }

    // Select Package Buttons jump to calculator
    document.querySelectorAll('.select-pkg').forEach(btn => {
        btn.addEventListener('click', function () {
            const pkgName = this.getAttribute('data-pkg');
            if (calcBasePackage && pkgName) {
                for (let i = 0; i < calcBasePackage.options.length; i++) {
                    if (calcBasePackage.options[i].text.includes(pkgName.split(' - ')[0])) {
                        calcBasePackage.selectedIndex = i;
                        updateCalculator();
                        break;
                    }
                }
            }
        });
    });

    // ========== FAQ ACCORDION TOGGLE ==========
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });

    // ========== FLOATING WHATSAPP WIDGET ==========
    const waFloatingBtn = document.getElementById('waFloatingBtn');
    const waChatPopup = document.getElementById('waChatPopup');
    const waClosePopup = document.getElementById('waClosePopup');

    if (waFloatingBtn && waChatPopup) {
        waFloatingBtn.addEventListener('click', () => {
            waChatPopup.classList.toggle('active');
        });

        if (waClosePopup) {
            waClosePopup.addEventListener('click', () => {
                waChatPopup.classList.remove('active');
            });
        }
    }

    // ========== CONTACT FORM WA DIRECT GENERATOR ==========
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const message = document.getElementById('contactMessage').value;

            if (!name || !email || !phone || !message) {
                alert('Mohon lengkapi semua kolom pesan!');
                return;
            }

            if (typeof window.showBookingToast === 'function') {
                window.showBookingToast('Pesan Booking Terkirim!', `Konsultasi dari ${name}`, 'Menghubungkan ke WA Admin');
            }

            const waText = `Halo Kalaila Photography, saya ingin berkonsultasi mengenai jasa foto:
            
*Nama:* ${name}
*Email:* ${email}
*Telepon:* ${phone}
*Pesan/Detail Acara:* ${message}`;

            window.open(`https://wa.me/6282318928400?text=${encodeURIComponent(waText)}`, '_blank');
            this.reset();
        });
    }

    // ========== FOOTER NEWSLETTER FORM ==========
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                const email = emailInput.value;
                alert(`Terima kasih! Katalog Pricelist PDF akan dikirimkan ke email (${email}) dan WhatsApp.`);
                window.open(`https://wa.me/6282318928400?text=${encodeURIComponent(`Halo Kalaila Photography, saya telah mendaftar newsletter dengan email ${email}. Mohon kirimkan Katalog PDF Pricelist & Promo terbaru!`)}`, '_blank');
                this.reset();
            }
        });
    }

    // ========== USER TESTIMONIAL SUBMISSION & DYNAMIC RENDER ==========
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    const userTestimonialForm = document.getElementById('userTestimonialForm');

    const defaultTestimonials = [];

    window.getStoredTestimonials = function() {
        const saved = localStorage.getItem('kalaila_user_testimonials');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [];
            }
        }
        return [];
    };

    window.deleteTestimonial = function(index) {
        window.showCustomModal({
            title: 'Hapus Ulasan?',
            message: 'Apakah Anda yakin ingin menghapus ulasan testimoni ini dari tampilan web?',
            type: 'warning',
            showCancel: true,
            buttonText: 'Ya, Hapus',
            cancelText: 'Batal',
            onConfirm: function() {
                let list = window.getStoredTestimonials();
                if (index >= 0 && index < list.length) {
                    list.splice(index, 1);
                    localStorage.setItem('kalaila_user_testimonials', JSON.stringify(list));
                    if (typeof window.renderTestimonials === 'function') {
                        window.renderTestimonials();
                    }
                    if (typeof window.renderAdminTestimonials === 'function') {
                        window.renderAdminTestimonials();
                    }
                    window.showCustomModal({
                        title: 'Berhasil Dihapus',
                        message: 'Ulasan testimoni telah berhasil dihapus.',
                        type: 'success'
                    });
                }
            }
        });
    };

    window.resetTestimonialsToDefault = function() {
        window.showCustomModal({
            title: 'Bersihkan Semua Ulasan?',
            message: 'Apakah Anda yakin ingin menghapus/membersihkan semua ulasan testimoni?',
            type: 'warning',
            showCancel: true,
            buttonText: 'Ya, Bersihkan Semua',
            cancelText: 'Batal',
            onConfirm: function() {
                localStorage.setItem('kalaila_user_testimonials', JSON.stringify([]));
                if (typeof window.renderTestimonials === 'function') {
                    window.renderTestimonials();
                }
                if (typeof window.renderAdminTestimonials === 'function') {
                    window.renderAdminTestimonials();
                }
                window.showCustomModal({
                    title: 'Berhasil Dibersihkan',
                    message: 'Semua ulasan testimoni telah berhasil dibersihkan!',
                    type: 'success'
                });
            }
        });
    };

    window.renderTestimonials = function() {
        if (!testimonialsGrid) return;
        const list = window.getStoredTestimonials();
        const isAdmin = sessionStorage.getItem('kalaila_admin_logged_in') === 'true';

        let html = '';

        if (isAdmin) {
            html += `
                <div class="admin-testimonial-banner">
                    <span><i class="fas fa-user-shield"></i> <strong>Mode Admin Aktif:</strong> Anda dapat mengelola ulasan langsung dari halaman ini.</span>
                    <button onclick="resetTestimonialsToDefault()" class="btn-clean-testimonials"><i class="fas fa-broom"></i> Bersihkan Semua Ulasan</button>
                </div>
            `;
        }

        if (list.length === 0) {
            html += `
                <div style="grid-column: 1/-1; text-align: center; padding: 48px 24px; background: white; border-radius: 16px; border: 1px dashed var(--border-color); width: 100%;">
                    <i class="fas fa-comment-dots" style="font-size: 2.5rem; color: var(--gold-accent); margin-bottom: 14px; display: block;"></i>
                    <h4 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--primary-color); margin-bottom: 6px;">Belum Ada Ulasan Klien</h4>
                    <p style="font-size: 0.9rem; color: var(--light-text);">Daftar ulasan masih kosong. Ulasan baru yang dikirim oleh pengunjung web akan otomatis tampil di sini!</p>
                </div>
            `;
            testimonialsGrid.innerHTML = html;
            return;
        }

        list.forEach((item, index) => {
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= item.stars) {
                    starsHtml += `<i class="fas fa-star"></i> `;
                } else {
                    starsHtml += `<i class="far fa-star" style="color: #cbd5e1;"></i> `;
                }
            }

            const adminBtns = isAdmin ? `
                <button class="admin-edit-testimonial-btn" onclick="editTestimonial(${index})" title="Edit ulasan ini">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="admin-delete-testimonial-btn" onclick="deleteTestimonial(${index})" title="Hapus ulasan ini">
                    <i class="fas fa-trash-alt"></i> Hapus
                </button>
            ` : '';

            html += `
                <div class="testimonial-card">
                    ${adminBtns}
                    <div class="stars">
                        ${starsHtml}
                    </div>
                    <p>"${item.comment}"</p>
                    <div class="client-info">
                        <div class="client-avatar">${item.avatar || 'KL'}</div>
                        <div>
                            <h4>${item.name}</h4>
                            <span>${item.event}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        testimonialsGrid.innerHTML = html;
    };

    function getInitials(name) {
        if (!name) return 'KL';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    if (testimonialsGrid) {
        window.renderTestimonials();
    }

    if (userTestimonialForm) {
        userTestimonialForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const clientName = document.getElementById('clientName').value.trim();
            const clientEvent = document.getElementById('clientEvent').value.trim();
            const clientComment = document.getElementById('clientComment').value.trim();
            const selectedRating = document.querySelector('input[name="rating"]:checked');
            const ratingVal = selectedRating ? parseInt(selectedRating.value) : 5;

            if (!clientName || !clientEvent || !clientComment) {
                alert('Mohon isi seluruh kolom testimoni!');
                return;
            }

            const newTestimonial = {
                name: clientName,
                event: clientEvent,
                stars: ratingVal,
                comment: clientComment,
                avatar: getInitials(clientName)
            };

            const currentList = window.getStoredTestimonials();
            currentList.unshift(newTestimonial); // Add to top

            localStorage.setItem('kalaila_user_testimonials', JSON.stringify(currentList));
            window.renderTestimonials();
            if (typeof window.renderAdminTestimonials === 'function') {
                window.renderAdminTestimonials();
            }

            alert('Terima kasih banyak telah memberikan ulasan & testimoni untuk kami. Apresiasi dan kepercayaan Anda sangat berarti bagi tim Kalaila Photography untuk terus mengabadikan momen berharga Anda.');
            this.reset();
            if (document.getElementById('star5')) document.getElementById('star5').checked = true;
        });
    }

    console.log('Kalaila Photography Warm Luxury features initialized!');
});

