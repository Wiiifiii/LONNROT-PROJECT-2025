// src/app/api/admin/metrics/interactions/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subDays } from 'date-fns';
import { getToken } from 'next-auth/jwt';  // Import NextAuth's getToken for session handling

export async function GET(request) {
  try {
    // Fetch the token to verify the user's authentication status
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated or not an admin, return an error
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    await prisma.$connect();

    // Totals
    const totalReads = await prisma.bookInteraction.count({ where: { type: 'READ_START' } });
    const totalDownloads = await prisma.bookInteraction.count({ where: { type: 'DOWNLOAD' } });

    // Last 10 days trends
    const today = new Date();
    const since = subDays(today, 9); // include today = 10 days

    const raw = await prisma.bookInteraction.groupBy({
      by: ['type', 'createdAt'],
      where: { createdAt: { gte: since } },
      _count: { createdAt: true }
    });

    // Initialize per-day buckets
    const readsMap = {}, downloadsMap = {};
    for (let i = 0; i < 10; i++) {
      const day = subDays(today, i).toISOString().slice(0, 10);
      readsMap[day] = 0;
      downloadsMap[day] = 0;
    }

    raw.forEach(r => {
      const day = r.createdAt.toISOString().slice(0, 10);
      if (r.type === 'READ_START') readsMap[day] = r._count.createdAt;
      if (r.type === 'DOWNLOAD') downloadsMap[day] = r._count.createdAt;
    });

    const readsLast10Days = Object.entries(readsMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    const downloadsLast10Days = Object.entries(downloadsMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    return NextResponse.json({
      totalReads,
      totalDownloads,
      readsLast10Days,
      downloadsLast10Days
    });
  } catch (err) {
    console.error('GET /api/admin/metrics/interactions error:', err);
    return NextResponse.json({ error: 'Failed to load interaction metrics' }, { status: 500 });
  }
}
