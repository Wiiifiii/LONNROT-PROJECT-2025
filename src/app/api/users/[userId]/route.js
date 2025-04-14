// Summary: Provides API endpoints for GET, PUT, and DELETE operations for a single user identified by userId using Prisma ORM.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, context) {
  try {
    const params = await context.params;
    const userId = params.userId;
    const id = parseInt(userId, 10);
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
    const body = await request.json();
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
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/users/[userId] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete user", details: error.message }, { status: 500 });
  }
}
