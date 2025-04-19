import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const passwordPolicy = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/;

export async function POST(req) {
  const { token, newPassword } = await req.json();
  if (
    typeof token !== 'string' ||
    typeof newPassword !== 'string' ||
    !passwordPolicy.test(newPassword)
  ) {
    return NextResponse.json({ error: 'Invalid token or weak password' }, { status: 400 });
  }

  const reset = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!reset || reset.used || reset.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token invalid or expired' }, { status: 400 });
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: reset.userId },
    data: { password_hash: hash },
  });
  await prisma.passwordReset.update({
    where: { id: reset.id },
    data: { used: true },
  });

  return NextResponse.json({ ok: true });
}
