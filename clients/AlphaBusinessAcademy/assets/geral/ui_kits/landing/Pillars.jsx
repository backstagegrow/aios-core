/* Pillars.jsx — the 12 pilares grid (official names) */
const PILLARS = [
  { n: "01", t: "Mentalidade de Dono e Visão de Escala" },
  { n: "02", t: "Vendas, Ticket Médio e Crescimento" },
  { n: "03", t: "Liderança, Cultura e Gestão de Equipe" },
  { n: "04", t: "Gestão de Lucro, CMV e Controle de Caixa" },
  { n: "05", t: "Estrutura Tributária e Proteção do Lucro" },
  { n: "06", t: "Posicionamento, Marca e Autoridade Local" },
  { n: "07", t: "Operação Eficiente e Padronização" },
  { n: "08", t: "Delegação e Estrutura de Gestão" },
  { n: "09", t: "Modelo Escalável e Replicável" },
  { n: "10", t: "Sociedades e Parcerias" },
  { n: "11", t: "Gestão por Indicadores (KPIs)" },
  { n: "12", t: "Execução e Próximo Nível" },
];

const Pillars = () => (
  <section id="programa" className="section vignette">
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>A Metodologia</div>
        <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', margin: '20px 0 16px' }}>
          12 pilares. Um <em>caminho</em>.
        </h2>
        <p className="aba-lead" style={{ maxWidth: 660, margin: '0 auto' }}>
          A Alpha Business Academy é estruturada em 12 módulos que transformam completamente o ecossistema do seu negócio.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {PILLARS.map(p => (
          <div key={p.n} className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
              <h3 style={{ fontFamily: 'var(--aba-font-display)', fontWeight: 400, fontSize: 22, margin: 0, color: 'var(--aba-fg-1)', letterSpacing: '-0.01em', lineHeight: 1.2, flex: 1 }}>{p.t}</h3>
              <div className="engrave-num" style={{ fontSize: 38, lineHeight: 0.9, flexShrink: 0 }}>{p.n}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
window.Pillars = Pillars;
