'use client'

import { useState, useEffect } from 'react'
import { Share2, CheckCircle2, AlertCircle, RefreshCw, Link as LinkIcon, Save, Database, ExternalLink } from 'lucide-react'

interface DriveFile {
    id: string
    name: string
    modifiedTime: string
}

export default function IntegracoesPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [driveFiles, setDriveFiles] = useState<DriveFile[]>([])
    const [syncingId, setSyncingId] = useState<string | null>(null)
    const [lastScan, setLastScan] = useState<string>('Nunca')

    const handleScanDrive = async () => {
        setStatus('loading')
        try {
            const response = await fetch('/api/google/drive')
            const data = await response.json()

            if (data.files) {
                setDriveFiles(data.files)
                setStatus('success')
                setLastScan(new Date().toLocaleTimeString())
            } else {
                setStatus('error')
            }
        } catch (error) {
            console.error('Erro ao scanear drive:', error)
            setStatus('error')
        }
    }

    const handleSyncSheet = async (fileId: string) => {
        setSyncingId(fileId)
        try {
            const response = await fetch('/api/google/sheets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ spreadsheetId: fileId })
            })
            const data = await response.json()

            if (data.data) {
                alert(`Sincronizado! Orion leu ${data.data.length} linhas com sucesso.`)
            } else {
                alert('Erro na leitura dos dados. Verifique as permissões.')
            }
        } catch (error) {
            console.error('Erro na sincronização:', error)
        } finally {
            setSyncingId(null)
        }
    }

    return (
        <div className="p-8 pb-12">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Share2 className="text-primary" size={32} />
                    Integrações & APIs
                </h1>
                <p className="text-zinc-500 mt-1">Gerencie a conexão do Orion Engine com o ecossistema Google Workspace.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Drive Scanner Section */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                    <LinkIcon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-tight">Orion Scanner</h3>
                                    <p className="text-zinc-500 text-xs">Varredura de arquivos compartilhados</p>
                                </div>
                            </div>
                            <button
                                onClick={handleScanDrive}
                                disabled={status === 'loading'}
                                className="bg-primary/80 hover:bg-primary disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-900/20"
                            >
                                <RefreshCw className={status === 'loading' ? 'animate-spin' : ''} size={14} />
                                {status === 'loading' ? 'Varrendo...' : 'Scanear Drive'}
                            </button>
                        </div>

                        <div className="max-h-[450px] overflow-y-auto">
                            {driveFiles.length > 0 ? (
                                <table className="w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-zinc-900 z-10">
                                        <tr className="text-zinc-500 border-b border-zinc-800/50">
                                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Planilha (Sheets)</th>
                                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Alteração</th>
                                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px] text-right">Integração</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/50">
                                        {driveFiles.map((file) => (
                                            <tr key={file.id} className="hover:bg-primary/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center text-primary text-[10px] font-black group-hover:border-primary/30 transition-colors">XLS</div>
                                                        <span className="font-semibold text-zinc-300 group-hover:text-white transition-colors">{file.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-500 text-xs">
                                                    {new Date(file.modifiedTime).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleSyncSheet(file.id)}
                                                        disabled={syncingId === file.id}
                                                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2 ml-auto"
                                                    >
                                                        {syncingId === file.id ? (
                                                            <><RefreshCw size={12} className="animate-spin" /> Lendo...</>
                                                        ) : (
                                                            <><RefreshCw size={12} /> Sincronizar</>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-20 text-center">
                                    <div className="inline-flex p-4 bg-zinc-950 border border-zinc-800 rounded-3xl text-zinc-700 mb-4">
                                        <Database size={40} />
                                    </div>
                                    <p className="text-zinc-500 text-sm italic">Nenhum arquivo detectado. Clique em "Scanear Drive".</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-3xl flex gap-6 items-start">
                        <div className="bg-primary/10 p-4 rounded-2xl text-primary border border-primary/10">
                            <AlertCircle size={28} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-zinc-200">Como autorizar novos arquivos?</p>
                            <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
                                O Orion Engine só consegue enxergar arquivos compartilhados com a Identidade Digital do robô. Para novos formulários, solicite compartilhamento com:
                                <code className="bg-zinc-900 text-primary/60 px-2 py-1 rounded-md ml-1 font-mono border border-zinc-800 mt-2 block w-fit">orion-ufop@synkra-mcp-agents.iam.gserviceaccount.com</code>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Integration Status & Info */}
                <div className="space-y-6">
                    <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="font-bold text-white">Cloud Status</h3>
                        </div>
                        <ul className="space-y-6">
                            {[
                                { l: 'Google Sheets API', v: 'ATIVO', s: 'text-primary' },
                                { l: 'Google Drive Search', v: 'ATIVO', s: 'text-primary' },
                                { l: 'Conexão Supabase', v: 'ESTÁVEL', s: 'text-blue-400' },
                                { l: 'Último Scan', v: lastScan, s: 'text-zinc-500' }
                            ].map((item, i) => (
                                <li key={i} className="flex flex-col gap-1 border-l-2 border-zinc-800 pl-4">
                                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{item.l}</span>
                                    <span className={`font-mono text-sm font-bold ${item.s}`}>{item.v}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <div className="bg-gradient-to-br from-primary/80/20 via-zinc-900 to-zinc-900 border border-primary/20 rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-primary/5">
                        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700 text-primary rotate-12">
                            <Share2 size={160} />
                        </div>
                        <h4 className="font-black text-white text-xl mb-3 relative z-10 leading-tight">Mapeamento <br /> Automático</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-6 relative z-10">O Orion detecta automaticamente perguntas de formulários e mapeia para os indicadores CAPES da UFOP.</p>
                        <button className="bg-zinc-100 text-zinc-950 px-4 py-2 rounded-xl text-xs font-black hover:bg-white transition-all relative z-10 flex items-center gap-2 group/btn">
                            Acessar Documentação <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
