/**
 * cleanupAvatars.js
 *
 * Deletes all files from the "avatars" bucket in Supabase storage and clears the avatar_url for all users in the database.
 * Loads environment variables, initializes PrismaClient and Supabase client for storage operations, 
 * and then performs the cleanup operations.
 *
 * Dependencies: dotenv, PrismaClient from '@prisma/client', and createClient from '@supabase/supabase-js'.
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: files } = await supabase.storage.from('avatars').list();
  const paths = files.map(f => f.name);
  if (paths.length) {
    await supabase.storage.from('avatars').remove(paths);
    console.log(`Deleted ${paths.length} avatar files.`);
  } else {
    console.log('No avatar files to delete.');
  }

  const res = await prisma.user.updateMany({ data: { avatar_url: null } });
  console.log(`Cleared avatar_url on ${res.count} users.`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
