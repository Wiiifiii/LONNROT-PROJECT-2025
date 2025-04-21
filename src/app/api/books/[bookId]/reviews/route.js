// src/app/api/books/[bookId]/reviews/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Use NextAuth's getToken for session management
import { PrismaClient } from "@prisma/client";
import { InteractionType } from "@/lib/constants";  // Import the InteractionType constant

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    // Fetch the token to verify the user's authentication status
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated, return an error
    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;
    const { bookId } = params;
    const bookIdNum = parseInt(bookId, 10);
    const { rating, comment } = await request.json();

    // If the rating is missing, return an error
    if (rating === undefined) {
      return NextResponse.json({ error: "Missing rating" }, { status: 400 });
    }

    // Create a new review in the database
    const newReview = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        userId,
        bookId: bookIdNum,
      },
    });

    // Log the interaction (e.g., adding a review)
    await prisma.bookInteraction.create({
      data: {
        bookId: bookIdNum,
        sessionId: token.user.id,  // Use user ID for the session
        type: InteractionType.REVIEW,  // Use InteractionType constant
      },
    });

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    console.error("POST review error:", error);
    return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 });
  }
}
