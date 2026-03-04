"use client";
import ScrollReveal from "../ui/ScrollReveal";

export default function ApplicationForm() {
    return (
        <section
            id="aplicacao"
            className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#141414] relative"
        >
            <div className="absolute inset-0 bg-[#D4A847]/[0.015]" />
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <ScrollReveal>
                    <p className="text-[#D4A847] text-sm font-semibold tracking-widest uppercase mb-4">
                        A Decisão é Agora
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black mb-6">
                        Mais Um Ano no Mesmo Ciclo?{" "}
                        <span className="gradient-text">Ou 2 Dias Para Mudar Tudo?</span>
                    </h2>
                    <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto mb-4 leading-relaxed">
                        Amanhã você pode abrir o negócio às 6h, apagar incêndios o dia inteiro, fechar o caixa às 23h e repetir. Ou pode tomar a decisão de instalar a estrutura que vai fazer sua operação lucrar sem você estar lá.
                    </p>
                    <p className="text-lg text-white font-semibold mb-10">
                        Dois caminhos. Só um muda o jogo.
                    </p>
                </ScrollReveal>

                <ScrollReveal>
                    <div className="bg-[#141414] border border-[#D4A847]/20 p-8 md:p-12 max-w-lg mx-auto">
                        <h3 className="text-xl font-bold mb-2">Aplique para sua vaga</h3>
                        <p className="text-sm text-[#9CA3AF] mb-6">
                            Apenas 40 vagas por edição. Processo seletivo de 3 minutos.
                        </p>
                        <form
                            className="space-y-4 text-left"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-[#9CA3AF]">
                                    Nome completo
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-sm focus:border-[#D4A847] focus:outline-none transition-colors"
                                    placeholder="Seu nome"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-[#9CA3AF]">
                                    WhatsApp (com DDD)
                                </label>
                                <input
                                    type="tel"
                                    className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-sm focus:border-[#D4A847] focus:outline-none transition-colors"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-[#9CA3AF]">
                                    Qual o seu negócio?
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-sm focus:border-[#D4A847] focus:outline-none transition-colors"
                                    placeholder="Ex: Cafeteria com 2 unidades, Restaurante japonês..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-[#9CA3AF]">
                                    Faturamento mensal
                                </label>
                                <select className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-sm focus:border-[#D4A847] focus:outline-none transition-colors text-[#9CA3AF]">
                                    <option>Selecione a faixa</option>
                                    <option>Até R$50k/mês</option>
                                    <option>R$50k — R$150k/mês</option>
                                    <option>R$150k — R$500k/mês</option>
                                    <option>Acima de R$500k/mês</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-[#9CA3AF]">
                                    Maior dor hoje no seu negócio
                                </label>
                                <select className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-sm focus:border-[#D4A847] focus:outline-none transition-colors text-[#9CA3AF]">
                                    <option>Selecione</option>
                                    <option>Preso no operacional / sem tempo</option>
                                    <option>Faturamento alto, lucro baixo</option>
                                    <option>Dificuldade com o time / turnover</option>
                                    <option>Quero expandir mas tenho medo de quebrar</option>
                                    <option>Não sei por onde começar a organizar</option>
                                </select>
                            </div>
                            <button type="submit" className="cta-button w-full mt-4">
                                → Garantir Minha Vaga Agora
                            </button>
                            <p className="text-xs text-[#9CA3AF] text-center mt-3">
                                ✓ Aplicação gratuita • ✓ Resposta em até 48h • ✓ Sem compromisso
                            </p>
                        </form>
                    </div>
                </ScrollReveal>

                <ScrollReveal>
                    <p className="text-sm text-[#9CA3AF] mt-8">
                        21 e 22 de Março de 2026 • São Paulo, SP • Vagas limitadas por curadoria
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
}
