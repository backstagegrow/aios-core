"use client";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { usePopup } from "../context/PopupContext";

const pillars = [
    {
        num: "01",
        label: "VENDAS",
        title: "Receita Previsível",
        text: "Pipeline de vendas claro. Proposta que converte. Execução que não depende do dono fechar cada mesa. Vendas com margem e recorrência.",
        gradient: "from-amber-400/20 via-transparent to-transparent",
        borderAccent: "border-l-amber-400",
    },
    {
        num: "02",
        label: "EXPANSÃO",
        title: "Escala com Estrutura",
        text: "Crescimento que não quebra. Processos documentados. Expansão com ROI calculado — não com feeling. De 1 para 3 unidades sem caos.",
        gradient: "from-cool-600/20 via-transparent to-transparent",
        borderAccent: "border-l-cool-500",
    },
    {
        num: "03",
        label: "AUTONOMIA",
        title: "Pessoas Autônomas",
        text: "Time que entrega resultado mesmo quando você não está. Cultura organizacional real, não discurso. Contratação por caráter, treinamento por processo.",
        gradient: "from-amber-400/15 via-cool-700/10 to-transparent",
        borderAccent: "border-l-amber-500",
    },
    {
        num: "04",
        label: "LUCRO",
        title: "Margem Protegida",
        text: "DRE que você entende. Decisões baseadas em números reais, não em pressão. Cada real gasto justificado. Lucro que sobrevive ao crescimento.",
        gradient: "from-cool-500/15 via-amber-400/10 to-transparent",
        borderAccent: "border-l-cool-600",
    },
];

export default function Pillars() {
    const { openPopup } = usePopup();

    return (
        <section className="relative py-24 md:py-32 bg-surface-950 overflow-hidden">
            {/* Background accent */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(80,70,160,0.05),transparent_50%)]" />

            <div className="relative max-w-6xl mx-auto px-6">
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-bold tracking-[0.2em] text-amber-400 uppercase mb-4">
                        METODOLOGIA PROPRIETÁRIA
                    </span>
                    <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight mb-4">
                        O Tripé da Excelência Empresarial™
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        A metodologia que transformou +500 operações do food service em
                        negócios que funcionam sem o dono no balcão.
                    </p>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {pillars.map((p, i) => (
                        <ScrollReveal key={i} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -8, borderColor: "rgba(200,164,92,0.4)" }}
                                className={`glass rounded-2xl p-7 h-full border-l-[3px] ${p.borderAccent} bg-gradient-to-b ${p.gradient} transition-shadow duration-500 hover:shadow-[0_12px_40px_rgba(200,164,92,0.08)]`}
                            >
                                <span className="text-5xl font-black text-amber-400/10 leading-none block mb-3 transition-colors duration-300 group-hover:text-amber-400/25">
                                    {p.num}
                                </span>
                                <span className="text-[0.65rem] font-bold tracking-[0.2em] text-cool-500 block mb-2">
                                    {p.label}
                                </span>
                                <h3 className="text-amber-400 font-bold text-base mb-3">
                                    {p.title}
                                </h3>
                                <p className="text-text-secondary text-[0.88rem] leading-relaxed">
                                    {p.text}
                                </p>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal className="text-center mt-16 flex flex-col items-center gap-6">
                    <div className="divider-gradient w-full max-w-md mx-auto mb-4" />
                    <p className="text-amber-400 font-medium">
                        Quando os 4 pilares estão alinhados, você para de ser operador e
                        volta a ser dono.
                    </p>
                    <button
                        onClick={openPopup}
                        className="animate-glow inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-surface-950 font-bold tracking-wider text-sm hover:from-amber-300 hover:to-amber-500 transition-all duration-300 shadow-[0_0_30px_rgba(200,164,92,0.15)]"
                    >
                        ALINHAR MEUS PILARES AGORA
                    </button>
                </ScrollReveal>
            </div>
        </section>
    );
}
