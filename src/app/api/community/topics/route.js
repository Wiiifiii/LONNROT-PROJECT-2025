// app/api/community/topics/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const topics = await prisma.topic.findMany({
    include: {
      author: { select: { id: true, username: true } },
      comments: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(topics);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, body } = await req.json();
  const topic = await prisma.topic.create({
    data: {
      title,
      body,
      author: { connect: { email: session.user.email } },
    },
  });
  return NextResponse.json(topic);
}
