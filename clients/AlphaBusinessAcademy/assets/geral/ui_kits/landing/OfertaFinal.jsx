/* OfertaFinal.jsx — closing pitch antes do form */
const OfertaFinal = () => (
  <section id="oferta" className="section" style={{ background: 'var(--aba-black)', borderTop: '1px solid rgba(201,162,74,0.25)', borderBottom: '1px solid rgba(201,162,74,0.25)' }}>
    <div className="container" style={{ maxWidth: 980, textAlign: 'center' }}>
      <div className="eyebrow" style={{ justifyContent: 'center' }}>Oferta Final</div>
      <h2 className="display" style={{ fontSize: 'clamp(44px, 5.6vw, 72px)', margin: '20px 0 28px', letterSpacing: '-0.02em' }}>
        Sua empresa vai continuar<br/><em>dependendo de você?</em>
      </h2>
      <p className="aba-lead" style={{ maxWidth: 720, margin: '0 auto 40px' }}>
        As vagas para a Imersão Presencial no <strong style={{ color: 'var(--aba-fg-1)', fontWeight: 600 }}>Morumbi Office Tower</strong> são limitadas. O risco de transformar sua empresa é todo nosso, com nossa garantia de <strong style={{ color: 'var(--aba-gold)', fontWeight: 600 }}>100% de satisfação no primeiro dia</strong>.
      </p>
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
        <a href="#cta" className="btn btn--primary" style={{ padding: '20px 36px', fontSize: 14 }}>
          Fazer minha aplicação agora <span style={{ fontFamily: 'var(--aba-font-display)', fontSize: 18 }}>→</span>
        </a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, maxWidth: 760, margin: '0 auto', paddingTop: 40, borderTop: '1px solid rgba(201,162,74,0.22)' }}>
        <Guarantee icon="◇" title="Garantia 1º dia" sub="100% de satisfação ou reembolso integral" />
        <Guarantee icon="◈" title="Vagas limitadas" sub="Morumbi Office Tower · São Paulo" />
        <Guarantee icon="◆" title="Por aplicação" sub="Validamos perfil em até 24h úteis" />
      </div>
    </div>
  </section>
);

const Guarantee = ({ icon, title, sub }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontFamily: 'var(--aba-font-display)', fontSize: 28, color: 'var(--aba-gold)', marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--aba-fg-1)', fontWeight: 700, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 12, color: 'var(--aba-fg-3)', lineHeight: 1.5 }}>{sub}</div>
  </div>
);
window.OfertaFinal = OfertaFinal;
