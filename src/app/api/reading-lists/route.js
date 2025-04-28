// src/app/api/reading-lists/route.js

import { NextResponse }       from "next/server";
import prisma                 from "@/lib/prisma";
import { getServerSession }   from "next-auth/next";
import { authOptions }        from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 🔥 Fix: session.user.id comes in as a string
  const userId = parseInt(session.user.id, 10);

  const lists = await prisma.readingList.findMany({
    where:  { userId },
    select: { id: true, name: true },
  });

  return NextResponse.json({ success: true, data: lists });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Only take `name` from the client; force the userId from session
  const userId = parseInt(session.user.id, 10);
  const { name } = await request.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { success: false, error: "Name is required" },
      { status: 400 }
    );
  }

  const created = await prisma.readingList.create({
    data: { name, userId },
  });

  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
