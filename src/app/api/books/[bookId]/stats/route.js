// src/app/api/books/[bookId]/stats/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Reuse PrismaClient in dev
const prismaStats = global.prismaStats || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prismaStats = prismaStats;

export async function GET(request, context) {
  const { bookId } = context.params;
  const id = Number(bookId);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }

  // Auth check
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Read-only aggregation—no .create() here
  const rows = await prismaStats.bookInteraction.groupBy({
    by: ["type"],
    where: { bookId: id },
    _count: { _all: true },
  });

  const out = { DOWNLOAD: 0, READ_START: 0, READ_FINISH: 0 };
  rows.forEach(r => {
    if (Object.prototype.hasOwnProperty.call(out, r.type)) {
      out[r.type] = r._count._all;
    }
  });

  return NextResponse.json(out, {
    status: 200,
    headers: { "Cache-Control": "s-maxage=60" },
  });
}