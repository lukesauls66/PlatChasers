import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  try {
    const completedGamesRelations = await prismadb.userFavoriteGame.findMany({
      where: { userId, isCompleted: true },
      include: { game: true },
    });

    console.log("Relations: ", completedGamesRelations);

    const completedGames = completedGamesRelations.map(
      (favoritedGame) => favoritedGame.game
    );

    console.log("Games: ", completedGames);

    return NextResponse.json(completedGames);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch completed games" },
      { status: 500 }
    );
  }
}
