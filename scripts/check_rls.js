import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function checkPolicies() {
    const { data, error } = await supabase.rpc('get_policies'); // If it exists
    if (error) {
        console.log("RPC get_policies failed, trying raw SQL...");
        const { data: pols, error: sqlErr } = await supabase.from('pg_policies').select('*'); // This usually won't work from client
        // Let's try to just check if we can read from business_managers with a non-admin key if we had one
        // But better: let's test if the table has ANY open policies.
    }

    // Alternative: check if the table is readable by everyone
    console.log("Checking RLS on business_managers...");
}
checkPolicies();
