// Summary: Handles user registration by validating input, checking existing users, hashing passwords, and creating a new user with a default "user" role. Blocks GET requests.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, password, confirmPassword } = body;
    if (!username || !email || !password || !confirmPassword) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }
    if (password !== confirmPassword) {
      return new Response(JSON.stringify({ error: "Passwords do not match" }), { status: 400 });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email is already registered" }), { status: 400 });
    }
    const hash = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password_hash: hash,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,       // <-- added gender
        displayName: body.displayName,
        bio: body.bio,
        socialMediaLinks: body.socialMediaLinks,
        // … add any additional fields as needed
      },
    });
    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: { id: created.id, email: created.email },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(JSON.stringify({ error: "Failed to register user" }), { status: 500 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: "Method Not Allowed" }), { status: 405 });
}
