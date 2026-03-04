"use client";
import ScrollReveal from "../ui/ScrollReveal";

export default function Transition() {
    return (
        <section className="py-20 bg-gradient-to-b from-[#141414] to-[#0A0A0A] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#D4A847]/[0.02]" />
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-4xl font-black mb-8">
                        O problema não é falta de esforço.{" "}
                        <span className="gradient-text">É falta de estrutura.</span>
                    </h2>
                    <p className="text-lg text-[#9CA3AF] leading-relaxed max-w-3xl mx-auto mb-6">
                        Dono de restaurante trabalha mais do que qualquer executivo de multinacional. Mas esforço sem método é improviso. E improviso cobra caro: sua margem, seu tempo, sua saúde e — no final — o futuro da sua família.
                    </p>
                    <p className="text-xl text-white font-semibold">
                        A diferença entre o dono que escala e o que se afoga não é talento. Não é sorte. Não é mercado.
                        <br />
                        <span className="gradient-text">É sistema. E sistema se instala em 2 dias.</span>
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
}
