/* ═══════════════════════════════════════════════════════════════
   ALPHA BUSINESS ACADEMY — O CAMINHO DO DONO
   Landing Page Interactions & Form Handling
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── SCROLL REVEAL ───
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));

    // ─── FAQ ACCORDION ───
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach((other) => {
                other.classList.remove('active');
                const otherAnswer = other.querySelector('.faq-item__answer');
                otherAnswer.style.maxHeight = '0';
                other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ─── STICKY CTA (Mobile) ───
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero');
    const formSection = document.getElementById('aplicacao');

    if (stickyCta && heroSection && formSection) {
        const stickyObserver = new IntersectionObserver(
            (entries) => {
                const heroVisible = entries.find((e) => e.target === heroSection);
                const formVisible = entries.find((e) => e.target === formSection);

                const heroInView = heroVisible ? heroVisible.isIntersecting : heroSection.getBoundingClientRect().bottom > 0;
                const formInView = formVisible ? formVisible.isIntersecting : false;

                if (!heroInView && !formInView && window.innerWidth <= 768) {
                    stickyCta.classList.add('visible');
                    stickyCta.setAttribute('aria-hidden', 'false');
                } else {
                    stickyCta.classList.remove('visible');
                    stickyCta.setAttribute('aria-hidden', 'true');
                }
            },
            { threshold: 0.1 }
        );
        stickyObserver.observe(heroSection);
        stickyObserver.observe(formSection);
    }

    // ─── SMOOTH SCROLL for anchor links ───
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── FORM VALIDATION & SUBMISSION ───
    const form = document.getElementById('application-form');
    const submitBtn = document.getElementById('submit-btn');
    const modal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = modal ? modal.querySelector('.modal__backdrop') : null;

    // Phone mask (BR format)
    const phoneInput = document.getElementById('whatsapp');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length >= 7) {
                e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } else if (value.length >= 3) {
                e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length >= 1) {
                e.target.value = `(${value}`;
            }
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));

            // Validate
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach((field) => {
                if (field.type === 'checkbox' && !field.checked) {
                    isValid = false;
                    field.closest('.form-checkbox').querySelector('.form-checkbox__mark').style.borderColor = 'var(--red)';
                } else if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                }
            });

            // Email validation
            const emailField = document.getElementById('email');
            if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
            }

            if (!isValid) return;

            // Loading state
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Add UTM params
            const urlParams = new URLSearchParams(window.location.search);
            data.utm_source = urlParams.get('utm_source') || '';
            data.utm_medium = urlParams.get('utm_medium') || '';
            data.utm_campaign = urlParams.get('utm_campaign') || '';
            data.utm_content = urlParams.get('utm_content') || '';
            data.utm_term = urlParams.get('utm_term') || '';
            data.consent_given = data.consent === 'on';

            // Simulate API call (replace with Supabase endpoint in production)
            console.log('📥 Lead captured:', data);

            setTimeout(() => {
                submitBtn.classList.remove('btn--loading');
                submitBtn.disabled = false;

                // Show success modal
                if (modal) {
                    modal.classList.add('active');
                    modal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                }

                // Reset form
                form.reset();

                // Fire tracking event
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'O Caminho do Dono',
                        content_category: 'Evento Presencial',
                    });
                }

                // Fire GTM event
                if (typeof dataLayer !== 'undefined') {
                    dataLayer.push({
                        event: 'form_submit',
                        form_name: 'application_form',
                        client: 'AlphaBusinessAcademy',
                    });
                }
            }, 1500);
        });
    }

    // Modal close
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ─── COUNTER ANIMATION ───
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(update);
                else counter.textContent = target;
            }
            requestAnimationFrame(update);
        });
    }

    // ─── PARALLAX GLOW ───
    const heroGlow = document.querySelector('.hero__glow');
    if (heroGlow) {
        window.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            heroGlow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    }

    // ─── HERO CTA RIPPLE EFFECT ───
    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                left: ${e.clientX - this.getBoundingClientRect().left - 10}px;
                top: ${e.clientY - this.getBoundingClientRect().top - 10}px;
                pointer-events: none;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    // Inject ripple keyframes
    const style = document.createElement('style');
    style.textContent = `@keyframes ripple { to { transform: scale(20); opacity: 0; } }`;
    document.head.appendChild(style);
})();
