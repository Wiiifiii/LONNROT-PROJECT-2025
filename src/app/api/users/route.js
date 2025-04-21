// src/app/api/users/route.js
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Import NextAuth's getToken for session management

const prisma = new PrismaClient();

export async function GET(request) {
  // Fetch the token to verify the user's authentication status
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, return an error
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Optionally, check if the user is an admin if you want to restrict this access
  if (token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  // Fetch all users from the database
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  // Fetch the token to verify the user's authentication status
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, return an error
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Optionally, check if the user is an admin if you want to restrict this access
  if (token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  // Parse the incoming request to create a new user
  try {
    const body = await request.json();
    if (!body.username || !body.email) {
      return NextResponse.json({ success: false, error: "Username and email are required" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password_hash: body.password_hash || null,
        role: body.role || "user",
      },
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
  }
}
