/* Nav.jsx */
const Nav = () => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
      padding: '14px 0',
      background: scrolled ? 'rgba(10,10,10,0.78)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,162,74,0.22)' : '1px solid transparent',
      transition: 'all 320ms cubic-bezier(.22,1,.36,1)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="../../assets/aba-logo.png" alt="ABA" style={{ height: 40, width: 'auto' }} />
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontFamily: 'var(--aba-font-display)', fontSize: 14, color: 'var(--aba-gold)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>Alpha</div>
            <div style={{ fontSize: 9, letterSpacing: '0.32em', color: 'var(--aba-fg-3)', textTransform: 'uppercase', fontWeight: 600 }}>Business Academy</div>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#diagnostico" className="aba-caption" style={{ color: 'var(--aba-fg-2)', textDecoration: 'none' }}>Diagnóstico</a>
          <a href="#programa" className="aba-caption" style={{ color: 'var(--aba-fg-2)', textDecoration: 'none' }}>12 Pilares</a>
          <a href="#mentor"  className="aba-caption" style={{ color: 'var(--aba-fg-2)', textDecoration: 'none' }}>Mentores</a>
          <a href="#alunos"  className="aba-caption" style={{ color: 'var(--aba-fg-2)', textDecoration: 'none' }}>Resultados</a>
          <a href="#cta" className="btn btn--primary" style={{ padding: '12px 22px', fontSize: 12 }}>Aplicar <span style={{ fontFamily: 'var(--aba-font-display)', fontSize: 16 }}>→</span></a>
        </div>
      </div>
    </nav>
  );
};
window.Nav = Nav;
