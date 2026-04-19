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
} from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import ChatWidget from '@/components/ChatWidget'
import { ToastProvider } from '@/components/Toast'

// UFOP Institutional Red
const UFOP_RED = '#9D2235'

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

    const activeClass = 'font-medium'
    const baseNavClass = 'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm'

    const navLink = (href: string) => {
        const isActive = pathname === href
        return {
            className: `${baseNavClass} ${isActive ? activeClass : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`,
            style: isActive ? {
                backgroundColor: 'rgba(157, 34, 53, 0.15)',
                color: UFOP_RED,
                border: '1px solid rgba(157, 34, 53, 0.25)',
            } : {}
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${UFOP_RED} transparent transparent transparent` }}></div>
        </div>
    )

    return (
        <ToastProvider><div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
            <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col fixed h-full shrink-0">
                {/* Header/Logo */}
                <div className="p-6 border-b border-zinc-800">
                    <div className="flex flex-col gap-3">
                        <img
                            src="/brand/logo-ufop-horiz.png"
                            alt="UFOP"
                            className="h-10 w-auto invert opacity-90"
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Academic SaaS</span>
                            {perfil?.role === 'admin' && (
                                <span
                                    className="text-[9px] font-black px-2 py-0.5 rounded"
                                    style={{
                                        backgroundColor: 'rgba(157, 34, 53, 0.2)',
                                        color: UFOP_RED,
                                        border: '1px solid rgba(157, 34, 53, 0.3)',
                                    }}
                                >ADM</span>
                            )}
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                    <Link href="/dashboard" {...navLink('/dashboard')}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link href="/dashboard/professores" {...navLink('/dashboard/professores')}>
                        <Users size={18} /> Docentes
                    </Link>
                    <Link href="/dashboard/alunos" {...navLink('/dashboard/alunos')}>
                        <GraduationCap size={18} /> Alunos
                    </Link>
                    <Link href="/dashboard/relatorios" {...navLink('/dashboard/relatorios')}>
                        <FileText size={18} /> Relatórios CAPES
                    </Link>

                    {perfil?.role === 'admin' && (
                        <div className="pt-4 mt-4 border-t border-zinc-800">
                            <span className="px-4 text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-2 block">Orion Engine</span>
                            <Link href="/dashboard/integracoes" {...navLink('/dashboard/integracoes')}>
                                <Share2 size={18} /> Integrações
                            </Link>
                        </div>
                    )}
                </nav>

                <button
                    onClick={handleSignOut}
                    className="mt-auto flex items-center gap-3 text-zinc-500 hover:text-white px-4 py-3 transition-colors border-t border-zinc-800 text-sm"
                >
                    <LogOut size={18} /> Sair
                </button>
            </aside>

            <main className="flex-1 ml-64 min-h-screen">
                {children}
            </main>
            <ChatWidget />
        </div></ToastProvider>
    )
}
