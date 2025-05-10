/**
 * prisma.js
 *
 * Exports a singleton instance of PrismaClient for database interactions.
 * In non-production environments, the Prisma instance is cached globally
 * to prevent multiple instances during hot-reloading.
 *
 * Dependencies: PrismaClient from '@prisma/client'.
 */

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => { return new PrismaClient(); };
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
export default prisma;
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;