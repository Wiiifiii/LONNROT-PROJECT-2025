import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/*  /api/books/[bookId]/stats
 *  counts { DOWNLOAD, READ_START, READ_FINISH }
 */
export async function GET(req, { params }) {
  /* params is a Promise in Next‑15 */
  const { bookId } = await params;
  const id = Number(bookId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }

  const rows = await prisma.bookInteraction.groupBy({
    by: ["type"],
    where: { bookId: id },
    _count: { _all: true },
  });

  /* shape into { DOWNLOAD: n, READ_START: n, READ_FINISH: n } */
  const out = { DOWNLOAD: 0, READ_START: 0, READ_FINISH: 0 };
  rows.forEach((r) => (out[r.type] = r._count._all));

  return NextResponse.json(out, {
    status: 200,
    headers: { "Cache-Control": "s-maxage=60" }, // 1‑minute CDN cache
  });
}
