// src/app/api/users/me/route.js
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET current user session
export async function GET() {
  // Fetch the session to verify the user's authentication status
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id, 10);

  // Fetch user details from the database
  const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, email: true, avatar_url: true, role: true },
     });

  return NextResponse.json({ user });
}

// DELETE current user account
export async function DELETE() {
  // Fetch the session to verify the user's authentication status
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id, 10);

  try {
    // Delete the user from the database
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
