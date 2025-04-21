import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

console.log("authOptions:", authOptions); // Debug log

const handler = NextAuth(authOptions);

export async function GET(request) {
  return handler(request);
}

export async function POST(request) {
  return handler(request);
}
