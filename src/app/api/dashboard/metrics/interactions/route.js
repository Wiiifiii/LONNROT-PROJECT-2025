// src/app/api/dashboard/metrics/interactions/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export async function GET() {
  try {
    // ensure connection
    await prisma.$connect();

    // 1) Kick off totals in parallel
    const totalReadsPromise     = prisma.bookInteraction.count({ where: { type: 'READ_START' } });
    const totalDownloadsPromise = prisma.bookInteraction.count({ where: { type: 'DOWNLOAD'   } });

    // 2) Build the last-10-days array of Date objects
    const today = new Date();
    const days = Array.from({ length: 10 }, (_, i) => subDays(today, 9 - i));

    // 3) Kick off per-day counts in parallel
    const readCountsPromise = Promise.all(
      days.map(day =>
        prisma.bookInteraction.count({
          where: {
            type: 'READ_START',
            createdAt: { gte: startOfDay(day), lte: endOfDay(day) }
          }
        })
      )
    );
    const downloadCountsPromise = Promise.all(
      days.map(day =>
        prisma.bookInteraction.count({
          where: {
            type: 'DOWNLOAD',
            createdAt: { gte: startOfDay(day), lte: endOfDay(day) }
          }
        })
      )
    );

    // 4) Await everything
    const [ totalReads, totalDownloads, readCounts, downloadCounts ] = 
      await Promise.all([ totalReadsPromise, totalDownloadsPromise, readCountsPromise, downloadCountsPromise ]);

    // 5) Zip dates with counts
    const readsLast10Days     = days.map((day, idx) => ({
      date: day.toISOString().slice(0, 10),
      count: readCounts[idx]
    }));
    const downloadsLast10Days = days.map((day, idx) => ({
      date: day.toISOString().slice(0, 10),
      count: downloadCounts[idx]
    }));

    // 6) Return combined payload
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
