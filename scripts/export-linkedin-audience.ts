import { supabase } from '../src/db/supabase.ts';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

export async function exportLinkedInAudience(clientId: string = 'BKSGrow') {
    console.log(`[linkedin-export] Fetching leads for ${clientId}...`);

    // Fetch leads with emails or websites (domains are useful for account targeting)
    const { data: leads, error } = await supabase
        .from('sales_leads')
        .select('email, website, business_name')
        .eq('client_id', clientId)
        .not('email', 'is', null);

    if (error) {
        console.error('[linkedin-export] Error fetching leads:', error.message);
        return;
    }

    if (!leads || leads.length === 0) {
        console.log('[linkedin-export] No leads found to export.');
        return;
    }

    // LinkedIn User Upload CSV format usually requires headers like:
    // email, first_name, last_name, company_name, title, etc.
    const csvHeader = 'email,company_name\n';
    const csvRows = leads.map(lead => {
        // Basic sanitization
        const email = lead.email.trim();
        const company = lead.business_name.replace(/,/g, '').trim();
        return `${email},${company}`;
    }).join('\n');

    const outputPath = path.resolve(process.cwd(), `exports/linkedin_audience_${clientId}_${new Date().toISOString().split('T')[0]}.csv`);

    // Ensure directory exists
    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    fs.writeFileSync(outputPath, csvHeader + csvRows);
    console.log(`[linkedin-export] Exported ${leads.length} leads to: ${outputPath}`);
    console.log(`[linkedin-export] Upload this file as a 'Matched Audience' on LinkedIn Campaign Manager.`);
}

const invokedScript = process.argv[1]?.replace(/\\/g, '/').split('/').pop();

if (invokedScript === 'export-linkedin-audience.ts' || invokedScript === 'export-linkedin-audience.js') {
    exportLinkedInAudience();
}
