(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const form = document.getElementById('lead-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  const params = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: params.get('utm_source') || 'direct',
    utm_medium: params.get('utm_medium') || 'none',
    utm_campaign: params.get('utm_campaign') || 'gthouse_sales_page',
    utm_content: params.get('utm_content') || ''
  };

  function setStatus(text, isError = false) {
    formStatus.textContent = text;
    formStatus.style.color = isError ? '#ff8f8f' : '#a9f0d0';
  }

  // Reveal animation for key blocks
  const revealNodes = document.querySelectorAll('.card, .section-title, .hero-card');
  if (!reducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    }, { threshold: 0.12 });

    revealNodes.forEach((el) => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  } else {
    revealNodes.forEach((el) => el.classList.add('in'));
  }

  // Carousel with placeholders
  const track = document.getElementById('carousel-track');
  if (track) {
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    let index = 0;

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle('is-active', idx === index));
    };

    document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => show(index - 1));
    document.querySelector('.carousel-btn.next')?.addEventListener('click', () => show(index + 1));
    if (!reducedMotion) {
      setInterval(() => show(index + 1), 5000);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('');

    if (!form.checkValidity()) {
      setStatus('Revise os campos obrigatorios antes de enviar.', true);
      form.reportValidity();
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());

    if (!payload.consent) {
      setStatus('Voce precisa autorizar o tratamento de dados para continuar.', true);
      return;
    }

    // Honeypot
    if (payload.website) {
      setStatus('Nao foi possivel processar o envio.', true);
      return;
    }

    Object.assign(payload, utm, {
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    });

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Falha no envio');
      }

      setStatus('Recebido. Nosso time entrara em contato para agendar a visita tecnica.');
      form.reset();
      window.dispatchEvent(new CustomEvent('gt_house_lead_submitted', { detail: payload }));
      console.log('Lead event', payload);
    } catch (error) {
      setStatus(`Nao foi possivel enviar agora. ${error.message}`, true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Solicitar visita tecnica';
    }
  });
})();
