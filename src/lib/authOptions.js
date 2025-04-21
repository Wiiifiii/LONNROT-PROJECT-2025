import CredentialsProvider from "next-auth/providers/credentials"; // Correct import
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";  // Correct import style: default import
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
