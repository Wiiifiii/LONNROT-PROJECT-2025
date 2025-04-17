// src/app/api/users/me/settings/route.js

import { NextResponse }             from "next/server";
import { getServerSession }         from "next-auth";
import authOptions                  from "../../auth/[...nextauth]/authOptions";
import { PrismaClient }             from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // 1) Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = parseInt(session.user.id, 10);

  // 2) Fetch settings
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

  // 3) Return settings or empty object
  return NextResponse.json(record?.settings || {});
}

export async function PUT(req) {
  // 1) Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = parseInt(session.user.id, 10);

  // 2) Parse new settings
  let newSettings;
  try {
    newSettings = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // 3) Update in database
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

  // 4) Return success
  return NextResponse.json({ success: true });
}
