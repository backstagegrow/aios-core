"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else window.location.href = "/dashboard";
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
            <div className="bg-[#141414] p-8 border border-[#D4A847]/20 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-white">Login • Alpha Academy</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="E-mail"
                        className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white focus:border-[#D4A847] outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white focus:border-[#D4A847] outline-none"
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
