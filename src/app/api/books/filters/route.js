export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$connect();

    // 1) All books (id + title), sorted alphabetically
    const books = await prisma.book.findMany({
      where: { isDeleted: false },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    // 2) Distinct authors, sorted
    const authorsRaw = await prisma.book.findMany({
      where: { isDeleted: false },
      distinct: ["author"],
      select: { author: true },
      orderBy: { author: "asc" },
    });
    const authors = authorsRaw.map((a) => a.author);

    // 3) “Original book” IDs: here we'll just return all book IDs,
    //    since there's no separate originalId field.
    const originalIds = books.map((b) => b.id);

    return NextResponse.json({ books, authors, originalIds });
  } catch (error) {
    console.error("Failed to load filters:", error);
    return NextResponse.error();
  }
}
