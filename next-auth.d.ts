import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      username: string;
      underReview: boolean;
      isAdmin: boolean;
      createdAt: string;
      games: any[];
      accounts: any[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    underReview: boolean;
    isAdmin: boolean;
    createdAt: string;
    games: any[];
    accounts: any[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    underReview: boolean;
    isAdmin: boolean;
    createdAt: string;
    games: any[];
    accounts: any[];
  }
}
