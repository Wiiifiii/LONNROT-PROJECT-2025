export const runtime = 'nodejs';

import { NextResponse }    from 'next/server';
import { PrismaClient }    from '@prisma/client';
import { getToken }        from 'next-auth/jwt';
import { InteractionType } from '@/lib/constants';

const prisma = new PrismaClient();

export async function POST(request, context) {
  // ⬇️ await context.params, then pull bookId
  const { bookId } = await context.params;
  const id = Number(bookId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid bookId' }, { status: 400 });
  }

  const { type } = await request.json();
  if (![InteractionType.READ_START, InteractionType.READ_FINISH].includes(type)) {
    return NextResponse.json({ error: 'Invalid interaction type' }, { status: 400 });
  }

  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const sessionId = token?.id?.toString() ?? 'anon';

    await prisma.bookInteraction.create({
      data: { bookId: id, sessionId, type },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to log read interaction:', err);
    return NextResponse.json({ error: 'Logging failed' }, { status: 500 });
  }
}
