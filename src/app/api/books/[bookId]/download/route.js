// app/api/books/[bookId]/download/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { InteractionType } from '@/lib/constants';
import { fileSlug } from '@/lib/slugify.js';

const prisma = new PrismaClient();

export async function GET(request, context) {
  // 1) pull our dynamic param (must await here)
  const { bookId } = await context.params;
  const id = Number(bookId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid bookId' }, { status: 400 });
  }

  // 2) parse format
  const format = request.nextUrl.searchParams.get('format'); // "pdf" or "txt"
  if (!['pdf', 'txt'].includes(format)) {
    return NextResponse.json(
      { error: 'Only "pdf" or "txt" formats are supported' },
      { status: 400 }
    );
  }

  // 3) fetch just the URLs + file_name + title for disposition
  const book = await prisma.book.findUnique({
    where: { id },
    select: {
      pdf_url:   true,
      txt_url:   true,
      file_name: true,
      title:     true,
      author:   true
    }
  });
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  // 4) fire-and-forget logging
  getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    .then(token => {
      const sessionId = token
        ? `user_${token.id}`
        : request.cookies.get('lo_sid')?.value ?? 'anon';
      return prisma.bookInteraction.create({
        data: { bookId: id, sessionId, type: InteractionType.DOWNLOAD }
      });
    })
    .catch(console.error);

  // 5) choose URL
  const realUrl = format === 'pdf' ? book.pdf_url : book.txt_url;
  if (!realUrl) {
    return NextResponse.json(
      { error: `${format.toUpperCase()} not available` },
      { status: 404 }
    );
  }

  // 6) proxy-fetch & stream
  try {
    const upstream = await fetch(realUrl);
    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error(
        `Upstream fetch failed: ${upstream.status} ${upstream.statusText} – ${errText}`
      );
      return NextResponse.json(
        { error: `Upstream fetch failed: ${upstream.status}`, details: errText },
        { status: upstream.status }
      );
    }

    if (format === 'txt') {
      const text = await upstream.text();
      return new NextResponse(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${fileSlug(id, book.title, 'txt')}"`
        }
      });
    } else {
      const buffer = await upstream.arrayBuffer();
      return new NextResponse(Buffer.from(buffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${book.file_name || 'book'}.pdf"`
        }
      });
    }
  } catch (err) {
    console.error('Proxy fetch error:', err);
    return NextResponse.json(
      { error: `Failed to fetch ${format.toUpperCase()} file` },
      { status: 500 }
    );
  }
}
