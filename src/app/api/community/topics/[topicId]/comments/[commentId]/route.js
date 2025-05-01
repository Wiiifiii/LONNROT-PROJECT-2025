// PATCH /DELETE /comments/[commentId]
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // await the dynamic params
  const { commentId } = await context.params;
  const id = Number(commentId);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }
  const existing = await prisma.comment.findUnique({
    where: { id },
    select: { author: { select: { email: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.author.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { body } = await request.json();
  if (typeof body !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const updated = await prisma.comment.update({
    where: { id },
    data: { body },
    include: { author: { select: { username: true, email: true } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { commentId } = await context.params;
  const id = Number(commentId);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }
  const existing = await prisma.comment.findUnique({
    where: { id },
    select: { author: { select: { email: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.author.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
