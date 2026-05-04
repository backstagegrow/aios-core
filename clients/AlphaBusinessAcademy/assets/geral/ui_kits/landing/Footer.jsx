/* Footer.jsx */
const Footer = () => (
  <footer style={{ background: 'var(--aba-ink-950)', borderTop: '1px solid rgba(201,162,74,0.18)', padding: '64px 0 40px' }}>
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 48 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <img src="../../assets/aba-logo.png" alt="ABA" style={{ height: 48, width: 'auto' }}/>
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontFamily: 'var(--aba-font-display)', fontSize: 16, color: 'var(--aba-gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Alpha</div>
            <div style={{ fontSize: 9, letterSpacing: '0.32em', color: 'var(--aba-fg-3)', textTransform: 'uppercase', fontWeight: 600 }}>Business Academy</div>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--aba-font-sans)', fontSize: 13, lineHeight: 1.6, color: 'var(--aba-fg-3)', maxWidth: 360, margin: 0 }}>
          A escola dos donos. Metodologia presencial para tirar o operador do balcão e construir uma empresa que lucra sem você.
        </p>
      </div>
      <div>
        <div className="aba-caption" style={{ marginBottom: 14 }}>Imersão</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li><a href="#programa" style={{ color: 'var(--aba-fg-2)', textDecoration: 'none', fontSize: 13 }}>12 Pilares</a></li>
          <li><a href="#mentor" style={{ color: 'var(--aba-fg-2)', textDecoration: 'none', fontSize: 13 }}>Mentores</a></li>
          <li><a href="#alunos" style={{ color: 'var(--aba-fg-2)', textDecoration: 'none', fontSize: 13 }}>Resultados</a></li>
          <li><a href="#inscricao" style={{ color: 'var(--aba-fg-2)', textDecoration: 'none', fontSize: 13 }}>Aplicar</a></li>
        </ul>
      </div>
      <div>
        <div className="aba-caption" style={{ marginBottom: 14 }}>Local · Contato</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li style={{ fontSize: 13, color: 'var(--aba-fg-2)' }}>Morumbi Office Tower</li>
          <li style={{ fontSize: 13, color: 'var(--aba-fg-2)' }}>São Paulo · SP</li>
          <li style={{ fontSize: 13, color: 'var(--aba-fg-2)' }}>contato@alphabusinessacademy.com.br</li>
        </ul>
      </div>
    </div>
    <div className="container" style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(201,162,74,0.12)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--aba-fg-3)', letterSpacing: '0.12em' }}>
      <span>© Alpha Business Academy · Todos os direitos reservados</span>
      <span>LGPD · Privacidade · Termos</span>
    </div>
  </footer>
);
window.Footer = Footer;
