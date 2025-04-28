// src/app/api/reading-lists/[listId]/items/route.js

import { NextResponse }     from "next/server";
import prisma               from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions }      from "@/lib/authOptions";

export const dynamic       = "force-dynamic";
export const dynamicParams = true;

export async function POST(request, { params: paramsPromise }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 🔥 Await params before using:
  const { listId: listIdRaw } = await paramsPromise;
  const listId = parseInt(listIdRaw, 10);
  if (isNaN(listId)) {
    return NextResponse.json(
      { success: false, error: "Invalid list ID" },
      { status: 400 }
    );
  }

  const { bookId: rawBookId } = await request.json();
  const bookId = parseInt(rawBookId, 10);
  if (isNaN(bookId)) {
    return NextResponse.json(
      { success: false, error: "Invalid book ID" },
      { status: 400 }
    );
  }

  // Ensure list belongs to this user:
  const list = await prisma.readingList.findUnique({
    where: { id: listId },
    select: { userId: true },
  });
  if (!list || list.userId !== parseInt(session.user.id, 10)) {
    return NextResponse.json(
      { success: false, error: "Not authorized for this list" },
      { status: 403 }
    );
  }

  // Prevent duplicates
  const existing = await prisma.readingListItem.findUnique({
    where: {
      readingListId_bookId: { readingListId: listId, bookId },
    },
  });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "Book already in list" },
      { status: 400 }
    );
  }

  const newItem = await prisma.readingListItem.create({
    data: { readingListId: listId, bookId },
  });

  return NextResponse.json({ success: true, data: newItem }, { status: 201 });
}
