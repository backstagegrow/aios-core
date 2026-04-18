import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function testNameField() {
    const longString = "EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".repeat(5);
    const { data, error } = await supabase.from('business_managers').insert({
        bm_id: 'SYSTEM_USER_TEST',
        name: longString,
        status: 'connected',
        token_expires: '2025-12-31'
    }).select();

    if (error) console.error(error);
    else console.log("Success with long string length:", data[0].name.length);

    // delete
    await supabase.from('business_managers').delete().eq('bm_id', 'SYSTEM_USER_TEST');
}

testNameField();
