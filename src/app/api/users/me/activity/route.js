// src/app/api/users/me/activity/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse }      from "next/server";
import { getServerSession }  from "next-auth/next";
import { authOptions }       from "@/lib/authOptions";
import { PrismaClient }      from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // 1) Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userIdNum = parseInt(session.user.id, 10);
  const userIdStr = session.user.id.toString();

  try {
    // 2) Fetch interactions (downloads, read starts, finishes)
    const interactions = await prisma.bookInteraction.findMany({
      where: { sessionId: userIdStr },
      select: {
        id:         true,
        type:       true,
        bookId:     true,
        createdAt:  true,
      },
    });

    // 3) Fetch reviews authored by this user
    const reviews = await prisma.review.findMany({
      where: { userId: userIdNum },
      select: {
        id:        true,
        bookId:    true,
        createdAt: true,
      },
    });

    // 4) Map both sets into a common shape
    const logs = [
      ...interactions.map((i) => ({
        id:        `i-${i.id}`,
        timestamp: i.createdAt,
        action:    i.type,       // DOWNLOAD, READ_START, READ_FINISH, etc.
        bookId:    i.bookId,
      })),
      ...reviews.map((r) => ({
        id:        `r-${r.id}`,
        timestamp: r.createdAt,
        action:    "REVIEW",
        bookId:    r.bookId,
      })),
    ]
    // 5) Sort descending by timestamp
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    // 6) Limit to 20 most recent
    .slice(0, 20);

    return NextResponse.json(logs);
  } catch (err) {
    console.error("Error fetching activity:", err);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
