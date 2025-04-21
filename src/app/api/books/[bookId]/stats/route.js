// src/app/api/books/[bookId]/stats/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Import getToken to check if the user is authenticated

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

  // Fetch the token to verify the user's authentication status
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Optionally, you could check if the user is authenticated here
  if (!token) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
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

  return NextResponse.json(out, {
    status: 200,
    headers: { "Cache-Control": "s-maxage=60" }, // 1‑minute CDN cache
  });
}
