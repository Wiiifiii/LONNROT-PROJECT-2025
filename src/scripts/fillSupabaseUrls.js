// scripts/fillSupabaseUrls.js

import 'dotenv/config';
import { PrismaClient }       from '@prisma/client';
import { createClient }       from '@supabase/supabase-js';
import { fileSlug }           from '../lib/slugify.js';

const prisma   = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const all = await prisma.book.findMany();
  for (const b of all) {
    const pdfName = fileSlug(b.id, b.title, 'pdf');
    const txtName = fileSlug(b.id, b.title, 'txt');

    const { data: { publicUrl: pdf_url } } = supabase
      .storage
      .from('books-files-public')
      .getPublicUrl(pdfName);

    const { data: { publicUrl: txt_url } } = supabase
      .storage
      .from('books-files-public')
      .getPublicUrl(txtName);

    await prisma.book.update({
      where: { id: b.id },
      data: { pdf_url, txt_url }
    });
    console.log(`✅ Book ${b.id} updated`);
  }
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
