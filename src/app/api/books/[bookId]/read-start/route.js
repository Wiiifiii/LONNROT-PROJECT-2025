// src/app/api/books/[bookId]/read-start/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { InteractionType } from "@/lib/constants";
import { startOfDay } from "date-fns";

const prisma = new PrismaClient();

export async function POST(request, context) {
  const { bookId } = await context.params;
  const id = Number(bookId);

  // Verify user's authentication status
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const sessionId = `user_${userId}`;

  // DUPLICATE GUARD: only one READ_START per book per day per sessionId
  const today = new Date();
  const dayZero = startOfDay(today);
  const existing = await prisma.bookInteraction.findFirst({
    where: {
      bookId: id,
      sessionId,
      type: InteractionType.READ_START,
      createdAt: { gte: dayZero }
    }
  });

  if (!existing) {
    await prisma.bookInteraction.create({
      data: {
        bookId: id,
        sessionId,
        type: InteractionType.READ_START,
      },
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}