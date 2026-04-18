import { createClient } from '@supabase/supabase-js';

const url = "https://xaivgzrmxewkevlqvphi.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaXZnenJteGV3a2V2bHF2cGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NjI3NjYsImV4cCI6MjA4NzUzODc2Nn0.OEfQpOU_NSiAeS_9WZd6u4uM9OB3hDpiKBj7Gl7GBzo";

const supabase = createClient(url, key);

async function createAdmin() {
    console.log("Tentando criar usuário na base certa...");
    const { data, error } = await supabase.auth.signUp({
        email: 'ericksgsena436@gmail.com',
        password: 'password123'
    });

    if (error) {
        console.log("Erro Cadastro auth:", error);
    } else {
        console.log("Usuário criado na Auth:", data.user?.id);

        // Criar perfil
        if (data.user) {
            const { error: pErr } = await supabase.from('profiles').upsert({
                id: data.user.id,
                email: 'ericksgsena436@gmail.com',
                role: 'admin',
                full_name: 'Erick Sena',
                agency_name: 'Alpha Digital'
            });
            if (pErr) console.log("Erro criar perfil:", pErr);
            else console.log("Perfil criado como ADMIN!");
        }
    }
}
createAdmin();
