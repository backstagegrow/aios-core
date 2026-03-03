/* ============================================
   spHAUS — JS Animations & Interactions
   GSAP + ScrollTrigger
   ============================================ */

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// === NAVBAR SCROLL BEHAVIOR ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// === HERO ENTRANCE ANIMATIONS ===
document.querySelectorAll('.animate-in').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0) * 150;
    setTimeout(() => {
        el.classList.add('visible');
    }, delay);
});

// === SCROLL REVEAL ===
// Add reveal class to elements
const revealSelectors = [
    '.manifesto-label',
    '.manifesto-quote',
    '.manifesto-body',
    '.cases-header',
    '.case-card',
    '.thespace-right > *',
    '.contact-header',
    '.form-group',
    '.btn-submit',
    '.footer-inner > *',
];

revealSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
        el.classList.add('reveal');
    });
});

// Intersection Observer for reveal
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// === GSAP PARALLAX — CASE IMAGES ===
gsap.utils.toArray('.case-img').forEach((img) => {
    gsap.to(img, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
            trigger: img.closest('.case-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        },
    });
});

// === GSAP — HERO GRID FADE ===
gsap.to('.hero-bg-grid', {
    opacity: 0.3,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
    },
});

// === GSAP — MANIFESTO TEXT SPLIT ANIMATION ===
const manifestoQuote = document.querySelector('.manifesto-quote');
if (manifestoQuote) {
    ScrollTrigger.create({
        trigger: manifestoQuote,
        start: 'top 75%',
        onEnter: () => {
            gsap.fromTo(
                manifestoQuote,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
            );
        },
        once: true,
    });
}

// === CASE CARDS STAGGER ===
ScrollTrigger.create({
    trigger: '.cases-grid',
    start: 'top 80%',
    onEnter: () => {
        gsap.fromTo(
            '.case-card',
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.2,
                ease: 'power3.out',
            }
        );
    },
    once: true,
});

// === THEESPACE LOGO SCALE ===
gsap.fromTo(
    '.thespace-logo',
    { scale: 0.9, opacity: 0.5 },
    {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: '.thespace',
            start: 'top center',
            end: 'bottom center',
            scrub: true,
        },
    }
);

// === FORM INTERACTIONS ===
const inputs = document.querySelectorAll('input, select, textarea');
inputs.forEach((input) => {
    input.addEventListener('focus', () => {
        gsap.to(input, { borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 });
    });
    input.addEventListener('blur', () => {
        if (!input.value) {
            gsap.to(input, { borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 });
        }
    });
});

// === FORM SUBMIT HANDLER ===
function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const btnText = btn.querySelector('.btn-text');

    // Animate button
    gsap.to(btn, {
        scale: 0.97,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
            btnText.textContent = 'Enviado com Sucesso!';
            btn.style.background = '#2A2A2A';
            btn.style.color = '#FFFFFF';
            btn.disabled = true;

            // Reset after 4s
            setTimeout(() => {
                btnText.textContent = 'Solicitar Proposta';
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
                document.getElementById('contactForm').reset();
            }, 4000);
        },
    });
}

// === SMOOTH NAVIGATION ===
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// === DIFF BAR MARQUEE on mobile ===
function maybeMarquee() {
    const bar = document.querySelector('.diff-inner');
    if (!bar) return;
    if (window.innerWidth < 768) {
        bar.style.justifyContent = 'flex-start';
        bar.style.overflow = 'auto';
    } else {
        bar.style.justifyContent = 'center';
        bar.style.overflow = '';
    }
}
maybeMarquee();
window.addEventListener('resize', maybeMarquee);

// === CURSOR ENHANCEMENT (Desktop) ===
if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
    width: 10px; height: 10px; border-radius: 50%;
    background: white; position: fixed; pointer-events: none;
    z-index: 99999; transition: transform 0.3s ease, opacity 0.3s ease;
    mix-blend-mode: difference; top: 0; left: 0;
  `;
    document.body.appendChild(cursor);

    let curX = 0, curY = 0;
    window.addEventListener('mousemove', (e) => {
        curX = e.clientX;
        curY = e.clientY;
        gsap.to(cursor, {
            x: curX - 5,
            y: curY - 5,
            duration: 0.15,
            ease: 'power2.out',
        });
    });

    // Scale on hover
    document.querySelectorAll('a, button').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 3.5, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
        });
    });
}

console.log('%c spHAUS © 2026 ', 'background:#0A0A0A; color:#fff; font-family:monospace; padding:8px 16px; font-size:14px;');
