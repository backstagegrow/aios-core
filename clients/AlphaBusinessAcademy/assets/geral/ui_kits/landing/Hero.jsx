/* Hero.jsx — image-forward, contained headline */
const Hero = () => {
  return (
    <section className="section vignette" style={{ paddingTop: 120, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 56, alignItems: 'center' }}>
        <div className="reveal is-in">
          <div className="eyebrow">Processo seletivo · Vagas limitadas</div>
          <h1 className="display" style={{ fontSize: 'clamp(34px, 3.6vw, 52px)', margin: '20px 0 22px', lineHeight: 1.06, letterSpacing: '-0.02em' }}>
            De escravo da operação a <em>CEO de elite</em>:<br/>
            o caminho para uma empresa que lucra <em>sem você</em>.
          </h1>
          <p style={{ fontFamily: 'var(--aba-font-sans)', fontWeight: 300, fontSize: 17, lineHeight: 1.6, color: 'var(--aba-fg-2)', maxWidth: 520, margin: '0 0 28px' }}>
            Pare de apagar incêndios 14 horas por dia. Conheça a metodologia de <strong style={{ color: 'var(--aba-fg-1)', fontWeight: 600 }}>Lucas Silva</strong> e <strong style={{ color: 'var(--aba-fg-1)', fontWeight: 600 }}>José Ricardo</strong> que já estruturou mais de <strong style={{ color: 'var(--aba-gold)', fontWeight: 600 }}>500 operações de food service</strong>. Saia do balcão e construa um negócio que funciona sem você.
          </p>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#cta" className="btn btn--primary">Quero o raio-x do meu negócio <span style={{ fontFamily: 'var(--aba-font-display)', fontSize: 18 }}>→</span></a>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 44, paddingTop: 24, borderTop: '1px solid rgba(201,162,74,0.22)' }}>
            <Stat value="+500" label="Operações" />
            <Stat value="3"    label="Dias presenciais" />
            <Stat value="12"   label="Pilares" />
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -28, border: '1px solid rgba(201,162,74,0.45)', borderRadius: 6, transform: 'translate(28px,28px)' }}></div>
          <img src="../../assets/hero-transformation.jpg" alt="Antes e depois" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 4, filter: 'contrast(1.05) saturate(0.95)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', position: 'relative', display: 'block' }} />
          <div style={{ position: 'absolute', left: 24, bottom: 24, right: 24, display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--aba-fg-1)', fontWeight: 700 }}>
            <span style={{ background: 'rgba(10,10,10,0.78)', padding: '8px 14px', backdropFilter: 'blur(8px)' }}>Antes · operador</span>
            <span style={{ background: 'var(--aba-gold)', color: 'var(--aba-black)', padding: '8px 14px' }}>Depois · CEO</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }) => (
  <div>
    <div className="engrave-num" style={{ fontSize: 42 }}>{value}</div>
    <div className="aba-caption" style={{ marginTop: 4 }}>{label}</div>
  </div>
);
window.Hero = Hero;
