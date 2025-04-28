// src/app/api/users/me/route.js
import { NextResponse }      from "next/server";
import { getServerSession }  from "next-auth/next";
import { authOptions }       from "@/lib/authOptions";
import { PrismaClient }      from "@prisma/client";
import { hash, compare }     from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id, 10) },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatar_url: true,
      role: true,
    },
  });
  return NextResponse.json({ success: true, data: user });
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = parseInt(session.user.id, 10);
  const body   = await request.json();
  const data   = {};

  if (body.displayName != null) data.displayName = body.displayName;
  if (body.avatarUrl   != null) data.avatar_url   = body.avatarUrl;
  if (body.email       != null) {
    if (!/^\S+@\S+\.\S+$/.test(body.email))
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    data.email = body.email;
  }

  if (body.currentPassword && body.newPassword) {
    const user  = await prisma.user.findUnique({ where: { id: userId } });
    const valid = await compare(body.currentPassword, user.password_hash);
    if (!valid)
      return NextResponse.json({ error: "Wrong current password" }, { status: 403 });
    data.password_hash = await hash(body.newPassword, 10);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatar_url: true,
      role: true,
    },
  });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = parseInt(session.user.id, 10);
  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ success: true, message: "Account deleted." });
}
