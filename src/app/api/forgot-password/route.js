import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { sendMail } from '@/lib/mailer';

export async function POST(request) {
  const { email } = await request.json();
  if (typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hr

  if (user) {
    await prisma.passwordReset.create({
      data: { token, userId: user.id, expiresAt },
    });

    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`;
    await sendMail({
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${link}">here</a> to reset your password. This link expires in one hour.</p>`
    });
  }

  // Always return OK to avoid leaking whether an email exists
  return NextResponse.json({ ok: true });
}
