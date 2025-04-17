/*  app/api/books/route.js
    ─────────────────────────────────────────────────────────────────
    Updates
    • Filters now check for "Coming Soon" (placeholder) instead of "All".
    • Pagination logic unchanged – you still fetch all books in pages.
------------------------------------------------------------------- */

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    /* ---------- build WHERE object ---------- */
    const where = {};

    const genre       = searchParams.get("genre");
    const year        = searchParams.get("year");
    const language    = searchParams.get("language");
    const author      = searchParams.get("author");
    const downloadable = searchParams.get("downloadable");

    if (genre && genre !== "Coming Soon")     where.genres = { has: genre };
    if (year  && year  !== "Coming Soon")     where.publicationYear = Number(year);
    if (language && language !== "Coming Soon") where.language = language;
    if (author && author !== "All")           where.author = author;
    if (downloadable === "true")              where.file_url = { not: null };

    const searchQuery = searchParams.get("searchQuery");
    if (searchQuery) {
      where.OR = [
        { title:  { contains: searchQuery, mode: "insensitive" } },
        { author: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    /* ---------- pagination only if page/limit present ---------- */
    const page  = Number(searchParams.get("page"));
    const limit = Number(searchParams.get("limit"));

    const usePagination = page > 0 && limit > 0;   // ✅ only paginate if both set

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        ...(usePagination && { skip: (page - 1) * limit, take: limit }),
      }),
      prisma.book.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          books,
          total,
          ...(usePagination && {
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          }),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/books error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.title || !body.author) {
      return NextResponse.json(
        { success: false, error: "Title and Author are required" },
        { status: 400 }
      );
    }

    /* Parse metadata if stringified */
    let metadataParsed = {};
    if (typeof body.metadata === "string" && body.metadata.trim() !== "") {
      metadataParsed = JSON.parse(body.metadata);
    } else if (typeof body.metadata === "object" && body.metadata !== null) {
      metadataParsed = body.metadata;
    }

    const createdBook = await prisma.book.create({
      data: {
        title: body.title,
        author: body.author,
        description: body.description ?? "",
        file_name: body.file_name ?? null,
        file_url: body.file_url ?? null,
        pdf_url: body.pdf_url ?? null,      // if you store generated PDFs
        cover_url: body.cover_url ?? null,
        genres:
          Array.isArray(body.genres) && body.genres.length ? body.genres : [],
        publicationYear: body.publicationYear
          ? Number(body.publicationYear)
          : null,
        language: body.language ?? null,
        metadata: metadataParsed,
        isDeleted: body.isDeleted === true,
        upload_date: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, data: createdBook },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/books error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create book", details: err.message },
      { status: 500 }
    );
  }
}
