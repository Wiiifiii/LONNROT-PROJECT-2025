import { createClient } from "@supabase/supabase-js"; // Import the createClient function from Supabase SDK

// Export a Supabase client instance using the URL and anonymous key from environment variables
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,   // Supabase project URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // Supabase anonymous API key
);
