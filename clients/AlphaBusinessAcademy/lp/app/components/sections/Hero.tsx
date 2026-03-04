"use client";
import ScrollReveal from "../ui/ScrollReveal";

export default function Hero() {
    const scrollToForm = () => {
        document.getElementById("aplicacao")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#141414] to-[#0A0A0A]" />
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A847' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                {/* Copy */}
                <ScrollReveal>
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A847]/10 border border-[#D4A847]/30 text-[#D4A847] text-sm font-semibold tracking-wider uppercase">
                            🔒 Últimas vagas — Imersão Presencial em SP, 21 e 22 de Março
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
                            Em 2 Dias, Instale
                            <br />
                            <span className="gradient-text">a Estrutura Que Faz</span>
                            <br />
                            Seu Negócio Lucrar
                            <br />
                            <span className="gradient-text">Sem Você no Balcão.</span>
                        </h1>

                        <p className="text-lg text-[#9CA3AF] max-w-xl leading-relaxed">
                            A imersão presencial para donos de restaurantes, cafeterias e franquias que faturam bem — mas <strong className="text-white">trabalham demais, lucram de menos e não conseguem tirar 2 dias de folga</strong> sem o negócio parar.
                        </p>

                        <div className="space-y-4">
                            <button onClick={scrollToForm} className="cta-button w-full sm:w-auto">
                                → Quero Minha Vaga na Imersão
                            </button>
                            <p className="text-sm text-[#9CA3AF]">
                                Aplicação de 3 minutos • Apenas 40 vagas por edição • Resposta em 48h
                            </p>
                        </div>

                        <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-[#1E1E1E] border-2 border-[#D4A847]/40 img-placeholder" style={{ fontSize: 0 }} />
                                ))}
                            </div>
                            <p className="text-sm text-[#9CA3AF]">
                                <span className="text-white font-semibold">Lucas Silva • José Ricardo • Robert CFO</span>
                                <br />+500 operações escaladas
                            </p>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Hero Image Placeholder */}
                <ScrollReveal className="hidden lg:block">
                    <div className="relative aspect-[4/5] img-placeholder rounded-sm">
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-1">Speaker Principal</div>
                            <img src="/images/speakers/principal.png" alt="Principal Speaker" className="w-full h-full object-cover rounded-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            <div className="text-lg font-bold">📷 Foto do mentor será inserida aqui</div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
