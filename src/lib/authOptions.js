import { PrismaAdapter } from "@next-auth/prisma-adapter"; // Adapter to integrate NextAuth with Prisma
import { PrismaClient } from "@prisma/client"; // Prisma client for database interactions
import CredentialsProvider from "next-auth/providers/credentials"; // Credentials provider for username/password authentication
import { compare } from "bcryptjs"; // Library to compare hashed passwords

const prisma = new PrismaClient(); // Initialize Prisma Client

export const authOptions = {
  // Use PrismaAdapter for storing NextAuth data in the database
  adapter: PrismaAdapter(prisma),
  providers: [
    // Configure CredentialsProvider for sign-in using username and password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Authorization function to validate the provided credentials
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        // Fetch user from the database by username
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          select: {
            id: true,
            username: true,
            email: true,
            password_hash: true,
            avatar_url: true, // Database column for avatar URL
            role: true,
          },
        });
        if (!user) {
          console.error("Auth error: user not found");
          return null;
        }
        // Compare submitted password with the stored hash
        const isValid = await compare(credentials.password, user.password_hash);
        if (!isValid) {
          console.error("Auth error: invalid password");
          return null;
        }
        // Return the minimal user object NextAuth needs
        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
          profileImage: user.avatar_url, // Canonical field for profile image
        };
      },
    }),
  ],
  // Use JWT strategy for sessions
  session: { strategy: "jwt" },
  callbacks: {
    // Callback to merge custom user properties into JWT token
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.name = user.name;
      }
      return token;
    },
    // Callback to expose token properties on the client session object
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.profileImage = token.profileImage;
        session.user.name = token.name;
      }
      return session;
    },
  },
  // Customize NextAuth pages for sign in and error handling
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Map all errors to the login page
  },
  // Customize cookie settings for sessionToken
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret for encrypting the JWT
  debug: process.env.NODE_ENV !== "production", // Enable debug output in non-production environments
};
