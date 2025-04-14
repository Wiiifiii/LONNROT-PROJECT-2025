// Summary: Sets up the NextAuth API routes using the provided authOptions configuration for the Node.js runtime.

export const runtime = "nodejs";
import NextAuth from "next-auth";
import authOptions from "./authOptions";

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);


