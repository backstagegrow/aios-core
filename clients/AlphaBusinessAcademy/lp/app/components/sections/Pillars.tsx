"use client";
import ScrollReveal from "../ui/ScrollReveal";

const pillars = [
    {
        icon: "📈",
        title: "Receita Previsível",
        body: "Chega de ficar torcendo para o mês fechar no azul. Pipeline de vendas claro, proposta que converte e execução que não depende de você fechar cada mesa. Margem protegida. Recorrência real.",
    },
    {
        icon: "🏗️",
        title: "Escala Sem Caos",
        body: "Abrir a segunda unidade não pode ser uma aposta. Processos documentados, expansão com ROI calculado — não com feeling. De 1 para 3 unidades sem perder o sono.",
    },
    {
        icon: "🧑‍🤝‍🧑",
        title: "Time Que Roda Sem Você",
        body: "Imagine sair de férias por 15 dias e voltar com o negócio funcionando melhor do que quando você saiu. Cultura real, contratação por caráter, treinamento por processo. Não é utopia — é método.",
    },
    {
        icon: "🛡️",
        title: "Lucro Que Sobrevive ao Crescimento",
        body: "DRE que você entende em 5 minutos. Decisões baseadas em números, não em pressão do fornecedor. Cada real gasto justificado. Porque faturar R$300k e lucrar R$8k é pior do que faturar R$150k e lucrar R$40k.",
    },
];

export default function Pillars() {
    return (
        <section className="py-24 section-dark">
            <div className="max-w-6xl mx-auto px-6">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <p className="text-[#D4A847] text-sm font-semibold tracking-widest uppercase mb-4">
                            O Método de Quem Já Escalou +500 Operações
                        </p>
                        <h2 className="text-3xl md:text-5xl font-black mb-4">
                            O Tripé da{" "}
                            <span className="gradient-text">Excelência Empresarial™</span>
                        </h2>
                        <p className="text-[#9CA3AF] max-w-2xl mx-auto">
                            Não é teoria de MBA. É o sistema exato que transformou cafeterias, restaurantes e franquias em máquinas que funcionam{" "}
                            <strong className="text-white">sem o dono no balcão.</strong>
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pillars.map((p, i) => (
                        <ScrollReveal key={i}>
                            <div className="bg-[#141414] border border-white/5 p-8 hover:border-[#D4A847]/30 transition-all duration-500 group h-full">
                                <div className="flex items-start gap-5">
                                    <div className="text-3xl shrink-0 mt-1">{p.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-[#D4A847] transition-colors">
                                            {p.title}
                                        </h3>
                                        <p className="text-[#9CA3AF] leading-relaxed text-sm">{p.body}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal>
                    <p className="text-center mt-12 text-lg font-semibold text-white">
                        Quando os 4 pilares estão instalados, você para de sobreviver e{" "}
                        <span className="gradient-text">volta a ser dono de verdade.</span>
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
}
