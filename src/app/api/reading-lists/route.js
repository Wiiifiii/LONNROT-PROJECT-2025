// src/app/api/reading-lists/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const lists = await prisma.readingList.findMany();
    return NextResponse.json({ success: true, data: lists }, { status: 200 });
  } catch (err) {
    console.error("GET /api/reading-lists error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch reading lists" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, userId } = await request.json();
    const parsed = parseInt(userId, 10);
    if (!name || isNaN(parsed)) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }
    const created = await prisma.readingList.create({
      data: { name, userId: parsed }
    });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/reading-lists error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
