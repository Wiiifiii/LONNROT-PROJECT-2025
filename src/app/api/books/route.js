// src/app/api/books/route.js
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { subDays } from "date-fns"

export async function GET(request) {
  try {
    const url         = new URL(request.url)
    const searchQuery = url.searchParams.get("searchQuery") || ""
    const bookId      = url.searchParams.get("book")       || ""
    const author      = url.searchParams.get("author")     || ""
    const origId      = url.searchParams.get("origId")     || ""
    const sortParam   = url.searchParams.get("sort")       || ""
    const page        = parseInt(url.searchParams.get("page")  || "1", 10)
    const limit       = parseInt(url.searchParams.get("limit") || "20", 10)

    // If they asked for trending, do that special logic:
    if (sortParam === "trending") {
      const weekAgo = subDays(new Date(), 7)
      const group = await prisma.bookInteraction.groupBy({
        by: ["bookId"],
        where: { createdAt: { gte: weekAgo } },
        _count: { bookId: true },
        orderBy: { _count: { bookId: "desc" } },
        take: limit,
      })
      const ids = group.map(r => r.bookId)
      const books = await prisma.book.findMany({
        where: { id: { in: ids }, isDeleted: false },
        select: { id: true, title: true, author: true, cover_url: true },
      })
      return NextResponse.json({
        success: true,
        data: { books, total: books.length, page: 1, limit },
      })
    }

    // If they asked for Lönnrot’s works:
    if (sortParam === "lonnrot") {
      const books = await prisma.book.findMany({
        where: {
          isDeleted: false,
          author: { contains: "Lönnrot", mode: "insensitive" },
        },
        orderBy: { upload_date: "desc" },
        take: limit,
        select: { id: true, title: true, author: true, cover_url: true },
      })
      return NextResponse.json({
        success: true,
        data: { books, total: books.length, page: 1, limit },
      })
    }

    // Build filters for default search
    const where = { isDeleted: false }
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { author: { contains: searchQuery, mode: "insensitive" } },
      ]
    }
    if (bookId)   where.id     = Number(bookId)
    if (author)   where.author = author
    if (origId)   where.origId = origId

    // Determine ordering based on sortParam
    let orderBy
    switch (sortParam) {
      case "downloads_desc":
        orderBy = { bookInteractions: { _count: "desc" } }
        break
      case "upload_date_desc":
        orderBy = { upload_date: "desc" }
        break
      default:
        orderBy = { title: "asc" }
    }

    // Pagination
    const skip = (page - 1) * limit
    const take = limit

    // Fetch count + page of books
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          title: true,
          author: true,
          cover_url: true,
        },
      }),
      prisma.book.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: { books, total, page, limit },
    })
  } catch (err) {
    console.error("GET /api/books error:", err)
    return NextResponse.json(
      { success: false, error: "Failed to fetch books" },
      { status: 500 }
    )
  }
}
