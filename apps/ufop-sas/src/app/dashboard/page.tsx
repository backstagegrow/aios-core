'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { processSRAExport } from '@/lib/sra-import'
import { Upload, Users, GraduationCap, FileSpreadsheet, LayoutDashboard } from 'lucide-react'
import { useToast } from '@/components/Toast'

export default function Dashboard() {
    const router = useRouter()
    const toast = useToast()
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        // Auth bypass for preview
    }, [router])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            const file = event.target.files?.[0]
            if (!file) return

            await processSRAExport(file)
            toast('Importação concluída com sucesso!')
        } catch (error: any) {
            toast('Erro na importação: ' + error.message, 'error')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white">Olá, Orion</h2>
                    <p className="text-zinc-500 mt-1">Bem-vindo ao painel de controle da UFOP.</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 bg-primary/80 hover:bg-primary text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors shadow-lg shadow-primary-900/20">
                        <Upload size={18} />
                        {uploading ? 'Processando...' : 'Importar SRA (.xlsx)'}
                        <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="text-primary" size={20} />
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">Discente</span>
                    </div>
                    <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Total de Alunos</h3>
                    <p className="text-3xl font-bold mt-1 text-white">89</p>
                    <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
                        <span className="text-primary font-bold">12</span> bolsistas ativos
                    </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <GraduationCap className="text-blue-500" size={20} />
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Docente</span>
                    </div>
                    <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Média Índice H</h3>
                    <p className="text-3xl font-bold mt-1 text-white">14.2</p>
                    <p className="text-[10px] text-zinc-500 mt-2">Corpo docente permanente</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <FileSpreadsheet className="text-amber-500" size={20} />
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider">CAPES</span>
                    </div>
                    <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Produção A1/A2</h3>
                    <p className="text-3xl font-bold mt-1 text-white">42</p>
                    <p className="text-[10px] text-zinc-500 mt-2">Referência ano base 2025</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <LayoutDashboard className="text-purple-500" size={20} />
                        <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Prazos</span>
                    </div>
                    <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Alertas Criticos</h3>
                    <p className="text-3xl font-bold mt-1 text-white">03</p>
                    <p className="text-[10px] text-amber-500 mt-2 font-medium">Alunos perto do jubilamento</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart/Table Area */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-6">Fluxo de Publicações</h3>
                        <div className="h-64 w-full flex items-end gap-3 px-2">
                            {[40, 70, 45, 90, 65, 80, 50, 100, 75, 85].map((h, i) => (
                                <div key={i} className="flex-1 bg-zinc-800 rounded-t-lg relative group transition-all hover:bg-primary/40" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h} art.
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-2">
                            <span>Jan</span>
                            <span>Mar</span>
                            <span>Mai</span>
                            <span>Jul</span>
                            <span>Set</span>
                            <span>Nov</span>
                        </div>
                    </section>

                    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-zinc-800">
                            <h3 className="font-bold text-white">Próximas Bancas</h3>
                        </div>
                        <div className="divide-y divide-zinc-800">
                            {[
                                { name: 'Ana Silva', title: 'Otimização de Processos via IA', date: '21/04 - 14:00', type: 'Defesa' },
                                { name: 'Carlos Santos', title: 'Sustentabilidade na Indústria 4.0', date: '25/04 - 09:00', type: 'Qualificação' }
                            ].map((banca, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors cursor-pointer">
                                    <div>
                                        <p className="text-sm font-bold text-white">{banca.name}</p>
                                        <p className="text-xs text-zinc-500">{banca.title}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-mono text-primary">{banca.date}</p>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400 border border-zinc-700">{banca.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-6">
                    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4">Ações Rápidas</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/dashboard/alunos')}
                                className="w-full flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl text-sm transition-all border border-zinc-700/50"
                            >
                                <div className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center"><Users size={18} /></div>
                                Ver Todos os Alunos
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/relatorios')}
                                className="w-full flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl text-sm transition-all border border-zinc-700/50"
                            >
                                <div className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center"><FileSpreadsheet size={18} /></div>
                                Gerar Relatório CAPES
                            </button>
                        </div>
                    </section>

                    <section className="border border-primary/20 rounded-2xl p-6" style={{ backgroundColor: 'rgba(157, 34, 53, 0.08)' }}>
                        <h3 className="font-bold text-primary text-sm mb-2">Dica de Orion</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Configure a <span className="text-zinc-200 font-medium">API do Google Sheets</span> para que os dados dos formulários de banca sejam sincronizados automaticamente sem precisar de uploads manuais.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
