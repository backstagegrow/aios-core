"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function SocialProof() {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Rich section background */}
            <div className="absolute inset-0">
                <Image
                    src="/images/section-bg.png"
                    alt=""
                    fill
                    className="object-cover opacity-40"
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

                {/* Photo grid — event atmosphere */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {[
                        { label: "Networking de alto nível", span: "md:col-span-2" },
                        { label: "Mentores e líderes", span: "" },
                        { label: "Estratégia no campo", span: "" },
                        { label: "Conexões estratégicas", span: "md:col-span-2" },
                    ].map((item, i) => (
                        <ScrollReveal key={i} delay={i * 0.08} className={item.span}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative rounded-2xl overflow-hidden aspect-[16/10] group cursor-pointer"
                            >
                                <Image
                                    src="/images/event-atmosphere.png"
                                    alt={item.label}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    style={{
                                        objectPosition: `${25 * i}% 50%`,
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 via-surface-950/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <span className="text-sm font-semibold">{item.label}</span>
                                    <span className="text-amber-400 text-xs ml-2">↗</span>
                                </div>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Stats row */}
                <ScrollReveal>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </div>
        </section>
    );
}
