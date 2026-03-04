"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "../ui/ScrollReveal";
import { usePopup } from "../context/PopupContext";

export default function SocialProof() {
    const { openPopup } = usePopup();

    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Rich section background */}
            <div className="absolute inset-0">
                <Image
                    src="/images/section-bg.png"
                    alt=""
                    fill
                    className="object-cover opacity-40"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-transparent to-surface-950" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6">
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-bold tracking-[0.2em] text-amber-400 uppercase mb-4">
                        AUTORIDADE & CONEXÕES
                    </span>
                    <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight mb-4">
                        Nosso Know-How Bilionário
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Isso não é &ldquo;conteúdo bonito&rdquo;. É proximidade com quem decide
                        grande, ambiente que eleva seu padrão e campo real onde estratégia
                        vira execução.
                    </p>
                </ScrollReveal>

                {/* No photo grid, moved elsewhere or removed */}

                {/* Stats row */}
                <ScrollReveal>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {[
                            { num: "+500", label: "Operações escaladas" },
                            { num: "2", label: "Dias de imersão" },
                            { num: "3", label: "Mentores especialistas" },
                            { num: "100%", label: "Foco em execução" },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="glass rounded-xl p-5 text-center transition-all duration-300 hover:border-amber-400/20"
                            >
                                <span className="text-2xl md:text-3xl font-black text-amber-400 block">
                                    {stat.num}
                                </span>
                                <span className="text-text-muted text-xs tracking-wider uppercase mt-1 block">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>

                <ScrollReveal className="text-center">
                    <button
                        onClick={openPopup}
                        className="animate-glow inline-flex items-center px-10 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-surface-950 font-bold tracking-wider text-sm hover:from-amber-300 hover:to-amber-500 transition-all duration-300 shadow-[0_0_30px_rgba(200,164,92,0.15)] hover:-translate-y-0.5"
                    >
                        COLOCAR MINHA EMPRESA NESSE NÍVEL
                    </button>
                </ScrollReveal>
            </div>
        </section>
    );
}
