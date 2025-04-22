export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$connect();

    // total users
    const totalUsers = await prisma.user.count();

    // by gender
    const gendersArr = ['MALE', 'FEMALE', 'OTHER'];
    const byGender = {};
    for (const g of gendersArr) {
      byGender[g] = await prisma.user.count({ where: { gender: g } });
    }

    // by age buckets
    const now = new Date();
    const buckets = {
      '<18':  await prisma.user.count({ where: { dateOfBirth: { gt: new Date(now.getFullYear() - 18, now.getMonth(), now.getDate()) } } }),
      '18-25': await prisma.user.count({ where: {
        dateOfBirth: {
          lte: new Date(now.getFullYear() - 18, now.getMonth(), now.getDate()),
          gt:  new Date(now.getFullYear() - 25, now.getMonth(), now.getDate())
        }
      } }),
      '26-40': await prisma.user.count({ where: {
        dateOfBirth: {
          lte: new Date(now.getFullYear() - 26, now.getMonth(), now.getDate()),
          gt:  new Date(now.getFullYear() - 40, now.getMonth(), now.getDate())
        }
      } }),
      '>40':  await prisma.user.count({ where: { dateOfBirth: { lte: new Date(now.getFullYear() - 40, now.getMonth(), now.getDate()) } } }),
    };

    return NextResponse.json({ totalUsers, byGender, byAge: buckets });
  } catch (err) {
    console.error('GET /api/dashboard/metrics/users error:', err);
    return NextResponse.json({ error: 'Failed to load user metrics' }, { status: 500 });
  }
}
