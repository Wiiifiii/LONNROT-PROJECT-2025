// src/app/api/users/me/route.js
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Use NextAuth's getToken for session management
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET current user session
export async function GET(request) {
  // Fetch the token from NextAuth to verify the user's authentication status
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, return null
  if (!token?.user?.id) {
    return NextResponse.json({ user: null });
  }

  const userId = parseInt(token.user.id, 10);

  // Fetch user details from the database
  const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, email: true, avatar_url: true, role: true },
     });

  return NextResponse.json({ user });
}

// DELETE current user account
export async function DELETE(request) {
  // Fetch the token from NextAuth to verify the user's authentication status
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, return an error
  if (!token?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userId = parseInt(token.user.id, 10);

  try {
    // Delete the user from the database
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
