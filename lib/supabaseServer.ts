import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Client Supabase côté serveur (service role) pour éviter d'exposer les droits d'écriture au navigateur.
 * IMPORTANT: ne jamais utiliser SUPABASE_SERVICE_ROLE_KEY côté client.
 */
export const supabaseServer = createClient(url, serviceRole, {
  auth: { persistSession: false, autoRefreshToken: false },
});
