import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function checkData() {
    const { data: ads, error: e1 } = await supabase.from('ad_accounts').select('*');
    console.log("Total Ad Accounts in DB:", ads?.length || 0);

    const { data: reports, error: e2 } = await supabase.from('reports').select('*').limit(5);
    console.log("Recent Reports entries:", reports?.length || 0);
    if (reports && reports.length > 0) console.log("Sample Report:", reports[0]);

    const { count, error: e3 } = await supabase.from('reports').select('*', { count: 'exact', head: true });
    console.log("Grand Total Reports Records:", count);
}
checkData();
