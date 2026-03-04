"use client";
import ScrollReveal from "../ui/ScrollReveal";

const speakers = [
    {
        name: "Lucas Silva",
        role: "Alpha Master Mentor",
        bio: "CEO da Ponto Alpha Café. Executivo de expansão da Monster Dog. Não fala de gestão da teoria — construiu a operação de dentro para fora. Sabe o que é ficar 14h no balcão, e sabe exatamente como sair de lá.",
    },
    {
        name: "José Ricardo",
        role: "Fundador do Ponto Alpha",
        bio: "De camelô a fundador de uma rede com +500 lojas. Zero teoria. Uma jornada inteira construída com as mãos no caixa. Entende cada dor sua porque já viveu cada uma delas — e saiu do outro lado.",
    },
    {
        name: "Robert",
        role: "Mentor & CFO",
        bio: "O estrategista financeiro que faz DRE parecer simples. Governança e estrutura para negócios que querem crescer sem quebrar. Se o número não fecha na planilha dele, a decisão não passa.",
    },
    {
        name: "Eduardo Oliveira & Victor Silva",
        role: "Executivos de Expansão",
        bio: "Visão de quem já escalou operações complexas no food service. Branding, marketing, processos e expansão — na prática, não no PowerPoint.",
    },
];

export default function Speakers() {
    return (
        <section className="py-24 section-dark">
            <div className="max-w-6xl mx-auto px-6">
                <ScrollReveal>
                    <p className="text-[#D4A847] text-sm font-semibold tracking-widest uppercase mb-4 text-center">
                        Seus Mentores nos 2 Dias
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
                        Quem Vai <span className="gradient-text">Guiar Sua Transformação</span>
                    </h2>
                    <p className="text-center text-[#9CA3AF] mb-16 max-w-2xl mx-auto text-sm">
                        Não são palestrantes. São operadores. Cada um deles construiu, escalou e vive diariamente o que vai te ensinar.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {speakers.map((s, i) => (
                        <ScrollReveal key={i}>
                            <div className="bg-[#141414] border border-white/5 overflow-hidden hover:border-[#D4A847]/30 transition-all duration-500 group">
                                {/* Photo placeholder */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={`/images/speakers/${s.name.toLowerCase().split(' ')[0]}.png`}
                                        alt={s.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.parentElement!.classList.add('img-placeholder'))}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold group-hover:text-[#D4A847] transition-colors">
                                        {s.name}
                                    </h3>
                                    <p className="text-[#D4A847] text-sm font-semibold mb-3">
                                        {s.role}
                                    </p>
                                    <p className="text-[#9CA3AF] text-sm leading-relaxed">{s.bio}</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
