"use client";
import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function ApplicationForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [phone, setPhone] = useState("");

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

        // UTM capture
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(
                (key) => { (data as Record<string, unknown>)[key] = params.get(key) || ""; }
            );
        }

        console.log("📥 Lead captured:", data);

        // Simulate API call — replace with Supabase in production
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccess(true);
            (e.target as HTMLFormElement).reset();
            setPhone("");
        }, 1500);
    }

    return (
        <>
            <section
                id="aplicacao"
                className="relative py-24 md:py-32 bg-gradient-to-b from-surface-950 via-cool-950 to-surface-950"
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(200,164,92,0.04),transparent_50%)]" />
                <div className="relative max-w-3xl mx-auto px-6">
                    <ScrollReveal className="text-center mb-12">
                        <span className="inline-block text-xs font-bold tracking-[0.2em] text-amber-400 uppercase mb-4">
                            INSCRIÇÃO
                        </span>
                        <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight mb-4">
                            Sua Empresa Vai Continuar
                            <br />
                            Dependendo de Você?
                        </h2>
                        <p className="text-text-secondary text-lg max-w-xl mx-auto">
                            Preencha a aplicação e avance para o WhatsApp com nosso time.
                            Ambiente fechado para empresários em operação.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal>
                        <form
                            onSubmit={handleSubmit}
                            className="glass rounded-3xl p-8 md:p-10 bg-gradient-to-br from-amber-400/3 to-cool-700/3 space-y-5"
                        >
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-text-secondary mb-2">
                                    Nome completo
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    required
                                    placeholder="Seu nome completo"
                                    className="w-full px-4 py-3 rounded-lg bg-surface-950 border border-amber-400/10 text-text-primary placeholder:text-text-subtle outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all"
                                />
                            </div>

                            {/* Email + WhatsApp */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="seu@email.com"
                                        className="w-full px-4 py-3 rounded-lg bg-surface-950 border border-amber-400/10 text-text-primary placeholder:text-text-subtle outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                                        WhatsApp (com DDD)
                                    </label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                                        placeholder="(11) 99999-9999"
                                        className="w-full px-4 py-3 rounded-lg bg-surface-950 border border-amber-400/10 text-text-primary placeholder:text-text-subtle outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Company + Segment */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                                        Nome da Empresa
                                    </label>
                                    <input
                                        type="text"
                                        name="empresa"
                                        required
                                        placeholder="Sua empresa"
                                        className="w-full px-4 py-3 rounded-lg bg-surface-950 border border-amber-400/10 text-text-primary placeholder:text-text-subtle outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                                        Segmento
                                    </label>
                                    <select
                                        name="segmento"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-surface-950 border border-amber-400/10 text-text-primary outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled selected className="text-text-subtle">
                                            Selecione...
                                        </option>
                                        <option value="cafeteria">Cafeteria</option>
                                        <option value="restaurante">Restaurante</option>
                                        <option value="franquia">Franquia Alimentícia</option>
                                        <option value="food-service">Food Service</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Revenue + Source */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                                        Faturamento Mensal
                                    </label>
                                    <select
                                        name="faturamento"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-surface-950 border border-amber-400/10 text-text-primary outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer"
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
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                                        Como soube do evento?
                                    </label>
                                    <select
                                        name="como_soube"
                                        className="w-full px-4 py-3 rounded-lg bg-surface-950 border border-amber-400/10 text-text-primary outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled selected className="text-text-subtle">
                                            Selecione...
                                        </option>
                                        <option value="instagram">Instagram</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="indicacao">Indicação</option>
                                        <option value="google">Google</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Consent */}
                            <label className="flex items-start gap-3 cursor-pointer text-sm text-text-secondary">
                                <input
                                    type="checkbox"
                                    name="consent"
                                    required
                                    className="mt-1 accent-amber-400"
                                />
                                <span>
                                    Concordo com a{" "}
                                    <a
                                        href="#"
                                        className="text-amber-400 underline hover:text-amber-300"
                                    >
                                        Política de Privacidade
                                    </a>{" "}
                                    e autorizo o contato via WhatsApp.
                                </span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="animate-glow w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-surface-950 font-bold tracking-wider text-sm hover:from-amber-300 hover:to-amber-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-surface-950/30 border-t-surface-950 rounded-full animate-spin" />
                                        Enviando...
                                    </span>
                                ) : (
                                    "QUERO GARANTIR MINHA VAGA →"
                                )}
                            </button>

                            <p className="text-center text-text-muted text-xs mt-3">
                                Sem spam • Você será direcionado ao WhatsApp
                            </p>
                        </form>
                    </ScrollReveal>
                </div>
            </section>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                    >
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowSuccess(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="relative glass rounded-3xl p-10 text-center max-w-md mx-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 text-surface-950 text-3xl font-bold">
                                ✓
                            </div>
                            <h3 className="text-2xl font-extrabold mb-3">
                                Aplicação Enviada!
                            </h3>
                            <p className="text-text-secondary mb-6">
                                Você será direcionado ao WhatsApp com nosso time. Ambiente
                                fechado para empresários em operação.
                            </p>
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-surface-950 font-bold text-sm hover:from-amber-300 hover:to-amber-500 transition-all"
                            >
                                ENTENDIDO
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
