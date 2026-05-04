/* Manifesto.jsx */
const Manifesto = () => (
  <section className="section" style={{ background: 'var(--aba-black)', position: 'relative', overflow: 'hidden' }}>
    <div className="container" style={{ maxWidth: 880, textAlign: 'center' }}>
      <div className="eyebrow" style={{ justifyContent: 'center' }}>Manifesto</div>
      <p style={{ fontFamily: 'var(--aba-font-display)', fontSize: 'clamp(28px, 3.4vw, 44px)', fontStyle: 'italic', lineHeight: 1.3, color: 'var(--aba-fg-1)', margin: '32px 0', fontWeight: 400 }}>
        Você não construiu um negócio para virar refém dele.<br/>
        <span style={{ color: 'var(--aba-gold)' }}>Construiu para ser livre.</span>
      </p>
      <div className="hairline hairline--ornament" style={{ maxWidth: 280, margin: '0 auto' }}><span>§</span></div>
    </div>
  </section>
);
window.Manifesto = Manifesto;
