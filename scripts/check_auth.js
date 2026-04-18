import { createClient } from '@supabase/supabase-js';

const url = "https://xaivgzrmxewkevlqvphi.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaXZnenJteGV3a2V2bHF2cGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2Mjc2NiwiZXhwIjoyMDg3NTM4NzY2fQ.0N-v-m8aIIL7e6fE82fIuN_1xM-8W-HwZz4ZzC7D5f4";

const supabase = createClient(url, key);

async function check() {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) {
        console.log("Erro ao listar users Admin:", error);
    } else {
        console.log("Users:", users.users.map(u => ({ id: u.id, email: u.email })));
    }
}
check();
