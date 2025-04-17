import { PrismaClient, InteractionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { bookId } = await params;                 // ✅ correct awaiting
  const id = Number(bookId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const fmt = new URL(req.url).searchParams.get("format") || "txt";
  const book = await prisma.book.findUnique({
    where: { id },
    select: { file_url: true, pdf_url: true },
  });
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const raw = fmt === "pdf" ? book.pdf_url : book.file_url;
  if (!raw)
    return NextResponse.json(
      { error: `No ${fmt.toUpperCase()} available` },
      { status: 404 },
    );

  /* log interaction BEFORE redirect */
  const sid =
    (await cookies()).get("lo_sid")?.value ?? "anon"; // ✅ await cookies
  await prisma.bookInteraction.create({
    data: { bookId: id, sessionId: sid, type: InteractionType.DOWNLOAD },
  });

  return NextResponse.redirect(raw, { status: 302 });
}
