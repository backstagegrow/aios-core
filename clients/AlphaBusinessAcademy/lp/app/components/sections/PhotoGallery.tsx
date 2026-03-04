"use client";
import ScrollReveal from "../ui/ScrollReveal";

export default function PhotoGallery() {
    return (
        <section className="py-24 section-cream">
            <div className="max-w-6xl mx-auto px-6">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-[#0A0A0A]">
                        Bastidores de Quem Já{" "}
                        <span className="text-[#D4A847]">Passou Por Aqui</span>
                    </h2>
                    <p className="text-center text-[#0A0A0A]/60 mb-12 max-w-2xl mx-auto">
                        Cada edição é uma experiência única. Donos que chegam sobrecarregados e saem com clareza, plano e uma rede de parceiros de verdade.
                    </p>
                </ScrollReveal>

                {/* Photo Grid - Placeholders */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ScrollReveal key={i}>
                            <div
                                className={`relative overflow-hidden border-[#D4A847]/10 ${i === 0 || i === 5
                                    ? "md:col-span-2 md:row-span-2 aspect-square"
                                    : "aspect-[4/3]"
                                    }`}
                            >
                                <img
                                    src={`/images/gallery/foto${i + 1}.png`}
                                    alt={`Foto ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.parentElement!.classList.add('img-placeholder', 'bg-[#E5E5E5]'))}
                                />
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal>
                    <div className="text-center mt-12">
                        <button
                            onClick={() =>
                                document
                                    .getElementById("aplicacao")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="cta-button"
                        >
                            → Quero Viver Isso na Próxima Edição
                        </button>
                        <p className="text-sm text-[#0A0A0A]/50 mt-3">
                            21 e 22 de Março | São Paulo — SP
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
