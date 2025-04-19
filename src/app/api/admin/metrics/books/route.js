// src/app/api/admin/metrics/books/route.js
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const totalBooks = await prisma.book.count({ where: { isDeleted: false } })
    return NextResponse.json({ totalBooks })
  } catch (err) {
    console.error("GET /api/admin/metrics/books error:", err)
    return NextResponse.json({ error: "Failed to load book metrics" }, { status: 500 })
  }
}
