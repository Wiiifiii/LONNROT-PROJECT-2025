// lib/prisma.js - Exports a singleton instance of PrismaClient for database interactions.
import { PrismaClient } from '@prisma/client'; // Import PrismaClient from the Prisma package
const prismaClientSingleton = () => { return new PrismaClient(); }; // Function to create a new PrismaClient instance
const globalForPrisma = globalThis; // Reference to the global scope for caching the Prisma instance
const prisma = globalForPrisma.prisma ?? prismaClientSingleton(); // Use an existing Prisma instance if available, otherwise create a new one
export default prisma; // Export the Prisma instance
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; // In non-production, cache the Prisma instance globally to prevent multiple instances during hot-reloading