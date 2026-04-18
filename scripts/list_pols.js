import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function listPolicies() {
    const { data, error } = await supabase.rpc('get_policies'); // I'll hope it works or try select
    const { data: pols, error: e2 } = await supabase.from('pg_policies').select('*').eq('tablename', 'business_managers');
    if (e2) {
        // generic select might fail. Let's try to just query with service role to confirm data exists (already did)
        console.log("Cannot read pg_policies directly via client.");
    } else {
        console.log("Policies:", pols);
    }
}
listPolicies();
