import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getCurrentProfile } from "../services/userService";

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                const prof = await getCurrentProfile();
                setProfile(prof);
            }
            setLoading(false);
        };

        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                setUser(session.user);
                const prof = await getCurrentProfile();
                setProfile(prof);
            } else {
                setUser(null);
                setProfile(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return { user, profile, loading };
}
