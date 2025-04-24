// src/app/api/users/me/settings/route.js
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // Fetch the session to verify the user's authentication status
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id, 10);

  // Fetch the user's settings
  let record;
  try {
    record = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    });
  } catch (err) {
    console.error("Error fetching settings:", err);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }

  // Return settings or an empty object if no settings found
  return NextResponse.json(record?.settings || {});
}

export async function PUT(request) {
  // Fetch the session to verify the user's authentication status
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id, 10);

  // Parse the new settings from the request body
  let newSettings;
  try {
    newSettings = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Update the user's settings in the database
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { settings: newSettings },
    });
  } catch (err) {
    console.error("Error updating settings:", err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }

  // Return success response
  return NextResponse.json({ success: true });
}
