export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse }    from 'next/server';
import { PrismaClient }    from '@prisma/client';
import { getToken }        from 'next-auth/jwt';
import { InteractionType } from '@/lib/constants';
import { fileSlug }        from '@/lib/slugify.js';

const prisma = new PrismaClient();

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
    select: { pdf_url: true, txt_url: true, file_name: true, title: true },
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
  if (!realUrl) {
    return NextResponse.json(
      { error: `${format.toUpperCase()} not available` },
      { status: 404 }
    );
  }

  try {
    const upstream = await fetch(realUrl);
    if (!upstream.ok) {
      const text = await upstream.text();
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
    } else {
      const buf = Buffer.from(await upstream.arrayBuffer());
      return new NextResponse(buf, {
        headers: {
          'Content-Type':        'application/pdf',
          'Content-Disposition': `attachment; filename="${book.file_name || 'book'}.pdf"`,
        },
      });
    }
  } catch (err) {
    console.error('Proxy error:', err);
    return NextResponse.json({ error: 'Proxy fetch failed' }, { status: 500 });
  }
}
