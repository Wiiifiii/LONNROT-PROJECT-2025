// src/app/api/reviews/[reviewId]/route.js
// Summary: Provides GET, PUT, and DELETE operations on a single review by its ID using Prisma ORM.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(request, context) {
  const { params } = await context; // ✅ await params
  const reviewId = Number(params.reviewId);
  const cookieStore = await cookies(); // ✅ await cookies
  const sid = cookieStore.get("lo_sid")?.value ?? "anon";

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: { select: { id: true, username: true, email: true } },
        book: { select: { id: true, title: true } },
      },
    });
    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: review, sid }, { status: 200 });
  } catch (error) {
    console.error("GET /api/reviews/[reviewId] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { reviewId } = params;
    const id = parseInt(reviewId, 10);
    const body = await request.json();
    if (body.rating === undefined) {
      return NextResponse.json({ success: false, error: "Rating is required" }, { status: 400 });
    }
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: Number(body.rating),
        comment: body.comment || "",
      },
    });
    return NextResponse.json({ success: true, data: updatedReview }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/reviews/[reviewId] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update review", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { reviewId } = params;
    const id = parseInt(reviewId, 10);
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Review deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/reviews/[reviewId] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete review", details: error.message }, { status: 500 });
  }
}
