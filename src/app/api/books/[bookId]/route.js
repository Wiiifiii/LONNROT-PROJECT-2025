// src/app/api/books/[bookId]/route.js
// Summary: Provides API endpoints for GET, PUT, and DELETE operations on a single book 
// and fetches related books by the same author.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, context) {
  const { bookId } = await context.params;
  const id = Number(bookId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }

  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: { select: { username: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!book) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const otherBooks = await prisma.book.findMany({
    where: { author: book.author, id: { not: id } },
    select: { id: true, title: true },
  });

  return NextResponse.json(
    { success: true, data: { book, otherBooks, reviews: book.reviews } },
    { status: 200 }
  );
}

export async function PUT(request, context) {
  const { bookId } = await context.params;
  const id = parseInt(bookId, 10);
  const body = await request.json();

  if (!body.title || !body.author) {
    return NextResponse.json(
      { success: false, error: "Title and Author are required" },
      { status: 400 }
    );
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
      genres:
        body.genres && Array.isArray(body.genres) ? body.genres : undefined,
      publicationYear: body.publicationYear
        ? Number(body.publicationYear)
        : undefined,
      language: body.language || undefined,
      metadata: body.metadata || {},
      isDeleted: body.isDeleted === true,
    },
  });

  return NextResponse.json({ success: true, data: updatedBook }, { status: 200 });
}

export async function DELETE(request, context) {
  const { bookId } = await context.params;
  const id = parseInt(bookId, 10);
  await prisma.book.delete({ where: { id } });
  return NextResponse.json(
    { success: true, message: "Book deleted" },
    { status: 200 }
  );
}
