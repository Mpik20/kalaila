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
                    <p style="font-size: 1.05rem; margin-bottom: 12px; color: var(--primary-color);">
                        Rekomendasi Konsep Foto Anda: <strong>${quizData.event}</strong> dengan Nuansa <strong>${quizData.tone}</strong> di <strong>${quizData.location}</strong>.
                    </p>
                `;
            }

            if (btnClaimQuiz) {
                const message = `Halo Kalaila Photography, saya telah mengisi Kuis Concept Matcher:\n- Acara: ${quizData.event}\n- Tone Foto: ${quizData.tone}\n- Lokasi: ${quizData.location}\n\nSaya ingin mengklaim Voucher Cashback Rp 300.000 (Kode: KALAILA300K) dan konsultasi moodboard!`;
                btnClaimQuiz.onclick = () => {
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

    // ========== RECENT CLIENT BOOKING TOAST NOTIFICATIONS ==========
    const recentBookings = [
        { name: 'Rian & Maya', event: 'Signature Package • Bandung', time: '8 menit lalu' },
        { name: 'Fikri & Annisa', event: 'Royal Luxury Package • Jakarta', time: '18 menit lalu' },
        { name: 'Dion & Bella', event: 'Prewedding Outdoor • Ciwidey', time: '35 menit lalu' },
        { name: 'Bagas & Clara', event: 'Essential Package • Cimahi', time: '1 jam lalu' }
    ];

    const bookingToast = document.getElementById('bookingToast');
    const toastName = document.getElementById('toastName');
    const toastEvent = document.getElementById('toastEvent');
    const toastTime = document.getElementById('toastTime');

    if (bookingToast && toastName && toastEvent && toastTime) {
        let toastIdx = 0;

        function showNextToast() {
            const booking = recentBookings[toastIdx];
            toastName.textContent = `${booking.name} baru mengamankan slot!`;
            toastEvent.textContent = booking.event;
            toastTime.textContent = booking.time;

            bookingToast.classList.add('show');

            setTimeout(() => {
                bookingToast.classList.remove('show');
            }, 4500);

            toastIdx = (toastIdx + 1) % recentBookings.length;
        }

        // Show first toast after 4 seconds, then repeat every 12 seconds
        setTimeout(() => {
            showNextToast();
            setInterval(showNextToast, 12000);
        }, 4000);
    }

    // ========== MOBILE MENU TOGGLE ==========
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ========== NAVBAR BACKGROUND ON SCROLL ==========
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                navbar.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                navbar.style.backgroundColor = 'rgba(22, 16, 13, 0.98)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.backgroundColor = 'rgba(35, 26, 22, 0.94)';
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

    // ========== AVAILABILITY DATE CHECKER ==========
    const availabilityForm = document.getElementById('availabilityForm');
    const availabilityResult = document.getElementById('availabilityResult');

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

            const formattedDate = new Date(dateVal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            availabilityResult.className = 'availability-result success';
            availabilityResult.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <span style="font-size: 1.1rem; color: #2ecc71;"><i class="fas fa-check-circle"></i> Slot Masih Tersedia!</span>
                        <p style="font-weight: 400; font-size: 0.92rem; margin-top: 4px; color: #fff;">
                            Kabar baik! Tanggal <strong>${formattedDate}</strong> di <strong>${cityVal}</strong> untuk <strong>${typeVal}</strong> masih buka untuk booking.
                        </p>
                    </div>
                    <a href="https://wa.me/6282318928400?text=${encodeURIComponent(`Halo Kalaila Photography, saya telah mengecek ketersediaan tanggal ${formattedDate} di ${cityVal} untuk ${typeVal} dan statusnya tersedia. Saya ingin mengamankan slot ini!`)}" 
                       target="_blank" 
                       style="background: #25d366; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.88rem;">
                       <i class="fab fa-whatsapp"></i> Amankan Slot Sekarang
                    </a>
                </div>
            `;
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

    console.log('Kalaila Photography Warm Luxury features initialized!');
});

