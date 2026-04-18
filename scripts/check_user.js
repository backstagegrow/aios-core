import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function checkUser() {
    const email = "ericksgsena436@gmail.com";
    console.log(`Checking user: ${email}`);

    // We can query auth.users if we use admin api or if we just query a custom clients table.
    // Let's try admin api first
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error("Error fetching users:", error);
    } else {
        const user = users.users.find(u => u.email === email);
        if (user) {
            console.log("User found in auth.users:", user.id);
            // Check if they are in clients table
            const { data: client, error: cError } = await supabase.from('clients').select('*').eq('id', user.id).single();
            console.log("Client in 'clients' table:", client || cError);
        } else {
            console.log("User NOT found in auth.users");
        }
    }
}

checkUser();
