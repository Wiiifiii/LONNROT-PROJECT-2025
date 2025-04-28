// src/app/api/users/me/bookmark/route.js
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse }      from 'next/server';
import { getServerSession }  from 'next-auth/next';
import { authOptions }       from '@/lib/authOptions';
import { PrismaClient }      from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);
  const body   = await request.json();

  // Parse bookId & position to integers
  const bookId   = parseInt(body.bookId, 10);
  const position = parseInt(body.position, 10) || 0;

  if (Number.isNaN(bookId)) {
    return NextResponse.json({ error: 'Invalid bookId' }, { status: 400 });
  }

  try {
    await prisma.readingPosition.upsert({
      where: {
        userId_bookId: { userId, bookId }
      },
      create: {
        userId,
        bookId,
        position
      },
      update: {
        position
      }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Bookmark upsert failed:', err);
    return NextResponse.json({ error: 'Failed to bookmark' }, { status: 500 });
  }
}
