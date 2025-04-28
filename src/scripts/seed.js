// prisma/seed-admin.js - Seeds the admin user into the database using Prisma.
import { PrismaClient } from "@prisma/client"; // Import PrismaClient for database operations
import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing

const prisma = new PrismaClient(); // Initialize PrismaClient

async function main() {
  const plain = "adminPassword123!"; // admin password
  const passwordHash = await bcrypt.hash(plain, 10); // Hash the admin password with a salt round of 10
  
  // Upsert the admin user in the database using username as the unique key
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },       // Unique key to check if the admin user exists
    update: {
      // If user exists, update their role and email to ensure admin privileges
      role: "admin",
      email: "admin@lonnrot.com",
    },
    create: {
      // If user does not exist, create a new admin user with these details
      username: "admin",
      email: "admin@lonnrot.com",
      password_hash: passwordHash,
      role: "admin",
      displayName: "Administrator",
      bio: "Site administrator",
      socialMediaLinks: {}, // Defaults to empty JSON
      dateOfBirth: null,    // Optional field, set as null
    },
  });
  // Log the seeded admin user's key details to the console
  console.log("✅ Admin user seeded:", {
    id: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
    role: adminUser.role,
  });
}

main().catch((e) => {
  console.error(e); // Log any errors during seeding
  process.exit(1);  // Exit with failure status if an error occurs
}).finally(async () => {
  await prisma.$disconnect(); // Disconnect PrismaClient to clean up resources
});
