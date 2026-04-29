export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function toInt(value, fallback) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n : fallback;
}

function clampInt(n, { min, max }) {
  return Math.max(min, Math.min(max, n));
}

export async function GET(request) {
  try {
    await prisma.$connect();

    const url       = new URL(request.url);
    const sortParam = url.searchParams.get("sort")      || "";
    const page      = clampInt(toInt(url.searchParams.get("page"), 1), { min: 1, max: 1_000_000 });
    const limit     = clampInt(toInt(url.searchParams.get("limit"), 20), { min: 1, max: 200 });

    // 1) Top downloads (DOWNLOAD interactions)
    if (sortParam === "downloads_desc") {
      const group = await prisma.bookInteraction.groupBy({
        by: ["bookId"],
        where: { type: "DOWNLOAD" },
        _count: { bookId: true },
        orderBy: { _count: { bookId: "desc" } },
        take: limit,
      });
      const ids = group.map((r) => r.bookId);

      // Fresh DB: no download interactions yet. Fall back to a deterministic list.
      if (ids.length === 0) {
        const books = await prisma.book.findMany({
          where: { isDeleted: false },
          orderBy: { bookInteractions: { _count: "desc" } },
          take: limit,
          select: { id: true, title: true, author: true, cover_url: true },
        });
        return NextResponse.json({
          success: true,
          data: { books, total: books.length, page: 1, limit },
        });
      }

      const booksRaw = await prisma.book.findMany({
        where: { id: { in: ids }, isDeleted: false },
        select: { id: true, title: true, author: true, cover_url: true },
      });

      // Prisma doesn't preserve IN(...) ordering; re-order to match ranking.
      const byId = new Map(booksRaw.map((b) => [b.id, b]));
      const books = ids.map((id) => byId.get(id)).filter(Boolean);
      return NextResponse.json({
        success: true,
        data: { books, total: books.length, page: 1, limit },
      });
    }

    // 2) Trending (READ_START interactions)
    if (sortParam === "trending") {
      const group = await prisma.bookInteraction.groupBy({
        by: ["bookId"],
        where: { type: "READ_START" },
        _count: { bookId: true },
        orderBy: { _count: { bookId: "desc" } },
        take: limit,
      });
      const ids = group.map((r) => r.bookId);

      // Fresh DB: no reads logged yet. Fall back to a deterministic list.
      if (ids.length === 0) {
        const books = await prisma.book.findMany({
          where: { isDeleted: false },
          orderBy: { upload_date: "desc" },
          take: limit,
          select: { id: true, title: true, author: true, cover_url: true },
        });
        return NextResponse.json({
          success: true,
          data: { books, total: books.length, page: 1, limit },
        });
      }

      const booksRaw = await prisma.book.findMany({
        where: { id: { in: ids }, isDeleted: false },
        select: { id: true, title: true, author: true, cover_url: true },
      });
      const byId = new Map(booksRaw.map((b) => [b.id, b]));
      const books = ids.map((id) => byId.get(id)).filter(Boolean);
      return NextResponse.json({
        success: true,
        data: { books, total: books.length, page: 1, limit },
      });
    }

    // 3) Recently added (upload_date descending)
    if (sortParam === "upload_date_desc") {
      const books = await prisma.book.findMany({
        where: { isDeleted: false },
        orderBy: { upload_date: "desc" },
        take: limit,
        select: { id: true, title: true, author: true, cover_url: true },
      });
      return NextResponse.json({
        success: true,
        data: { books, total: books.length, page: 1, limit },
      });
    }

    // 4) Lönnrot’s works
    if (sortParam === "lonnrot") {
      const books = await prisma.book.findMany({
        where: {
          isDeleted: false,
          author: { contains: "Lönnrot", mode: "insensitive" },
        },
        orderBy: { upload_date: "desc" },
        take: limit,
        select: { id: true, title: true, author: true, cover_url: true },
      });
      return NextResponse.json({
        success: true,
        data: { books, total: books.length, page: 1, limit },
      });
    }

    // 5) Fallback: regular filtered & paginated search
    const searchQuery = url.searchParams.get("searchQuery") || "";
    const bookId      = url.searchParams.get("book")       || url.searchParams.get("bookId") || "";
    const author      = url.searchParams.get("author")     || "";
    const origId      = url.searchParams.get("origId")     || url.searchParams.get("originalId") || "";

    const where = { isDeleted: false };
    if (searchQuery) {
      where.OR = [
        { title:  { contains: searchQuery, mode: "insensitive" } },
        { author: { contains: searchQuery, mode: "insensitive" } },
      ];
    }
    if (bookId)  where.id     = Number(bookId);
    if (author)  where.author = author;
   // if (origId)  where.origId = origId;
   if (origId)  where.id     = Number(origId);

    const skip = (page - 1) * limit;
    const take = limit;
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy: { title: "asc" },
        skip,
        take,
        select: { id: true, title: true, author: true, cover_url: true },
      }),
      prisma.book.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: { books, total, page, limit },
    });
  } catch (err) {
    console.error("GET /api/books error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
