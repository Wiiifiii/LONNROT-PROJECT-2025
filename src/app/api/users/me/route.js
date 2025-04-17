// src/app/api/users/me/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE() {
  // 1) Ensure the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 2) Delete the user (cascades via your onDelete rules)
  const userId = parseInt(session.user.id, 10);
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }

  // 3) Return success
  return NextResponse.json({ success: true });
}
