"use client";
import { useState } from "react";
import ScrollReveal from "../ui/ScrollReveal";

const faqs = [
    {
        q: "Preciso parar 2 dias inteiros?",
        a: "Sim. E esse é exatamente o ponto. Se você não consegue tirar 2 dias para pensar no futuro da sua empresa, essa é a maior prova de que precisa estar aqui. Quanto custa mais um ano no mesmo ciclo? Mais do que 2 dias, com certeza.",
    },
    {
        q: "É para o meu segmento?",
        a: "Se você tem um negócio no food service — cafeteria, restaurante, dark kitchen, franquia alimentícia — sim, foi desenhado cirurgicamente para você. Os mentores não são teóricos. Eles vivem esse mercado todos os dias.",
    },
    {
        q: "Vou sair com algo prático?",
        a: "Você vai sair com um plano de execução para os próximos 90 dias, frameworks testados em +500 operações, e acesso direto à rede de mentores. Não é 'depois a gente vê'. É ação no dia seguinte.",
    },
    {
        q: "Não vai ser mais uma palestra motivacional?",
        a: "Zero motivação. 100% sistema. É imersão com diagnóstico do seu negócio real, construção de plano com números e interação direta com quem já escalou operações iguais à sua. Você não vai assistir — vai trabalhar no seu negócio.",
    },
    {
        q: "E se meu time não aguentar 2 dias sem mim?",
        a: "Se ele não aguenta, essa é a prova definitiva de que sua empresa tem uma dependência terminal. Voltar com a estrutura para resolver isso é literalmente o melhor ROI que você vai ter esse ano.",
    },
    {
        q: "Como funciona a inscrição?",
        a: "É um processo de aplicação de 3 minutos. Analisamos cada perfil para manter o nível do grupo exatamente onde precisa estar. Respondemos em até 48h via WhatsApp com a decisão.",
    },
];

export default function FAQ() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section className="py-24 section-dark">
            <div className="max-w-3xl mx-auto px-6">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
                        Ainda tem <span className="gradient-text">dúvidas?</span>
                    </h2>
                    <p className="text-center text-[#9CA3AF] mb-12 text-sm">
                        Se a resposta que você procura não está aqui, fale com nosso time pelo WhatsApp.
                    </p>
                </ScrollReveal>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <ScrollReveal key={i}>
                            <div className="border border-white/5 bg-[#141414] overflow-hidden">
                                <button
                                    onClick={() => setOpen(open === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
                                >
                                    <span className="font-semibold pr-4">{faq.q}</span>
                                    <span className="text-[#D4A847] text-xl shrink-0">
                                        {open === i ? "−" : "+"}
                                    </span>
                                </button>
                                {open === i && (
                                    <div className="px-6 pb-6 text-sm text-[#9CA3AF] leading-relaxed border-t border-white/5 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
