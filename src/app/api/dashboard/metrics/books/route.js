export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$connect();

    // total books (exclude deleted)
    const totalBooks = await prisma.book.count({ where: { isDeleted: false } });

    return NextResponse.json({ totalBooks });
  } catch (err) {
    console.error('GET /api/dashboard/metrics/books error:', err);
    return NextResponse.json({ error: 'Failed to load book metrics' }, { status: 500 });
  }
}
