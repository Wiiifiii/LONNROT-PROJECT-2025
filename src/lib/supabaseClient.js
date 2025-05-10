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

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
