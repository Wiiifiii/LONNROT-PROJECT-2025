export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subDays } from 'date-fns';

export async function GET() {
  try {
    await prisma.$connect();

    // totals
    const totalReads     = await prisma.bookInteraction.count({     where: { type: 'READ_START' } });
    const totalDownloads = await prisma.bookInteraction.count({ where: { type: 'DOWNLOAD'   } });

    // last 10 days
    const today = new Date();
    const readsMap = {};
    const downloadsMap = {};

    for (let i = 9; i >= 0; i--) {
      const day = subDays(today, i);
      const dayKey = day.toISOString().slice(0, 10);
      readsMap[dayKey] = 0;
      downloadsMap[dayKey] = 0;
    }

    const raw = await prisma.bookInteraction.groupBy({
      by: ['type', 'createdAt'],
      where: { createdAt: { gte: subDays(today, 9) } },
      _count: { createdAt: true },
    });

    raw.forEach(r => {
      const key = r.createdAt.toISOString().slice(0, 10);
      if (r.type === 'READ_START')     readsMap[key] = r._count.createdAt;
      if (r.type === 'DOWNLOAD')       downloadsMap[key] = r._count.createdAt;
    });

    const readsLast10Days = Object.entries(readsMap)
      .map(([date, count]) => ({ date, count }));
    const downloadsLast10Days = Object.entries(downloadsMap)
      .map(([date, count]) => ({ date, count }));

    return NextResponse.json({
      totalReads,
      totalDownloads,
      readsLast10Days,
      downloadsLast10Days
    });
  } catch (err) {
    console.error('GET /api/dashboard/metrics/interactions error:', err);
    return NextResponse.json({ error: 'Failed to load interaction metrics' }, { status: 500 });
  }
}
