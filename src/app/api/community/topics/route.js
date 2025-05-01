import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  const [topics, total] = await Promise.all([
    prisma.topic.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { username: true, email: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.topic.count(),
  ]);

  return NextResponse.json({ topics, total });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, body } = await request.json();
  if (typeof title !== "string" || typeof body !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const topic = await prisma.topic.create({
    data: {
      title,
      body,
      author: { connect: { email: session.user.email } },
    },
  });
  return NextResponse.json(topic, { status: 201 });
}
