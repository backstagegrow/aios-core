"use client";
import ScrollReveal from "./ScrollReveal";
import { usePopup } from "../context/PopupContext";

export default function EventDetails() {
    const { openPopup } = usePopup();

    const info = [
        { icon: "📅", title: "21 e 22 de Março de 2026", sub: "Dia inteiro" },
        { icon: "🍸", title: "Coquetel de Networking", sub: "Na véspera do evento" },
        { icon: "📍", title: "Edifício Morumbi Office Tower", sub: "São Paulo — SP" },
        { icon: "👥", title: "Vagas Limitadas", sub: "Curadoria de participantes" },
    ];

    const deliverables = [
        "Diagnóstico real do seu negócio (sem autoilusão)",
        "Plano de execução para os próximos 90 dias",
        "Estrutura de vendas previsível",
        "Framework de contratação e retenção",
        "Clareza financeira: DRE, fluxo e margem real",
        "Rede de empresários sérios + acesso direto aos mentores",
    ];

    return (
        <section id="evento" className="relative py-24 md:py-32 bg-gradient-to-br from-surface-900 via-surface-950 to-cool-950/30">
            <div className="max-w-6xl mx-auto px-6">
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-bold tracking-[0.2em] text-amber-400 uppercase mb-4">
                        A IMERSÃO
                    </span>
                    <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight mb-4">
                        O Caminho do Dono
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        2 dias para tomar as decisões que vão mudar a trajetória da sua
                        empresa.
                    </p>
                </ScrollReveal>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <div className="flex flex-col gap-4">
                        {info.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.08}>
                                <div className="glass rounded-xl p-5 flex items-start gap-4 transition-all duration-300 hover:border-amber-400/20">
                                    <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                                    <div>
                                        <strong className="text-[0.95rem] block">{item.title}</strong>
                                        <span className="text-text-muted text-sm">{item.sub}</span>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal delay={0.2}>
                        <div className="glass rounded-2xl p-8 bg-gradient-to-br from-amber-400/5 to-cool-700/5">
                            <h3 className="text-amber-400 font-bold text-base mb-6">
                                O que você vai construir nestes 2 dias:
                            </h3>
                            <ul className="space-y-3">
                                {deliverables.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-3 text-text-secondary text-[0.92rem] leading-relaxed"
                                    >
                                        <span className="text-amber-400 font-bold flex-shrink-0">→</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollReveal>
                </div>

                <ScrollReveal className="text-center mt-16">
                    <p className="text-amber-400 font-medium pt-8 border-t border-amber-400/10 mb-8">
                        Não é palestra. Não é motivacional. É um ambiente de decisão para
                        quem já opera e quer operar melhor.
                    </p>
                    <button
                        onClick={openPopup}
                        className="animate-glow inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-surface-950 font-bold tracking-wider text-sm hover:from-amber-300 hover:to-amber-500 transition-all duration-300 shadow-[0_0_30px_rgba(200,164,92,0.15)]"
                    >
                        GARANTIR MINHA VAGA AGORA
                    </button>
                </ScrollReveal>
            </div>
        </section>
    );
}
