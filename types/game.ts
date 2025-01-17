export interface UserFavoriteGame {
  id: string;
  gameId: string;
  userId: string;
  isCompleted: boolean;
}

export interface AchievementPost {
  id: string;
  body: string;
  likes?: number;
  dislikes?: number;
  private: boolean;
  userId: string;
  achievementId: string;
  createdAt: string;
  username?: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image: string;
  isUnlocked: boolean;
  unlockedBy: {
    isUnlocked: boolean;
  }[];
  achievementPosts: AchievementPost[];
  _count: {
    achievementPosts: number;
  };
}

export interface GamePost {
  id: string;
  body: string;
  likes?: number;
  dislikes?: number;
  private: boolean;
  userId: string;
  gameId: string;
  createdAt: string;
  username?: string | null;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  isCompleted: boolean;
  gamePosts?: GamePost[];
  achievements?: Achievement[];
  favoritedBy?: UserFavoriteGame[];
  _count?: {
    gamePosts: number;
    achievements: number;
    achievementPosts: number;
  };
}

export interface UserCount {
  games: number;
  gamePosts: number;
  achievementPosts: number;
}
