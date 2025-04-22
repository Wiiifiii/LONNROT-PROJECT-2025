// scripts/importBooks.js
// Summary: This file fetches an HTML page to extract book information, processes the data,
// uploads files to Supabase storage, and upserts the data into the database using Prisma.

import 'dotenv/config';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { fileSlug } from "../lib/slugify.js";
import { processBook, createPdfFromRawText } from "./pdfHelpers.js";

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fetchBooks(url) {
  try {
    const response = await axios.get(url);
    return extractBooks(response.data);
  } catch (error) {
    console.error('Error fetching the HTML:', error);
    return [];
  }
}

function extractBooks(html) {
  const $ = cheerio.load(html);
  const bookData = [];
  const pattern = /(\d+)\.\s([^:]+):\s*<a href="(.*?)">(.*?)<\/a>/g;
  $('font').each((_, el) => {
    const content = $(el).html();
    if (!content) return;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      bookData.push({
        id: match[1],
        Kirjailija: match[2].trim(),
        kirjannimi: match[4].trim(),
        url: match[3].trim(),
      });
    }
  });
  return bookData;
}

function extractFileName(url) {
  if (!url) return null;
  const parts = url.split('/');
  return parts[parts.length - 1] || null;
}

async function getHighestBookId() {
  const highest = await prisma.book.findFirst({ orderBy: { id: 'desc' } });
  return highest?.id ?? 0;
}

async function upsertBooks(books) {
  let count = 0;
  for (const item of books) {
    const id = Number(item.id);
    const transformedBook = {
      id,
      title: item.kirjannimi,
      author: item.Kirjailija,
      file_name: extractFileName(item.url),
      file_url: item.url,
      txt_url: null,
      pdf_url: null,
      upload_date: new Date(),
      metadata: {},
    };

    // 1) Fetch & fix the raw text
    const { book: rawText } = await processBook(id);
    // 2) Generate PDF bytes
    const pdfBytes = await createPdfFromRawText(rawText);
    // 3) Create buffers for upload
    const txtBuffer = Buffer.from(rawText, "utf8");

    // 4) Upload TXT
    const txtName = fileSlug(id, transformedBook.title, "txt");
    await supabase.storage
      .from("books-files")
      .upload(txtName, txtBuffer, {
        contentType: "text/plain; charset=utf-8",
        upsert: true,
      });
    const { data: { publicUrl: txtUrl } } = supabase.storage
      .from("books-files")
      .getPublicUrl(txtName);
    transformedBook.txt_url = txtUrl;

    // 5) Upload PDF
    const pdfName = fileSlug(id, transformedBook.title, "pdf");
    await supabase.storage
      .from("books-files")
      .upload(pdfName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });
    const { data: { publicUrl: pdfUrl } } = supabase.storage
      .from("books-files")
      .getPublicUrl(pdfName);
    transformedBook.pdf_url = pdfUrl;

    // 6) Upsert into your Postgres
    await prisma.book.upsert({
      where: { id },
      update: transformedBook,
      create: transformedBook,
    });
    count++;
    console.log(`Imported book ${id}: ${transformedBook.title}`);
  }
  return count;
}

export async function main() {
  await prisma.$connect();
  const sourceUrl = 'http://www.lonnrot.net/valmiit.html';
  console.log(`Fetching books from ${sourceUrl}...`);
  const highestId = await getHighestBookId();
  console.log(`Current highest book ID in the database: ${highestId}`);
  const allBooks = await fetchBooks(sourceUrl);
  console.log(`Found ${allBooks.length} books on the source.`);

  const newBooks = allBooks.filter(b => Number(b.id) > highestId);
  console.log(`Processing ${newBooks.length} new books only.`);
  if (newBooks.length === 0) {
    console.log("No new books to import.");
    await prisma.$disconnect();
    return;
  }

  console.log('Upserting books into the database...');
  const importedCount = await upsertBooks(newBooks);
  console.log(`Import complete. New books added: ${importedCount}`);

  await prisma.$disconnect();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    prisma.$disconnect().then(() => process.exit(1));
  });
}
