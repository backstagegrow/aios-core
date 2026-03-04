"use client";
import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePopup } from "../context/PopupContext";

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

        // Simulate API setup and redirect to checkout
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccess(true);
            (e.target as HTMLFormElement).reset();
            setPhone("");

            // Replicate Monster Day's flow: redirect after form
            setTimeout(() => {
                window.location.href = "https://pay.kiwify.com.br/placeholder";
            }, 2500);
        }, 1500);
    }

    return (
        <AnimatePresence>
            {isOpen && !showSuccess && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto"
                >
                    <div
                        className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm"
                        onClick={closePopup}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl my-8 glass rounded-3xl p-6 md:p-10 bg-gradient-to-br from-amber-400/5 to-cool-700/5 z-10"
                    >
                        <button
                            onClick={closePopup}
                            className="absolute top-5 right-5 text-text-muted hover:text-text-primary transition-colors text-2xl leading-none"
                        >
                            &times;
                        </button>

                        <div className="text-center mb-8">
                            <span className="inline-block text-xs font-bold tracking-[0.2em] text-amber-400 uppercase mb-2">
                                APLICAÇÃO
                            </span>
                            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2">
                                Preencha seus dados
                            </h2>
                            <p className="text-text-secondary text-sm md:text-base">
                                Reserve sua vaga na Imersão Alpha Business.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-text-secondary mb-1">
                                    Nome completo
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    required
                                    placeholder="Seu nome completo"
                                    className="w-full px-4 py-3 rounded-lg bg-surface-950/80 border border-amber-400/10 text-text-primary placeholder:text-text-subtle outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all text-sm"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-1">
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="seu@email.com"
                                        className="w-full px-4 py-3 rounded-lg bg-surface-950/80 border border-amber-400/10 text-text-primary placeholder:text-text-subtle outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-1">
                                        WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                                        placeholder="(11) 99999-9999"
                                        className="w-full px-4 py-3 rounded-lg bg-surface-950/80 border border-amber-400/10 text-text-primary placeholder:text-text-subtle outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-1">
                                        Nome da Empresa
                                    </label>
                                    <input
                                        type="text"
                                        name="empresa"
                                        required
                                        placeholder="Sua empresa"
                                        className="w-full px-4 py-3 rounded-lg bg-surface-950/80 border border-amber-400/10 text-text-primary placeholder:text-text-subtle outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-1">
                                        Faturamento Mensal
                                    </label>
                                    <select
                                        name="faturamento"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-surface-950/80 border border-amber-400/10 text-text-primary outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="" disabled selected className="text-text-subtle">
                                            Selecione...
                                        </option>
                                        <option value="ate-50k">Até R$ 50 mil</option>
                                        <option value="50k-200k">R$ 50 mil — R$ 200 mil</option>
                                        <option value="200k-500k">R$ 200 mil — R$ 500 mil</option>
                                        <option value="acima-500k">Acima de R$ 500 mil</option>
                                    </select>
                                </div>
                            </div>

                            <label className="flex items-start gap-3 cursor-pointer text-xs text-text-secondary pt-2">
                                <input
                                    type="checkbox"
                                    name="consent"
                                    required
                                    className="mt-0.5 accent-amber-400"
                                />
                                <span>
                                    Concordo com a{" "}
                                    <a href="#" className="text-amber-400 underline hover:text-amber-300">
                                        Política de Privacidade
                                    </a>.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="animate-glow w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-surface-950 font-bold tracking-wider text-sm hover:from-amber-300 hover:to-amber-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-surface-950/30 border-t-surface-950 rounded-full animate-spin" />
                                        Processando...
                                    </span>
                                ) : (
                                    "AVANÇAR PARA CHEKCOUT →"
                                )}
                            </button>
                            <p className="text-center text-text-muted text-xs mt-3">
                                Compra 100% segura e garantida.
                            </p>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            {/* Success Status View */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                >
                    <div className="fixed inset-0 bg-surface-950/90 backdrop-blur-md" />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative glass rounded-3xl p-10 text-center max-w-md mx-4 z-10"
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 text-surface-950 text-3xl font-bold">
                            ✓
                        </div>
                        <h3 className="text-2xl font-extrabold mb-3">
                            Tudo certo!
                        </h3>
                        <p className="text-text-secondary mb-6">
                            Redirecionando você para a página de checkout seguro...
                        </p>
                        <div className="mx-auto w-8 h-8 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
