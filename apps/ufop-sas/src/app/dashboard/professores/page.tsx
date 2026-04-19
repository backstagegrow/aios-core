'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, GraduationCap, Link as LinkIcon, RefreshCw, Search, UploadCloud } from 'lucide-react'
import { parseLattesXML } from '@/lib/lattes-xml-parser'
import { useToast } from '@/components/Toast'

export default function ProfessoresPage() {
    const [professores, setProfessores] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newProf, setNewProf] = useState({ nome: '', email: '', link_lattes: '' })
    const [search, setSearch] = useState('')
    const toast = useToast()

    const professoresFiltrados = professores.filter(p =>
        p.nome?.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase())
    )

    const fetchProfessores = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('professores')
            .select('*')
            .order('nome')
        if (!error) setProfessores(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchProfessores()
    }, [])

    const handleLattesUpload = async (profId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            setSyncing(profId)
            const reader = new FileReader()

            reader.onload = async (e) => {
                const xmlContent = e.target?.result as string
                const indicators = await parseLattesXML(xmlContent)
                const errors: string[] = []

                // Limpa dados anteriores do professor para re-importação limpa
                await supabase.from('producoes').delete().eq('professor_id', profId)
                await supabase.from('conferencias').delete().eq('professor_id', profId)
                await supabase.from('projetos').delete().eq('professor_id', profId)
                await supabase.from('orientacoes').delete().eq('professor_id', profId)

                // Artigos
                if (indicators.artigos.length > 0) {
                    const { error } = await supabase.from('producoes').insert(
                        indicators.artigos.map(art => ({
                            professor_id: profId,
                            tipo: 'ARTIGO',
                            titulo: art.titulo,
                            journal: art.periodico,
                            doi: art.doi,
                            data_publicacao: art.ano ? `${art.ano}-01-01` : null,
                        }))
                    )
                    if (error) errors.push(`Artigos: ${error.message}`)
                }

                // Conferências
                if (indicators.conferencias.length > 0) {
                    const { error } = await supabase.from('conferencias').insert(
                        indicators.conferencias.map(c => ({
                            professor_id: profId,
                            titulo: c.titulo,
                            ano: c.ano,
                            evento: c.evento,
                            cidade: c.cidade,
                            natureza: c.natureza,
                            classificacao: c.classificacao,
                        }))
                    )
                    if (error) errors.push(`Conferências: ${error.message}`)
                }

                // Projetos
                if (indicators.projetos.length > 0) {
                    const { error } = await supabase.from('projetos').insert(
                        indicators.projetos.map(p => ({
                            professor_id: profId,
                            titulo: p.titulo,
                            ano_inicio: p.ano_inicio,
                            ano_fim: p.ano_fim,
                            situacao: p.situacao,
                            financiador: p.financiador,
                        }))
                    )
                    if (error) errors.push(`Projetos: ${error.message}`)
                }

                // Orientações
                if (indicators.orientacoes.length > 0) {
                    const { error } = await supabase.from('orientacoes').insert(
                        indicators.orientacoes.map(o => ({
                            professor_id: profId,
                            tipo: o.tipo,
                            titulo: o.titulo,
                            ano: o.ano,
                            orientado: o.orientado,
                            situacao: o.situacao,
                            instituicao: o.instituicao,
                        }))
                    )
                    if (error) errors.push(`Orientações: ${error.message}`)
                }

                if (errors.length > 0) {
                    toast('Erros na importação: ' + errors.join(', '), 'error')
                } else {
                    toast(
                        `Lattes importado! ${indicators.artigos.length} artigos · ${indicators.conferencias.length} conferências · ${indicators.projetos.length} projetos · ${indicators.orientacoes.length} orientações`
                    )
                }

                setSyncing(null)
                fetchProfessores()
            }
            reader.readAsText(file)
        } catch (err: any) {
            toast('Erro no processamento: ' + err.message, 'error')
            setSyncing(null)
        }
    }

    const handleAddProfessor = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase
            .from('professores')
            .insert([newProf])

        if (!error) {
            setShowAddForm(false)
            setNewProf({ nome: '', email: '', link_lattes: '' })
            fetchProfessores()
        } else {
            toast(error.message, 'error')
        }
    }

    return (
        <div className="p-8 pb-12">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <GraduationCap className="text-primary" size={32} />
                        Corpo Docente
                    </h1>
                    <p className="text-zinc-500 mt-1">Gerencie os 18 professores permanentes e seus indicadores Lattes.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-primary/80 hover:bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary-900/20"
                >
                    <Plus size={18} /> Cadastrar Professor
                </button>
            </header>

            {showAddForm && (
                <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-lg font-bold text-white mb-4">Novo Professor</h3>
                    <form onSubmit={handleAddProfessor} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            placeholder="Nome Completo"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                            value={newProf.nome}
                            onChange={e => setNewProf({ ...newProf, nome: e.target.value })}
                            required
                        />
                        <input
                            placeholder="E-mail"
                            type="email"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                            value={newProf.email}
                            onChange={e => setNewProf({ ...newProf, email: e.target.value })}
                        />
                        <input
                            placeholder="Link Lattes (URL)"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                            value={newProf.link_lattes}
                            onChange={e => setNewProf({ ...newProf, link_lattes: e.target.value })}
                        />
                        <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                            <button type="button" onClick={() => setShowAddForm(false)} className="text-zinc-400 hover:text-white px-4 py-2 text-sm">Cancelar</button>
                            <button type="submit" className="bg-white text-zinc-950 px-6 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200">Salvar Dados</button>
                        </div>
                    </form>
                </section>
            )}

            {/* Tabela de Professores */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input className="w-full bg-zinc-800 border-none rounded-lg py-2 pl-10 pr-4 text-xs text-zinc-300 focus:ring-1 focus:ring-zinc-700 outline-none" placeholder="Filtrar por nome ou e-mail..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="text-xs text-zinc-500 font-medium">Total: {professoresFiltrados.length} Professores</div>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500 font-bold bg-zinc-900/30">
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Índice H</th>
                            <th className="px-6 py-4">FWCI (Scopus)</th>
                            <th className="px-6 py-4">Link Lattes</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-48"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-8"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-12"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-32"></div></td>
                                    <td></td>
                                </tr>
                            ))
                        ) : professores.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Nenhum professor cadastrado ainda.</td>
                            </tr>
                        ) : professoresFiltrados.map((p) => (
                            <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-sm text-zinc-200">{p.nome}</div>
                                    <div className="text-[10px] text-zinc-500">{p.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-primary font-bold">{p.kpi_h || '-'}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-blue-400">{p.kpi_fwci || '-'}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {p.link_lattes && (
                                        <a href={p.link_lattes} target="_blank" className="text-zinc-500 hover:text-primary/60 flex items-center gap-1.5 text-xs truncate max-w-[200px]">
                                            <LinkIcon size={12} /> Lattes
                                        </a>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <label className={`p-2 rounded-lg transition-all cursor-pointer ${syncing === p.id ? 'bg-primary/20 text-primary' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
                                            {syncing === p.id ? <RefreshCw size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".xml"
                                                onChange={(e) => handleLattesUpload(p.id, e)}
                                                disabled={!!syncing}
                                            />
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
