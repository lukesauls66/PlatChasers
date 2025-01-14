import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const completedGamesRelations = await prismadb.userFavoriteGame.findMany({
      where: { userId, isCompleted: true },
      include: {
        game: {
          include: {
            _count: {
              select: {
                achievements: true,
              },
            },
            achievements: true,
          },
        },
      },
    });

    const completedGames = completedGamesRelations.map((favoritedGame) => ({
      id: favoritedGame.game.id,
      title: favoritedGame.game.title,
      description: favoritedGame.game.description,
      image: favoritedGame.game.image,
      achievementCount: favoritedGame.game._count.achievements,
      achievements: favoritedGame.game.achievements,
    }));

    return NextResponse.json(completedGames);
  } catch (error) {
    console.error("Error fetching completed games:", error);
    return NextResponse.json(
      { error: "Failed to fetch completed games" },
      { status: 500 }
    );
  }
}
