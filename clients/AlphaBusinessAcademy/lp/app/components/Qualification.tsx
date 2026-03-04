"use client";
import ScrollReveal from "./ScrollReveal";
import { usePopup } from "../context/PopupContext";

export default function Qualification() {
    const { openPopup } = usePopup();

    const forWho = [
        "Empresários com negócio em operação que precisam subir o nível de decisão",
        "Quem já fatura, mas sente que o crescimento virou peso e não liberdade",
        "Quem está sobrecarregado e quer sair do improviso com direção",
        "Quem quer clareza sobre vendas, pessoas e expansão — sem teoria solta",
        "Quem entende que o próximo nível exige ambiente certo e conversas reais",
    ];

    const notFor = [
        "Iniciantes ou quem ainda não tem negócio rodando",
        "Quem busca fórmula mágica ou atalho rápido",
        "Quem quer apenas se inspirar sem agir",
    ];

    return (
        <section className="relative py-24 md:py-32 bg-gradient-to-b from-surface-950 to-surface-900">
            <div className="max-w-4xl mx-auto px-6">
                <ScrollReveal className="text-center mb-12">
                    <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight">
                        Essa imersão não é para curiosos.
                        <br />
                        <span className="text-amber-400">
                            É para empresários de decisão.
                        </span>
                    </h2>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 gap-6">
                    <ScrollReveal>
                        <div className="rounded-2xl p-8 bg-gradient-to-br from-emerald-950/20 to-surface-900 border border-emerald-700/15">
                            <h3 className="text-base font-bold mb-5 flex items-center gap-2">
                                <span className="text-emerald-400">✔</span> Para quem é
                            </h3>
                            <ul className="space-y-3">
                                {forWho.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-3 text-text-secondary text-[0.92rem] leading-relaxed"
                                    >
                                        <span className="text-emerald-400 flex-shrink-0 mt-0.5">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.1}>
                        <div className="rounded-2xl p-8 bg-gradient-to-br from-red-950/20 to-surface-900 border border-red-700/15">
                            <h3 className="text-base font-bold mb-5 flex items-center gap-2">
                                <span className="text-red-400">✕</span> Para quem NÃO é
                            </h3>
                            <ul className="space-y-3">
                                {notFor.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-3 text-text-secondary text-[0.92rem] leading-relaxed"
                                    >
                                        <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollReveal>
                </div>

                <ScrollReveal className="text-center mt-12 flex flex-col items-center gap-6">
                    <p className="text-text-muted">
                        Por isso existe o processo seletivo. Não é para qualquer um. É para
                        quem está pronto.
                    </p>
                    <button
                        onClick={openPopup}
                        className="inline-flex items-center px-8 py-3 rounded-xl bg-surface-800 text-amber-400 border border-amber-400/20 font-bold tracking-wider text-sm hover:bg-surface-700 transition-all duration-300"
                    >
                        APLICAR PARA A SELEÇÃO
                    </button>
                </ScrollReveal>
            </div>
        </section>
    );
}
