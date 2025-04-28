// src/app/api/reading-lists/[listId]/route.js

import { NextResponse }     from "next/server";
import prisma               from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions }      from "@/lib/authOptions";

export const dynamic       = "force-dynamic";
export const dynamicParams = true;

export async function GET(request, { params: paramsPromise }) {
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

  const readingList = await prisma.readingList.findFirst({
    where: { id: listId, userId: parseInt(session.user.id, 10) },
    include: {
      items: {
        include: {
          book: {
            select: { id: true, title: true, author: true, cover_url: true },
          },
        },
      },
    },
  });

  if (!readingList) {
    return NextResponse.json(
      { success: false, error: "Reading list not found or unauthorized" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: readingList });
}

export async function PUT(request, { params: paramsPromise }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Await params:
  const { listId: listIdRaw } = await paramsPromise;
  const listId = parseInt(listIdRaw, 10);
  const { name } = await request.json();

  if (isNaN(listId) || !name?.trim()) {
    return NextResponse.json(
      { success: false, error: "Invalid input" },
      { status: 400 }
    );
  }

  const updated = await prisma.readingList.updateMany({
    where: { id: listId, userId: parseInt(session.user.id, 10) },
    data: { name: name.trim() },
  });

  if (updated.count === 0) {
    return NextResponse.json(
      { success: false, error: "Not found or not authorized" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: { id: listId, name: name.trim() } });
}

export async function DELETE(request, { params: paramsPromise }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Await params:
  const { listId: listIdRaw } = await paramsPromise;
  const listId = parseInt(listIdRaw, 10);
  if (isNaN(listId)) {
    return NextResponse.json(
      { success: false, error: "Invalid list ID" },
      { status: 400 }
    );
  }

  const deleted = await prisma.readingList.deleteMany({
    where: { id: listId, userId: parseInt(session.user.id, 10) },
  });

  if (deleted.count === 0) {
    return NextResponse.json(
      { success: false, error: "Not found or not authorized" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: "Deleted" });
}
