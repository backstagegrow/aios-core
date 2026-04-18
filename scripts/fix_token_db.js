import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";
const token = "EAAdqdx9GvPIBRJ4xwrlivlQTyS89ezDP3cr9KXEOPtJ2fbFZCbUKxDYFHasYANQrTH6hCHAwLAdjjE7Vv1rvrNoZAFjM26DOlQZAsj6Kaf0zj4jzEiBmnRTiMPZBZCihjZAGYZBHmZBBvsRinkzubLYwMa4uXcRjnh10ZCHVUW3pAToGe5bW6ZCDLU5NJlN9uQ8QZDZD";

const supabase = createClient(url, key);

async function fixToken() {
    console.log("Upserting SYSTEM_USER_TOKEN...");
    const { error } = await supabase.from('business_managers').upsert({
        bm_id: 'SYSTEM_USER_TOKEN',
        name: token,
        status: 'connected',
        token_expires: '2025-12-31'
    }, { onConflict: 'bm_id' });
    if (error) console.log("Error:", error);
    else console.log("Token saved successfully!");
}
fixToken();
