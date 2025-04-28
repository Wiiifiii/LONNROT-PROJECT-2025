// scripts/fillSupabaseUrls.js
import 'dotenv/config'; // Load environment variables from the .env file
import { PrismaClient } from '@prisma/client'; // Import PrismaClient for database interactions
import { createClient } from '@supabase/supabase-js'; // Import createClient to interact with Supabase
import { fileSlug } from '../lib/slugify.js'; // Import fileSlug function to generate slugified filenames

const prisma = new PrismaClient(); // Initialize PrismaClient
const supabase = createClient(
  process.env.SUPABASE_URL,              // Supabase project URL from environment variables
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Supabase service role key from environment variables
);

async function main() {
  const all = await prisma.book.findMany(); // Retrieve all books from the database
  for (const b of all) { // Iterate over each book
    const pdfName = fileSlug(b.id, b.title, 'pdf'); // Generate a slugified filename for the PDF
    const txtName = fileSlug(b.id, b.title, 'txt'); // Generate a slugified filename for the TXT
    const { data: { publicUrl: pdf_url } } = supabase
      .storage
      .from('books-files-public') // Access the 'books-files-public' storage bucket
      .getPublicUrl(pdfName); // Get the public URL for the PDF file
    const { data: { publicUrl: txt_url } } = supabase
      .storage
      .from('books-files-public') // Access the 'books-files-public' storage bucket
      .getPublicUrl(txtName); // Get the public URL for the TXT file
    await prisma.book.update({ // Update the book record with the obtained public URLs
      where: { id: b.id },
      data: { pdf_url, txt_url }
    });
    console.log(`✅ Book ${b.id} updated`); // Log successful update for this book
  }
  await prisma.$disconnect(); // Disconnect PrismaClient after operations
}

main().catch(e => {
  console.error(e); // Log any errors that occur during execution
  prisma.$disconnect(); // Disconnect PrismaClient on error
  process.exit(1); // Exit the process with a failure code
});
