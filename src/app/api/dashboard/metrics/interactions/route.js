export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export async function GET() {
  try {
    await prisma.$connect();

    // totals (you can also add distinct here if you want to dedupe by userId/bookId)
    const totalReads = await prisma.bookInteraction.count({
      where: { type: 'READ_START' },
      // distinct: ['userId','bookId']
    });
    const totalDownloads = await prisma.bookInteraction.count({
      where: { type: 'DOWNLOAD' },
    });

    // last 10 days
    const today = new Date();
    const readsMap = {};
    const downloadsMap = {};

    // initialize counters for each day
    for (let i = 9; i >= 0; i--) {
      const day = subDays(today, i);
      const key = day.toISOString().slice(0, 10);
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);

      readsMap[key] = await prisma.bookInteraction.count({
        where: {
          type: 'READ_START',
          createdAt: { gte: dayStart, lte: dayEnd },
        },
      });

      downloadsMap[key] = await prisma.bookInteraction.count({
        where: {
          type: 'DOWNLOAD',
          createdAt: { gte: dayStart, lte: dayEnd },
        },
      });
    }

    const readsLast10Days = Object.entries(readsMap).map(([date, count]) => ({ date, count }));
    const downloadsLast10Days = Object.entries(downloadsMap).map(([date, count]) => ({ date, count }));

    return NextResponse.json({
      totalReads,
      totalDownloads,
      readsLast10Days,
      downloadsLast10Days,
    });
  } catch (err) {
    console.error('GET /api/dashboard/metrics/interactions error:', err);
    return NextResponse.json({ error: 'Failed to load interaction metrics' }, { status: 500 });
  }
}
