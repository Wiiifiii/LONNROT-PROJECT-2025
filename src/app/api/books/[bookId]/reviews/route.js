// src/app/api/books/[bookId]/reviews/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse }       from "next/server";
import { getServerSession }   from "next-auth/next";
import { authOptions }        from "@/lib/authOptions";
import { PrismaClient }       from "@prisma/client";
import { InteractionType }    from "@/lib/constants";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  // 1) Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parse path + user IDs
  const { bookId }  = await params;               // await params first
  const bookIdInt   = parseInt(bookId, 10);
  const userIdInt   = parseInt(session.user.id, 10);

  // 3) Parse body
  const { rating, comment } = await request.json();
  if (rating === undefined) {
    return NextResponse.json({ error: "Missing rating" }, { status: 400 });
  }

  // 4) Create the review
  const newReview = await prisma.review.create({
    data: {
      rating:  Number(rating),
      comment,
      userId:  userIdInt,
      bookId:  bookIdInt,
    },
  });

  // 5) Log the download interaction using the specific enum value
  await prisma.bookInteraction.create({
    data: {
      bookId:    bookIdInt,
      sessionId: session.user.id,           // still a string in your schema
      type:      InteractionType.REVIEW,
    },
  });

  return NextResponse.json({ success: true, data: newReview }, { status: 201 });
}
