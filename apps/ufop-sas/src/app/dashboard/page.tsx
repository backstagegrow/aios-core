'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { processSRAExport } from '@/lib/sra-import'
import { Upload, RefreshCw, Calendar } from 'lucide-react'
import { useToast } from '@/components/Toast'

const UFOP_RED = '#9D2235'

function mesesDesde(dateStr: string) {
    const past = new Date(dateStr)
    const hoje = new Date()
    return (hoje.getFullYear() - past.getFullYear()) * 12 + (hoje.getMonth() - past.getMonth())
}

export default function Dashboard() {
    const toast = useToast()
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [lastUpdate, setLastUpdate] = useState('')

    const [totalAlunos, setTotalAlunos] = useState(0)
    const [bolsas, setBolsas] = useState<Record<string, number>>({})
    const [totalBolsas, setTotalBolsas] = useState(0)
    const [producoesA1A2, setProducoesA1A2] = useState(0)
    const [bancasAgendadas, setBancasAgendadas] = useState(0)
    const [totalDocentes, setTotalDocentes] = useState(0)
    const [perto, setPerto] = useState<any[]>([])
    const [jubilados, setJubilados] = useState<any[]>([])
    const [aguardando, setAguardando] = useState<any[]>([])
    const [defesasProximas, setDefesasProximas] = useState(0)

    const fetchAll = useCallback(async () => {
        setLoading(true)
        setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))

        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user?.email) setUsername(session.user.email.split('@')[0])

        const hoje = new Date()
        const seisMeses = new Date()
        seisMeses.setMonth(seisMeses.getMonth() + 6)

        const [
            { data: alunos },
            { data: professores },
            { data: producoes },
            { data: bancasAg },
            { data: defesas },
        ] = await Promise.all([
            supabase.from('alunos').select('id, nome, status_bolsa, status, prazo_jubilamento, professores(nome)'),
            supabase.from('professores').select('id'),
            supabase.from('producoes').select('qualis'),
            supabase.from('bancas').select('id').gte('data_hora', hoje.toISOString()).lte('data_hora', seisMeses.toISOString()),
            supabase.from('bancas').select('id').eq('tipo', 'Defesa').gte('data_hora', hoje.toISOString()).lte('data_hora', seisMeses.toISOString()),
        ])

        const lista = alunos ?? []
        setTotalAlunos(lista.length)

        const bc: Record<string, number> = {}
        lista.forEach(a => {
            const b = (a.status_bolsa || '').trim()
            if (b && b.toLowerCase() !== 'nenhuma' && b !== '') {
                const k = b.toUpperCase()
                bc[k] = (bc[k] || 0) + 1
            }
        })
        setBolsas(bc)
        setTotalBolsas(Object.values(bc).reduce((s, n) => s + n, 0))

        setProducoesA1A2((producoes ?? []).filter(p => p.qualis === 'A1' || p.qualis === 'A2').length)
        setBancasAgendadas((bancasAg ?? []).length)
        setTotalDocentes((professores ?? []).length)
        setDefesasProximas((defesas ?? []).length)

        setPerto(lista.filter(a => {
            if (!a.prazo_jubilamento) return false
            const p = new Date(a.prazo_jubilamento)
            return p >= hoje && p <= seisMeses
        }))

        setJubilados(lista.filter(a =>
            a.prazo_jubilamento && new Date(a.prazo_jubilamento) < hoje
        ))

        setAguardando(lista.filter(a =>
            (a.status || '').toLowerCase().includes('aguard') ||
            (a.status || '').toLowerCase().includes('doc')
        ))

        setLoading(false)
    }, [])

    useEffect(() => { fetchAll() }, [fetchAll])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            const file = e.target.files?.[0]
            if (!file) return
            await processSRAExport(file)
            toast('Importação concluída com sucesso!')
            fetchAll()
        } catch (err: any) {
            toast('Erro na importação: ' + err.message, 'error')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const Skeleton = () => <div className="h-9 w-16 bg-zinc-800 rounded animate-pulse mt-1" />

    return (
        <div className="p-8 pb-12">
            {/* Header */}
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Olá, {username || '...'}</h1>
                    <p className="text-zinc-500 mt-1 text-sm">
                        Painel de controle · PPGCC UFOP
                        {lastUpdate && <> · atualizado às {lastUpdate}</>}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchAll}
                        disabled={loading}
                        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm text-zinc-300 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Atualizar
                    </button>
                    <label
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white cursor-pointer"
                        style={{ backgroundColor: UFOP_RED }}
                    >
                        <Upload size={16} />
                        {uploading ? 'Processando...' : 'Importar SRA (.xlsx)'}
                        <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                </div>
            </header>

            {/* KPI Cards — row 1 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex justify-between mb-2">
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total de Alunos</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(157,34,53,0.15)', color: UFOP_RED }}>ATIVO</span>
                    </div>
                    {loading ? <Skeleton /> : <p className="text-4xl font-black text-white">{totalAlunos}</p>}
                    {!loading && totalBolsas > 0 && <p className="text-xs text-zinc-500 mt-2">{totalBolsas} bolsistas ativos</p>}
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex justify-between mb-2">
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Bolsas Ativas</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">BOLSAS</span>
                    </div>
                    {loading ? <Skeleton /> : <p className="text-4xl font-black text-white">{totalBolsas}</p>}
                    {!loading && (
                        <div className="flex gap-3 mt-2 flex-wrap">
                            {Object.entries(bolsas).map(([ag, n]) => (
                                <span key={ag} className="text-[10px] font-black text-amber-400">{n} <span className="text-zinc-600">{ag}</span></span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex justify-between mb-2">
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Produções Q1/Q2</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">CAPES</span>
                    </div>
                    {loading ? <Skeleton /> : <p className="text-4xl font-black text-white">{producoesA1A2}</p>}
                    <p className="text-xs text-zinc-600 mt-2">Artigos qualificados importados</p>
                </div>
            </div>

            {/* KPI Cards — row 2 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex justify-between mb-2">
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Bancas Agendadas</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">PRÓXIMAS</span>
                    </div>
                    {loading ? <Skeleton /> : <p className="text-4xl font-black text-white">{bancasAgendadas}</p>}
                    <p className="text-xs text-zinc-600 mt-2">Próximos 6 meses</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex justify-between mb-2">
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Docentes Cadastrados</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">PPGCC</span>
                    </div>
                    {loading ? <Skeleton /> : <p className="text-4xl font-black text-purple-400">{totalDocentes}</p>}
                    <p className="text-xs text-zinc-600 mt-2">Corpo docente permanente</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex justify-between mb-2">
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Alertas Críticos</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">PRAZOS</span>
                    </div>
                    {loading ? <Skeleton /> : (
                        <p className={`text-4xl font-black ${(jubilados.length + perto.length) > 0 ? 'text-amber-400' : 'text-white'}`}>
                            {String(jubilados.length + perto.length).padStart(2, '0')}
                        </p>
                    )}
                    <p className="text-xs text-amber-500/70 mt-2">Alunos perto do jubilamento</p>
                </div>
            </div>

            {/* Status panels */}
            <div className="grid grid-cols-3 gap-4">
                {/* Perto do jubilamento */}
                <div className="bg-zinc-900 border border-amber-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Perto do Jubilamento ({loading ? '…' : perto.length})
                        </span>
                    </div>
                    {loading ? <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" /> : perto.length === 0 ? (
                        <p className="text-zinc-600 text-xs italic">Nenhum aluno em alerta.</p>
                    ) : (
                        <div className="space-y-2">
                            {perto.slice(0, 6).map((a, i) => (
                                <div key={i} className="flex justify-between">
                                    <p className="text-xs font-bold text-zinc-300 truncate">{a.nome}</p>
                                    <span className="text-[10px] text-amber-400 font-mono ml-2 shrink-0">{mesesDesde(a.prazo_jubilamento)}m</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Jubilados / prazo excedido */}
                <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Jubilados / Prazo Excedido ({loading ? '…' : jubilados.length})
                        </span>
                    </div>
                    {loading ? <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" /> : jubilados.length === 0 ? (
                        <p className="text-zinc-600 text-xs italic">Nenhum aluno jubilado.</p>
                    ) : (
                        <div className="space-y-2 overflow-y-auto max-h-40">
                            {jubilados.map((a, i) => (
                                <div key={i} className="flex justify-between">
                                    <p className="text-xs font-bold text-zinc-300 truncate">{a.nome}</p>
                                    <span className="text-[10px] text-red-400 font-mono ml-2 shrink-0">{mesesDesde(a.prazo_jubilamento)}m</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Aguard. Documentação + Defesas */}
                <div className="space-y-4">
                    <div className="bg-zinc-900 border border-green-500/20 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                Aguard. Documentação ({loading ? '…' : aguardando.length})
                            </span>
                        </div>
                        {loading ? <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" /> : aguardando.length === 0 ? (
                            <p className="text-zinc-600 text-xs italic">Nenhum aluno pendente.</p>
                        ) : (
                            <div className="space-y-2">
                                {aguardando.slice(0, 4).map((a, i) => (
                                    <p key={i} className="text-xs font-bold text-zinc-300 truncate">{a.nome}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar size={14} className="text-zinc-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Defesas — Próx. 6 Meses</span>
                        </div>
                        {loading ? <div className="h-8 bg-zinc-800 rounded animate-pulse w-12" /> : (
                            <p className="text-3xl font-black text-white">{defesasProximas}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
