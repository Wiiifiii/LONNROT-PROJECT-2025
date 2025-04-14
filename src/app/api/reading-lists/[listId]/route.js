// Summary: Provides API endpoints for GET, PUT, and DELETE operations on a reading list specified by listId, using Prisma ORM.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const prisma = new PrismaClient();

export async function GET(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const listId = params.listId;
    const id = parseInt(listId, 10);
    const readingList = await prisma.readingList.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            book: {
              select: { id: true, title: true, author: true },
            },
          },
        },
      },
    });
    if (!readingList) {
      return NextResponse.json({ success: false, error: "Reading list not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: readingList }, { status: 200 });
  } catch (error) {
    console.error("GET /api/reading-lists/[listId] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reading list" }, { status: 500 });
  }
}

export async function PUT(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const listId = params.listId;
    const id = parseInt(listId, 10);
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    const updatedList = await prisma.readingList.update({
      where: { id },
      data: { name: body.name },
    });
    return NextResponse.json({ success: true, data: updatedList }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/reading-lists/[listId] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update reading list", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const listId = params.listId;
    const id = parseInt(listId, 10);
    await prisma.readingList.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Reading list deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/reading-lists/[listId] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete reading list", details: error.message }, { status: 500 });
  }
}
