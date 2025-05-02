// src/app/api/books/[bookId]/read-start/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { InteractionType } from "@/lib/constants";
import { startOfDay } from "date-fns";

// Reuse PrismaClient in dev to avoid too many connections
const prismaReadStart = global.prismaReadStart || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prismaReadStart = prismaReadStart;

export async function POST(request, context) {
  const params = await context.params;
  const { bookId } = params;
  const id = Number(bookId);

  // Auth: ensure we have a user
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const sessionId = `user_${userId}`;

  // Guard: only one READ_START per book per session per day
  const today = startOfDay(new Date());
  const existing = await prismaReadStart.bookInteraction.findFirst({
    where: {
      bookId: id,
      sessionId,
      type: InteractionType.READ_START,
      createdAt: { gte: today }
    }
  });

  if (!existing) {
    await prismaReadStart.bookInteraction.create({
      data: { bookId: id, sessionId, type: InteractionType.READ_START }
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
