import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { InteractionType } from "@/lib/constants";
import archiver from "archiver"; // Import archiver to create ZIP files


const prisma = new PrismaClient();

export async function GET(request, context) {
  const { bookId } = await context.params;
  const format = request.nextUrl.searchParams.get("format");

  // Only support pdf and txt formats
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

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const sessionId = token ? `user_${token.id}` : request.cookies.get("lo_sid")?.value ?? "anon";

  await prisma.bookInteraction.create({
    data: { bookId: Number(bookId), sessionId, type: InteractionType.DOWNLOAD },
  });

  // Handle TXT format
  if (format === "txt") {
    if (!book.file_url) {
      return NextResponse.json({ error: "TXT not available" }, { status: 404 });
    }

    // Download the TXT file
    const upstream = await fetch(book.file_url);
    const text = await upstream.text(); // Read as text

    // Create a zip file
    const zipStream = archiver("zip", { zlib: { level: 9 } }); // Create a ZIP stream
    zipStream.append(text, { name: `${book.file_name || 'book'}.txt` });

    // Return the ZIP file as a response
    return new NextResponse(zipStream, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${book.file_name || 'book'}.zip`,
      },
    });
  }

  // Handle PDF format (unchanged)
  if (book.pdf_url) {
    const upstream = await fetch(book.pdf_url);
    const pdf = await upstream.arrayBuffer();
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: { "Content-Type": "application/pdf" },
    });
  }

  // Additional logic for PDF extraction remains unchanged
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const extractRes = await fetch(`${base}/api/books/${bookId}/extract`);
  if (!extractRes.ok) {
    return NextResponse.json({ error: "Failed to extract text" }, { status: extractRes.status });
  }
  const extractJson = await extractRes.json();
  if (!extractJson.success) {
    return NextResponse.json({ error: extractJson.error }, { status: 500 });
  }

  const pdfBytes = Buffer.from(extractJson.pdfBase64, "base64");
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
