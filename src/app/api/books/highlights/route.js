export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET() {
  try {
    await prisma.$connect();
    const weekAgo = subDays(new Date(), 7);

    // Fetch all four lists in parallel:
    const [
      mostDownloaded,
      recentlyAdded,
      trendingGroup,
      lonnrotWorks
    ] = await Promise.all([
      // 1) Most Downloaded (by total DOWNLOAD interactions)
      prisma.book.findMany({
        where: { isDeleted: false },
        orderBy: { bookInteractions: { _count: "desc" } },
        take: 81,
        select: { id: true, title: true, author: true, cover_url: true },
      }),
      // 2) Recently Added (by upload_date)
      prisma.book.findMany({
        where: { isDeleted: false },
        orderBy: { upload_date: "desc" },
        take: 81,
        select: { id: true, title: true, author: true, cover_url: true },
      }),
      // 3) Trending This Week (interactions in last 7 days)
      prisma.bookInteraction.groupBy({
        by: ["bookId"],
        where: { createdAt: { gte: weekAgo } },
        _count: { bookId: true },
        orderBy: { _count: { bookId: "desc" } },
        take: 81,
      }),
      // 4) Elias Lönnrot’s Works
      prisma.book.findMany({
        where: {
          isDeleted: false,
          author: { contains: "Lönnrot", mode: "insensitive" },
        },
        orderBy: { upload_date: "desc" },
        take: 81,
        select: { id: true, title: true, author: true, cover_url: true },
      }),
    ]);

    // Resolve the actual Book records for trending
    const trendingIds = trendingGroup.map((r) => r.bookId);
    const trending = trendingIds.length
      ? await prisma.book.findMany({
          where: { id: { in: trendingIds } },
          select: { id: true, title: true, author: true, cover_url: true },
        })
      : [];

    return NextResponse.json({
      mostDownloaded,
      recentlyAdded,
      trending,
      lonnrot: lonnrotWorks,
    });
  } catch (error) {
    console.error("GET /api/books/highlights error:", error);
    return NextResponse.json({ error: "Failed to load highlights" }, { status: 500 });
  }
}
