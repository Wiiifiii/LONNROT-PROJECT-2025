import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();


export async function GET(request, context) {
  const { bookId } = await context.params;
  const format = request.nextUrl.searchParams.get("format");

  // only support pdf|txt
  if (format !== "pdf" && format !== "txt") {
    return NextResponse.json({ error: "Only pdf or txt are supported" }, { status: 400 });
  }

  const book = await prisma.book.findUnique({
    where: { id: Number(bookId) },
    select: { file_url: true, pdf_url: true, file_name: true }
  });
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  // TXT proxy remains unchanged
  if (format === "txt") {
    if (!book.file_url) {
      return NextResponse.json({ error: "TXT not available" }, { status: 404 });
    }
    const upstream = await fetch(book.file_url);
    const text = await upstream.arrayBuffer();
    return new NextResponse(Buffer.from(text), {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // PDF branch
  if (book.pdf_url) {
    // proxy pre‑generated PDF
    const upstream = await fetch(book.pdf_url);
    const pdf = await upstream.arrayBuffer();
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: { "Content-Type": "application/pdf" },
    });
  }

  // === NO pdf_url: call your existing extract endpoint ===
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const extractRes = await fetch(`${base}/api/books/${bookId}/extract`);
  if (!extractRes.ok) {
    return NextResponse.json({ error: "Failed to extract text" }, { status: extractRes.status });
  }
  const extractJson = await extractRes.json();
  if (!extractJson.success) {
    return NextResponse.json({ error: extractJson.error }, { status: 500 });
  }

  // `extractJson.pdfBase64` is the base64‐encoded PDF you already create
  const pdfBytes = Buffer.from(extractJson.pdfBase64, "base64");
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      // Optional: force-download
      // "Content-Disposition": `attachment; filename="${book.file_name || bookId}.pdf"`,
    },
  });
}
