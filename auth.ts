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
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Email does not exist");
        }

        const isPasswordValid = await compare(password, user.hashedPassword);

        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        console.log("USER: ", user);
        return user;
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
  },
});

// async function handleAccountLinking(user, account, profile) {
//   const existingAccount = await prismadb.account.findUnique({
//     where: {
//       provider_providerAccountId: {
//         provider: account?.provider,
//         providerAccountId: account?.providerAccountId,
//       },
//     },
//   });

//   if (existingAccount) {
//     return true;
//   }

//   const existingUser = await prismadb.user.findUnique({
//     where: { email: user.email },
//   });

//   if (existingUser) {
//     await prismadb.account.create({
//       data: {
//         userId: existingUser.id,
//         type: "oauth",
//         provider: account.provider,
//         providerAccountId: account.providerAccountId,
//         access_token: account.access_token,
//         refresh_token: account.refresh_token,
//         expires_at: account.expires_at,
//         id_token: account.id_token,
//         token_type: account.token_type,
//       },
//     });

//     return true;
//   } else {
//     return {
//       redirect: "/?Variant=register",
//     };
//   }
// }
