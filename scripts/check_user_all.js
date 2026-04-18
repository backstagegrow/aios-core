import { createClient } from '@supabase/supabase-js';

const projects = [
    { name: "Meta Ads", url: "https://whcfgflswdanptxsvfes.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE" },
    { name: "SpHaus", url: "https://bleqjcxwtgzwbkediusr.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZXFqY3h3dGd6d2JrZWRpdXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIzNzIyMCwiZXhwIjoyMDg1ODEzMjIwfQ.CtrTzX5QhKP01QOeaqOkcExfCzyiqZ2_7_pIasC32uQ" },
    { name: "Backstagefy", url: "https://xaivgzrmxewkevlqvphi.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaXZnenJteGV3a2V2bHF2cGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2Mjc2NiwiZXhwIjoyMDg3NTM4NzY2fQ.2ZniGbPyAR2y1gBmDfMwU3wqQvuykKPxKwZjJdj7nI4" }
];

async function checkAll() {
    const email = "ericksgsena436@gmail.com";
    for (const p of projects) {
        console.log(`\nChecking project: ${p.name}`);
        const supabase = createClient(p.url, p.key);
        const { data: users, error } = await supabase.auth.admin.listUsers();

        if (error) {
            console.error("Error:", error);
            continue;
        }

        const user = users.users.find(u => u.email === email);
        if (user) {
            console.log(`[+] User FOUND in ${p.name}! ID: ${user.id}`);
            // Check if they are in clients table
            const { data: client, error: cError } = await supabase.from('clients').select('*').eq('id', user.id).single();
            if (client) {
                console.log(`    Client profile exists.`);
            } else {
                console.log(`    No profile in 'clients' table.`);
            }
        } else {
            console.log(`[-] User not found in ${p.name}`);
        }
    }
}

checkAll();
