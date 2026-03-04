"use client";
import ScrollReveal from "../ui/ScrollReveal";

const forWho = [
    "Donos de restaurantes, cafeterias, franquias e dark kitchens que já faturam",
    "Quem cresce no faturamento mas não vê o lucro acompanhar",
    "Empresários que querem montar time, documentar processo e escalar com segurança",
    "Quem busca um ambiente de decisão com outros donos sérios — não é feira de networking",
    "Prontos para investir 2 dias em estrutura que vai economizar anos de tentativa e erro",
];

const notForWho = [
    "Quem ainda não abriu o negócio — aqui é para quem já opera",
    "Quem quer fórmula mágica ou 'hack' pra ficar rico rápido",
    "Quem quer só 'se inspirar' e voltar pra fazer tudo igual",
];

export default function Qualification() {
    return (
        <section className="py-24 section-surface">
            <div className="max-w-5xl mx-auto px-6">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
                        Isso aqui é para quem{" "}
                        <span className="gradient-text">já está no jogo.</span>
                    </h2>
                    <p className="text-center text-[#9CA3AF] mb-16 max-w-2xl mx-auto text-sm">
                        Não abrimos para qualquer um. O processo seletivo existe para garantir que cada pessoa na sala esteja no nível certo.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ScrollReveal>
                        <div className="bg-[#0A0A0A] border border-[#22C55E]/20 p-8 h-full">
                            <h3 className="text-xl font-bold mb-6 text-[#22C55E]">
                                ✅ Para quem é
                            </h3>
                            <ul className="space-y-4">
                                {forWho.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <span className="text-[#22C55E] font-bold mt-0.5">✓</span>
                                        <span className="text-[#9CA3AF]">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal>
                        <div className="bg-[#0A0A0A] border border-[#EF4444]/20 p-8 h-full">
                            <h3 className="text-xl font-bold mb-6 text-[#EF4444]">
                                ❌ Para quem NÃO é
                            </h3>
                            <ul className="space-y-4">
                                {notForWho.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <span className="text-[#EF4444] font-bold mt-0.5">✗</span>
                                        <span className="text-[#9CA3AF]">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollReveal>
                </div>

                <ScrollReveal>
                    <p className="text-center mt-8 text-white text-sm font-semibold">
                        Por isso existe o processo seletivo.{" "}
                        <span className="gradient-text">
                            Não é para qualquer um. É para quem está pronto.
                        </span>
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
}
