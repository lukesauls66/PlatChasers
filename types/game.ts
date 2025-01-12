export interface AchievementPost {
  id: string;
  body: string;
  likes: number;
  dislikes: number;
  private: boolean;
  userId: string;
  achievementId: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image: string;
  isUnlocked: boolean;
  achievementPosts: AchievementPost[];
  _count: {
    achievementPosts: number;
  };
}

export interface GamePost {
  id: string;
  body: string;
  likes: number;
  dislikes: number;
  private: boolean;
  userId: string;
  gameId: string;
  createdAt: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  isCompleted: boolean;
  gamePosts: GamePost[];
  achievements: Achievement[];
  _count: {
    gamePosts: number;
    achievements: number;
    achievementPosts: number;
  };
}
