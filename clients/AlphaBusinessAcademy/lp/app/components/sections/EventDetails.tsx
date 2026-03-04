"use client";
import ScrollReveal from "../ui/ScrollReveal";

export default function EventDetails() {
    const scrollToForm = () => {
        document.getElementById("aplicacao")?.scrollIntoView({ behavior: "smooth" });
    };

    const deliverables = [
        "Diagnóstico real do seu negócio (sem autoilusão)",
        "Plano de execução para os próximos 90 dias",
        "Estrutura de vendas previsível para food service",
        "Framework de contratação e retenção",
        "Clareza financeira: DRE, fluxo e margem real",
        "Rede de empresários sérios + acesso direto aos mentores",
    ];

    return (
        <section className="py-24 section-surface relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Local placeholder */}
                    <ScrollReveal>
                        <div className="space-y-6">
                            <div className="aspect-video relative overflow-hidden rounded-sm">
                                <img
                                    src="/images/venue/local.png"
                                    alt="Venue"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.parentElement!.classList.add('img-placeholder'))}
                                />
                            </div>
                            <div className="bg-[#0A0A0A] border border-white/5 p-6">
                                <h3 className="text-xl font-bold mb-1 gradient-text">O QG da Sua Nova Escala</h3>
                                <div className="border-l-2 border-[#D4A847] pl-4 mt-4 space-y-1">
                                    <p className="font-semibold text-white">Edifício Morumbi Office Tower</p>
                                    <p className="text-sm text-[#9CA3AF]">São Paulo, SP</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Right: Event info */}
                    <ScrollReveal>
                        <div className="space-y-8">
                            <div>
                                <p className="text-[#D4A847] text-sm font-semibold tracking-widest uppercase mb-4">Imersão Presencial</p>
                                <h2 className="text-3xl md:text-4xl font-black mb-2">O Caminho do Dono</h2>
                                <p className="text-[#9CA3AF]">2 dias para tomar as decisões que vão mudar a trajetória da sua empresa.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: "📅", label: "21 e 22 de Março de 2026" },
                                    { icon: "🍸", label: "Coquetel de networking" },
                                    { icon: "📍", label: "São Paulo, SP" },
                                    { icon: "👥", label: "Vagas limitadas por curadoria" },
                                ].map((d, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-[#0A0A0A] p-4 border border-white/5">
                                        <span className="text-xl">{d.icon}</span>
                                        <span className="text-sm font-medium">{d.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h4 className="font-bold mb-4 text-lg">O que você vai construir nestes 2 dias:</h4>
                                <ul className="space-y-3">
                                    {deliverables.map((d, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <span className="text-[#D4A847] font-bold mt-0.5">✓</span>
                                            <span className="text-[#9CA3AF]">{d}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-[#D4A847]/5 border border-[#D4A847]/20 p-4 text-sm text-[#9CA3AF] italic">
                                Não é palestra. Não é motivacional. É um ambiente de decisão para quem já opera e quer operar melhor.
                            </div>

                            <button onClick={scrollToForm} className="cta-button w-full">
                                → Quero Aplicar Para a Imersão
                            </button>
                            <p className="text-xs text-[#9CA3AF] text-center">16 e 17 de Março | São Paulo — SP</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
