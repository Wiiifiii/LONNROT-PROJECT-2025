// src/app/api/books/[bookId]/read-start/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Import getToken for session handling
import { InteractionType } from "@/lib/constants"; // Import InteractionType constants

const prisma = new PrismaClient();

export async function POST(request, ctx) {
  const { bookId } = await ctx.params;
  const id = Number(bookId);

  // Fetch the token to verify the user's authentication status
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  // If not authenticated, fall back to the lo_sid cookie for anonymous session
  const sessionId = token ? `user_${token.id}` : request.cookies.get("lo_sid")?.value ?? "anon";

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
