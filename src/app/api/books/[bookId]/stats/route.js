// src/app/api/books/[bookId]/stats/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

/*  /api/books/[bookId]/stats
 *  counts { DOWNLOAD, READ_START, READ_FINISH }
 */
export async function GET(req, { params }) {
  const { bookId } = await params;
  const id = Number(bookId);

  // If the bookId is invalid, return a 400 error
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }

  // Fetch the session to verify the user's authentication status
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the interaction counts for the specified bookId
  const rows = await prisma.bookInteraction.groupBy({
    by: ["type"],
    where: { bookId: id },
    _count: { _all: true },
  });

  // Shape the data into { DOWNLOAD: n, READ_START: n, READ_FINISH: n }
  const out = { DOWNLOAD: 0, READ_START: 0, READ_FINISH: 0 };
  rows.forEach((r) => (out[r.type] = r._count._all));

  // Optionally, log the access or interaction in some way for analytics

  return NextResponse.json(out, {
    status: 200,
    headers: { "Cache-Control": "s-maxage=60" }, // 1‑minute CDN cache
  });
}
