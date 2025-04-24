// src/app/api/users/me/activity/route.js
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // Get the session from NextAuth to check if the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id, 10);

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
