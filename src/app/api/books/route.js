// Summary: Handles API endpoints for fetching all books with GET and creating a new book with POST, using Prisma ORM.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Parse query parameters for pagination and filters.
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Build a "where" clause for Prisma based on filters.
    const where = {};

    // Genre filter: assumes "genres" is stored as an array.
    const genre = searchParams.get("genre");
    if (genre && genre !== "All") {
      where.genres = { has: genre };
    }

    // Year filter.
    const year = searchParams.get("year");
    if (year && year !== "All") {
      where.publicationYear = Number(year);
    }

    // Language filter.
    const language = searchParams.get("language");
    if (language && language !== "All") {
      where.language = language;
    }

    // Author filter.
    const author = searchParams.get("author");
    if (author && author !== "All") {
      where.author = author;
    }

    // Downloadable filter.
    const downloadable = searchParams.get("downloadable");
    if (downloadable === "true") {
      where.file_url = { not: null };
    }

    // Full-text search for title and author.
    const searchQuery = searchParams.get("searchQuery");
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { author: { contains: searchQuery, mode: "insensitive" } }
      ];
    }

    // Fetch paginated, filtered books and total count concurrently.
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: {
          reviews: {
            include: {
              user: { select: { id: true, username: true, email: true } }
            }
          }
        }
      }),
      prisma.book.count({ where })
    ]);

    // Return the paginated data along with pagination metadata.
    return NextResponse.json(
      { 
        success: true, 
        data: { books, total, page, limit, totalPages: Math.ceil(total / limit) }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET books with pagination error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.title || !body.author) {
      return NextResponse.json({ success: false, error: "Title and Author are required" }, { status: 400 });
    }

    let metadataParsed = {};
    if (typeof body.metadata === "string") {
      if (body.metadata.trim() !== "") {
        try {
          metadataParsed = JSON.parse(body.metadata);
        } catch (err) {
          return NextResponse.json(
            { success: false, error: "Invalid JSON in metadata field", details: err.message },
            { status: 400 }
          );
        }
      }
    } else if (typeof body.metadata === "object" && body.metadata !== null) {
      metadataParsed = body.metadata;
    }

    const createdBook = await prisma.book.create({
      data: {
        title: body.title,
        author: body.author,
        description: body.description || "",
        file_name: body.file_name || null,
        file_url: body.file_url || null,
        cover_url: body.cover_url || null,
        // New fields:
        genres: body.genres && Array.isArray(body.genres) ? body.genres : [],
        publicationYear: body.publicationYear ? Number(body.publicationYear) : null,
        language: body.language || null,
        metadata: metadataParsed,
        isDeleted: body.isDeleted === true,
        upload_date: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: createdBook }, { status: 201 });
  } catch (error) {
    console.error("POST /api/books error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to create book", details: error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
