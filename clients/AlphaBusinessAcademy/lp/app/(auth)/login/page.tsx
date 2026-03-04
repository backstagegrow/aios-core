"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else router.push("/dashboard");
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-[#D4A847]/20">
                <h1 className="text-2xl font-bold mb-6 text-[#D4A847]">Login Alpha Academy</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-[#D4A847] outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-[#D4A847] outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="cta-button w-full" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
