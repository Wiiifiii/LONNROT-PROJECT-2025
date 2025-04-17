import { PrismaClient, InteractionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request, ctx) {
  const { bookId } = await ctx.params;   // ✅ correct, params is a Promise
  const id = Number(bookId);

  const cookieStore = await cookies();    // (only where you read cookies)
  const sid = cookieStore.get("lo_sid")?.value ?? "anon";

  await prisma.bookInteraction.create({
    data: { bookId: id, sessionId: sid, type: InteractionType.READ_START },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
