import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";
const token = "EAAdqdx9GvPIBRJ4xwrlivlQTyS89ezDP3cr9KXEOPtJ2fbFZCbUKxDYFHasYANQrTH6hCHAwLAdjjE7Vv1rvrNoZAFjM26DOlQZAsj6Kaf0zj4jzEiBmnRTiMPZBZCihjZAGYZBHmZBBvsRinkzubLYwMa4uXcRjnh10ZCHVUW3pAToGe5bW6ZCDLU5NJlN9uQ8QZDZD";

const supabase = createClient(url, key);

async function simulateFetch() {
    const { data: accounts } = await supabase.from('ad_accounts').select('meta_id');
    console.log(`Testing ${accounts.length} accounts...`);

    for (const acc of accounts) {
        console.log(`Checking ${acc.meta_id}...`);
        const url = `https://graph.facebook.com/v18.0/${acc.meta_id}/insights?date_preset=last_30d&fields=spend,impressions,reach,cpm,ctr,cpc,clicks,frequency,actions,cost_per_action_type&access_token=${token}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            console.log(`✅ ${acc.meta_id} has data: spend=${data.data[0].spend}`);
        } else {
            console.log(`❌ ${acc.meta_id} returned no data.`);
            if (data.error) console.log("Error:", data.error.message);
        }
    }
}

simulateFetch();
