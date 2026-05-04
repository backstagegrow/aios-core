/* CtaFinal.jsx — substitui o form. CTAs em botão (WhatsApp / aplicação externa) */
const CtaFinal = () => (
  <section id="cta" className="section" style={{ background: 'var(--aba-ink-900)' }}>
    <div className="container" style={{ maxWidth: 880, textAlign: 'center' }}>
      <div className="eyebrow" style={{ justifyContent: 'center' }}>Aplicar à Imersão</div>
      <h2 className="display" style={{ fontSize: 'clamp(38px, 4.6vw, 60px)', margin: '20px 0 16px' }}>
        Próxima turma — <em>Morumbi Office Tower</em>.
      </h2>
      <p className="aba-lead" style={{ maxWidth: 560, margin: '0 auto 36px' }}>
        Vagas limitadas, por aplicação. Fale direto com a equipe ABA pelo WhatsApp.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
        <a href="https://wa.me/5511999999999" target="_blank" rel="noopener" className="btn btn--primary" style={{ padding: '20px 36px', fontSize: 14 }}>
          Fazer minha aplicação no WhatsApp <span style={{ fontFamily: 'var(--aba-font-display)', fontSize: 18 }}>→</span>
        </a>
      </div>
      <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--aba-fg-3)' }}>
        <span>◇ Garantia de 100% no 1º dia</span>
        <span>◈ Resposta em até 24h úteis</span>
      </div>
    </div>
  </section>
);
window.CtaFinal = CtaFinal;
