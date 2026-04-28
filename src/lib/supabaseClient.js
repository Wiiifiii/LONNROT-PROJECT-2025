/**
 * supabaseClient.js
 *
 * Exports a Supabase client instance using the project URL and anonymous API key
 * provided in the environment variables. This client is used to interact with 
 * Supabase services.
 *
 * Dependencies: @supabase/supabase-js.
 */

import { createClient } from "@supabase/supabase-js";

// Lazily create the public Supabase client at call-time so that builds
// don't fail when NEXT_PUBLIC_SUPABASE_* env vars are missing.
export function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Backwards-compatible default export (may be null during build)
export const supabase = getPublicSupabase();
