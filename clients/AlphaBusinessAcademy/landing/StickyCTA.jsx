/* StickyCTA.jsx — appears after scroll */
const StickyCTA = () => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`sticky-cta ${show ? 'is-in' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span className="pulse-dot"></span>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--aba-fg-3)', fontWeight: 600 }}>Processo seletivo · Vagas limitadas</div>
          <div style={{ fontFamily: 'var(--aba-font-display)', fontSize: 18, color: 'var(--aba-fg-1)', fontStyle: 'italic' }}>Morumbi Office Tower · São Paulo</div>
        </div>
      </div>
      <a href="#cta" className="btn btn--primary" style={{ padding: '14px 24px', fontSize: 12 }}>Fazer aplicação <span style={{ fontFamily: 'var(--aba-font-display)', fontSize: 16 }}>→</span></a>
    </div>
  );
};
window.StickyCTA = StickyCTA;
