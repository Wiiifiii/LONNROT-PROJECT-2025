// Summary: Handles API endpoints for GET and POST operations on users using Prisma ORM.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
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
