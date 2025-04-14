// Summary: Handles API endpoints for GET and POST operations on reviews using Prisma ORM.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, username: true, email: true } },
        book: { select: { id: true, title: true } },
      },
    });
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.bookId || body.rating === undefined) {
      return NextResponse.json({ success: false, error: "bookId and rating are required" }, { status: 400 });
    }
    const newReview = await prisma.review.create({
      data: {
        bookId: body.bookId,
        userId: body.userId || null,
        rating: body.rating,
        comment: body.comment || "",
      },
    });
    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review", details: error.message },
      { status: 500 }
    );
  }
}
