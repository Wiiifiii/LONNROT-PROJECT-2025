// scripts/importBooks.js
// Summary: Fetches book list from Lönnrot.net, processes each book’s text & PDF,
// uploads both to Supabase, and upserts the resulting URLs into Postgres via Prisma.

import 'dotenv/config';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { fileSlug } from '../lib/slugify.js';
import { processBook, createPdfFromRawText } from './pdfHelpers.js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Fetch the HTML from the source page
async function fetchBooks(sourceUrl) {
  try {
    const { data: html } = await axios.get(sourceUrl);
    return extractBooks(html);
  } catch (err) {
    console.error('❌ Error fetching book list:', err);
    return [];
  }
}

// 2. Parse out the list of books using Cheerio & regex
function extractBooks(html) {
  const $ = cheerio.load(html);
  const pattern = /(\d+)\.\s([^:]+):\s*<a href="(.*?)">(.*?)<\/a>/g;
  const books = [];

  $('font').each((_, el) => {
    const content = $(el).html();
    if (!content) return;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      books.push({
        id:       Number(match[1]),
        author:   match[2].trim(),
        title:    match[4].trim(),
        file_url: match[3].trim(),
      });
    }
  });

  return books;
}

// 3. Find the highest existing book ID so we only import new ones
async function getHighestBookId() {
  const last = await prisma.book.findFirst({ orderBy: { id: 'desc' } });
  return last?.id ?? 0;
}

// 4. Process & upload each new book
async function upsertBooks(booksToImport) {
  let imported = 0;

  for (const { id, title, author, file_url } of booksToImport) {
    console.log(`\n📦 Processing Book #${id}: "${title}" by ${author}`);

    // Build the base record
    const record = {
      id,
      title,
      author,
      file_name: extractFileName(file_url),
      file_url,
      txt_url: null,
      pdf_url: null,
      upload_date: new Date(),
      metadata: {}
    };

    try {
      // 4a. Fetch & normalize raw text
      const { book: rawText } = await processBook(id);
      const txtBuffer = Buffer.from(rawText, 'utf8');

      // 4b. Generate PDF bytes
      const pdfBytes = await createPdfFromRawText(rawText);

      // 4c. Upload TXT
      const txtKey = fileSlug(id, title, 'txt');
      const { error: txtErr } = await supabase
        .storage
        .from('books-files')
        .upload(txtKey, txtBuffer, {
          contentType: 'text/plain; charset=utf-8',
          upsert: true,
        });
      if (txtErr) {
        console.error(`❌ TXT upload failed for #${id}:`, txtErr);
      } else {
        const { data: { publicUrl: txtUrl } } = supabase
          .storage
          .from('books-files')
          .getPublicUrl(txtKey);
        record.txt_url = txtUrl;
        console.log(`   ✔️  TXT uploaded → ${txtUrl}`);
      }

      // 4d. Upload PDF
      const pdfKey = fileSlug(id, title, 'pdf');
      const { error: pdfErr } = await supabase
        .storage
        .from('books-files')
        .upload(pdfKey, pdfBytes, {
          contentType: 'application/pdf',
          upsert: true,
        });
      if (pdfErr) {
        console.error(`❌ PDF upload failed for #${id}:`, pdfErr);
      } else {
        const { data: { publicUrl: pdfUrl } } = supabase
          .storage
          .from('books-files')
          .getPublicUrl(pdfKey);
        record.pdf_url = pdfUrl;
        console.log(`   ✔️  PDF uploaded → ${pdfUrl}`);
      }

      // 4e. Upsert into Postgres
      await prisma.book.upsert({
        where:  { id },
        update: record,
        create: record,
      });
      console.log(`   🎉 Book #${id} upserted successfully`);
      imported++;

    } catch (err) {
      console.error(`❌ Failed to process Book #${id}:`, err);
    }
  }

  return imported;
}

// Helper to extract filename from a URL
function extractFileName(url) {
  const parts = url.split('/');
  return parts[parts.length - 1] || null;
}

// Main entrypoint
export async function main() {
  await prisma.$connect();

  const SOURCE_URL = 'http://www.lonnrot.net/valmiit.html';
  console.log(`🔍 Fetching book list from ${SOURCE_URL}`);
  const allBooks     = await fetchBooks(SOURCE_URL);
  const highestId    = await getHighestBookId();
  const newBooks     = allBooks.filter((b) => b.id > highestId);

  console.log(`Found ${allBooks.length} total books. ${newBooks.length} new.`);

  if (newBooks.length === 0) {
    console.log('✅ No new books to import.');
  } else {
    const count = await upsertBooks(newBooks);
    console.log(`\n🚀 Import complete: ${count} books added/updated.`);
  }

  await prisma.$disconnect();
}

// If run directly, execute main()
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error('💥 Import script failed:', e);
    prisma.$disconnect().then(() => process.exit(1));
  });
}
