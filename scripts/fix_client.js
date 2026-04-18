import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function fixClient() {
    const email = "ericksgsena436@gmail.com";
    const id = "a487baef-bce6-4b9b-821d-d5514ddf4943";

    // Insert just with name and email
    const { data: clientData, error: clientError } = await supabase.from('clients').insert({
        id: id,
        name: "Erick Sena",
        email: email
    }).select();

    if (clientError) {
        console.error("Error creating client profile:", clientError);
    } else {
        console.log("Client profile created:", clientData);
    }
}

fixClient();
