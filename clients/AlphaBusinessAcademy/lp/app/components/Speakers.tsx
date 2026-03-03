"use client";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

/* ──────────────────────────────────────────────
   DADOS VALIDADOS contra o site oficial:
   https://pontoacafe.com/evento-presencial-o-caminho-do-dono/
   ────────────────────────────────────────────── */
const speakers = [
    {
        initials: "LS",
        role: "CEO • ALPHA MASTER MENTOR",
        name: "Lucas Silva",
        title: "CEO da Ponto Alpha Café\nExecutivo de Expansão da Monster Dog",
        bio: "Construiu a jornada na operação e evoluiu até a linha de frente das decisões que mudam o jogo: equipe, expansão e margem.",
        tags: ["Expansão", "Gestão", "Campo"],
        gradient: "from-amber-400 to-amber-700",
    },
    {
        initials: "JR",
        role: "FUNDADOR • PALESTRANTE",
        name: "José Ricardo",
        title: "Fundador do Ponto Alpha Café\n+500 lojas implantadas",
        bio: "De camelô a uma das maiores referências em franquias no Brasil. Crescimento no mundo real: ponto, processo, padrão e escala.",
        tags: ["Franquias", "Expansão", "Execução"],
        gradient: "from-cool-500 to-cool-700",
    },
    {
        initials: "R",
        role: "MENTOR & CFO",
        name: "Robert",
        title: "Mentor e CFO da Ponto Alpha\nConselheiro de grandes empresários",
        bio: "Atua onde decisões mudam o jogo: caixa, margem, prioridades e governança. Traduz estratégia em direção, execução e resultado.",
        tags: ["Finanças", "Governança", "Liderança"],
        gradient: "from-amber-500 to-cool-600",
    },
];

export default function Speakers() {
    return (
        <section
            id="mentores"
            className="relative py-24 md:py-32 bg-section-warm"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(80,70,160,0.04),transparent_50%)]" />
            <div className="relative max-w-6xl mx-auto px-6">
                <ScrollReveal className="text-center mb-16">
                    <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight">
                        Quem Vai Guiar Sua Transformação
                    </h2>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-6">
                    {speakers.map((s, i) => (
                        <ScrollReveal key={i} delay={i * 0.12}>
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="glass rounded-2xl p-8 text-center h-full transition-all duration-500 hover:shadow-[0_12px_40px_rgba(200,164,92,0.08)] hover:border-amber-400/25"
                            >
                                <div
                                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center mx-auto mb-5 border-[3px] border-surface-950 shadow-lg`}
                                >
                                    <span className="text-xl font-extrabold text-surface-950">
                                        {s.initials}
                                    </span>
                                </div>
                                <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cool-500 block mb-1">
                                    {s.role}
                                </span>
                                <h3 className="text-xl font-extrabold mb-2">{s.name}</h3>
                                <p className="text-text-muted text-sm whitespace-pre-line mb-4 leading-snug">
                                    {s.title}
                                </p>
                                <p className="text-text-secondary text-[0.88rem] italic leading-relaxed mb-5">
                                    {s.bio}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {s.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[0.65rem] font-semibold tracking-wider text-amber-400 bg-amber-400/8 px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
