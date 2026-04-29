export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse }    from 'next/server';
import { PrismaClient }    from '@prisma/client';
import { getToken }        from 'next-auth/jwt';
import { InteractionType } from '@/lib/constants';
import { fileSlug }        from '@/lib/slugify.js';
import unzipper            from 'unzipper';
import { PDFDocument }     from 'pdf-lib';
import fontkit             from '@pdf-lib/fontkit';
import fs                  from 'fs';
import path                from 'path';

const prisma = new PrismaClient();

function paddedBookId(id) {
  return String(id).padStart(4, '0');
}

async function fetchBookRawTextFromZip({ id, zipUrl }) {
  const effectiveUrl = zipUrl || `http://www.lonnrot.net/kirjat/${paddedBookId(id)}.zip`;
  const res = await fetch(effectiveUrl, { cache: 'no-store' });
  if (!res.ok) {
    const preview = await res.text().catch(() => '');
    throw new Error(`Failed to fetch ZIP (HTTP ${res.status}). ${preview.slice(0, 200)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const directory = await unzipper.Open.buffer(buf);

  const txtFile = directory.files.find((f) => {
    const p = String(f.path || '').toLowerCase();
    return f.type === 'File' && p.endsWith('.txt') && !p.startsWith('__macosx/');
  });
  if (!txtFile) {
    const names = directory.files.map(f => f.path).slice(0, 20).join(', ');
    throw new Error(`ZIP did not contain a .txt file. Entries: ${names}`);
  }

  const txtBuf = await txtFile.buffer();
  const utf8 = txtBuf.toString('utf8');
  if (utf8.includes('�')) {
    return new TextDecoder('iso-8859-1').decode(txtBuf);
  }
  return utf8;
}

async function createPdfFromRawText(rawText) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // In Vercel/serverless the filesystem is read-only (except /tmp) but reading shipped files is fine.
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'LiberationSans-Regular.ttf');
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const margin = 50;
  const lineHeight = 14;
  const lines = String(rawText).split('\n');
  let page = pdfDoc.addPage();
  let { height } = page.getSize();
  let y = height - margin;
  let pageNumber = 1;

  function addPageNumber(p) {
    p.drawText(`Page ${pageNumber}`, {
      x: p.getSize().width - 80,
      y: 20,
      size: 10,
      font: customFont,
    });
  }

  for (const textLine of lines) {
    if (y < margin) {
      addPageNumber(page);
      pageNumber++;
      page = pdfDoc.addPage();
      ({ height } = page.getSize());
      y = height - margin;
    }
    page.drawText(textLine, {
      x: margin,
      y,
      size: 12,
      font: customFont,
    });
    y -= lineHeight;
  }

  addPageNumber(page);
  return pdfDoc.save();
}

export async function GET(request, context) {
  // ⬇️ await context.params, then grab bookId
  const { bookId } = await context.params;
  const id = Number(bookId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid bookId' }, { status: 400 });
  }

  const format = request.nextUrl.searchParams.get('format');
  if (!['pdf','txt'].includes(format)) {
    return NextResponse.json(
      { error: 'Only "pdf" or "txt" formats are supported' },
      { status: 400 }
    );
  }

  const book = await prisma.book.findUnique({
    where: { id },
    select: { pdf_url: true, txt_url: true, file_url: true, file_name: true, title: true },
  });
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  // Log the download
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const sessionId = token?.id?.toString() 
      ?? request.cookies.get('lo_sid')?.value 
      ?? 'anon';

    await prisma.bookInteraction.create({
      data: { bookId: id, sessionId, type: InteractionType.DOWNLOAD },
    });
  } catch (err) {
    console.error('Failed to log download:', err);
  }

  // Stream the file
  const realUrl = format === 'pdf' ? book.pdf_url : book.txt_url;

  try {
    // Preferred path: proxy from stored URL (Supabase/public).
    if (realUrl) {
      const upstream = await fetch(realUrl);
      if (!upstream.ok) {
        const text = await upstream.text().catch(() => '');
        console.error(`Upstream error ${upstream.status}:`, text);
        return NextResponse.json({ error: `Fetch failed: ${upstream.status}` }, { status: upstream.status });
      }

      if (format === 'txt') {
        const text = await upstream.text();
        return new NextResponse(text, {
          headers: {
            'Content-Type':        'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename="${fileSlug(id, book.title, 'txt')}"`,
          },
        });
      }

      const buf = Buffer.from(await upstream.arrayBuffer());
      return new NextResponse(buf, {
        headers: {
          'Content-Type':        'application/pdf',
          'Content-Disposition': `attachment; filename="${fileSlug(id, book.title, 'pdf')}"`,
        },
      });
    }

    // Fallback path: generate from the source ZIP (works even when txt_url/pdf_url are null).
    const rawText = await fetchBookRawTextFromZip({ id, zipUrl: book.file_url });
    if (format === 'txt') {
      return new NextResponse(rawText, {
        headers: {
          'Content-Type':        'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${fileSlug(id, book.title, 'txt')}"`,
        },
      });
    }

    const pdfBytes = await createPdfFromRawText(rawText);
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${fileSlug(id, book.title, 'pdf')}"`,
      },
    });
  } catch (err) {
    console.error('Proxy error:', err);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
