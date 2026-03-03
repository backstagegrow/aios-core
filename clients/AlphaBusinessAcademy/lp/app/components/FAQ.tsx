"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const faqs = [
    {
        q: "Preciso parar 2 dias inteiros?",
        a: "Sim. E esse é exatamente o ponto. Se você não consegue tirar 2 dias para pensar no futuro do seu negócio, essa é a prova de que precisa estar aqui. O custo de NÃO parar é muito maior.",
    },
    {
        q: "É para o meu segmento?",
        a: "A imersão é para empresários em operação que querem subir o nível de decisão. Os mentores viveram a jornada do food service, franquias e expansão de rede — a metodologia se aplica a qualquer negócio em fase de crescimento.",
    },
    {
        q: "Vou receber algo prático para levar?",
        a: "Você vai sair com um plano de execução para os próximos 90 dias, frameworks testados e acesso à rede de mentores. Não tem 'depois a gente vê'. É ação imediata.",
    },
    {
        q: "Meu time aguenta sem mim por 2 dias?",
        a: "Se não aguenta 2 dias, esse é o maior sinal de que sua empresa precisa de estrutura. Voltar de lá com um plano para resolver isso é o melhor investimento que você faz.",
    },
    {
        q: "Como funciona a inscrição?",
        a: "É um processo de aplicação de 1-3 minutos. Analisamos cada perfil para manter a qualidade do grupo. Você será direcionado ao WhatsApp com o time para os próximos passos.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section
            id="faq"
            className="relative py-24 md:py-32 bg-section-cool"
        >
            <div className="max-w-3xl mx-auto px-6">
                <ScrollReveal className="text-center mb-12">
                    <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold">
                        Dúvidas frequentes
                    </h2>
                    <p className="text-text-muted mt-2">
                        Visão e clareza antes de você tomar a decisão.
                    </p>
                </ScrollReveal>

                <div className="space-y-3">
                    {faqs.map((item, i) => (
                        <ScrollReveal key={i} delay={i * 0.06}>
                            <div className="glass rounded-xl overflow-hidden transition-colors duration-300 hover:border-amber-400/20">
                                <button
                                    onClick={() =>
                                        setOpenIndex(openIndex === i ? null : i)
                                    }
                                    className="w-full flex justify-between items-center p-5 text-left text-[0.95rem] font-semibold text-text-primary hover:text-amber-400 transition-colors"
                                    aria-expanded={openIndex === i}
                                >
                                    <span>{item.q}</span>
                                    <motion.span
                                        animate={{ rotate: openIndex === i ? 45 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-amber-400 text-xl flex-shrink-0 ml-4"
                                    >
                                        +
                                    </motion.span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {openIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <p className="px-5 pb-5 text-text-secondary text-[0.92rem] leading-relaxed">
                                                {item.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
