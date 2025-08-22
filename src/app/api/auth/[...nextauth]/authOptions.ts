import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { AuthOptions } from "next-auth";
const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
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
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
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
