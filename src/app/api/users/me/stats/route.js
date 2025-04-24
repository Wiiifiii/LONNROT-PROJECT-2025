// src/app/api/users/me/stats/route.js
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // Fetch the session to verify the user's authentication status
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const userIdStr = userId.toString();
  const userIdNum = parseInt(userId, 10);

  // Fetch the stats: number of finished books and bookmarks
  let booksRead, bookmarks;
  try {
    booksRead = await prisma.bookInteraction.count({
      where: { sessionId: userIdStr, type: "READ_FINISH" },
    });
    bookmarks = await prisma.readingPosition.count({
      where: { userId: userIdNum },
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }

  // Compute a placeholder timeSaved (e.g., 0.5 hours per finished book)
  const timeSaved = booksRead * 0.5;

  // Return the stats
  return NextResponse.json({ booksRead, bookmarks, timeSaved });
}
