"use client";
import ScrollReveal from "./ScrollReveal";
import { usePopup } from "../context/PopupContext";

export default function ApplicationForm() {
    const { openPopup } = usePopup();

    return (
        <section
            id="aplicacao"
            className="relative py-24 md:py-32 bg-gradient-to-b from-surface-950 via-cool-950 to-surface-950"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(200,164,92,0.04),transparent_50%)]" />
            <div className="relative max-w-4xl mx-auto px-6 text-center">
                <ScrollReveal className="mb-12">
                    <span className="inline-block text-xs font-bold tracking-[0.2em] text-amber-400 uppercase mb-4 px-4 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5">
                        INSCRIÇÃO
                    </span>
                    <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-6">
                        Sua Empresa Vai Continuar
                        <br className="hidden md:block" />
                        Dependendo de Você?
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10">
                        Clique no botão abaixo para preencher a sua aplicação.
                        As vagas são limitadas para manter a proximidade e qualidade do evento.
                    </p>

                    <button
                        onClick={openPopup}
                        className="animate-glow inline-flex items-center justify-center px-12 py-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-surface-950 font-black tracking-wider text-lg hover:from-amber-300 hover:to-amber-500 transition-all duration-300 hover:-translate-y-1 shadow-[0_0_40px_rgba(200,164,92,0.2)]"
                    >
                        QUERO GARANTIR MINHA VAGA →
                    </button>
                    <p className="text-center text-text-muted text-sm mt-5">
                        Processo seletivo de 3 minutos • Seleção criteriosa
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
}
