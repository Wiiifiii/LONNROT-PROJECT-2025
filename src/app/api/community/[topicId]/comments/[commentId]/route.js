// src/app/api/community/topics/[topicId]/comments/[commentId]/route.js
import { NextResponse } from 'next/server'
import prisma           from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/authOptions'

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const commentId = Number(params.commentId)
  if (isNaN(commentId)) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
  }

  // only the author can edit
  const existing = await prisma.comment.findUnique({
    where:  { id: commentId },
    select: { author: { select: { email: true } } },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (existing.author.email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { body } = await request.json()
  if (typeof body !== 'string') {
    return NextResponse.json({ error: 'Invalid comment body' }, { status: 400 })
  }

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data:  { body },
  })

  return NextResponse.json(updated)
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const commentId = Number(params.commentId)
  if (isNaN(commentId)) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
  }

  // only the author can delete
  const existing = await prisma.comment.findUnique({
    where:  { id: commentId },
    select: { author: { select: { email: true } } },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (existing.author.email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.comment.delete({ where: { id: commentId } })
  return NextResponse.json({ success: true })
}
