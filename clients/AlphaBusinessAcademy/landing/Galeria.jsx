/* Galeria.jsx — fotos das edições da Imersão (placeholders) */
const SHOTS = [
  { tag: "Sala principal",    span: 2, hue: 30 },
  { tag: "Mentoria 1:1",      span: 1, hue: 40 },
  { tag: "Networking",        span: 1, hue: 35 },
  { tag: "Painel financeiro", span: 1, hue: 45 },
  { tag: "Coffee · pausa",    span: 1, hue: 38 },
  { tag: "Encerramento",      span: 2, hue: 32 },
];

const Galeria = () => (
  <section id="galeria" className="section" style={{ background: 'var(--aba-ink-950)' }}>
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, gap: 32, flexWrap: 'wrap' }}>
        <div>
          <div className="eyebrow">Galeria · Edições anteriores</div>
          <h2 className="display" style={{ fontSize: 'clamp(34px, 4vw, 52px)', margin: '16px 0 0' }}>
            Três dias <em>presenciais</em>.<br/>Morumbi Office Tower.
          </h2>
        </div>
        <p style={{ fontFamily: 'var(--aba-font-sans)', fontSize: 14, lineHeight: 1.6, color: 'var(--aba-fg-3)', maxWidth: 360, margin: 0 }}>
          Sala fechada, grupo selecionado, mentoria direta. As fotos abaixo são de turmas anteriores da Imersão.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '220px', gap: 12 }}>
        {SHOTS.map((s, i) => (
          <figure key={s.tag} style={{
            margin: 0,
            gridColumn: `span ${s.span}`,
            position: 'relative',
            background: `linear-gradient(135deg, oklch(0.32 0.04 ${s.hue}) 0%, oklch(0.18 0.03 ${s.hue}) 100%)`,
            border: '1px solid rgba(201,162,74,0.18)',
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,162,74,0.25)', fontFamily: 'var(--aba-font-display)', fontStyle: 'italic', fontSize: 22 }}>
              foto · {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(10,10,10,0.85) 100%)' }}></div>
            <figcaption style={{ position: 'absolute', left: 16, bottom: 14, right: 16, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--aba-fg-1)', fontWeight: 700 }}>
              {s.tag}
            </figcaption>
          </figure>
        ))}
      </div>
      <div style={{ marginTop: 24, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--aba-fg-3)' }}>
        ◇ Placeholders · substituir por fotos reais das edições
      </div>
    </div>
  </section>
);
window.Galeria = Galeria;
