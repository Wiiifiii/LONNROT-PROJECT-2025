// src/app/api/auth/[...nextauth]/route.js
export const runtime = "nodejs";
import NextAuth from "next-auth/next";
import authOptions from "./authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
