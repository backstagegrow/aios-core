"use client";
import ScrollReveal from "../ui/ScrollReveal";

const painPoints = [
    {
        icon: "🔥",
        title: "Preso no Balcão",
        body: "Você abriu o negócio para ter liberdade. Hoje é o primeiro a chegar e o último a sair. Tira um dia de folga? Ligam 15 vezes. Vai ao médico? Volta correndo. Não existe férias. Não existe processo. Existe você — apagando incêndio todos os dias.",
    },
    {
        icon: "💸",
        title: "Fatura Alto, Lucra Pouco",
        body: "O faturamento cresce — mas o dinheiro some. Sem DRE, sem fluxo de caixa real, sem saber quanto custa cada prato que sai. Você trabalha o dobro e leva pra casa proporcionalmente menos. O negócio engorda. O seu bolso, não.",
    },
    {
        icon: "👥",
        title: "Time Que Só Funciona Com Você",
        body: "Contrata caro. Treina com dificuldade. Perde em 3 meses. O turnover come sua margem e sua energia. Quer delegar, mas não confia. Quando confia, se frustra. Resultado: você centraliza tudo e vira o gargalo do próprio negócio.",
    },
];

export default function PainCards() {
    return (
        <section className="py-24 section-surface">
            <div className="max-w-6xl mx-auto px-6">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
                        Se você se vê aqui, <span className="gradient-text">não é coincidência.</span>
                    </h2>
                    <p className="text-center text-[#9CA3AF] mb-16 max-w-2xl mx-auto">
                        Esses 3 cenários destruíram mais negócios promissores do que qualquer crise econômica. Se você se identificou com pelo menos um, este evento existe por sua causa.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {painPoints.map((card, i) => (
                        <ScrollReveal key={i}>
                            <div className="bg-[#0A0A0A] border border-white/5 p-8 h-full hover:border-[#D4A847]/30 transition-all duration-500 group">
                                <div className="text-4xl mb-6">{card.icon}</div>
                                <h3 className="text-xl font-bold mb-4 group-hover:text-[#D4A847] transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-[#9CA3AF] leading-relaxed text-sm">{card.body}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
