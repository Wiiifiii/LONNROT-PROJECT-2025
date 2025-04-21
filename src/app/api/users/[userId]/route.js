// src/app/api/users/[userId]/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Import NextAuth's getToken for session handling

const prisma = new PrismaClient();

export async function GET(request, context) {
  try {
    const params = await context.params;
    const userId = params.userId;
    const id = parseInt(userId, 10);

    // Fetch the token to verify the user's authentication status
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated or doesn't have the correct permissions, return an error
    if (!token || (token.user.id !== id && token.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Admins or the user themselves can view" }, { status: 403 });
    }

    // Fetch user details from the database
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[userId] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch user", details: error.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const userId = params.userId;
    const id = parseInt(userId, 10);

    // Fetch the token to verify the user's authentication status
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated or doesn't have admin role, return an error
    if (!token || (token.user.id !== id && token.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const body = await request.json();

    // Ensure the required fields are provided
    if (!body.username || !body.email) {
      return NextResponse.json({ success: false, error: "Username and email are required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: body.username,
        email: body.email,
        password_hash: body.password_hash || undefined,
        role: body.role || undefined
      }
    });

    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users/[userId] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update user", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const userId = params.userId;
    const id = parseInt(userId, 10);

    // Fetch the token to verify the user's authentication status
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated or doesn't have admin role, return an error
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    // Delete the user from the database
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/users/[userId] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete user", details: error.message }, { status: 500 });
  }
}
