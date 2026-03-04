"use client";
import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePopup } from "../../context/PopupContext";

export default function ApplicationModal() {
    const { isOpen, closePopup } = usePopup();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [phone, setPhone] = useState("");

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    function formatPhone(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 11);
        if (digits.length >= 7)
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        if (digits.length >= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length >= 1) return `(${digits}`;
        return "";
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(
                (key) => { (data as Record<string, unknown>)[key] = params.get(key) || ""; }
            );
        }

        console.log("📥 Lead captured:", data);

        setTimeout(() => {
            setIsLoading(false);
            setShowSuccess(true);
            (e.target as HTMLFormElement).reset();
            setPhone("");

            setTimeout(() => {
                window.location.href = "https://api.whatsapp.com/send/?phone=5511939411365&text=Olá%21+Gostaria+de+validar+meu+ingresso+para+a+imersão+presencial&type=phone_number&app_absent=0";
            }, 2500);
        }, 1500);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto"
                >
                    <div
                        className="fixed inset-0 bg-[#0A0A0A]"
                        onClick={closePopup}
                    />

                    {!showSuccess ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 p-8 shadow-2xl overflow-hidden rounded-sm"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <button
                                onClick={closePopup}
                                className="absolute top-6 right-6 text-[#9CA3AF] hover:text-white transition-colors z-20"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="relative z-10 space-y-8">
                                <div className="text-center">
                                    <span className="text-[#D4A847] text-xs font-bold tracking-[0.2em] uppercase">Aplicação</span>
                                    <h2 className="text-2xl md:text-3xl font-black text-white mt-2 uppercase">Preencha seus dados</h2>
                                    <p className="text-[#9CA3AF] text-sm mt-1">Reserve sua vaga na Imersão Alpha Business.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Nome completo</label>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                placeholder="Seu nome completo"
                                                className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4A847]/50 transition-colors rounded-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">E-mail</label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="email"
                                                    placeholder="seu@email.com"
                                                    className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4A847]/50 transition-colors rounded-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">WhatsApp</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    name="phone"
                                                    value={phone}
                                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                                    placeholder="(11) 99999-9999"
                                                    className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4A847]/50 transition-colors rounded-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Nome da Empresa</label>
                                            <input
                                                required
                                                type="text"
                                                name="company"
                                                placeholder="Sua empresa"
                                                className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4A847]/50 transition-colors rounded-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <input required type="checkbox" className="mt-1 accent-[#D4A847]" id="privacy" />
                                        <label htmlFor="privacy" className="text-[10px] text-[#9CA3AF] leading-tight uppercase font-bold">
                                            Concordo com a <a href="#" className="text-[#D4A847] hover:underline">Política de Privacidade</a>.
                                        </label>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            style={{
                                                width: "100%",
                                                padding: "20px 0",
                                                background: "linear-gradient(to right, #D4A847, #B68E35)",
                                                color: "#000",
                                                fontWeight: 900,
                                                fontSize: "14px",
                                                textTransform: "uppercase" as const,
                                                letterSpacing: "0.1em",
                                                border: "none",
                                                cursor: "pointer",
                                                borderRadius: "2px",
                                            }}
                                        >
                                            {isLoading ? "Processando..." : "FINALIZAR NO WHATSAPP →"}
                                        </button>
                                        <p className="text-center text-[10px] text-[#4B5563] uppercase tracking-[0.2em] font-black mt-4">
                                            Compra 100% segura e garantida.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative bg-[#0A0A0A] border border-[#D4A847]/30 rounded-sm p-12 text-center max-w-md mx-4 z-10 shadow-[0_0_50px_rgba(212,168,71,0.1)]"
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4A847] to-[#B68E35] flex items-center justify-center mx-auto mb-8 text-black text-4xl shadow-lg">
                                ✓
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                                Tudo certo!
                            </h3>
                            <p className="text-[#9CA3AF] mb-8 leading-relaxed">
                                Redirecionando você para a página de ingresso...
                            </p>
                            <div className="mx-auto w-10 h-10 border-4 border-[#D4A847]/20 border-t-[#D4A847] rounded-full animate-spin" />
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
