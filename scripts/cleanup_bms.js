import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function cleanupBMs() {
    console.log("Fetching all Business Managers...");
    const { data: bms, error } = await supabase.from('business_managers').select('*');

    if (error) {
        console.error("Error fetching BMs:", error);
        return;
    }

    console.log(`Found ${bms.length} BMs.`);

    // Identificar registros para deletar (aqueles que começam com NEW_ ou não são reais)
    // O SYSTEM_USER_TOKEN deve ser mantido sempre.
    const toDelete = bms.filter(bm => bm.bm_id !== 'SYSTEM_USER_TOKEN' && (bm.bm_id.startsWith('NEW_') || bm.name === 'Novo BM Conectado'));

    if (toDelete.length === 0) {
        console.log("No mock BMs found to delete.");
        return;
    }

    console.log(`Deleting ${toDelete.length} mock BMs:`, toDelete.map(bm => bm.bm_id));

    const { error: delErr } = await supabase
        .from('business_managers')
        .delete()
        .in('id', toDelete.map(bm => bm.id));

    if (delErr) console.error("Error deleting:", delErr);
    else console.log("Mock BMs deleted successfully!");
}

cleanupBMs();
