// src/app/api/reading-lists/[listId]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function GET(request, { params: paramsPromise }) {
  try {
    const { listId: listIdRaw } = await paramsPromise;
    const listId = parseInt(listIdRaw, 10);

    const readingList = await prisma.readingList.findUnique({
      where: { id: listId },
      include: {
        items: {
          include: {
            book: {
              select: { id: true, title: true, author: true, cover_url: true }
            }
          }
        }
      }
    });

    if (!readingList) {
      return NextResponse.json(
        { success: false, error: "Reading list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: readingList }, { status: 200 });
  } catch (err) {
    console.error("GET /api/reading-lists/[listId] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reading list", details: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: paramsPromise }) {
  try {
    const { listId: listIdRaw } = await paramsPromise;
    const listId = parseInt(listIdRaw, 10);
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.readingList.update({
      where: { id: listId },
      data: { name }
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/reading-lists/[listId] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update reading list", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: paramsPromise }) {
  try {
    const { listId: listIdRaw } = await paramsPromise;
    const listId = parseInt(listIdRaw, 10);

    await prisma.readingList.delete({ where: { id: listId } });

    return NextResponse.json({ success: true, message: "Reading list deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/reading-lists/[listId] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete reading list", details: err.message },
      { status: 500 }
    );
  }
}
