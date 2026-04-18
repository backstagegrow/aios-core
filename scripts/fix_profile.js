import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function fixProfile() {
    const id = "a487baef-bce6-4b9b-821d-d5514ddf4943";

    // Set client_id
    const { data: profileData, error: profileError } = await supabase.from('profiles').update({
        client_id: id
    }).eq('id', id).select();

    if (profileError) {
        console.error("Error updating profile:", profileError);
    } else {
        console.log("Profile updated:", profileData);
    }
}

fixProfile();
