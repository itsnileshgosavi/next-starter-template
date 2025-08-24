import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email?.trim() || !credentials?.password?.trim()) {
          throw new Error("Email and password are required");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user) {
          throw new Error("User not found");
        }
        
        if (!user.password) {
          throw new Error("Invalid password");
        }
        
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }
        return {
          id: user?.id ?? "",
          name: user?.name ?? "",
          email: user?.email ?? "",
          image: user?.image ?? "",
          role: user?.role as string | null ?? null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        //search user in db by instagram id
        const dbUser = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
        });
        if (!dbUser) {
          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              image: user.image,
            },
          });
        }
        return true;
      }
      return false;
    },
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          id: account.providerAccountId,
          name: user.name,
          email: user.email,
          ...token,
        };
      }

      // Return previous token if the current token has not expired
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.role = token.role as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
  debug: process.env.NODE_ENV === "development",
  theme: {
    logo: "/next.svg",
    brandColor: "#1976d2",
    colorScheme: "light",
  },
};

export default authOptions;
