// scripts/importBooks.js
// Summary: Fetches book list from Lönnrot.net, processes each book’s text & PDF,
// uploads both to Supabase, and upserts the resulting URLs into Postgres via Prisma.

import 'dotenv/config'  // Load environment variables from .env file
import * as cheerio from 'cheerio'  // Import Cheerio for HTML parsing
import axios from 'axios'  // Import Axios for HTTP requests
import { PrismaClient } from '@prisma/client'  // Import PrismaClient for database operations
import { createClient } from '@supabase/supabase-js'  // Import createClient for interacting with Supabase
import { fileSlug } from '../lib/slugify.js'  // Import fileSlug function to generate slugified filenames
import { processBook, createPdfFromRawText } from './pdfHelpers.js'  // Import helper functions for processing books

const prisma = new PrismaClient()  // Initialize PrismaClient
const supabase = createClient(
  process.env.SUPABASE_URL,  // Supabase project URL from environment variables
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Supabase service role key from environment variables
)

// 1. Fetch the HTML from the source page
async function fetchBooks(sourceUrl) {
  try {
    const { data: html } = await axios.get(sourceUrl)  // Fetch HTML content from the provided source URL
    return extractBooks(html)  // Parse and return the list of books from the HTML
  } catch (err) {
    console.error('❌ Error fetching book list:', err)  // Log error if fetching fails
    return []  // Return an empty array on error
  }
}

// 2. Parse out the list of books using Cheerio & regex
function extractBooks(html) {
  const $ = cheerio.load(html)  // Load the HTML content into Cheerio
  const pattern = /(\d+)\.\s([^:]+):\s*<a href="(.*?)">(.*?)<\/a>/g  // Regex pattern to match book entries
  const books = []  // Initialize array to hold book objects
  $('font').each((_, el) => {  // Iterate over each <font> tag in the HTML
    const content = $(el).html()  // Get the HTML content of the current element
    if (!content) return  // Skip if content is empty
    let match
    while ((match = pattern.exec(content)) !== null) {  // Use regex to extract book details
      books.push({
        id: Number(match[1]),  // Book ID as a number
        author: match[2].trim(),  // Author name, trimmed
        title: match[4].trim(),  // Book title, trimmed
        file_url: match[3].trim(),  // File URL, trimmed
      })
    }
  })
  return books  // Return the array of books extracted from the HTML
}

// 3. Find the highest existing book ID so we only import new ones
async function getHighestBookId() {
  const last = await prisma.book.findFirst({ orderBy: { id: 'desc' } })  // Retrieve the book with the highest ID
  return last?.id ?? 0  // Return the highest ID or 0 if no books exist
}

// 4. Process & upload each new book
async function upsertBooks(booksToImport) {
  let imported = 0  // Counter for number of books imported
  for (const { id, title, author, file_url } of booksToImport) {  // Iterate over each book to import
    console.log(`\n📦 Processing Book #${id}: "${title}" by ${author}`)  // Log details about the current book being processed
    const record = {  // Create a record object for upserting into the database
      id,
      title,
      author,
      file_name: extractFileName(file_url),  // Extract filename from the file URL
      file_url,
      txt_url: null,  // Initialize txt_url as null; will be updated later
      pdf_url: null,  // Initialize pdf_url as null; will be updated later
      upload_date: new Date(),  // Set current date as upload date
      metadata: {}  // Initialize metadata as an empty object
    }
    try {
      // 4a. Fetch & normalize raw text
      const rawText = await processBook(id)  // Process the book to obtain raw text
      if (typeof rawText !== 'string') {  // If the returned value is not a string
        console.error(`⚠️ processBook(${id}) did not return text, got:`, rawText)  // Log warning and continue to next book
        continue
      }
      const txtBuffer = Buffer.from(rawText, 'utf8')  // Convert raw text to a Buffer

      // 4b. Generate PDF bytes
      const pdfBytes = await createPdfFromRawText(rawText)  // Create a PDF from the raw text

      // 4c. Upload TXT
      const txtKey = fileSlug(id, title, 'txt')  // Generate a slugified filename for TXT file
      const { error: txtErr } = await supabase
        .storage
        .from('books-files-public')  // Access the 'books-files-public' storage bucket
        .upload(txtKey, txtBuffer, {
          contentType: 'text/plain; charset=utf-8',  // Set content type for TXT file
          upsert: true,  // Allow overwriting of existing file
        })
      if (txtErr) {  // If an error occurs during TXT upload
        console.error(`❌ TXT upload failed for #${id}:`, txtErr)  // Log the error
      } else {
        const { data: { publicUrl: txtUrl } } = await supabase
          .storage
          .from('books-files-public')
          .getPublicUrl(txtKey)  // Get the public URL for the uploaded TXT file
        record.txt_url = txtUrl  // Update record with TXT file URL
        console.log(`   ✔️ TXT uploaded → ${txtUrl}`)  // Log successful TXT upload
      }

      // 4d. Upload PDF
      const pdfKey = fileSlug(id, title, 'pdf')  // Generate a slugified filename for PDF file
      const { error: pdfErr } = await supabase
        .storage
        .from('books-files-public')  // Access the 'books-files-public' storage bucket
        .upload(pdfKey, pdfBytes, {
          contentType: 'application/pdf',  // Set content type for PDF file
          upsert: true,  // Allow overwriting of existing file
        })
      if (pdfErr) {  // If an error occurs during PDF upload
        console.error(`❌ PDF upload failed for #${id}:`, pdfErr)  // Log the error
      } else {
        const { data: { publicUrl: pdfUrl } } = await supabase
          .storage
          .from('books-files-public')
          .getPublicUrl(pdfKey)  // Get the public URL for the uploaded PDF file
        record.pdf_url = pdfUrl  // Update record with PDF file URL
        console.log(`   ✔️ PDF uploaded → ${pdfUrl}`)  // Log successful PDF upload
      }

      // 4e. Upsert into Postgres
      await prisma.book.upsert({
        where:  { id },  // Locate the book by ID
        update: record,  // Update record if book exists
        create: record,  // Create record if book does not exist
      })
      console.log(`   🎉 Book #${id} upserted successfully`)  // Log successful upsert
      imported++  // Increment counter for imported books

    } catch (err) {  // Catch any errors during processing
      console.error(`❌ Failed to process Book #${id}:`, err)  // Log failure for the current book
    }
  }
  return imported  // Return count of imported books
}

// Helper to extract filename from a URL
function extractFileName(url) {
  const parts = url.split('/')  // Split URL by '/'
  return parts[parts.length - 1] || null  // Return the last segment as the filename or null if empty
}

// Main entrypoint
export async function main() {
  await prisma.$connect()  // Connect to the database using Prisma
  const SOURCE_URL = 'http://www.lonnrot.net/valmiit.html'  // Define source URL for fetching books
  console.log(`🔍 Fetching book list from ${SOURCE_URL}`)  // Log the source URL being fetched
  const allBooks  = await fetchBooks(SOURCE_URL)  // Fetch all books from source page
  const highestId = await getHighestBookId()  // Retrieve highest existing book ID from database
  const newBooks  = allBooks.filter(b => b.id > highestId)  // Filter out books that are already imported
  console.log(`Found ${allBooks.length} total books. ${newBooks.length} new.`)  // Log counts of total and new books
  if (newBooks.length === 0) {  // If no new books, log and finish
    console.log('✅ No new books to import.')
  } else {
    const count = await upsertBooks(newBooks)  // Process and upsert new books
    console.log(`\n🚀 Import complete: ${count} books added/updated.`)  // Log import completion with count
  }
  await prisma.$disconnect()  // Disconnect PrismaClient after operations
}

// If run directly, execute main()
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => {
    console.error('💥 Import script failed:', e)  // Log error if main() fails
    prisma.$disconnect().then(() => process.exit(1))  // Disconnect PrismaClient and exit with failure code
  })
}
