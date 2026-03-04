"use client";
import { usePopup } from "../../context/PopupContext";

export default function Hero() {
    const { openPopup } = usePopup();

    return (
        <section className="relative min-h-screen bg-[#0A0A0A] flex items-center overflow-hidden">

            {/* Subtle gradient accents */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#D4A847]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#D4A847]/3 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* ——— LEFT COLUMN: All copy ——— */}
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A847]/10 border border-[#D4A847]/30 text-[#D4A847] text-sm font-semibold tracking-wider uppercase">
                            🔒 Últimas vagas — Imersão Presencial em SP, 21 e 22 de Março
                        </div>

                        {/* Title — mb-10 = 40px de espaço */}
                        <h1 className="mt-8 mb-10 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.15] tracking-tight text-white">
                            Em 2 Dias, Instale{" "}
                            <span className="gradient-text">a Estrutura Que Faz</span>{" "}
                            Seu Negócio Lucrar{" "}
                            <span className="gradient-text">Sem Você no Balcão.</span>
                        </h1>

                        {/* Description — mb-10 = 40px de espaço */}
                        <p className="mb-10 text-lg text-[#9CA3AF] max-w-xl leading-[1.8]">
                            A imersão presencial para donos de restaurantes, cafeterias e
                            franquias que faturam bem — mas{" "}
                            <strong className="text-white">
                                trabalham demais, lucram de menos e não conseguem tirar 2
                                dias de folga
                            </strong>{" "}
                            sem o negócio parar.
                        </p>

                        {/* CTA — mb-10 = 40px de espaço */}
                        <div className="mb-10">
                            <button onClick={openPopup} className="cta-button px-12 py-5 text-lg">
                                → Quero Minha Vaga na Imersão
                            </button>
                            <p className="mt-4 text-sm text-[#6B7280]">
                                Aplicação de 3 minutos • <strong className="text-[#9CA3AF]">Apenas 40 vagas por edição</strong> • Resposta em 48h
                            </p>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                            <div className="flex -space-x-3">
                                <img src="/images/Quem Vai Guiar Sua Transformação/Lucas.jpg" className="w-10 h-10 rounded-full object-cover border-2 border-[#0A0A0A]" alt="Lucas Silva" />
                                <img src="/images/Quem Vai Guiar Sua Transformação/José Ricardo.jpeg" className="w-10 h-10 rounded-full object-cover border-2 border-[#0A0A0A]" alt="José Ricardo" />
                                <img src="/images/Quem Vai Guiar Sua Transformação/Robert.png" className="w-10 h-10 rounded-full object-cover border-2 border-[#0A0A0A]" alt="Robert CFO" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Lucas Silva • José Ricardo • Robert CFO</p>
                                <p className="text-xs text-[#6B7280]">+500 operações escaladas</p>
                            </div>
                        </div>
                    </div>

                    {/* ——— RIGHT COLUMN: Mentor Photo ——— */}
                    <div className="relative flex items-end justify-center lg:h-[680px]">
                        {/* Glow */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-80 h-80 bg-[#D4A847]/10 rounded-full blur-[80px]" />
                        </div>

                        {/* Label */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
                            <span className="text-xs text-[#6B7280] uppercase tracking-[0.2em] font-semibold">
                                Speaker Principal
                            </span>
                        </div>

                        {/* Photo */}
                        <img
                            src="/images/Quem Vai Guiar Sua Transformação/Lucas.jpg"
                            alt="Lucas Silva — Speaker Principal"
                            className="relative z-10 w-full max-w-sm lg:max-w-none lg:h-full object-cover object-top"
                            style={{ maxHeight: "680px" }}
                        />

                        {/* Bottom fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent z-20" />
                    </div>

                </div>
            </div>
        </section>
    );
}
