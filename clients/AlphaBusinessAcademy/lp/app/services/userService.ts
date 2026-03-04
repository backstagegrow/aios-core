import { supabase } from "../lib/supabase";

export async function getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*, tenants(*)')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }

    return data;
}

export async function getTenantBranding(slug: string) {
    const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) return null;
    return data;
}
