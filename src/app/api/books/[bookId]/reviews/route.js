// Summary: This API route handles POST requests to create a new review for a book. It verifies the user session, extracts the review data from the request body, creates a review using Prisma, and returns a JSON response.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { bookId } = params;
    const bookIdNum = parseInt(bookId, 10);
    const { rating, comment } = await request.json();
    if (!rating) {
      return NextResponse.json({ error: "Missing rating" }, { status: 400 });
    }
    const newReview = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        userId,
        bookId: bookIdNum,
      },
    });
    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    console.error("POST review error:", error);
    return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 });
  }
}
