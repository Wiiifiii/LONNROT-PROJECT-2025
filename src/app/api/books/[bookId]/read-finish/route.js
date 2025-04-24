// src/app/api/books/[bookId]/read-finish/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { InteractionType } from "@/lib/constants"; // Import InteractionType constants

const prisma = new PrismaClient();

export async function POST(request, ctx) {
  const { bookId } = await ctx.params;
  const id = Number(bookId);

  // Fetch user session to verify authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const sessionId = `user_${userId}`;

  // Log the READ_FINISH interaction using the InteractionType constant
  await prisma.bookInteraction.create({
    data: {
      bookId: id,
      sessionId: sessionId,
      type: InteractionType.READ_FINISH, // Using InteractionType constant
    },
  });

  // Respond with a success message
  return NextResponse.json({ ok: true }, { status: 201 });
}
