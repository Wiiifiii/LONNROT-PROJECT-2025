// Summary: Handles POST requests to add a book to a reading list by validating the input, ensuring the reading list exists and the book isn't already added, and then creating a new reading list item using Prisma.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const prisma = new PrismaClient();

export async function POST(request, context) {
  try {
    const params = await Promise.resolve(context).then(ctx => ctx.params);
    const listId = params.listId;
    const id = parseInt(listId, 10);
    const body = await request.json();

    if (!body.bookId) {
      return NextResponse.json({ success: false, error: "bookId is required" }, { status: 400 });
    }
    const bookId = parseInt(body.bookId, 10);

    const list = await prisma.readingList.findUnique({ where: { id } });
    if (!list) {
      return NextResponse.json({ success: false, error: "Reading list not found" }, { status: 404 });
    }

    const existingItem = await prisma.readingListItem.findUnique({
      where: {
        readingListId_bookId: {
          readingListId: id,
          bookId: bookId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json({ success: false, error: "Book already added to reading list" }, { status: 400 });
    }

    const newItem = await prisma.readingListItem.create({
      data: {
        readingListId: id,
        bookId: bookId,
      },
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error adding book to reading list:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add book to reading list", details: error.message },
      { status: 500 }
    );
  }
}
