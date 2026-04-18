import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
// ANON KEY
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDA3MTgsImV4cCI6MjA4NzA3NjcxOH0.cvOq318HShJa3sqj3tPPkDO07lzr2xDJYFGX4PkA20k";

const supabase = createClient(url, key);

async function testFetch() {
    const { data, error } = await supabase.from('business_managers').select('bm_id, name').eq('bm_id', 'SYSTEM_USER_TOKEN');
    if (error) console.log("Anon Error:", error.message);
    else console.log("Anon Data:", data);
}
testFetch();
