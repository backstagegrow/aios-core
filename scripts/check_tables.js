import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function checkTables() {
    const { data, error } = await supabase.rpc('get_tables'); // Or just fetch a few known names

    // Quick test of settings tables
    const tables = ['settings', 'agency_settings', 'system_settings', 'config'];
    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('*').limit(1);
        if (!error) {
            console.log(`Table exists: ${t}`);
        }
    }
}

checkTables();
