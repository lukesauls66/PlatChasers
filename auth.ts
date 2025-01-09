import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import prismadb from "@/lib/prismadb";
import { signInSchema } from "./lib/zod";
import { compare } from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Facebook,
    Discord,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = await signInSchema.parseAsync(credentials);

        const user = await prismadb.user.findUnique({
          where: {
            email: email,
          },
          include: {
            games: true,
            accounts: true,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Email does not exist");
        }

        const isPasswordValid = await compare(password, user.hashedPassword);

        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        console.log("USER: ", user);
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image || null,
          username: user.username,
          underReview: user.underReview,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt.toISOString(),
          games: user.games, // Include games
          accounts: user.accounts, // Include accounts
        };
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      console.log("Account: ", account, account?.provider);
      if (account?.provider && account?.provider !== "credentials") {
        const existingAccount = await prismadb.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account?.provider,
              providerAccountId: account?.providerAccountId,
            },
          },
        });

        console.log("Existing Account: ", existingAccount);

        if (existingAccount) {
          return true;
        }

        const existingUser = await prismadb.user.findUnique({
          where: { email: user.email || "" },
        });

        console.log("Existing User: ", existingUser);

        if (existingUser) {
          await prismadb.account.create({
            data: {
              userId: existingUser.id,
              type: "oauth",
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              id_token: account.id_token || "",
              token_type: account.token_type,
            },
          });

          return true;
        } else {
          return "/?Variant=register";
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prismadb.user.findUnique({
          where: { id: user.id },
          include: {
            games: true,
            accounts: {
              select: {
                id: true,
                userId: true,
                type: true,
                provider: true,
              },
            },
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.email = dbUser.email;
          token.username = dbUser.username;
          token.underReview = dbUser.underReview;
          token.isAdmin = dbUser.isAdmin;
          token.createdAt = dbUser.createdAt;
          token.games = dbUser.games;
          token.accounts = dbUser.accounts;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.underReview = token.underReview as boolean;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.createdAt = token.createdAt as string;
        session.user.games = token.games as any[];
        session.user.accounts = token.accounts as any[];
      }

      return session;
    },
  },
});
