// src/app/api/books/[bookId]/read-start/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { InteractionType } from "@/lib/constants"; // Import InteractionType constants

const prisma = new PrismaClient();

export async function POST(request, context) {
  const { bookId } = await context.params;
  const id = Number(bookId);

  // Fetch the session to verify the user's authentication status
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const sessionId = `user_${userId}`;

  // Log the READ_START interaction using the InteractionType constant
  await prisma.bookInteraction.create({
    data: {
      bookId: id,
      sessionId: sessionId,
      type: InteractionType.READ_START, // Use InteractionType constant
    },
  });

  // Respond with a success message
  return NextResponse.json({ ok: true }, { status: 201 });
}
