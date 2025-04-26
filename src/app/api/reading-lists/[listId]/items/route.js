// src/app/api/reading-lists/[listId]/items/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function POST(request, { params: paramsPromise }) {
  try {
    const { listId: listIdRaw } = await paramsPromise;
    const listId = parseInt(listIdRaw, 10);

    const { bookId: rawBookId } = await request.json();
    const bookId = parseInt(rawBookId, 10);
    if (isNaN(bookId)) {
      return NextResponse.json(
        { success: false, error: "bookId is required" },
        { status: 400 }
      );
    }

    // ensure list exists
    const list = await prisma.readingList.findUnique({ where: { id: listId } });
    if (!list) {
      return NextResponse.json(
        { success: false, error: "Reading list not found" },
        { status: 404 }
      );
    }

    // prevent duplicates
    const existing = await prisma.readingListItem.findUnique({
      where: { readingListId_bookId: { readingListId: listId, bookId } }
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Book already in list" },
        { status: 400 }
      );
    }

    const newItem = await prisma.readingListItem.create({
      data: { readingListId: listId, bookId }
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (err) {
    console.error("POST /api/reading-lists/[listId]/items error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to add book to list", details: err.message },
      { status: 500 }
    );
  }
}
