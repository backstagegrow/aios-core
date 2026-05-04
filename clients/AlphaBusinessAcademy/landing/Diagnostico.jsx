/* Diagnostico.jsx — the pain section */
const PAINS = [
  { t: "Faturamento alto, lucro baixo", d: "O caixa entra, mas no fim do mês não sobra nada. Não é azar. É falta de estrutura." },
  { t: "Dinheiro que some",             d: 'Sem controle financeiro real, cada decisão é no "feeling" — e o feeling tem um custo alto.' },
  { t: "Equipe sem autonomia",          d: "O turnover come sua margem. Quando você não está, nada funciona." },
  { t: "Dono preso no operacional",     d: "Se você tirar um dia de folga, ligam 12 vezes. O negócio não funciona sem você." },
  { t: "Crescimento travado",           d: "Cada vez que tenta escalar, algo quebra. Falta processo e direção." },
  { t: "Problemas com sócios",          d: "Conflitos de visão e responsabilidades mal definidas drenam energia e dinheiro." },
];

const Diagnostico = () => (
  <section id="diagnostico" className="section" style={{ background: 'var(--aba-ink-900)' }}>
    <div className="container">
      <div style={{ maxWidth: 760, marginBottom: 56 }}>
        <div className="eyebrow">O Diagnóstico</div>
        <h2 className="display" style={{ fontSize: 'clamp(36px, 4.4vw, 56px)', margin: '20px 0 20px' }}>
          Você construiu um <em>emprego caro</em><br/>disfarçado de empresa.
        </h2>
        <p className="aba-lead" style={{ maxWidth: 580 }}>
          Todo domingo você está com a família, mas não consegue parar de olhar o celular. Isso não é liberdade. É uma armadilha.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {PAINS.map((p, i) => (
          <div key={p.t} className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ width: 28, height: 28, borderRadius: 999, border: '1px solid rgba(200,74,61,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C84A3D', fontFamily: 'var(--aba-font-display)', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                {String(i + 1).padStart(2,'0')}
              </span>
              <h3 style={{ fontFamily: 'var(--aba-font-display)', fontWeight: 400, fontSize: 22, margin: 0, color: 'var(--aba-fg-1)', letterSpacing: '-0.01em' }}>{p.t}</h3>
            </div>
            <p style={{ fontFamily: 'var(--aba-font-sans)', fontSize: 14, lineHeight: 1.6, color: 'var(--aba-fg-2)', margin: 0 }}>{p.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
window.Diagnostico = Diagnostico;
