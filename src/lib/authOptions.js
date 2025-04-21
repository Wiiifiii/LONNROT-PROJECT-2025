import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import CredentialsProvider from "next-auth/providers/credentials"; // Credentials provider for login
//import prisma from "./prisma";  // Prisma client import
import { compare } from "bcryptjs";  // Password comparison
// Create Prisma client instance
const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma), // Use PrismaAdapter with PrismaClient
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

        // Fetch user from Prisma
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) throw new Error("Invalid username or password");

        // Check password using bcryptjs
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileImage = user.profileImage;
      }
      return token;
    },
    async session({ session, token }) {
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
  secret: process.env.NEXTAUTH_SECRET,
};

export default (req, res) => NextAuth(req, res, authOptions);
