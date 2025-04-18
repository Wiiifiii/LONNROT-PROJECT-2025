// Summary: Handles API endpoints for GET and POST operations on reading lists using Prisma ORM.

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
    const body = await request.json()
    const { name, userId } = body
    // Convert userId to an integer
    const parsedUserId = parseInt(userId, 10)
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ success: false, error: "Invalid userId" }, { status: 400 })
    }
    const list = await prisma.readingList.create({
      data: {
        name,
        userId: parsedUserId,
      },
    })
    return NextResponse.json({ success: true, data: list }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
