// GT House — Premium Interactions & GSAP
gsap.registerPlugin(ScrollTrigger);

// === NAVBAR SCROLL ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// === HAMBURGER MENU ===
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.mob-link, .mob-cta').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
    });
});

// === HERO ENTRANCE ===
document.querySelectorAll('.animate-in').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0) * 150;
    setTimeout(() => el.classList.add('visible'), delay + 200);
});

// === SCROLL REVEAL ===
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// === GSAP PARALLAX — HERO IMAGE ===
gsap.to('.hero-img', {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
    },
});

// === GSAP PARALLAX — SPACE IMAGES ===
gsap.utils.toArray('.space-img').forEach((img) => {
    gsap.to(img, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
            trigger: img.closest('.space-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        },
    });
});

// === GSAP — DIFFERENTIALS STAGGER ===
ScrollTrigger.create({
    trigger: '.diffs-grid',
    start: 'top 80%',
    onEnter: () => {
        gsap.fromTo('.diff-card',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        );
    },
    once: true,
});

// === GSAP — SPACES STAGGER ===
ScrollTrigger.create({
    trigger: '.spaces-grid',
    start: 'top 75%',
    onEnter: () => {
        gsap.fromTo('.space-card',
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
        );
    },
    once: true,
});

// === TESTIMONIAL GLOW ===
gsap.fromTo(
    '.testimonial',
    { backgroundPosition: '0% 50%' },
    {
        backgroundPosition: '100% 50%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.testimonial',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        },
    }
);

// === TEAL GLOW ON DIFF CARDS ===
document.querySelectorAll('.diff-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, { boxShadow: '0 0 0 1px rgba(0,191,165,0.25), 0 8px 40px rgba(0,191,165,0.08)', duration: 0.3 });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { boxShadow: 'none', duration: 0.3 });
    });
});

// === FORM ===
const form = document.getElementById('lead-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

function setStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = `form-status ${type}`;
}

const params = new URLSearchParams(window.location.search);
const utm = {
    utm_source: params.get('utm_source') || 'direct',
    utm_medium: params.get('utm_medium') || 'none',
    utm_campaign: params.get('utm_campaign') || 'gthouse_redesign',
    utm_content: params.get('utm_content') || '',
};

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('', '');

    if (!form.checkValidity()) {
        setStatus('Revise os campos obrigatórios antes de enviar.', 'error');
        form.reportValidity();
        return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());

    if (!payload.consent) {
        setStatus('Você precisa autorizar o tratamento de dados para continuar.', 'error');
        return;
    }

    if (payload.website) {
        setStatus('Não foi possível processar o envio.', 'error');
        return;
    }

    Object.assign(payload, utm, {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
    });

    submitBtn.disabled = true;
    const btnLabel = submitBtn.querySelector('.btn-label');
    btnLabel.textContent = 'Enviando...';

    // Animate button
    gsap.to(submitBtn, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Falha no envio');
        }

        setStatus('✓ Recebido! Nossa equipe entrará em contato em até 2 horas.', 'success');
        form.reset();
        window.dispatchEvent(new CustomEvent('gt_house_lead', { detail: payload }));

    } catch (_err) {
        // Fallback: redirect to WhatsApp
        const waMsg = encodeURIComponent(
            `Olá! Quero conhecer a GT House.\n\nEmpresa: ${payload.empresa}\nTipo: ${payload.tipo}\nParticipantes: ${payload.publico}`
        );
        setStatus('✓ Redirecionando para WhatsApp...', 'success');
        setTimeout(() => window.open(`https://wa.me/5511999999999?text=${waMsg}`, '_blank'), 800);

    } finally {
        submitBtn.disabled = false;
        btnLabel.textContent = 'Solicitar Visita Técnica';
    }
});

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// === WHATSAPP FAB — show after scroll ===
const fab = document.getElementById('whatsappFab');
if (fab) {
    fab.style.opacity = '0';
    fab.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            fab.style.opacity = '1';
        } else {
            fab.style.opacity = '0';
        }
    }, { passive: true });
}

// === COUNTER ANIMATION ===
function animateCounter(el, end, suffix = '') {
    let start = 0;
    const step = end / 40;
    const timer = setInterval(() => {
        start += step;
        if (start >= end) {
            el.textContent = end + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start) + suffix;
        }
    }, 30);
}

ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 80%',
    onEnter: () => {
        const stats = document.querySelectorAll('.stat strong');
        const values = ['+200', 'R$60k+', '100%'];
        stats.forEach((el, i) => {
            el.textContent = values[i];
            gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: i * 0.15 });
        });
    },
    once: true,
});

console.log('%c GT House © 2026 ', 'background:#0D1B2A; color:#00BFA5; font-family:sans-serif; padding:8px 16px; font-size:14px;');
