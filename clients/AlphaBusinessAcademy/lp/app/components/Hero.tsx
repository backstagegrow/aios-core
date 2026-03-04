"use client";
import { motion } from "framer-motion";
import { usePopup } from "../context/PopupContext";

export default function Hero() {
    const { openPopup } = usePopup();

    return (
        <section
            id="hero"
            className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden"
        >
            {/* Rich background with overlays */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-surface-950 to-surface-950" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(80,70,160,0.12),transparent_60%),radial-gradient(ellipse_at_70%_20%,rgba(200,164,92,0.08),transparent_50%)]" />
            </div>

            {/* Breathing glow orb */}
            <motion.div
                className="absolute w-[600px] h-[600px] top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(200,164,92,0.1), rgba(80,70,160,0.06) 50%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8"
                >
                    <div className="mx-auto w-24 h-24 md:w-28 md:h-28 relative">
                        {/* Logo placeholder — replace with actual logo file */}
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400/20 to-amber-700/20 backdrop-blur-sm border border-amber-400/20 flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-amber-400 text-3xl md:text-4xl font-black block leading-none">A</span>
                                <span className="text-amber-400/60 text-[0.4rem] tracking-[0.15em] font-bold block mt-0.5">BUSINESS</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="inline-block text-xs font-bold tracking-[0.25em] text-amber-400 uppercase mb-8 px-5 py-2 rounded-full border border-amber-400/20 bg-amber-400/5"
                >
                    IMERSÃO PRESENCIAL — SÃO PAULO, 21 E 22 DE MARÇO
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-gradient text-[clamp(2.2rem,6vw,4.5rem)] font-black leading-[1.05] mb-7"
                >
                    Pare de Ser Refém
                    <br />
                    do Seu Próprio Negócio.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45 }}
                    className="text-text-secondary text-[clamp(1rem,2.2vw,1.25rem)] max-w-[680px] mx-auto mb-10 leading-relaxed"
                >
                    2 dias intensivos para empresários que querem sair do operacional,
                    montar um time que funciona sem eles e escalar com lucro de verdade.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col items-center gap-4 mb-12"
                >
                    <button
                        onClick={(e) => { e.preventDefault(); openPopup(); }}
                        className="animate-glow inline-flex items-center px-10 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-surface-950 font-bold tracking-wider text-sm hover:from-amber-300 hover:to-amber-500 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        QUERO APLICAR PARA A IMERSÃO
                    </button>
                    <span className="text-text-muted text-sm tracking-wide">
                        Vagas limitadas — processo seletivo de 3 minutos
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.75 }}
                    className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-surface-950/50 backdrop-blur-sm border border-amber-400/10"
                >
                    <div className="flex -space-x-2">
                        {["LS", "JR", "R"].map((initials, i) => (
                            <div
                                key={i}
                                className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-[0.65rem] font-bold text-surface-950 border-2 border-surface-950"
                            >
                                {initials}
                            </div>
                        ))}
                    </div>
                    <span className="text-text-secondary text-sm">
                        Lucas Silva • José Ricardo • Robert{" "}
                        <span className="text-amber-400 font-semibold">
                            | +500 operações escaladas
                        </span>
                    </span>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-400 text-xs tracking-widest"
            >
                <span>Conheça o método</span>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-4 h-4 border-r-2 border-b-2 border-amber-400 rotate-45"
                />
            </motion.div>
        </section>
    );
}
