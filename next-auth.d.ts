import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";
import { Game, GamePost, AchievementPost, UserCount } from "./types/game";

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
      games: Game[];
      gamePosts: GamePost[];
      achievementPosts: AchievementPost[];
      _count: UserCount;
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
    games: Game[];
    gamePosts: GamePost[];
    achievementPosts: AchievementPost[];
    _count: UserCount;
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
    games: Game[];
    gamePosts: GamePost[];
    achievementPosts: AchievementPost[];
    _count: UserCount;
    accounts: any[];
  }
}
