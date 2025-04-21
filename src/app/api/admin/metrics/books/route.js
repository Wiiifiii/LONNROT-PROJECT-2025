// src/app/api/admin/metrics/books/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';  // Import NextAuth's getToken for session handling

export async function GET(request) {
  try {
    // Fetch the token to verify the user's authentication status
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated or is not an admin, return an error
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    await prisma.$connect();

    // Fetch the total count of books that are not deleted
    const totalBooks = await prisma.book.count({ where: { isDeleted: false } });

    return NextResponse.json({ totalBooks });
  } catch (err) {
    console.error('GET /api/admin/metrics/books error:', err);
    return NextResponse.json({ error: 'Failed to load book metrics' }, { status: 500 });
  }
}
