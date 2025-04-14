// Summary: This API route fetches books by a specific author from the database using Prisma ORM. (Currently not in use)

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let authorName = searchParams.get("name");
    if (!authorName) {
      return new Response(
        JSON.stringify({ success: false, error: "Author name is required", icon: "📚" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    authorName = authorName.trim().replace(/^['"]+|['"]+$/g, "");

    const books = await prisma.book.findMany({
      where: {
        author: {
          contains: authorName,
          mode: "insensitive",
        },
      },
    });

    return new Response(
      JSON.stringify({ success: true, books, icon: "📚" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message, icon: "📚" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
