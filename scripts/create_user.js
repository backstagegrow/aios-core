import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function createUser() {
    const email = "ericksgsena436@gmail.com";
    const password = "PontoAcafe2024*"; // default temporary password

    console.log(`Creating user in Meta Ads: ${email}`);

    // Create in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
    });

    if (authError) {
        console.error("Error creating user:", authError);
        return;
    }

    console.log("User created in auth.users! ID:", authData.user.id);

    // Create in clients table
    const { data: clientData, error: clientError } = await supabase.from('clients').insert({
        id: authData.user.id,
        name: "Erick Sena",
        email: email,
        role: "client"
    }).select();

    if (clientError) {
        console.error("Error creating client profile:", clientError);
    } else {
        console.log("Client profile created:", clientData);
    }
}

createUser();
