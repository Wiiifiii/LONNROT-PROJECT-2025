// src/app/api/users/me/activity/route.js

import { NextResponse }              from "next/server";
import { getServerSession }          from "next-auth";
import authOptions                   from "../../auth/[...nextauth]/authOptions";
import { PrismaClient }              from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // 1) Ensure the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = parseInt(session.user.id, 10);

  // 2) Fetch the last 20 activity logs
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

  // 3) Return them
  return NextResponse.json(logs);
}
