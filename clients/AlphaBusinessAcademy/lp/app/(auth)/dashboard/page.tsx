import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const runtime = 'edge';

export default async function DashboardPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-[#D4A847]">Dashboard SaaS</h1>
                <div className="glass-card p-6 rounded-2xl border border-[#D4A847]/20">
                    <p className="text-xl">Bem-vindo, {user?.email}</p>
                    <p className="mt-4 text-gray-400">Você está logado na plataforma de gestão Alpha Business Academy.</p>
                </div>
            </div>
        </div>
    );
}
