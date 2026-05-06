'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Search, Clock, Upload } from 'lucide-react'
import { processSRAExport } from '@/lib/sra-import'
import { useToast } from '@/components/Toast'
import { AlunoDetailModal, type Aluno } from '@/components/AlunoDetailModal'

function getStatusAluno(prazoDefesa: string | null | undefined) {
    if (!prazoDefesa) return { label: 'REGULAR', cls: 'bg-primary/10 text-primary border-primary/20' }
    const prazo = new Date(prazoDefesa)
    const now = new Date()
    if (prazo <= now) return { label: 'JUBILAMENTO', cls: 'bg-red-500/10 text-red-400 border-red-500/20' }
    const in12Months = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    if (prazo <= in12Months) return { label: 'PERTO DO PRAZO', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
    return { label: 'REGULAR', cls: 'bg-primary/10 text-primary border-primary/20' }
}

export default function AlunosPage() {
    const [alunos, setAlunos] = useState<Aluno[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [search, setSearch] = useState('')
    const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null)
    const toast = useToast()

    const alunosFiltrados = alunos.filter(a =>
        a.nome?.toLowerCase().includes(search.toLowerCase()) ||
        a.matricula?.toLowerCase().includes(search.toLowerCase())
    )

    const stats = useMemo(() => {
        const now = new Date()
        const in12Months = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        return {
            regular: alunos.filter(a => {
                if (!a.prazo_jubilamento) return true
                const prazo = new Date(a.prazo_jubilamento)
                return prazo > in12Months
            }).length,
            qualificados: alunos.filter(a => a.status === 'QUALIFICADO').length,
            pertoPrazo: alunos.filter(a => {
                if (!a.prazo_jubilamento) return false
                const prazo = new Date(a.prazo_jubilamento)
                return prazo > now && prazo <= in12Months
            }).length,
            jubilamento: alunos.filter(a => {
                if (!a.prazo_jubilamento) return false
                return new Date(a.prazo_jubilamento) <= now
            }).length,
        }
    }, [alunos])

    const fetchAlunos = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('alunos')
            .select('*, professores(nome)')
            .order('nome')
        if (!error && data) setAlunos(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchAlunos()
    }, [])

    const handleSRAUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        event.target.value = ''
        try {
            setUploading(true)
            const count = await processSRAExport(file)
            toast(`Planilha SRA importada! ${count} alunos sincronizados.`)
            fetchAlunos()
        } catch (error: any) {
            toast('Erro na importação: ' + error.message, 'error')
        } finally {
            setUploading(false)
        }
    }

    return (
        <>
        <div className="p-8 pb-12">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="text-primary" size={32} />
                        Corpo Discente
                    </h1>
                    <p className="text-zinc-500 mt-1">Gestão de matrículas, jubilamento e bolsas sincronizados com o SRA.</p>
                </div>
                <label
                    className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg font-medium text-sm text-white transition-all shadow-lg"
                    style={{ backgroundColor: uploading ? 'rgba(157,34,53,0.6)' : '#9D2235' }}
                >
                    <Upload size={16} />
                    {uploading ? 'Importando...' : 'Importar SRA (.xlsx)'}
                    <input
                        type="file"
                        className="hidden"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleSRAUpload}
                        disabled={uploading}
                    />
                </label>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Regular</h3>
                    {loading
                        ? <div className="h-8 bg-zinc-800 rounded w-12 animate-pulse" />
                        : <p className="text-2xl font-bold text-primary">{stats.regular}</p>
                    }
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Qualificados</h3>
                    {loading
                        ? <div className="h-8 bg-zinc-800 rounded w-12 animate-pulse" />
                        : <p className="text-2xl font-bold text-blue-500">{stats.qualificados}</p>
                    }
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Perto do Prazo</h3>
                    {loading
                        ? <div className="h-8 bg-zinc-800 rounded w-12 animate-pulse" />
                        : <p className="text-2xl font-bold text-amber-500">{stats.pertoPrazo}</p>
                    }
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl" style={{ borderColor: 'rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.03)' }}>
                    <h3 className="text-red-500 text-[10px] font-bold uppercase mb-2">Jubilamento</h3>
                    {loading
                        ? <div className="h-8 bg-zinc-800 rounded w-12 animate-pulse" />
                        : <p className="text-2xl font-bold text-red-500">{stats.jubilamento}</p>
                    }
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input
                            className="w-full bg-zinc-800 border-none rounded-lg py-2 pl-10 pr-4 text-xs text-zinc-300 outline-none"
                            placeholder="Buscar por nome ou matrícula..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="text-xs text-zinc-500 font-medium">
                        {loading ? '...' : `Total: ${alunos.length} alunos`}
                    </div>
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
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="h-3.5 bg-zinc-800 rounded w-40 mb-2"></div>
                                        <div className="h-2.5 bg-zinc-800/60 rounded w-24"></div>
                                    </td>
                                    <td className="px-6 py-4"><div className="h-5 bg-zinc-800 rounded-full w-20"></div></td>
                                    <td className="px-6 py-4"><div className="h-3.5 bg-zinc-800 rounded w-32"></div></td>
                                    <td className="px-6 py-4"><div className="h-3.5 bg-zinc-800 rounded w-16"></div></td>
                                    <td className="px-6 py-4 text-right"><div className="h-3.5 bg-zinc-800 rounded w-12 ml-auto"></div></td>
                                </tr>
                            ))
                        ) : alunos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <Upload size={32} className="mx-auto mb-3 text-zinc-700" />
                                    <p className="text-zinc-500 text-sm font-medium">Nenhum aluno cadastrado</p>
                                    <p className="text-zinc-600 text-xs mt-1">Use o botão "Importar SRA" acima para carregar a planilha.</p>
                                </td>
                            </tr>
                        ) : alunosFiltrados.map((a) => {
                            const status = getStatusAluno(a.prazo_jubilamento)
                            return (
                                <tr key={a.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-sm text-zinc-200">{a.nome}</div>
                                        <div className="text-[10px] text-zinc-500 font-mono">{a.matricula}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${status.cls}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-zinc-400">
                                        {a.professores?.nome || <span className="text-zinc-600 italic">Não vinculado</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {a.prazo_jubilamento ? (
                                            <div className={`flex items-center gap-2 text-xs ${status.label !== 'REGULAR' ? 'text-amber-400' : 'text-zinc-400'}`}>
                                                <Clock size={12} className="shrink-0" />
                                                {new Date(a.prazo_jubilamento).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })}
                                            </div>
                                        ) : (
                                            <span className="text-zinc-600 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setAlunoSelecionado(a)}
                                            className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-tighter"
                                        >
                                            Detalhes
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        <AlunoDetailModal
            aluno={alunoSelecionado}
            onClose={() => setAlunoSelecionado(null)}
        />
        </>
    )
}
