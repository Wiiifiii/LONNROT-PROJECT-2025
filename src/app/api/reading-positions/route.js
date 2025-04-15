//"use client"; // if you need client behavior – for API routes typically this is not needed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/reading-positions
export async function POST(request) {
  // Parse JSON body – expected: { userId, bookId, position }
  const { userId, bookId, position } = await request.json();
  
  try {
    // Upsert the reading position (update if exists; otherwise, create new)
    // We use the unique field combination (userId, bookId)
    const readingPos = await prisma.readingPosition.upsert({
      where: {
        // Ensure this matches the @@unique constraint in your schema
        userId_bookId: { userId, bookId },
      },
      update: { position },
      create: { userId, bookId, position },
    });

    return new Response(JSON.stringify({ success: true, readingPos }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving reading position:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
