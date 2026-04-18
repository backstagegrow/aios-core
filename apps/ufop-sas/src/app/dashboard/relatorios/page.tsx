'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FileSpreadsheet, TrendingUp, Award, BarChart3, Download, Filter } from 'lucide-react'
import { calculateProgramScore, QUALIS_WEIGHTS } from '@/lib/capes-logic'

export default function RelatoriosPage() {
    const [productions, setProductions] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('producoes')
            .select('*, professores(nome)')

        if (!error) {
            setProductions(data || [])
            setStats(calculateProgramScore(data || []))
        }
        setLoading(false)
    }

    const handleExportCSV = () => {
        if (productions.length === 0) {
            alert('Não há dados para exportar ainda. Importe o Lattes de um docente primeiro.')
            return
        }

        const headers = ['ID', 'Professor', 'Título', 'Ano', 'Qualis']
        const csvRows = [
            headers.join(','),
            ...productions.map(p => [
                p.id,
                `"${p.professores?.nome || 'N/A'}"`,
                `"${p.titulo}"`,
                p.ano,
                p.qualis || 'S/Q'
            ].join(','))
        ]

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `relatorio-capes-${new Date().getFullYear()}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <div className="p-8 text-zinc-500 font-mono">Gerando indicadores...</div>

    return (
        <div className="p-8 pb-12">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BarChart3 className="text-primary" size={32} />
                        Relatórios CAPES
                    </h1>
                    <p className="text-zinc-500 mt-1">Consolidação automática de indicadores de produção e impacto.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all">
                        <Filter size={18} /> Filtrar Ano
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="bg-primary/80 hover:bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
                    >
                        <Download size={18} /> Exportar CSV
                    </button>
                </div>
            </header>

            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <TrendingUp className="text-primary mb-4" size={24} />
                    <h3 className="text-zinc-400 text-sm font-medium">Score Qualis Total</h3>
                    <p className="text-4xl font-bold mt-2">{stats?.totalScore || 0}</p>
                    <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <Award className="text-blue-500 mb-4" size={24} />
                    <h3 className="text-zinc-400 text-sm font-medium">Média por Produção</h3>
                    <p className="text-4xl font-bold mt-2">{stats?.averagePerProd || 0}</p>
                    <p className="text-xs text-zinc-500 mt-2">Peso médio ponderado</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <FileSpreadsheet className="text-amber-500 mb-4" size={24} />
                    <h3 className="text-zinc-400 text-sm font-medium">Total de Artigos</h3>
                    <p className="text-4xl font-bold mt-2">{productions.length}</p>
                    <p className="text-xs text-zinc-500 mt-2">{Object.keys(stats?.countByQualis || {}).length} estratos diferentes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribuição por Qualis */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-6">Distribuição por Estrato Qualis</h3>
                    <div className="space-y-4">
                        {Object.entries(QUALIS_WEIGHTS).map(([q, weight]) => {
                            const count = stats?.countByQualis?.[q] || 0
                            const percentage = (count / (productions.length || 1)) * 100
                            return (
                                <div key={q} className="group">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="font-bold text-zinc-300">{q} <span className="font-normal text-zinc-500 ml-2">({weight} pts)</span></span>
                                        <span className="text-zinc-400">{count} artigos</span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${weight >= 85 ? 'bg-primary' : 'bg-zinc-600 group-hover:bg-zinc-500'}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Produções Recentes */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col">
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="font-bold text-white">Últimas Importações</h3>
                        <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">LIVE</span>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[400px]">
                        <table className="w-full text-left text-xs">
                            <tbody className="divide-y divide-zinc-800">
                                {productions.slice(0, 10).map((prod) => (
                                    <tr key={prod.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-zinc-200 line-clamp-1">{prod.titulo}</div>
                                            <div className="text-zinc-500 mt-0.5">{prod.professores?.nome}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-0.5 rounded font-mono font-bold ${prod.qualis?.startsWith('A') ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                {prod.qualis || 'S/Q'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    )
}
