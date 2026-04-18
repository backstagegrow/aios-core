import { createClient } from '@supabase/supabase-js';

const url = "https://whcfgflswdanptxsvfes.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE";

const supabase = createClient(url, key);

async function resetPassword() {
    console.log("Finding user ericksgsena436@gmail.com...");
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) {
        console.error("Error listing users:", error);
        return;
    }

    const user = users.users.find(u => u.email === 'ericksgsena436@gmail.com');
    if (!user) {
        console.log("User not found!");
        return;
    }

    console.log(`Found user ID: ${user.id}. Resetting password to 'Meta@2026'...`);

    const { data: updated, error: updErr } = await supabase.auth.admin.updateUserById(user.id, {
        password: 'Meta@2026'
    });

    if (updErr) {
        console.error("Error resetting password:", updErr);
    } else {
        console.log("Password reset successfully!");

        // Ensure profile is admin
        const { error: profErr } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);

        if (profErr) console.log("Warning: Profile update failed:", profErr.message);
        else console.log("Profile verified as ADMIN.");
    }
}

resetPassword();
