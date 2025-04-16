// src/app/api/books/[bookId]/route.js
// Summary: Provides API endpoints for GET, PUT, and DELETE operations on a single book 
// and fetches related books by the same author.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, context) {
  try {
    const params = await context.params;
    const bookId = params.bookId;
    const id = parseInt(bookId, 10);
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: { select: { id: true, username: true, email: true } },
          },
        },
      },
    });
    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 });
    }
    const otherBooks = await prisma.book.findMany({
      where: { author: book.author, NOT: { id: book.id } },
      select: { id: true, title: true },
    });
    return NextResponse.json({ success: true, data: { book, otherBooks } }, { status: 200 });
  } catch (error) {
    console.error("GET single book error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch book" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const bookId = params.bookId;
    const id = parseInt(bookId, 10);
    const body = await request.json();

    if (!body.title || !body.author) {
      return NextResponse.json({ success: false, error: "Title and Author are required" }, { status: 400 });
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title: body.title,
        author: body.author,
        description: body.description || "",
        file_name: body.file_name || null,
        file_url: body.file_url || null,
        cover_url: body.cover_url || null,
        // New fields:
        genres: body.genres && Array.isArray(body.genres) ? body.genres : undefined,
        publicationYear: body.publicationYear ? Number(body.publicationYear) : undefined,
        language: body.language || undefined,
        metadata: body.metadata || {},
        isDeleted: body.isDeleted === true,
      },
    });
    
    return NextResponse.json({ success: true, data: updatedBook }, { status: 200 });
  } catch (error) {
    console.error("PUT update book error:", error);
    return NextResponse.json({ success: false, error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const bookId = params.bookId;
    const id = parseInt(bookId, 10);
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Book deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE book error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete book" }, { status: 500 });
  }
}
