"use client";
import ScrollReveal from "./ScrollReveal";

const pains = [
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
                <path d="M24 14v12l8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Preso no Operacional",
        text: "Você abriu o negócio para ter liberdade. Mas hoje é o primeiro a chegar e o último a sair. Se tira um dia de folga, ligam 15 vezes. Não existe processo — existe você apagando incêndio.",
        accent: "from-amber-400/10 to-cool-700/10",
    },
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <path d="M8 34h32M8 14l8 8 8-6 8 10 8-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Fatura Bem, Mas Não Sobra",
        text: "O faturamento cresce, mas o lucro não acompanha. Sem DRE claro, sem fluxo de caixa real. Você trabalha mais e ganha proporcionalmente menos.",
        accent: "from-cool-600/10 to-amber-400/10",
    },
    {
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <circle cx="18" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="34" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 36c0-6 5-10 12-10s12 4 12 10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M34 22c4 0 8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Time Que Não Funciona Sozinho",
        text: "Contrata caro, treina com dificuldade, perde em 3 meses. O turnover come sua margem e sua energia. Quer delegar, mas não confia.",
        accent: "from-amber-400/10 to-cool-600/10",
    },
];

export default function PainCards() {
    return (
        <section className="relative py-24 md:py-32 bg-section-alt">
            <div className="divider-gradient mb-24" />
            <div className="max-w-6xl mx-auto px-6">
                <ScrollReveal>
                    <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight mb-4">
                        Você reconhece esse cenário?
                    </h2>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    {pains.map((pain, i) => (
                        <ScrollReveal key={i} delay={i * 0.12}>
                            <div className={`glass rounded-2xl p-8 h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(200,164,92,0.08)] group bg-gradient-to-br ${pain.accent}`}>
                                <div className="text-amber-400 mb-5 transition-transform duration-300 group-hover:scale-110">
                                    {pain.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-3">{pain.title}</h3>
                                <p className="text-text-secondary text-[0.92rem] leading-relaxed">
                                    {pain.text}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal>
                    <p className="text-amber-400 font-medium mt-16 pt-8 border-t border-amber-400/10 text-center md:text-left">
                        Se você se viu em pelo menos um desses cenários, este evento foi
                        desenhado para você.
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
}
