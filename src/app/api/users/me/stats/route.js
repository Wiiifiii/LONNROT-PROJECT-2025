// src/app/api/users/me/stats/route.js
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Import NextAuth's getToken for session handling
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  // Fetch the token to verify the user's authentication status
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, return an error
  if (!token?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userIdStr = token.user.id.toString();
  const userIdNum = parseInt(token.user.id, 10);

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
