// src/app/api/reviews/route.js
// Summary: Handles API endpoints for GET operations on reviews using Prisma ORM.

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
