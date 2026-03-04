"use client";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
            <header className="mb-8 flex justify-between items-center border-b border-white/10 pb-4">
                <h1 className="text-2xl font-black gradient-text">Dashboard • Alpha Academy</h1>
                <button className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Sair</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#141414] border border-white/5 p-6 rounded-sm">
                    <h3 className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-2">Total de Alunos</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-[#141414] border border-white/5 p-6 rounded-sm">
                    <h3 className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-2">Leads Hoje</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-[#141414] border border-white/5 p-6 rounded-sm">
                    <h3 className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-2">Faturamento</h3>
                    <p className="text-3xl font-bold">R$ 0,00</p>
                </div>
            </div>

            <section className="mt-12 bg-[#141414] border border-white/5 p-8">
                <h2 className="text-xl font-bold mb-4">Bem-vindo à nova estrutura SaaS</h2>
                <p className="text-[#9CA3AF]">
                    Esta é a base do seu novo sistema. A partir daqui, você pode gerenciar múltiplos tenants, cursos e fluxos de vendas.
                </p>
            </section>
        </div>
    );
}
