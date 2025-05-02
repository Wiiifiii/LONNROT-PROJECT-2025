// src/app/api/dashboard/metrics/interactions/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays } from "date-fns";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$connect();

    // totals
    const [totalReads, totalDownloads] = await Promise.all([
      prisma.bookInteraction.count({ where: { type: 'READ_START' } }),
      prisma.bookInteraction.count({ where: { type: 'DOWNLOAD' } })
    ]);

    // aggregate last 10 days
    const since = subDays(new Date(), 9);
    const daily = await prisma.$queryRaw`
      SELECT
        DATE("createdAt") AS date,
        "type",
        COUNT(*) AS count
      FROM "BookInteraction"
      WHERE "createdAt" >= ${since}
      GROUP BY date, "type"
      ORDER BY date;
    `;

    // build day buckets
    const readsMap = {}, downloadsMap = {};
    for (let i = 9; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const key = day.toISOString().slice(0, 10);
      readsMap[key] = 0;
      downloadsMap[key] = 0;
    }

    daily.forEach(row => {
      const key = new Date(row.date).toISOString().slice(0, 10);
      if (row.type === 'READ_START') readsMap[key] = Number(row.count);
      if (row.type === 'DOWNLOAD')   downloadsMap[key] = Number(row.count);
    });

    const readsLast10Days = Object.entries(readsMap).map(([date, count]) => ({ date, count }));
    const downloadsLast10Days = Object.entries(downloadsMap).map(([date, count]) => ({ date, count }));

    return NextResponse.json({ totalReads, totalDownloads, readsLast10Days, downloadsLast10Days });
  } catch (err) {
    console.error('GET /api/dashboard/metrics/interactions error:', err);
    return NextResponse.json({ error: 'Failed to load interaction metrics' }, { status: 500 });
  }
}
