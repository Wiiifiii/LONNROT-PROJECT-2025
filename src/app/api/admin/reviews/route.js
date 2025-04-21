// src/app/api/admin/reviews/route.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Import NextAuth's getToken for session management

export async function GET(request) {
  // Fetch the token to verify the user's authentication status
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If there is no token or the user is not an admin, deny access
  if (!token || token.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Your data fetching logic goes here
  // For example, fetching reviews from the database
  return new Response(JSON.stringify({ reviews: [] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
