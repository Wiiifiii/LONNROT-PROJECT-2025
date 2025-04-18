// src/lib/prisma.js
import { PrismaClient } from '@prisma/client'

let prisma

// In development, use a global to avoid exhausting your connection pool
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
