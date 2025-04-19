// src/app/api/admin/metrics/users/route.js
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // 1) Total users
    const totalUsers = await prisma.user.count()

    // 2) By gender
    const genders = await Promise.all(
      ["MALE", "FEMALE", "OTHER"].map(async (g) => ({
        gender: g,
        count: await prisma.user.count({ where: { gender: g } }),
      }))
    )
    const byGender = genders.reduce((acc, { gender, count }) => {
      acc[gender] = count
      return acc
    }, {})

    // 3) Age buckets
    const now = new Date()
    const buckets = {
      "<18":  await prisma.user.count({ where: { dateOfBirth: { gt: new Date(now.getFullYear() - 18, now.getMonth(), now.getDate()) } } }),
      "18-25": await prisma.user.count({ where: { dateOfBirth: { lte: new Date(now.getFullYear() - 18, now.getMonth(), now.getDate()), gt: new Date(now.getFullYear() - 25, now.getMonth(), now.getDate()) } } }),
      "26-40": await prisma.user.count({ where: { dateOfBirth: { lte: new Date(now.getFullYear() - 26, now.getMonth(), now.getDate()), gt: new Date(now.getFullYear() - 40, now.getMonth(), now.getDate()) } } }),
      ">40":  await prisma.user.count({ where: { dateOfBirth: { lte: new Date(now.getFullYear() - 40, now.getMonth(), now.getDate()) } } }),
    }

    return NextResponse.json({ totalUsers, byGender, byAge: buckets })
  } catch (err) {
    console.error("GET /api/admin/metrics/users error:", err)
    return NextResponse.json({ error: "Failed to load user metrics" }, { status: 500 })
  }
}
