// src/app/api/community/topics/[topicId]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request, context) {
  // Await the params
  const { topicId: topicIdStr } = await context.params;
  const topicId = Number(topicIdStr);
  if (isNaN(topicId)) {
    return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
  }

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      author: { select: { id: true, username: true, email: true } },
      comments: {
        include: { author: { select: { id: true, username: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!topic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(topic);
}

export async function PATCH(request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Await the params
  const { topicId: topicIdStr } = await context.params;
  const topicId = Number(topicIdStr);
  if (isNaN(topicId)) {
    return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
  }

  // Only the author can patch
  const existing = await prisma.topic.findUnique({
    where: { id: topicId },
    select: { author: { select: { email: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.author.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, body } = await request.json();
  if (typeof title !== "string" || typeof body !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.topic.update({
    where: { id: topicId },
    data: { title, body },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Await the params before use
  const { topicId: topicIdStr } = await context.params;
  const topicId = Number(topicIdStr);
  if (isNaN(topicId)) {
    return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
  }

  // Only the author can delete
  const existing = await prisma.topic.findUnique({
    where: { id: topicId },
    select: { author: { select: { email: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.author.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Delete all comments, then the topic itself
  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { topicId } }),
    prisma.topic.delete({ where: { id: topicId } }),
  ]);
  return NextResponse.json({ success: true });
}
