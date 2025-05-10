/**
 * authOptions.js
 *
 * Configures NextAuth authentication using a Prisma adapter.
 * It uses credentials-based authentication to verify the user's password,
 * and sets up JWT and session callbacks to include user id, role, name, and profile image.
 *
 * Dependencies: @next-auth/prisma-adapter, @prisma/client, next-auth/providers/credentials, and bcryptjs.
 */

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            password_hash: true,
            avatar_url: true,
            role: true,
          },
        });

        if (!user) {
          console.error("Auth error: user not found");
          return null;
        }

        const isValid = await compare(credentials.password, user.password_hash);
        if (!isValid) {
          console.error("Auth error: invalid password");
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.displayName || user.username,
          email: user.email,
          role: user.role,
          profileImage: user.avatar_url,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.profileImage = user.profileImage;
      }
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.profileImage = session.user.profileImage;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.profileImage = token.profileImage;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
};
