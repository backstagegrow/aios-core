'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    FileText,
    Share2,
    LogOut,
    User,
    ShieldCheck,
    Settings
} from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [perfil, setPerfil] = useState<any>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            // Buscar perfil no banco
            const { data: profile } = await supabase
                .from('perfis')
                .select('*')
                .eq('id', session.user.id)
                .single()

            setPerfil(profile)
            setLoading(false)
        }
        checkAuth()
    }, [router])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
            {/* Sidebar de Orion */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col fixed h-full shrink-0">
                {/* Header/Logo */}
                <div className="p-6 border-b border-zinc-800">
                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <img
                                src="/brand/logo-ufop-horiz.png"
                                alt="UFOP"
                                className="h-10 w-auto invert opacity-90"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Academic SaaS</span>
                            {perfil?.role === 'admin' && (
                                <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30">ADM</span>
                            )}
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                    <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-primary/10 text-primary font-medium border border-primary/20' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/dashboard/professores" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname === '/dashboard/professores' ? 'bg-primary/10 text-primary font-medium border border-primary/20' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                        <Users size={20} /> Professores
                    </Link>
                    <Link href="/dashboard/alunos" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname === '/dashboard/alunos' ? 'bg-primary/10 text-primary font-medium border border-primary/20' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                        <GraduationCap size={20} /> Alunos
                    </Link>
                    <Link href="/dashboard/relatorios" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname === '/dashboard/relatorios' ? 'bg-primary/10 text-primary font-medium border border-primary/20' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                        <FileText size={20} /> Relatórios
                    </Link>

                    {perfil?.role === 'admin' && (
                        <div className="pt-4 mt-4 border-t border-zinc-800">
                            <span className="px-4 text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-2 block">Orion Engine</span>
                            <Link href="/dashboard/integracoes" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname === '/dashboard/integracoes' ? 'bg-primary/10 text-primary font-medium border border-primary/20' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                                <Share2 size={20} /> Integrações
                            </Link>
                        </div>
                    )}
                </nav>

                <button
                    onClick={handleSignOut}
                    className="mt-auto flex items-center gap-3 text-zinc-500 hover:text-white px-4 py-2 transition-colors border-t border-zinc-800 pt-4"
                >
                    <LogOut size={20} /> Sair
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 min-h-screen">
                {children}
            </main>
        </div>
    )
}
