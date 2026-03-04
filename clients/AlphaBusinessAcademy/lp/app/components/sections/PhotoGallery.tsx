"use client";
import ScrollReveal from "../ui/ScrollReveal";
import { usePopup } from "../../context/PopupContext";

const galleryImages = [
    "DE3A2507.jpg",
    "DSC00015.jpg",
    "DSC00016.jpg",
    "DSC00471 (1).jpg",
    "DSC00471 (2).jpg",
    "DSC00471.jpg",
    "DSC00529.jpg",
    "DSC08448.jpg", // Substituí para garantir diversidade
    "DSC08333.jpg",
    "DSC08376.jpg",
    "DSC08386.jpg",
    "DSC08417.jpg",
];

export default function PhotoGallery() {
    const { openPopup } = usePopup();

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

                {/* Photo Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {galleryImages.map((img, i) => (
                        <ScrollReveal key={i}>
                            <div
                                className={`relative overflow-hidden group shadow-lg ${i === 0 || i === 5
                                    ? "md:col-span-2 md:row-span-2 aspect-square"
                                    : "aspect-[4/3]"
                                    }`}
                            >
                                <img
                                    src={`/images/Bastidores de Quem Já Passou Por Aqui/${img}`}
                                    alt={`Bastidores ${i + 1}`}
                                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal>
                    <div className="text-center mt-12">
                        <button onClick={openPopup} className="cta-button">
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
