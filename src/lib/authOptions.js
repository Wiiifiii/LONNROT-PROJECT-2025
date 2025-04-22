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
            email: true,
            password_hash: true,
            avatar_url: true,    // ← your DB column
            role: true,
          },
        });

        if (!user) {
          console.error("Auth error: user not found");
          return null;
        }

        const isValid = await compare(
          credentials.password,
          user.password_hash
        );
        if (!isValid) {
          console.error("Auth error: invalid password");
          return null;
        }

        // Return the minimal user object NextAuth needs:
        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
          profileImage: user.avatar_url,  // ← canonical field for your front end
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    jwt({ token, user }) {
      // On sign-in, merge our custom props into the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileImage = user.profileImage;
      }
      return token;
    },

    session({ session, token }) {
      // Expose them on the client `session.user`
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
    error: "/auth/login",   // still mapping all errors to the login page
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
};
