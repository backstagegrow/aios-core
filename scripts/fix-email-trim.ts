import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

// Busca todos os leads SitesSales com email (pode ter espaço no início)
const { data: leads, error } = await supabase
    .from('sales_leads')
    .select('id, email')
    .eq('client_id', 'SitesSales')
    .not('email', 'is', null);

if (error) { console.error('Erro:', error.message); process.exit(1); }

const dirty = (leads ?? []).filter(l => l.email !== l.email.trim());
console.log(`[fix-email] ${dirty.length} leads com espaço no email encontrados`);

for (const lead of dirty) {
    const cleaned = lead.email.trim();
    const { error: e } = await supabase
        .from('sales_leads')
        .update({ email: cleaned })
        .eq('id', lead.id);

    if (e) console.error(`  ✗ ID ${lead.id}: ${e.message}`);
    else console.log(`  ✓ ID ${lead.id}: "${lead.email}" → "${cleaned}"`);
}

console.log('[fix-email] Concluído.');
