import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

console.log("authOptions:", authOptions);  // Debug log to check the content of authOptions

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
