import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// WORKAROUND: Prevent Webpack optimization issues
const handler = NextAuth({
  ...authOptions,
  // Force Node.js runtime (critical for Prisma)
  runtime: "nodejs",
});

export { handler as GET, handler as POST };
