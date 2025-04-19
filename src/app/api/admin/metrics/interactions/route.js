// src/app/api/admin/metrics/interactions/route.js
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { subDays } from "date-fns"

export async function GET() {
  try {
    // Totals
    const totalReads     = await prisma.bookInteraction.count({ where: { type: "READ_START" } })
    const totalDownloads= await prisma.bookInteraction.count({ where: { type: "DOWNLOAD" } })

    // Last 10 days trends
    const today   = new Date()
    const since   = subDays(today, 9) // inclusive of today = 10 days
    const raw     = await prisma.bookInteraction.groupBy({
      by: ["type", "createdAt"],
      where: {
        createdAt: { gte: since }
      },
      _count: { createdAt: true },
    })

    // Normalize to per-day counts
    const readsLast10 = {}
    const dlLast10    = {}
    for (let i = 0; i < 10; i++) {
      const d = subDays(today, i).toISOString().slice(0, 10)
      readsLast10[d] = 0
      dlLast10[d]    = 0
    }
    raw.forEach(r => {
      const day = r.createdAt.toISOString().slice(0, 10)
      if (r.type === "READ_START") readsLast10[day] = r._count.createdAt
      if (r.type === "DOWNLOAD")  dlLast10[day]    = r._count.createdAt
    })

    // Convert objects to sorted arrays
    const readsByDay    = Object.entries(readsLast10).sort(([a],[b])=>a.localeCompare(b)).map(([date, count])=>({ date, count }))
    const downloadsByDay= Object.entries(dlLast10).sort(([a],[b])=>a.localeCompare(b)).map(([date, count])=>({ date, count }))

    return NextResponse.json({
      totalReads,
      totalDownloads,
      readsLast10Days: readsByDay,
      downloadsLast10Days: downloadsByDay
    })
  } catch (err) {
    console.error("GET /api/admin/metrics/interactions error:", err)
    return NextResponse.json({ error: "Failed to load interaction metrics" }, { status: 500 })
  }
}
