/**
 * seed.js
 *
 * Seeds the admin user into the database using Prisma.
 * It hashes the admin password, upserts the admin user using the username as the unique key,
 * and logs the seeded user's details.
 *
 * Dependencies: PrismaClient from "@prisma/client" and bcryptjs.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const plain = "adminPassword123!";
  const passwordHash = await bcrypt.hash(plain, 10);
  
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      role: "admin",
      email: "admin@lonnrot.com",
    },
    create: {
      username: "admin",
      email: "admin@lonnrot.com",
      password_hash: passwordHash,
      role: "admin",
      displayName: "Administrator",
      bio: "Site administrator",
      socialMediaLinks: {},
      dateOfBirth: null,
    },
  });
  console.log("✅ Admin user seeded:", {
    id: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
    role: adminUser.role,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
