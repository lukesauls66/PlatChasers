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
  adapter: PrismaAdapter(prismadb),
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
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
