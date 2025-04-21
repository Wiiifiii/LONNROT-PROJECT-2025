// src/app/api/users/me/settings/route.js
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";  // Import NextAuth's getToken for session management
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  // Fetch the token to verify the user's authentication status
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, return an error
  if (!token?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(token.user.id, 10);

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
  // Fetch the token to verify the user's authentication status
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, return an error
  if (!token?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(token.user.id, 10);

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
