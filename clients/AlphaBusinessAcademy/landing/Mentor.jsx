/* Mentor.jsx — 3 mentores oficiais */
const MENTORES = [
  {
    name: "Lucas Silva",
    img: "../../assets/portrait-lucas.webp",
    role: "CEO · Ponto Alpha Café",
    sub: "Executivo · Monster Dog",
    bio: "Sabe o que é estar no balcão e exatamente como sair dele. Construiu, escalou e ainda opera negócios reais — não é teoria de palco.",
  },
  {
    name: "José Ricardo",
    img: "../../assets/portrait-jose-ricardo.webp",
    role: "Fundador · +500 lojas",
    sub: "De camelô a empresário",
    bio: "Jornada construída com as mãos no caixa. Estruturou uma rede com mais de 500 lojas no food service partindo do zero.",
  },
  {
    name: "Robert",
    img: "../../assets/portrait-robert.webp",
    role: "Estratégia Financeira",
    sub: "Governança · DRE · Lucro",
    bio: "O cara que faz a DRE parecer fácil e o lucro aparecer de verdade. Põe ordem no caixa e blinda a margem do operador.",
  },
];

const Mentor = () => (
  <section id="mentor" className="section vignette" style={{ background: 'var(--aba-ink-900)' }}>
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Mentores · Autoridade</div>
        <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', margin: '20px 0 16px' }}>
          Quem está na sua frente <em>já fez</em>.
        </h2>
        <p className="aba-lead" style={{ maxWidth: 620, margin: '0 auto' }}>
          Três operadores que viveram cada degrau — não consultores que aprenderam em livro.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
        {MENTORES.map(m => (
          <div key={m.name} style={{ position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              {m.img ? (
                <img src={m.img} alt={m.name} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 4, filter: 'contrast(1.05) saturate(0.95)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}/>
              ) : (
                <div style={{ width: '100%', aspectRatio: '4/5', background: 'var(--aba-ink-800)', borderRadius: 4, border: '1px solid rgba(201,162,74,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aba-ink-500)', fontFamily: 'var(--aba-font-display)', fontStyle: 'italic' }}>retrato</div>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(10,10,10,0.85) 100%)', borderRadius: 4 }}></div>
              <div style={{ position: 'absolute', left: 20, bottom: 20, right: 20 }}>
                <div style={{ fontFamily: 'var(--aba-font-display)', fontSize: 28, color: 'var(--aba-fg-1)', letterSpacing: '-0.01em', lineHeight: 1.05 }}>{m.name}</div>
                <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--aba-gold)', marginTop: 6, fontWeight: 600 }}>{m.role}</div>
                <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--aba-fg-3)', marginTop: 2 }}>{m.sub}</div>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--aba-font-sans)', fontSize: 14, lineHeight: 1.6, color: 'var(--aba-fg-2)', margin: '20px 0 0' }}>{m.bio}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
window.Mentor = Mentor;
