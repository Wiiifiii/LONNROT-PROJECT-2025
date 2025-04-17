/**
 *  GET /api/books/[id]/download?format=txt|pdf
 *
 *  • Logs a BookInteraction row (type DOWNLOAD)
 *  • Redirects to the real file URL (302) – keeps the file CDN‑fast
 */

import { PrismaClient, InteractionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const bookId = Number(params.id);
  if (Number.isNaN(bookId)) {
    return NextResponse.json({ error: "Invalid book id" }, { status: 400 });
  }

  /* -------- fetch book -------- */
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { file_url: true, pdf_url: true },
  });
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  /* -------- pick format -------- */
  const format = new URL(request.url).searchParams.get("format") ?? "txt";
  const rawUrl =
    format === "pdf" ? book.pdf_url : book.file_url;

  if (!rawUrl) {
    return NextResponse.json(
      { error: `No ${format.toUpperCase()} available for this book.` },
      { status: 404 }
    );
  }

  /* -------- log the interaction -------- */
  try {
    const sid = cookies().get("lo_sid")?.value ?? "anon";
    await prisma.bookInteraction.create({
      data: { bookId, sessionId: sid, type: InteractionType.DOWNLOAD },
    });
  } catch (err) {
    // Don’t block the download if logging fails
    console.error("BookInteraction logging failed:", err);
  }

  /* -------- redirect to the actual file -------- */
  // If you store files on Azure Blob, build a short‑lived SAS URL here:
  // const redirectUrl = await getSignedBlobUrl(rawUrl);
  const redirectUrl = rawUrl;

  return NextResponse.redirect(redirectUrl, 302);
}
