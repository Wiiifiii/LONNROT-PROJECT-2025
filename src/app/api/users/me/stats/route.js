// src/app/api/users/me/stats/route.js
export const dynamic = 'force-dynamic';
export const runtime  = 'nodejs';

import { NextResponse }     from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions }      from "@/lib/authOptions";
import { PrismaClient }     from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userIdStr = session.user.id.toString();
  const userIdNum = parseInt(session.user.id, 10);

  // 1) Count distinct finished books
  const finishedGroups = await prisma.bookInteraction.groupBy({
    by: ["bookId"],
    where: {
      sessionId: userIdStr,
      type:      "READ_FINISH",
    },
  });
  const booksRead = finishedGroups.length;

  // 2) Count bookmarks
  const bookmarks = await prisma.readingPosition.count({
    where: { userId: userIdNum },
  });

  // 3) Compute time saved on *finished* books only
  const timeSaved = booksRead * 0.5; // 0.5 hrs per distinct book

  return NextResponse.json({ booksRead, bookmarks, timeSaved });
}
