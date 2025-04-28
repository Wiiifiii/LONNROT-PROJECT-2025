// app/api/community/topics/[topicId]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.topicId);
  const { title, body } = await req.json();

  // verify author
  const topic = await prisma.topic.findUnique({
    where: { id },
    select: { author: { select: { email: true } } },
  });
  if (!topic) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (topic.author.email !== session.user.email)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.topic.update({
    where: { id },
    data: { title, body },
  });
  return NextResponse.json(updated);
}
