-- Criação da tabela viabr_leads
CREATE TABLE public.viabr_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    empresa TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    origem TEXT DEFAULT 'Site Via BR'
);

-- Ativar RLS (Row Level Security) para segurança
ALTER TABLE public.viabr_leads ENABLE ROW LEVEL SECURITY;

-- Política de segurança: Permite que qualquer pessoa INSIRA dados (anônimo), mas não permite LER.
CREATE POLICY "Permitir insert anonimo" ON public.viabr_leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Política de segurança: Apenas usuários autenticados (Service Role / Admin) podem ler os leads
CREATE POLICY "Permitir leitura apenas para admin" ON public.viabr_leads
    FOR SELECT
    TO authenticated
    USING (true);
