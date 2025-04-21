// src/app/api/users/me/activity/route.js
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Use NextAuth's getToken for session management
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  // Get the token from NextAuth to check if the user is authenticated
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, return an error
  if (!token?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(token.user.id, 10);

  // Fetch the last 20 activity logs for the authenticated user
  let logs;
  try {
    logs = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 20,
    });
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }

  // Return the activity logs
  return NextResponse.json(logs);
}
