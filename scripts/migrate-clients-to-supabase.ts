import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // use service role for insert

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const CLIENTS_DIR = path.join(process.cwd(), 'clients');

async function migrateClients() {
    console.log(`Starting migration from ${CLIENTS_DIR}...`);

    try {
        const clients = await fs.readdir(CLIENTS_DIR);

        for (const client of clients) {
            const clientPath = path.join(CLIENTS_DIR, client);
            const stat = await fs.stat(clientPath);

            if (stat.isDirectory()) {
                console.log(`Processing client: ${client}`);

                // Read design_system.html if exists
                const dsPath = path.join(clientPath, 'design_system.html');
                try {
                    const dsContent = await fs.readFile(dsPath, 'utf8');
                    console.log(`  Found design_system.html for ${client}, pushing to Supabase...`);

                    const { data: existing } = await supabase
                        .from('client_context_memory')
                        .select('id')
                        .eq('client_id', client)
                        .eq('context_type', 'design_system')
                        .single();

                    let error;
                    if (existing) {
                        const res = await supabase
                            .from('client_context_memory')
                            .update({
                                title: `${client} Design System`,
                                content: dsContent,
                                source_file: 'design_system.html',
                            })
                            .eq('id', existing.id);
                        error = res.error;
                    } else {
                        const res = await supabase
                            .from('client_context_memory')
                            .insert({
                                client_id: client,
                                context_type: 'design_system',
                                title: `${client} Design System`,
                                content: dsContent,
                                source_file: 'design_system.html',
                            });
                        error = res.error;
                    }

                    if (error) {
                        console.error(`  Error inserting design_system for ${client}:`, error);
                    } else {
                        console.log(`  Success for ${client} design_system.`);
                    }
                } catch (err: any) {
                    if (err.code === 'ENOENT') {
                        console.log(`  No design_system.html found for ${client}.`);
                    } else {
                        console.error(`  Error reading design_system.html for ${client}:`, err);
                    }
                }

                // Also try to find imersao.html just as an example context
                const imersaoPath = path.join(clientPath, 'imersao.html');
                try {
                    const imContent = await fs.readFile(imersaoPath, 'utf8');
                    console.log(`  Found imersao.html for ${client}, pushing to Supabase...`);

                    const { data: existingImersao } = await supabase
                        .from('client_context_memory')
                        .select('id')
                        .eq('client_id', client)
                        .eq('context_type', 'landing_page')
                        .single();

                    let imersaoError;
                    if (existingImersao) {
                        const res = await supabase
                            .from('client_context_memory')
                            .update({
                                title: `${client} Imersao Landing Page`,
                                content: imContent,
                                source_file: 'imersao.html',
                            })
                            .eq('id', existingImersao.id);
                        imersaoError = res.error;
                    } else {
                        const res = await supabase
                            .from('client_context_memory')
                            .insert({
                                client_id: client,
                                context_type: 'landing_page',
                                title: `${client} Imersao Landing Page`,
                                content: imContent,
                                source_file: 'imersao.html',
                            });
                        imersaoError = res.error;
                    }

                    if (imersaoError) {
                        console.error(`  Error inserting imersao for ${client}:`, imersaoError);
                    } else {
                        console.log(`  Success for ${client} imersao.`);
                    }
                } catch (err: any) {
                    // silently ignore if not found
                }

            }
        }

        console.log('Migration script complete.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateClients();
