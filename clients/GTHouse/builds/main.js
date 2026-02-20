(() => {
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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('');

    if (!form.checkValidity()) {
      setStatus('Revise os campos obrigatorios antes de enviar.', true);
      form.reportValidity();
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    Object.assign(payload, utm, { page: window.location.pathname, timestamp: new Date().toISOString() });

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
