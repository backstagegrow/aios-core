'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Search, Filter, History, Clock, AlertTriangle } from 'lucide-react'

export default function AlunosPage() {
    const [alunos, setAlunos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const alunosFiltrados = alunos.filter(a =>
        a.nome?.toLowerCase().includes(search.toLowerCase()) ||
        a.matricula?.toLowerCase().includes(search.toLowerCase())
    )

    const fetchAlunos = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('alunos')
            .select('*, professores(nome)')
            .order('nome')
        if (!error) setAlunos(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchAlunos()
    }, [])

    return (
        <div className="p-8 pb-12">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="text-primary" size={32} />
                        Corpo Discente
                    </h1>
                    <p className="text-zinc-500 mt-1">Gestão de matrículas, jubilamento e bolsas sincronizados com o SRA.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 flex items-center gap-3">
                        <History size={18} className="text-zinc-500" />
                        <div className="text-left">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold">Última Sincronização SRA</p>
                            <p className="text-xs font-mono text-zinc-300">18/04/2026 - 16:45</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Regular</h3>
                    <p className="text-2xl font-bold text-primary">72</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Qualificados</h3>
                    <p className="text-2xl font-bold text-blue-500">14</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Perto do Prazo</h3>
                    <p className="text-2xl font-bold text-amber-500">03</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl border-red-500/20 bg-red-500/5">
                    <h3 className="text-red-500 text-[10px] font-bold uppercase mb-2">Jubilamento</h3>
                    <p className="text-2xl font-bold text-red-500">00</p>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input className="w-full bg-zinc-800 border-none rounded-lg py-2 pl-10 pr-4 text-xs text-zinc-300 outline-none" placeholder="Buscar por nome ou matrícula..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button className="text-xs text-zinc-400 flex items-center gap-2 hover:text-white transition-colors">
                        <Filter size={14} /> Filtros Avançados
                    </button>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                            <th className="px-6 py-4">Aluno</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Orientador</th>
                            <th className="px-6 py-4">Prazo Final</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500 animate-pulse">Carregando dados discentes...</td></tr>
                        ) : alunos.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Importe a planilha SRA para popular a lista.</td></tr>
                        ) : alunosFiltrados.map((a) => (
                            <tr key={a.id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-sm text-zinc-200">{a.nome}</div>
                                    <div className="text-[10px] text-zinc-500 font-mono">{a.matricula}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold border border-primary/20">REGULAR</span>
                                </td>
                                <td className="px-6 py-4 text-xs text-zinc-400">
                                    {a.professores?.nome || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                        <Clock size={12} className="text-zinc-500" />
                                        12/2026
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-tighter">Detalhes</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
