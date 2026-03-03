export default function Footer() {
    return (
        <footer className="border-t border-amber-400/8 py-8">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <span className="text-xs font-extrabold tracking-[0.15em] text-amber-400">
                        ALPHA BUSINESS ACADEMY
                    </span>
                    <p className="text-text-muted text-xs mt-1">
                        © 2026 Alpha Business Academy. Todos os direitos reservados.
                    </p>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="text-text-muted text-xs hover:text-amber-400 transition-colors">
                        Política de Privacidade
                    </a>
                    <a href="#" className="text-text-muted text-xs hover:text-amber-400 transition-colors">
                        Termos de Uso
                    </a>
                </div>
            </div>
        </footer>
    );
}
