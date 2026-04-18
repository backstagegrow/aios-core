import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabaseAdmin = createClient(url, key);

async function resetPass() {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        'a487baef-bce6-4b9b-821d-d5514ddf4943',
        { password: 'password123' }
    );
    if (error) console.log("Erro:", error);
    else console.log("Senha resetada com sucesso para password123");
}
resetPass();
