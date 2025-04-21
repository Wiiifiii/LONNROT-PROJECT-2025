import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

console.log("authOptions:", authOptions); // Debug log

export const { GET, POST } = NextAuth(authOptions);
