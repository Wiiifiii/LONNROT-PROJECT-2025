import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(_req, { params }) {
  const comments = await prisma.comment.findMany({
    where: { topicId: parseInt(params.topicId) },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { body } = await req.json();
  const comment = await prisma.comment.create({
    data: {
      body,
      topic: { connect: { id: parseInt(params.topicId) } },
      author: { connect: { email: session.user.email } },
    },
  });
  return NextResponse.json(comment);
}
