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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error('Missing credentials');
          }
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
            select: {
              id: true,
              username: true,
              email: true,
              password_hash: true,
              role: true,
              profileImage: true
            }
          });
          if (!user) throw new Error('User not found');
          const isValid = await compare(credentials.password, user.password_hash);
          if (!isValid) throw new Error('Invalid password');

          return {
            id: user.id.toString(),
            name: user.username,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage
          };
        } catch (error) {
          console.error('Auth error:', error.message);
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileImage = user.profileImage;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.profileImage = token.profileImage;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production'
};
