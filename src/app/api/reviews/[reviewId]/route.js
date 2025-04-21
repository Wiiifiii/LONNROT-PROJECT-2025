// src/app/api/reviews/[reviewId]/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Import NextAuth's getToken for session management

const prisma = new PrismaClient();

export async function GET(request, context) {
  const { reviewId } = context.params;
  
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Check if the user is authenticated
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const review = await prisma.review.findUnique({
      where: { id: Number(reviewId) },
      include: {
        user: { select: { id: true, username: true, email: true } },
        book: { select: { id: true, title: true } },
      },
    });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error) {
    console.error("GET /api/reviews/[reviewId] error:", error);
    return NextResponse.json({ error: "Failed to fetch review" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const { reviewId } = context.params;
  const body = await request.json();

  // Check if the user is authenticated and is an admin
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const updatedReview = await prisma.review.update({
      where: { id: Number(reviewId) },
      data: {
        rating: body.rating,
        comment: body.comment || "",
      },
    });

    return NextResponse.json({ success: true, data: updatedReview }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/reviews/[reviewId] error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const { reviewId } = context.params;

  // Check if the user is authenticated and is an admin
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    await prisma.review.delete({
      where: { id: Number(reviewId) },
    });

    return NextResponse.json({ success: true, message: "Review deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/reviews/[reviewId] error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
