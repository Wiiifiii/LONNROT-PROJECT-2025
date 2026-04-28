/**
 * importBooks.js
 *
 * Fetches the book list from Lönnrot.net, processes each book’s text and PDF,
 * uploads both to Supabase, and upserts the resulting URLs into Postgres via Prisma.
 *
 * Dependencies: dotenv, cheerio, axios, PrismaClient from '@prisma/client',
 * @supabase/supabase-js, fileSlug from '../lib/slugify.js', and functions from './pdfHelpers.js'.
 */

import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { fileSlug } from '../lib/slugify.js'
import { processBook, createPdfFromRawText } from './pdfHelpers.js'
import { pathToFileURL } from 'url'

// Load env vars for local scripts.
// - `vercel env pull` creates `.env.local`
// - many dev setups use `.env`
for (const envFile of ['.env.local', '.env']) {
  const envPath = path.resolve(process.cwd(), envFile)
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
    break
  }
}

const prisma = new PrismaClient()
let supabase

function base64UrlDecodeToString(input) {
  const base64 = String(input).replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  return Buffer.from(padded, 'base64').toString('utf8')
}

function inferSupabaseProjectRefFromUrl(url) {
  try {
    const hostname = new URL(url).hostname
    // Typical: {ref}.supabase.co
    const first = hostname.split('.')[0]
    return first || null
  } catch {
    return null
  }
}

function inferSupabaseProjectRefFromServiceRoleKey(jwt) {
  try {
    const parts = String(jwt).split('.')
    if (parts.length < 2) return null
    const payload = JSON.parse(base64UrlDecodeToString(parts[1]))
    return payload?.ref || null
  } catch {
    return null
  }
}

function inferSupabaseProjectRefFromDatabaseUrl(databaseUrl) {
  const summary = getDatabaseUrlSummary(databaseUrl)
  if (!summary) return null

  // Direct connection host typically looks like: db.{ref}.supabase.co
  const hostMatch = summary.host.match(/^db\.([a-z0-9]+)\.supabase\.co$/i)
  if (hostMatch?.[1]) return hostMatch[1]

  // Pooler username typically looks like: postgres.{ref}
  if (summary.username?.startsWith('postgres.')) {
    return summary.username.slice('postgres.'.length)
  }

  return null
}

function hasPlaceholderPassword(databaseUrl) {
  return /\[(?:YOUR[-_ ]?PASSWORD)\]|<YOUR[-_ ]?PASSWORD>|YOUR[-_ ]?PASSWORD/i.test(String(databaseUrl))
}

function maskDatabaseUrl(databaseUrl) {
  try {
    const url = new URL(databaseUrl)
    const hasPassword = Boolean(url.password)
    if (hasPassword) url.password = '***'
    return url.toString()
  } catch {
    // Fallback: hide anything that looks like user:pass@
    return String(databaseUrl).replace(/:\/\/([^:]+):([^@]+)@/g, '://$1:***@')
  }
}

function getDatabaseUrlSummary(databaseUrl) {
  try {
    const url = new URL(databaseUrl)
    return {
      protocol: url.protocol,
      host: url.hostname,
      port: url.port || '(default)',
      database: url.pathname?.replace(/^\//, '') || '(unknown)',
      username: url.username || '(unknown)',
      hasPassword: Boolean(url.password)
    }
  } catch {
    return null
  }
}

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing env var ${name}.\n` +
      `Create a .env file in the repo root (copy from .env.example) or set it in your shell.\n` +
      `Do NOT paste secrets into chat.`
    )
  }
  return value
}

function initClients() {
  // Prisma needs DATABASE_URL (and DIRECT_URL for migrations; not required here)
  const databaseUrl = requireEnv('DATABASE_URL')
  if (hasPlaceholderPassword(databaseUrl)) {
    throw new Error(
      'DATABASE_URL still contains a placeholder password (e.g. "[YOUR-PASSWORD]").\n' +
      'Fix: Supabase Dashboard → Settings → Database → Reset database password, then copy/paste the connection string into .env.local.\n' +
      'Tip: For Prisma migrations, use the Direct connection string (host like db.<ref>.supabase.co:5432) in DIRECT_URL.'
    )
  }

  const summary = getDatabaseUrlSummary(databaseUrl)
  if (summary) {
    console.log(
      `🗄️  DB target: ${summary.username}@${summary.host}:${summary.port}/${summary.database} (password: ${summary.hasPassword ? 'set' : 'missing'})`
    )
  } else {
    console.log(`🗄️  DB target: ${maskDatabaseUrl(databaseUrl)}`)
  }

  // Supabase admin client for uploads
  const supabaseUrl = requireEnv('SUPABASE_URL')
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

  // Helpful diagnostics if envs are mixed between different Supabase projects
  const dbRef = inferSupabaseProjectRefFromDatabaseUrl(databaseUrl)
  const urlRef = inferSupabaseProjectRefFromUrl(supabaseUrl)
  const keyRef = inferSupabaseProjectRefFromServiceRoleKey(serviceKey)

  if (dbRef && urlRef && dbRef !== urlRef) {
    throw new Error(
      `Supabase mismatch: DATABASE_URL looks like project "${dbRef}" but SUPABASE_URL looks like "${urlRef}".\n` +
      `Fix: ensure DATABASE_URL/DIRECT_URL, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY are all from the same Supabase project.`
    )
  }
  if (keyRef && urlRef && keyRef !== urlRef) {
    throw new Error(
      `Supabase mismatch: SUPABASE_SERVICE_ROLE_KEY is for "${keyRef}" but SUPABASE_URL looks like "${urlRef}".\n` +
      `Fix: Supabase Dashboard → Settings → API → copy the "service_role" key for project "${urlRef}" and update SUPABASE_SERVICE_ROLE_KEY in .env.local.`
    )
  }

  supabase = createClient(supabaseUrl, serviceKey)
}

async function fetchBooks(sourceUrl) {
  try {
    const response = await axios.get(sourceUrl, {
      timeout: 30000,
      headers: {
        // Some hosts block requests without a UA
        'User-Agent': 'LonnrotLibraryImporter/1.0 (+https://github.com/Wiiifiii/LONNROT-PROJECT-2025)'
      },
      // If the host serves redirects, follow them
      maxRedirects: 10,
      validateStatus: () => true
    })

    if (response.status < 200 || response.status >= 300) {
      console.error(`❌ Error fetching book list: HTTP ${response.status}`)
      console.error('URL:', sourceUrl)
      return []
    }

    const html = response.data
    if (typeof html !== 'string' || html.length < 50) {
      console.error('❌ Error fetching book list: response did not look like HTML')
      console.error('URL:', sourceUrl)
      console.error('content-type:', response.headers?.['content-type'])
      console.error('preview:', String(html).slice(0, 300))
      return []
    }

    const books = extractBooks(html, sourceUrl)
    if (books.length === 0) {
      console.warn('⚠️ No books parsed from the source HTML. The page structure may have changed.')
      console.warn('URL:', sourceUrl)
      console.warn('HTML preview:', html.slice(0, 500))
    }
    return books
  } catch (err) {
    console.error('❌ Error fetching book list:', err?.message || err)
    console.error('URL:', sourceUrl)
    return []
  }
}

function extractBooks(html, baseUrl) {
  // The site used to wrap the list in <font> tags, but the current page layout
  // includes the same textual pattern without <font>. Run the regex on the full HTML.
  const pattern = /\*{0,2}(\d{1,5})\.\s*([^:<]+?):\s*<a[^>]*href="([^"]+)"[^>]*>([^<]+?)<\/a>/g
  const books = []
  let match
  while ((match = pattern.exec(html)) !== null) {
    const id = Number(match[1])
    const author = String(match[2] || '').trim()
    const title = String(match[4] || '').trim().replace(/\*\*$/g, '')
    let file_url = String(match[3] || '').trim()
    try {
      file_url = new URL(file_url, baseUrl || 'http://www.lonnrot.net/').toString()
    } catch {
      // leave as-is; will fail later with a clear error
    }
    if (!Number.isFinite(id) || !author || !title || !file_url) continue
    books.push({ id, author, title, file_url })
  }
  return books
}

async function getHighestBookId() {
  const last = await prisma.book.findFirst({ orderBy: { id: 'desc' } })
  return last?.id ?? 0
}

async function upsertBooks(booksToImport) {
  let imported = 0
  for (const { id, title, author, file_url } of booksToImport) {
    console.log(`\n📦 Processing Book #${id}: "${title}" by ${author}`)
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
    }
    try {
      const rawText = await processBook(id, file_url)
      if (typeof rawText !== 'string') {
        console.error(`⚠️ processBook(${id}) did not return text, got:`, rawText)
        continue
      }
      const txtBuffer = Buffer.from(rawText, 'utf8')
      const pdfBytes = await createPdfFromRawText(rawText)

      const txtKey = fileSlug(id, title, 'txt')
      const { error: txtErr } = await supabase
        .storage
        .from('books-files-public')
        .upload(txtKey, txtBuffer, {
          contentType: 'text/plain; charset=utf-8',
          upsert: true
        })
      if (txtErr) {
        console.error(`❌ TXT upload failed for #${id}:`, txtErr)
      } else {
        const { data: { publicUrl: txtUrl } } = await supabase
          .storage
          .from('books-files-public')
          .getPublicUrl(txtKey)
        record.txt_url = txtUrl
        console.log(`   ✔️ TXT uploaded → ${txtUrl}`)
      }

      const pdfKey = fileSlug(id, title, 'pdf')
      const { error: pdfErr } = await supabase
        .storage
        .from('books-files-public')
        .upload(pdfKey, pdfBytes, {
          contentType: 'application/pdf',
          upsert: true
        })
      if (pdfErr) {
        console.error(`❌ PDF upload failed for #${id}:`, pdfErr)
      } else {
        const { data: { publicUrl: pdfUrl } } = await supabase
          .storage
          .from('books-files-public')
          .getPublicUrl(pdfKey)
        record.pdf_url = pdfUrl
        console.log(`   ✔️ PDF uploaded → ${pdfUrl}`)
      }

      await prisma.book.upsert({
        where: { id },
        update: record,
        create: record
      })
      console.log(`   🎉 Book #${id} upserted successfully`)
      imported++
    } catch (err) {
      console.error(`❌ Failed to process Book #${id}:`, err)
    }
  }
  return imported
}

function extractFileName(url) {
  const parts = url.split('/')
  return parts[parts.length - 1] || null
}

export async function main() {
  initClients()
  await prisma.$connect()
  const SOURCE_URL =
    process.env.BOOK_SOURCE_URL ||
    process.argv.find(a => a.startsWith('--sourceUrl='))?.split('=')[1] ||
    'http://www.lonnrot.net/valmiit.html'

  const limitArg =
    process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] ||
    process.env.IMPORT_LIMIT
  const parsedLimit = limitArg ? Number(limitArg) : null
  const importLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null

  console.log(`🔍 Fetching book list from ${SOURCE_URL}`)
  const allBooks  = await fetchBooks(SOURCE_URL)
  const highestId = await getHighestBookId()

  let newBooks  = allBooks.filter(b => b.id > highestId)
  // The page is ordered newest → oldest. If this is a fresh DB, default to a safe limit
  // to avoid an accidental import of thousands of books.
  const effectiveLimit = importLimit ?? (highestId === 0 ? 50 : null)
  if (effectiveLimit && newBooks.length > effectiveLimit) {
    newBooks = newBooks.slice(0, effectiveLimit)
    console.log(`ℹ️ Limiting import to newest ${effectiveLimit} books (use --limit=... or set IMPORT_LIMIT, or remove limit by setting a high value).`)
  }

  console.log(`Found ${allBooks.length} total books. ${newBooks.length} to import.`)
  if (newBooks.length === 0) {
    console.log('✅ No new books to import.')
  } else {
    const count = await upsertBooks(newBooks)
    console.log(`\n🚀 Import complete: ${count} books added/updated.`)
  }
  await prisma.$disconnect()
}

// Run when executed directly (works on Windows too)
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(e => {
    console.error('💥 Import script failed:', e)
    prisma.$disconnect().then(() => process.exit(1))
  })
}
