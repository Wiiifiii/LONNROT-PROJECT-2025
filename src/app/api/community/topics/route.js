// src/app/api/community/topics/route.js
import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/authOptions'

export async function GET() {
  const topics = await prisma.topic.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author:   { select: { id: true, username: true, email: true } },
      comments: { select: { id: true } }, // we just need the count
    },
  })
  return NextResponse.json(topics)
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, body } = await request.json()
  if (typeof title !== 'string' || typeof body !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const newTopic = await prisma.topic.create({
    data: {
      title,
      body,
      author: { connect: { email: session.user.email } },
    },
  })

  return NextResponse.json(newTopic, { status: 201 })
}
