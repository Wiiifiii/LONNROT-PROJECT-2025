// src/app/api/community/topics/[topicId]/comments/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request, context) {
  // Await the params before using them
  const { topicId: topicIdStr } = await context.params;
  const topicId = Number(topicIdStr);
  if (isNaN(topicId)) {
    return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { topicId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, username: true, email: true } },
    },
  });
  return NextResponse.json(comments);
}

export async function POST(request, context) {
  // Await the params before using them
  const { topicId: topicIdStr } = await context.params;
  const topicId = Number(topicIdStr);
  if (isNaN(topicId)) {
    return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { body } = await request.json();
  if (typeof body !== "string") {
    return NextResponse.json({ error: "Invalid comment body" }, { status: 400 });
  }

  const newComment = await prisma.comment.create({
    data: {
      body,
      topic: { connect: { id: topicId } },
      author: { connect: { email: session.user.email } },
    },
    include: {
      author: { select: { id: true, username: true } },
    },
  });

  return NextResponse.json(newComment, { status: 201 });
}
