/* Testimonials.jsx — video cards (placeholder posters) */
const TESTIMONIALS = [
  { name: "Debora",   role: "Food Service",     metric: "+50%",      metricLabel: "Faturamento",        poster: null },
  { name: "Marcio",   role: "Rede em expansão", metric: "Rede",      metricLabel: "Estrutura escalável", poster: null },
  { name: "Vinícius", role: "Alimentação",      metric: "Liberdade", metricLabel: "Operacional",         poster: null },
];

const VideoCard = ({ t }) => {
  const initial = t.name.charAt(0);
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', aspectRatio: '4/5', background: t.poster ? `url(${t.poster}) center/cover` : 'linear-gradient(135deg, var(--aba-ink-800) 0%, var(--aba-ink-900) 100%)', borderBottom: '1px solid rgba(201,162,74,0.22)' }}>
          {!t.poster && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aba-ink-600)', fontFamily: 'var(--aba-font-display)', fontStyle: 'italic', fontSize: 80, opacity: 0.6 }}>
              {initial}
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.85) 100%)' }}></div>
          <button aria-label={`Reproduzir vídeo de ${t.name}`} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 76, height: 76, borderRadius: '50%', background: 'rgba(201,162,74,0.95)', border: '1px solid var(--aba-gold-light)', color: 'var(--aba-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 8px rgba(201,162,74,0.15)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div style={{ position: 'absolute', left: 18, bottom: 16, right: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--aba-font-display)', fontSize: 24, color: 'var(--aba-fg-1)', letterSpacing: '-0.01em', lineHeight: 1.05 }}>{t.name}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--aba-gold)', marginTop: 4, fontWeight: 700 }}>{t.role}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="engrave-num" style={{ fontSize: 24, lineHeight: 1 }}>{t.metric}</div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--aba-fg-3)', marginTop: 4 }}>{t.metricLabel}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--aba-fg-3)', fontWeight: 600 }}>Depoimento em vídeo</div>
          <div style={{ color: 'var(--aba-gold)', fontSize: 13, letterSpacing: 2 }}>★★★★★</div>
        </div>
    </div>
  );
};

const Testimonials = () => (
  <section id="alunos" className="section vignette">
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Prova Social · Resultados</div>
        <h2 className="display" style={{ fontSize: 'clamp(36px, 4.4vw, 56px)', margin: '20px 0 16px' }}>
          Veja os resultados de quem<br/>já <em>percorreu o caminho</em>.
        </h2>
        <p className="aba-lead" style={{ maxWidth: 580, margin: '0 auto' }}>
          Cases reais — sem narração de copywriter. Aperte play.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {TESTIMONIALS.map(t => <VideoCard key={t.name} t={t}/>)}
      </div>
    </div>
  </section>
);
window.Testimonials = Testimonials;
