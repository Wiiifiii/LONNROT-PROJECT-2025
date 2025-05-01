// GET  /api/community/topics/[topicId]
// PATCH/DELETE same URL
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request, context) {
  // await the dynamic params before using them
  const { topicId } = await context.params;
  const id = Number(topicId);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
  }

  const topic = await prisma.topic.findUnique({
    where: { id },
    include: {
      author: { select: { username: true, email: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { username: true, email: true } } },
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
  const { topicId } = await context.params;
  const id = Number(topicId);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
  }

  const existing = await prisma.topic.findUnique({
    where: { id },
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
    where: { id },
    data: { title, body },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { topicId } = await context.params;
  const id = Number(topicId);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
  }

  const existing = await prisma.topic.findUnique({
    where: { id },
    select: { author: { select: { email: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.author.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { topicId: id } }),
    prisma.topic.delete({ where: { id } }),
  ]);
  return NextResponse.json({ success: true });
}
