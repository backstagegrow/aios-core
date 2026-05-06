'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { FileText, RefreshCw } from 'lucide-react'

const UFOP_RED = '#9D2235'

export default function RelatoriosPage() {
    const [alunos, setAlunos] = useState<any[]>([])
    const [producoes, setProducoes] = useState<any[]>([])
    const [professores, setProfessores] = useState<any[]>([])
    const [bancas, setBancas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAll = useCallback(async () => {
        setLoading(true)
        const [{ data: a }, { data: p }, { data: prof }, { data: b }] = await Promise.all([
            supabase.from('alunos').select('id, data_ingresso, prazo_jubilamento, status_bolsa, professor_orientador_id'),
            supabase.from('producoes').select('id, qualis'),
            supabase.from('professores').select('id, nome'),
            supabase.from('bancas').select('aluno_id, tipo'),
        ])
        setAlunos(a ?? [])
        setProducoes(p ?? [])
        setProfessores(prof ?? [])
        setBancas(b ?? [])
        setLoading(false)
    }, [])

    useEffect(() => { fetchAll() }, [fetchAll])

    // Média de Integralização: avg % do prazo consumido por aluno
    const mediaIntegralizacao = useMemo(() => {
        const hoje = new Date()
        const valid = alunos.filter(a => a.data_ingresso && a.prazo_jubilamento)
        if (!valid.length) return 0
        const sum = valid.reduce((acc, a) => {
            const ingresso = new Date(a.data_ingresso).getTime()
            const jubilamento = new Date(a.prazo_jubilamento).getTime()
            const total = jubilamento - ingresso
            const decorrido = hoje.getTime() - ingresso
            return acc + Math.min(Math.max(decorrido / total, 0), 1)
        }, 0)
        return ((sum / valid.length) * 100).toFixed(1)
    }, [alunos])

    // Alunos Qualificados: % que tem banca de Qualificação
    const alunosQualificados = useMemo(() => {
        const comQual = new Set(bancas.filter(b => b.tipo === 'Qualificação' && b.aluno_id).map(b => b.aluno_id))
        return alunos.length > 0 ? ((comQual.size / alunos.length) * 100).toFixed(1) : '0.0'
    }, [alunos, bancas])

    // Bolsas por agência
    const bolsas = useMemo(() => {
        const counts: Record<string, number> = {}
        alunos.forEach(a => {
            const b = (a.status_bolsa || '').trim()
            if (b && b.toLowerCase() !== 'nenhuma' && b !== '') {
                const key = b.toUpperCase()
                counts[key] = (counts[key] || 0) + 1
            }
        })
        return counts
    }, [alunos])

    const totalBolsas = Object.values(bolsas).reduce((s, n) => s + n, 0)

    // Qualis CAPES
    const qualisCounts = useMemo(() => {
        const counts: Record<string, number> = { A1: 0, A2: 0, A3: 0, A4: 0, B1: 0, B2: 0 }
        producoes.forEach(p => { if (p.qualis && counts[p.qualis] !== undefined) counts[p.qualis]++ })
        return counts
    }, [producoes])

    // Carga de orientação por docente
    const cargaOrientacao = useMemo(() => {
        const map: Record<string, { nome: string; count: number }> = {}
        professores.forEach(p => { map[p.id] = { nome: p.nome, count: 0 } })
        alunos.forEach(a => {
            if (a.professor_orientador_id && map[a.professor_orientador_id])
                map[a.professor_orientador_id].count++
        })
        return Object.values(map).filter(p => p.count > 0).sort((a, b) => b.count - a.count).slice(0, 8)
    }, [alunos, professores])

    const maxOrientacoes = Math.max(...cargaOrientacao.map(p => p.count), 1)

    const BADGE_COLORS: Record<string, string> = {
        Q1: 'bg-red-900/40 text-red-300 border-red-800',
        Q2: 'bg-orange-900/40 text-orange-300 border-orange-800',
        Q3: 'bg-blue-900/40 text-blue-300 border-blue-800',
        Q4: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    }

    return (
        <div className="p-8 pb-12">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FileText className="text-primary" size={32} />
                        Inteligência Acadêmica
                    </h1>
                    <p className="text-zinc-500 mt-1">Dados agregados para gestão e Plataforma Sucupira</p>
                </div>
                <button
                    onClick={fetchAll}
                    disabled={loading}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm text-zinc-300 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Atualizar
                </button>
            </header>

            <div className="grid grid-cols-3 gap-6 mb-6">
                {/* EFICIÊNCIA DISCENTE */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-5 h-5 rounded-full border-2 border-zinc-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-zinc-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Eficiência Discente</span>
                    </div>

                    <div className="mb-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Média de Integralização</p>
                        <p className="text-3xl font-black mb-2" style={{ color: UFOP_RED }}>{loading ? '—' : `${mediaIntegralizacao}%`}</p>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${mediaIntegralizacao}%`, backgroundColor: UFOP_RED }} />
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Alunos Qualificados</p>
                        <p className="text-3xl font-black text-blue-400 mb-2">{loading ? '—' : `${alunosQualificados}%`}</p>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${alunosQualificados}%` }} />
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Bolsas Ativas</p>
                        {loading ? <div className="h-8 bg-zinc-800 rounded animate-pulse" /> : (
                            <div className="flex gap-3 flex-wrap">
                                {totalBolsas === 0 ? (
                                    <span className="text-zinc-600 text-xs">Nenhuma bolsa cadastrada</span>
                                ) : Object.entries(bolsas).map(([agencia, count]) => (
                                    <div key={agencia} className="text-center">
                                        <p className="text-xl font-black text-amber-400">{count}</p>
                                        <p className="text-[9px] font-bold uppercase text-zinc-500">{agencia}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* QUALIDADE (CAPES) */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-5 h-5 rounded-full border-2 border-zinc-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-zinc-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Qualidade (CAPES)</span>
                    </div>

                    <div className="mb-5">
                        <p className="text-4xl font-black" style={{ color: UFOP_RED }}>{loading ? '—' : producoes.length}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">produções</p>
                    </div>

                    <div className="mb-5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">JCR Quartil</p>
                        <div className="grid grid-cols-4 gap-1.5">
                            {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                                <div key={q} className={`rounded-lg px-2 py-2 text-center border ${BADGE_COLORS[q]}`}>
                                    <p className="text-base font-black">0</p>
                                    <p className="text-[9px] font-bold">{q}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Qualis CAPES</p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                            {Object.entries(qualisCounts).map(([q, count]) => (
                                <div key={q} className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-400">{q}</span>
                                    <span className="text-xs font-mono text-zinc-300">{loading ? '—' : count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CORPO DOCENTE */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-5 h-5 rounded-full border-2 border-zinc-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-zinc-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Corpo Docente</span>
                    </div>

                    <div className="mb-5">
                        <p className="text-4xl font-black text-purple-400">{loading ? '—' : professores.length}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">docentes</p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Carga de Orientação</p>
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-zinc-800 rounded animate-pulse" />)}
                            </div>
                        ) : (
                            <div className="space-y-2 overflow-y-auto max-h-48">
                                {cargaOrientacao.map(({ nome, count }) => (
                                    <div key={nome} className="flex items-center gap-2">
                                        <span className="text-[10px] text-zinc-400 w-24 truncate shrink-0">{nome.split(' ').slice(0, 2).join(' ').toUpperCase()}</span>
                                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${(count / maxOrientacoes) * 100}%`, backgroundColor: '#7c3aed' }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-400 w-4 text-right">{count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Relatório Consolidado para Sucupira */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(157,34,53,0.15)' }}>
                        <FileText size={20} style={{ color: UFOP_RED }} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-200">Relatório Consolidado para Sucupira</p>
                        <p className="text-xs text-zinc-500">Gere o arquivo pronto para importação no módulo de Coleta da CAPES.</p>
                    </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">EM DESENVOLVIMENTO</span>
            </div>
        </div>
    )
}
