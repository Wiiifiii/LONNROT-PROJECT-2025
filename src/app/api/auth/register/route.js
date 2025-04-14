// Summary: Handles user registration by validating input, checking existing users, hashing passwords, and creating a new user with a default "user" role. Blocks GET requests.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, email, password, confirmPassword } = await req.json();
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
        role: "user",
      },
    });
    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: { id: newUser.id, email: newUser.email },
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
