// Summary: Seeds the database with an admin user using Prisma and bcrypt.

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password_hash = await bcrypt.hash('admin', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'kalleadmin@lonnrot.com' },
    update: { role: 'admin' },
    create: {
      username: 'kalleadmin',
      email: 'kalleadmin@lonnrot.com',
      password_hash,
      role: 'admin',
    },
  });

  console.log('Admin user seeded:', adminUser);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
