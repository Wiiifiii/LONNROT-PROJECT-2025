// src/app/api/users/me/stats/route.js

import { NextResponse }             from "next/server";
import { getServerSession }         from "next-auth";
import authOptions                  from "../../auth/[...nextauth]/authOptions";
import { PrismaClient }             from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // 1) Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const userIdStr = session.user.id.toString();
  const userIdNum = parseInt(session.user.id, 10);

  // 2) Count finished reads (stub: using sessionId) and bookmarks
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
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }

  // 3) Compute a placeholder timeSaved (e.g. 0.5 hours per finished book)
  const timeSaved = booksRead * 0.5;

  // 4) Return them
  return NextResponse.json({ booksRead, bookmarks, timeSaved });
}
