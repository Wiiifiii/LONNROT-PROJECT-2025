// src/app/api/auth/login/route.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );
    return new Response(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: "Method Not Allowed" }),
    { status: 405 }
  );
}
