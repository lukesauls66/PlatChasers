import prismadb from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const games = await prismadb.game.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        isCompleted: true,
        _count: {
          select: { gamePosts: true, achievements: true },
        },
        gamePosts: true,
        achievements: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            isUnlocked: true,
          },
        },
      },
    });

    const gamesWithUnlockedAchievements = await Promise.all(
      games.map(async (game) => {
        const unlockedAchievementCount = await prismadb.achievement.count({
          where: {
            gameId: game.id,
            isUnlocked: true,
          },
        });
        return {
          ...game,
          _count: {
            ...game._count,
            unlockedAchievements: unlockedAchievementCount,
          },
        };
      })
    );

    return NextResponse.json(gamesWithUnlockedAchievements);
  } catch (error) {
    console.log("Error getting all games: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { title, description, image } = await req.json();

  try {
    const existingGame = await prismadb.game.findUnique({
      where: { title },
    });

    if (existingGame) {
      return NextResponse.json(
        { error: "Game title not available" },
        { status: 422 }
      );
    }

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const game = await prismadb.game.create({
      data: {
        title,
        description,
        image,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
