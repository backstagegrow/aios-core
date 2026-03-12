import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Ensure .env has these values loaded
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[Supabase] Missing SUPABASE_URL or keys in environment variables.');
}

/**
 * Singleton Supabase Client instance for the AIOS.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Helper to fetch a client's context directly from the new multi-tenant `client_context_memory` table.
 * 
 * @param clientId The ID of the client (e.g. "GTHouse")
 * @param contextType The type of context requested (e.g. "design_system", "landing_page")
 * @returns The context content or null if not found.
 */
export async function getClientContext(clientId: string, contextType: string): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .from('client_context_memory')
            .select('content')
            .eq('client_id', clientId)
            .eq('context_type', contextType)
            .single();

        if (error) {
            console.error(`[Supabase] Error fetching context ${contextType} for client ${clientId}:`, error.message);
            return null;
        }

        return data?.content || null;
    } catch (e) {
        console.error(`[Supabase] Exception fetching context ${contextType} for client ${clientId}:`, e);
        return null;
    }
}
