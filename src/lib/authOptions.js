import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma"; // Ensure the default import is correct
import { compare } from "bcryptjs";

/** @type {import("next-auth").NextAuthOptions} */
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Username & Password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          throw new Error("Missing credentials");
        }
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        if (!user) throw new Error("Invalid username or password");

        const isValid = await compare(credentials.password, user.password_hash);
        if (!isValid) throw new Error("Invalid username or password");

        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // JWT Callback
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT Callback: User found", user); // Debugging log
        token.id = user.id;
        token.role = user.role;
        token.profileImage = user.profileImage;
      }
      return token;
    },

    // Session Callback
    async session({ session, token }) {
      console.log("Session Callback: Token data", token); // Debugging log
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.profileImage = token.profileImage;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,  // Ensure NEXTAUTH_SECRET is set in the environment
};
