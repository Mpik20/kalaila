document.addEventListener('DOMContentLoaded', () => {

    // ========== PAGE LOADER & TRANSITION HANDLER ==========
    const pageLoader = document.getElementById('pageLoader');
    const loaderProgress = document.querySelector('.loader-progress');

    window.addEventListener('load', () => {
        if (pageLoader) {
            setTimeout(() => {
                pageLoader.classList.add('fade-out');
            }, 300);
        }
    });

    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = this.getAttribute('target');

            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me') || target === '_blank') {
                return;
            }

            e.preventDefault();
            if (pageLoader) {
                pageLoader.classList.remove('fade-out');
                if (loaderProgress) {
                    loaderProgress.style.animation = 'none';
                    loaderProgress.offsetHeight;
                    loaderProgress.style.animation = 'loaderFill 0.5s ease forwards';
                }
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
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

    // ========== NAVBAR BACKGROUND ON SCROLL ==========
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                navbar.style.boxShadow = '0 4px 20px rgba(26, 26, 46, 0.06)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.boxShadow = '0 1px 0 rgba(0, 0, 0, 0.04)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.96)';
            }
        });
    }

    // ========== PORTFOLIO INTERACTIVE CATEGORY FILTER ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
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
                coupleMainImg.style.opacity = '1';
            }, 150);
        }

        // Sync active thumb
        document.querySelectorAll('.couple-thumb-item').forEach((t, i) => {
            t.classList.toggle('active', i === currentCouplePhotoIndex);
        });
    }

    function openCoupleModal(card) {
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
            coupleMainImg.alt = `${coupleName} Photo`;
        }

        if (coupleThumbsGrid) {
            coupleThumbsGrid.innerHTML = '';
            currentCouplePhotos.forEach((src, idx) => {
                const thumb = document.createElement('div');
                thumb.className = `couple-thumb-item ${idx === 0 ? 'active' : ''}`;
                thumb.innerHTML = `<img src="${src}" alt="Foto ${idx + 1}">`;
                thumb.addEventListener('click', () => {
                    switchCouplePhoto(idx);
                });
                coupleThumbsGrid.appendChild(thumb);
            });
        }

        if (coupleWaBtn) {
            coupleWaBtn.href = `https://wa.me/6282318928400?text=${encodeURIComponent(`Halo Kalaila Photography, saya sangat menyukai konsep foto galeri pasangan ${coupleName} (${coupleCat} di ${coupleLoc}). Bisakah konsultasi paket & konsep serupa?`)}`;
        }

        coupleModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCoupleModal() {
        if (coupleModal) {
            coupleModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

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
            openCoupleModal(card);
        });
    });

    if (coupleModalClose) coupleModalClose.addEventListener('click', closeCoupleModal);
    if (coupleModalOverlay) coupleModalOverlay.addEventListener('click', closeCoupleModal);

    document.addEventListener('keydown', (e) => {
        if (coupleModal && coupleModal.classList.contains('active')) {
            if (e.key === 'Escape') closeCoupleModal();
            if (e.key === 'ArrowLeft') switchCouplePhoto(currentCouplePhotoIndex - 1);
            if (e.key === 'ArrowRight') switchCouplePhoto(currentCouplePhotoIndex + 1);
        }
    });

    // ========== AVAILABILITY DATE CHECKER & CALENDAR OVERVIEW ==========
    const availabilityForm = document.getElementById('availabilityForm');
    const availabilityResult = document.getElementById('availabilityResult');
    const calendarDatesGrid = document.getElementById('calendarDatesGrid');
    const toggleAdminSlotBtn = document.getElementById('toggleAdminSlotMode');

    // Default slots per day (Max 3 slots per day)
    let defaultDaySlots = {
        6: 0, 12: 0, 18: 0, 25: 0, // Full Booked
        3: 1, 8: 1, 14: 1, 20: 1, 27: 1, 29: 1, // Sisa 1 Slot
        2: 2, 5: 2, 9: 2, 15: 2, 22: 2, 28: 2 // Sisa 2 Slot
    };

    let savedSlots = localStorage.getItem('kalaila_day_slots');
    let daySlotsMap = savedSlots ? JSON.parse(savedSlots) : defaultDaySlots;

    let isAdminSlotMode = false;

    function getRemainingSlots(day) {
        if (daySlotsMap.hasOwnProperty(day)) {
            return parseInt(daySlotsMap[day]);
        }
        return 3; // Default 3 slots
    }

    function renderCalendarGrid() {
        if (!calendarDatesGrid) return;

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        let gridHTML = '';
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dayName = dayNames[dateObj.getDay()];
            const slots = getRemainingSlots(day);

            let statusClass = 'status-available';
            let badgeText = `Sisa ${slots} Slot`;

            if (slots === 0) {
                statusClass = 'status-booked';
                badgeText = 'Full Booked';
            } else if (slots <= 2) {
                statusClass = 'status-limited';
                badgeText = `Sisa ${slots} Slot`;
            }

            const formattedDateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            gridHTML += `
                <div class="date-chip ${statusClass}" data-day="${day}" data-date="${formattedDateISO}">
                    <span class="day-name">${dayName}</span>
                    <span class="day-num">${day}</span>
                    <span class="status-badge">${badgeText}</span>
                </div>
            `;
        }
        calendarDatesGrid.innerHTML = gridHTML;

        // Click date chip listener
        document.querySelectorAll('.date-chip').forEach(chip => {
            chip.addEventListener('click', function () {
                const dayNum = parseInt(this.getAttribute('data-day'));
                const selectedISO = this.getAttribute('data-date');

                if (isAdminSlotMode) {
                    let curSlots = getRemainingSlots(dayNum);
                    curSlots = (curSlots > 0) ? curSlots - 1 : 3;
                    daySlotsMap[dayNum] = curSlots;

                    localStorage.setItem('kalaila_day_slots', JSON.stringify(daySlotsMap));
                    renderCalendarGrid();

                    if (typeof window.showBookingToast === 'function') {
                        const statusDesc = curSlots === 0 ? 'Full Booked' : `Sisa ${curSlots} Slot`;
                        window.showBookingToast('Status Slot Diperbarui!', `Tanggal ${dayNum}: ${statusDesc}`, 'Disimpan di browser');
                    }
                } else {
                    // Client Mode: Autofill date input
                    const eventDateInput = document.getElementById('eventDate');
                    if (eventDateInput && selectedISO) {
                        eventDateInput.value = selectedISO;
                        eventDateInput.focus();
                    }
                }
            });
        });
    }

    if (calendarDatesGrid) {
        renderCalendarGrid();
    }

    if (toggleAdminSlotBtn) {
        toggleAdminSlotBtn.addEventListener('click', () => {
            isAdminSlotMode = !isAdminSlotMode;
            toggleAdminSlotBtn.classList.toggle('active', isAdminSlotMode);
            if (isAdminSlotMode) {
                toggleAdminSlotBtn.innerHTML = `<i class="fas fa-check-circle"></i> Mode Edit AKTIF (Klik Tanggal)`;
                alert('MODE EDIT ADMIN AKTIF!\n\nKlik tanggal mana saja pada kalender untuk mengganti jumlah sisa slot:\nSISA 3 SLOT -> SISA 2 SLOT -> SISA 1 SLOT -> FULL BOOKED -> SISA 3 SLOT.');
            } else {
                toggleAdminSlotBtn.innerHTML = `<i class="fas fa-edit"></i> Edit Status Tanggal`;
            }
        });
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
            const dayNumber = inputDate.getDate();
            const formattedDate = inputDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const slots = getRemainingSlots(dayNumber);

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

    const defaultTestimonials = [
        {
            name: "Budi & Siti",
            event: "Pernikahan Bandung • 2024",
            stars: 5,
            comment: "Tim Kalaila Photography bener-bener ramah dan ceria banget! Kita yang tadinya kaku banget di depan kamera jadi rileks dan ketawa lepas. Hasil fotonya masyaAllah bagus banget, tonalnya hangat sesuai harapan!",
            avatar: "BS"
        },
        {
            name: "Rina & Andi",
            event: "Pre-wedding Ciwidey • 2024",
            stars: 5,
            comment: "Sangat memuaskan dari awal komunikasi via WA sampai serah terima album foto. Sneak peek fotonya dikirim super cepat dalam 2 hari setelah acara. Sangat direkomendasikan untuk calon pengantin!",
            avatar: "RA"
        },
        {
            name: "Dika & Maya",
            event: "Wedding Reception • 2024",
            stars: 5,
            comment: "Videografi dan albumnya super mewah! Hasil cetak canvas-nya jernih banget dipajang di ruang tamu. Terima kasih tim Kalaila sudah membuat hari spesial kami abadi selamanya.",
            avatar: "DM"
        }
    ];

    function getStoredTestimonials() {
        const saved = localStorage.getItem('kalaila_user_testimonials');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return defaultTestimonials;
            }
        }
        return defaultTestimonials;
    }

    function renderTestimonials() {
        if (!testimonialsGrid) return;
        const list = getStoredTestimonials();

        let html = '';
        list.forEach(item => {
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= item.stars) {
                    starsHtml += `<i class="fas fa-star"></i> `;
                } else {
                    starsHtml += `<i class="far fa-star" style="color: #cbd5e1;"></i> `;
                }
            }

            html += `
                <div class="testimonial-card">
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
    }

    function getInitials(name) {
        if (!name) return 'KL';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    if (testimonialsGrid) {
        renderTestimonials();
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

            const currentList = getStoredTestimonials();
            currentList.unshift(newTestimonial); // Add to top

            localStorage.setItem('kalaila_user_testimonials', JSON.stringify(currentList));
            renderTestimonials();

            alert('Terima kasih! Ulasan & testimoni Anda telah berhasil diterbitkan dan langsung tampil di halaman ini.');
            this.reset();
            if (document.getElementById('star5')) document.getElementById('star5').checked = true;
        });
    }

    console.log('Kalaila Photography Warm Luxury features initialized!');
});

