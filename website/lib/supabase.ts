import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// When env vars are missing (e.g. before you've connected Supabase) we return
// null so the app still builds and runs, the waitlist form will report a
// friendly "not connected yet" message instead of crashing.
export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(url && anonKey);
