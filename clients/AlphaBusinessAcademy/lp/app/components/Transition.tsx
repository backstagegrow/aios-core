"use client";
import ScrollReveal from "./ScrollReveal";

export default function Transition() {
    return (
        <section className="relative py-20 md:py-28 bg-gradient-to-b from-surface-950 via-cool-950 to-surface-950 border-y border-amber-400/8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(80,70,160,0.06),transparent_60%)]" />
            <div className="relative max-w-3xl mx-auto px-6 text-center">
                <ScrollReveal>
                    <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight mb-6">
                        O problema não é falta de esforço.
                        <br />
                        <span className="text-amber-400">É falta de sistema.</span>
                    </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.15}>
                    <p className="text-text-secondary text-lg leading-relaxed mb-5">
                        Empresários do food service trabalham mais do que qualquer um. Mas
                        esforço sem método é improviso. E improviso tem um preço: sua
                        margem, seu tempo e sua saúde mental.
                    </p>
                </ScrollReveal>
                <ScrollReveal delay={0.25}>
                    <p className="text-text-secondary text-lg leading-relaxed">
                        A diferença entre o dono que escala e o que se afoga não é talento —{" "}
                        <strong className="text-text-primary">é estrutura</strong>. E
                        estrutura se instala.
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
}
