// app/api/community/[topicId]/comments/[commentId]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.commentId);
  const { body } = await _req.json();

  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { author: { select: { email: true } } },
  });
  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (comment.author.email !== session.user.email)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.comment.update({
    where: { id },
    data: { body },
  });
  return NextResponse.json(updated);
}
