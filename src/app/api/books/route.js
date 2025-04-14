// Summary: Handles API endpoints for fetching all books with GET and creating a new book with POST, using Prisma ORM.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const books = await prisma.book.findMany();
    return NextResponse.json({ success: true, data: books }, { status: 200 });
  } catch (error) {
    console.error("GET all books error:", error);
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
