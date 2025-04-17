import { PrismaClient, InteractionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const type = InteractionType.READ_FINISH;

export async function POST(request, { params }) {
  const bookId = Number(params.bookId);
  if (Number.isNaN(bookId)) {
    return NextResponse.json({ error: "Bad book id" }, { status: 400 });
  }

  try {
    await prisma.bookInteraction.create({
      data: {
        bookId,
        sessionId: cookies().get("lo_sid")?.value ?? "anon",
        type,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("READ_START log failed", err);
    return NextResponse.json({ error: "Log failed" }, { status: 500 });
  }
}
