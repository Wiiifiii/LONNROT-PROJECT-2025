// Summary: Handles API endpoints for GET and POST operations on reading lists using Prisma ORM.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const lists = await prisma.readingList.findMany();
    return NextResponse.json({ success: true, data: lists }, { status: 200 });
  } catch (error) {
    console.error("GET /api/reading-lists error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reading lists" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.userId) {
      return NextResponse.json({ success: false, error: "Name and userId are required" }, { status: 400 });
    }
    const newList = await prisma.readingList.create({
      data: {
        name: body.name,
        userId: body.userId,
      },
    });
    return NextResponse.json({ success: true, data: newList }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reading-lists error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create reading list", details: error.message },
      { status: 500 }
    );
  }
}
