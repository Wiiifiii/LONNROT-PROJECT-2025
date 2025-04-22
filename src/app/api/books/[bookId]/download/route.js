export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { InteractionType } from '@/lib/constants';

import { fileSlug } from "@/lib/slugify.js";

const prisma = new PrismaClient();

export async function GET(request, context) {
  // Await the params before extracting properties:
  const { bookId } = await Promise.resolve(context.params);
  const format = request.nextUrl.searchParams.get('format');

  // only support pdf & txt
  if (format !== 'pdf' && format !== 'txt') {
    return NextResponse.json(
      { error: 'Only pdf or txt are supported' },
      { status: 400 }
    );
  }

  // load book metadata
  const book = await prisma.book.findUnique({
    where: { id: Number(bookId) },
    select: { file_url: true, pdf_url: true, file_name: true, txt_url: true, title: true },
  });

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  // record download interaction
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const sessionId = token ? `user_${token.id}` : request.cookies.get('lo_sid')?.value ?? 'anon';
  
  try {
    await prisma.bookInteraction.create({
      data: {
        bookId: Number(bookId),
        sessionId,
        type: InteractionType.DOWNLOAD,
      },
    });
  } catch (error) {
    console.error("Failed to record interaction", error);
  }

  // ─── TXT → ZIP branch ───────────────────────────────────────────────────────
  if (format === "txt") {
    if (!book.txt_url) {
      return NextResponse.json({ error: "TXT not available" }, { status: 404 });
    }

    try {
      const upstream = await fetch(book.txt_url);
      const text = await upstream.text();

      // Return as plain text rather than zipped content
      return new NextResponse(text, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileSlug(book.id, book.title, "txt")}"`,
        },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch TXT file" }, { status: 500 });
    }
  }

  // ─── PDF branch (direct URL) ────────────────────────────────────────────────
  if (book.pdf_url) {
    try {
      const upstream = await fetch(book.pdf_url);
      if (!upstream.ok) {
        throw new Error(`Failed to fetch PDF file: ${upstream.statusText}`);
      }
      const pdfArray = await upstream.arrayBuffer();
      return new NextResponse(Buffer.from(pdfArray), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${book.file_name || 'book'}.pdf"`,
        },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch PDF file' }, { status: 500 });
    }
  }

  // ─── Fallback to extract PDF ────────────────────────────────────────────────
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const extractRes = await fetch(`${base}/api/books/${bookId}/extract`);
  if (!extractRes.ok) {
    return NextResponse.json({ error: 'Failed to extract text' }, { status: extractRes.status });
  }
  
  const extractJson = await extractRes.json();
  if (!extractJson.success) {
    return NextResponse.json({ error: extractJson.error }, { status: 500 });
  }
  
  const pdfBytes = Buffer.from(extractJson.pdfBase64, 'base64');
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${book.file_name || 'book'}.pdf"`,
    },
  });
}
