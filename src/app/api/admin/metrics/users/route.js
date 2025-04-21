// src/app/api/admin/metrics/users/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';  // Import NextAuth's getToken for session management

export async function GET(request) {
  try {
    // Fetch the token to verify the user's authentication status
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated or is not an admin, return an error
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    await prisma.$connect();

    // Total users
    const totalUsers = await prisma.user.count();

    // By gender
    const gendersArr = ['MALE', 'FEMALE', 'OTHER'];
    const genders = await Promise.all(
      gendersArr.map(async (g) => ({
        gender: g,
        count: await prisma.user.count({ where: { gender: g } }),
      }))
    );
    const byGender = genders.reduce((acc, { gender, count }) => {
      acc[gender] = count;
      return acc;
    }, {});

    // Age buckets
    const now = new Date();
    const buckets = {
      '<18':  await prisma.user.count({ where: { dateOfBirth: { gt: new Date(now.getFullYear() - 18, now.getMonth(), now.getDate()) } } }),
      '18-25': await prisma.user.count({ where: { dateOfBirth: { lte: new Date(now.getFullYear() - 18, now.getMonth(), now.getDate()), gt: new Date(now.getFullYear() - 25, now.getMonth(), now.getDate()) } } }),
      '26-40': await prisma.user.count({ where: { dateOfBirth: { lte: new Date(now.getFullYear() - 26, now.getMonth(), now.getDate()), gt: new Date(now.getFullYear() - 40, now.getMonth(), now.getDate()) } } }),
      '>40':  await prisma.user.count({ where: { dateOfBirth: { lte: new Date(now.getFullYear() - 40, now.getMonth(), now.getDate()) } } }),
    };

    return NextResponse.json({ totalUsers, byGender, byAge: buckets });
  } catch (err) {
    console.error('GET /api/admin/metrics/users error:', err);
    return NextResponse.json({ error: 'Failed to load user metrics' }, { status: 500 });
  }
}
