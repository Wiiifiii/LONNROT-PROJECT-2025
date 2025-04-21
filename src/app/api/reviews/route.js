// src/app/api/reviews/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Import NextAuth's getToken to handle authentication

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Check if the user is authenticated
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch reviews from the database and return
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
