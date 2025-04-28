// scripts/cleanupAvatars.js
// Import environment variables from .env file
import 'dotenv/config';
// Import PrismaClient for database interactions
import { PrismaClient } from '@prisma/client';
// Import createClient to interact with Supabase storage
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient(); // Initialize Prisma Client for database operations
// Create a Supabase client instance using URL and service role key from environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  // 1) Delete all files in the "avatars" bucket
  // List all files in the 'avatars' bucket from Supabase storage
  const { data: files } = await supabase.storage.from('avatars').list();
  // Extract file names (paths) from the file list
  const paths = files.map(f => f.name);
  // If there are files, remove them; otherwise, log that there are none to delete
  if (paths.length) {
    await supabase.storage.from('avatars').remove(paths);
    console.log(`Deleted ${paths.length} avatar files.`);
  } else {
    console.log('No avatar files to delete.');
  }

  // 2) Null out every user's avatar_url in the database
  // Update all user records, setting avatar_url to null
  const res = await prisma.user.updateMany({ data: { avatar_url: null } });
  console.log(`Cleared avatar_url on ${res.count} users.`);
  await prisma.$disconnect(); // Disconnect Prisma Client
}

main().catch(e => {
  console.error(e); // Log any errors that occur
  prisma.$disconnect(); // Disconnect Prisma Client on error
  process.exit(1); // Exit the process with failure code
});
