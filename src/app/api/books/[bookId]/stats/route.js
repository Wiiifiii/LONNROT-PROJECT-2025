// src/app/api/books/[bookId]/stats/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Reuse PrismaClient instance in development to avoid multiple connections
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

/*  /api/books/[bookId]/stats
 *  returns counts for { DOWNLOAD, READ_START, READ_FINISH }
 */
export async function GET(req, { params }) {
    try {
        const { bookId } = await params;
        const id = Number(bookId);
    
        if (Number.isNaN(id)) {
            return NextResponse.json({ error: "Bad id" }, { status: 400 });
        }
    
        // Verify user's authentication status
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        // Read-only aggregation—no .create() calls here
        const rows = await prisma.bookInteraction.groupBy({
            by: ["type"],
            where: { bookId: id },
            _count: { _all: true },
        });
    
        const out = { DOWNLOAD: 0, READ_START: 0, READ_FINISH: 0 };
        rows.forEach(r => {
            // Ensure that the type exists in the output even if row.type is unexpected
            if (Object.prototype.hasOwnProperty.call(out, r.type)) {
                out[r.type] = r._count._all;
            }
        });
    
        return NextResponse.json(out, {
            status: 200,
            headers: { "Cache-Control": "s-maxage=60" },
        });
    } catch (error) {
        console.error("Error processing /api/books/[bookId]/stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
