// prisma/seed-admin.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const plain = "amdinPassword123!"; // your chosen admin password
  const passwordHash = await bcrypt.hash(plain, 10);

  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },       // ← use username as the unique key
    update: {
      // in case the user already exists, ensure they have admin role and sync email if needed
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
      socialMediaLinks: {}, // will default to empty JSON
      dateOfBirth: null,   // optional, can be omitted entirely
    },
  });

  console.log("✅ Admin user seeded:", {
    id: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
    role: adminUser.role,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
