export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { InteractionType } from '@/lib/constants';
import { fileSlug } from '@/lib/slugify.js';

const prisma = new PrismaClient();

export async function GET(request, context) {
  // 1) pull our dynamic param
  const { bookId } = await context.params;
  const id = Number(bookId);
  const format = request.nextUrl.searchParams.get('format'); // "pdf" or "txt"

  if (!['pdf', 'txt'].includes(format)) {
    return NextResponse.json(
      { error: 'Only "pdf" or "txt" formats are supported' },
      { status: 400 }
    );
  }

  // 2) fetch stored Supabase URLs + file_name + title
  const book = await prisma.book.findUnique({
    where: { id },
    select: {
      pdf_url:   true,
      txt_url:   true,
      file_name: true,
      title:     true,
    }
  });
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  // 3) fire-and-forget logging of the download interaction
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

  // 4) choose the right URL
  const realUrl = format === 'pdf' ? book.pdf_url : book.txt_url;
  if (!realUrl) {
    return NextResponse.json(
      { error: `${format.toUpperCase()} not available` },
      { status: 404 }
    );
  }

  // 5) proxy-fetch it in Node and stream back
  try {
    const upstream = await fetch(realUrl);
    if (!upstream.ok) {
      const errorText = await upstream.text();
      console.error(`Upstream fetch failed: ${upstream.status} ${upstream.statusText} - ${errorText}`);
      return NextResponse.json(
        { error: `Upstream fetch failed: ${upstream.status} ${upstream.statusText}`, details: errorText },
        { status: upstream.status }
      );
    }

    if (format === 'txt') {
      const text = await upstream.text();
      return new NextResponse(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${fileSlug(id, book.title, 'txt')}"`,
        }
      });
    } else {
      const arrayBuffer = await upstream.arrayBuffer();
      return new NextResponse(Buffer.from(arrayBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${book.file_name || 'book'}.pdf"`,
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
