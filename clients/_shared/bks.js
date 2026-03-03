/**
 * BKS DESIGN SYSTEM — ANIMATIONS
 * Versão: 1.0 | 27/02/2026
 *
 * USO:
 *   <script src="../_shared/bks.js"></script>
 *   <script>
 *     BKS.init({
 *       navbarId: 'navbar',
 *       waNumber: '5511999999999',
 *       formId: 'lead-form',
 *     });
 *   </script>
 */

/* global gsap, ScrollTrigger */

const BKS = (() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── NAVBAR ───────────────────────────────
    function initNavbar(id = 'navbar') {
        const nav = document.getElementById(id);
        if (!nav) return;
        window.addEventListener('scroll', () => {
            nav.classList.toggle('is-scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // ─── HAMBURGER MOBILE MENU ────────────────
    function initHamburger(hamburgerId = 'hamburger', menuId = 'mobileMenu') {
        const btn = document.getElementById(hamburgerId);
        const menu = document.getElementById(menuId);
        if (!btn || !menu) return;

        btn.addEventListener('click', () => {
            menu.classList.toggle('is-open');
            btn.classList.toggle('is-active');
            btn.setAttribute('aria-expanded', String(menu.classList.contains('is-open')));
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('is-open');
                btn.classList.remove('is-active');
            });
        });
    }

    // ─── HERO ENTRANCE ───────────────────────
    function initHeroEntrance(selector = '.hero-enter') {
        if (prefersReducedMotion) {
            document.querySelectorAll(selector).forEach(el => el.classList.add('is-visible'));
            return;
        }

        document.querySelectorAll(selector).forEach((el) => {
            const delay = parseFloat(el.dataset.delay || 0) * 150;
            setTimeout(() => el.classList.add('is-visible'), delay + 100);
        });
    }

    // ─── SCROLL REVEAL ────────────────────────
    function initReveal(selector = '.reveal') {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        if (prefersReducedMotion) {
            els.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        els.forEach(el => observer.observe(el));
    }

    // ─── GSAP PARALLAX ────────────────────────
    function initParallax(selector = '.parallax-img', intensity = 8) {
        if (prefersReducedMotion || typeof gsap === 'undefined') return;

        gsap.utils.toArray(selector).forEach((img) => {
            gsap.to(img, {
                yPercent: intensity,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.closest('section') || img.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        });
    }

    // ─── GSAP STAGGER ─────────────────────────
    function initStagger(parentSelector, childSelector, options = {}) {
        if (prefersReducedMotion || typeof ScrollTrigger === 'undefined') return;

        const {
            from = { opacity: 0, y: 60 },
            to = { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
            start = 'top 80%',
        } = options;

        ScrollTrigger.create({
            trigger: parentSelector,
            start,
            onEnter: () => gsap.fromTo(childSelector, from, to),
            once: true,
        });
    }

    // ─── WHATSAPP FAB ─────────────────────────
    function initWAFab(selector = '.bks-wa-fab') {
        const fab = document.querySelector(selector);
        if (!fab) return;

        window.addEventListener('scroll', () => {
            fab.classList.toggle('is-visible', window.scrollY > 300);
        }, { passive: true });
    }

    // ─── SMOOTH SCROLL ────────────────────────
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (!target) return;
                const top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        });
    }

    // ─── CUSTOM CURSOR ─────────────────────────
    function initCursor() {
        if (!window.matchMedia('(pointer: fine)').matches) return;
        if (prefersReducedMotion) return;

        const cursor = document.createElement('div');
        cursor.style.cssText = `
      width: 10px; height: 10px; border-radius: 50%;
      background: white; position: fixed; pointer-events: none;
      z-index: 99999; mix-blend-mode: difference;
      top: 0; left: 0; will-change: transform;
    `;
        document.body.appendChild(cursor);

        const lerp = (a, b, t) => a + (b - a) * t;
        let cx = 0, cy = 0, tx = 0, ty = 0;

        window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });

        const animate = () => {
            cx = lerp(cx, tx, 0.18);
            cy = lerp(cy, ty, 0.18);
            cursor.style.transform = `translate3d(${cx - 5}px, ${cy - 5}px, 0)`;
            requestAnimationFrame(animate);
        };
        animate();

        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => { cursor.style.transform += ' scale(3.5)'; });
            el.addEventListener('mouseleave', () => { cursor.style.transform = cursor.style.transform.replace(' scale(3.5)', ''); });
        });
    }

    // ─── FORM HANDLER ─────────────────────────
    function initForm(formId = 'lead-form', waNumber = '', statusId = 'form-status') {
        const form = document.getElementById(formId);
        const statusEl = document.getElementById(statusId);
        const submitBtn = form?.querySelector('[type="submit"]');
        if (!form) return;

        // UTM capture
        const params = new URLSearchParams(window.location.search);
        const utm = {
            utm_source: params.get('utm_source') || 'direct',
            utm_medium: params.get('utm_medium') || 'none',
            utm_campaign: params.get('utm_campaign') || window.location.hostname,
            utm_content: params.get('utm_content') || '',
        };

        const setStatus = (msg, type = '') => {
            if (!statusEl) return;
            statusEl.textContent = msg;
            statusEl.className = `bks-form__status ${type}`;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            setStatus('', '');

            if (!form.checkValidity()) {
                setStatus('Revise os campos obrigatórios.', 'error');
                form.reportValidity();
                return;
            }

            const payload = Object.fromEntries(new FormData(form).entries());

            // Honeypot check
            if (payload.website) { setStatus('Erro.', 'error'); return; }

            // Consent check
            if ('consent' in payload && !payload.consent) {
                setStatus('Autorize o tratamento de dados para continuar.', 'error');
                return;
            }

            Object.assign(payload, utm, {
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
            });

            if (submitBtn) {
                submitBtn.disabled = true;
                const label = submitBtn.querySelector('.btn-label') || submitBtn;
                label.textContent = 'Enviando...';
            }

            try {
                const res = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) throw new Error('API error');

                setStatus('✓ Mensagem recebida! Retornaremos em breve.', 'success');
                form.reset();
                window.dispatchEvent(new CustomEvent('bks_lead_submitted', { detail: payload }));

            } catch (_err) {
                // Fallback: WhatsApp redirect
                if (waNumber) {
                    const company = payload.empresa || payload.nome || '';
                    const type = payload.tipo || '';
                    const msg = encodeURIComponent(`Olá! Tenho interesse no espaço.\n\nEmpresa: ${company}\nTipo de evento: ${type}`);
                    setStatus('Redirecionando para WhatsApp...', 'success');
                    setTimeout(() => window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank'), 600);
                } else {
                    setStatus('Tente novamente ou entre em contato pelo WhatsApp.', 'error');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const label = submitBtn.querySelector('.btn-label') || submitBtn;
                    label.textContent = submitBtn.dataset.originalText || 'Enviar';
                }
            }
        });

        // Save original button text
        if (submitBtn) {
            const label = submitBtn.querySelector('.btn-label') || submitBtn;
            submitBtn.dataset.originalText = label.textContent;
        }
    }

    // ─── MASTER INIT ──────────────────────────
    function init(config = {}) {
        const {
            navbarId = 'navbar',
            hamburgerId = 'hamburger',
            menuId = 'mobileMenu',
            formId = 'lead-form',
            waNumber = '',
            statusId = 'form-status',
            cursor = true,
            parallax = true,
        } = config;

        // Always
        initNavbar(navbarId);
        initHamburger(hamburgerId, menuId);
        initHeroEntrance();
        initReveal();
        initWAFab();
        initSmoothScroll();
        initForm(formId, waNumber, statusId);

        // Optional
        if (cursor) initCursor();
        if (parallax && typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            initParallax();
        }

        console.log(
            '%c BKS Design System v1.0 ',
            'background:#0D1B2A; color:#00BFA5; font-family:monospace; padding:6px 12px;'
        );
    }

    return {
        init,
        initNavbar,
        initHamburger,
        initHeroEntrance,
        initReveal,
        initParallax,
        initStagger,
        initWAFab,
        initSmoothScroll,
        initCursor,
        initForm,
    };
})();

// Auto-export for module environments
if (typeof module !== 'undefined') module.exports = BKS;
