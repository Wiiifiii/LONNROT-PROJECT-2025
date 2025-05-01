// GET  /comments
// POST /comments
import { NextResponse }     from "next/server";
import prisma               from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions }      from "@/lib/authOptions";

export async function GET(request, context) {
  // await the dynamic params before using them
  const { topicId } = await context.params;
  const id = Number(topicId);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { topicId: id },
    orderBy: { createdAt: "asc" },
    include: { author: { select: { username: true, email: true } } },
  });
  return NextResponse.json(comments);
}

export async function POST(request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topicId } = await context.params;
  const id = Number(topicId);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
  }

  const { body } = await request.json();
  if (typeof body !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      body,
      topic:  { connect: { id } },
      author: { connect: { email: session.user.email } },
    },
    include: { author: { select: { username: true, email: true } } },
  });
  return NextResponse.json(comment, { status: 201 });
}
