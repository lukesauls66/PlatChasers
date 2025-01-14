import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  try {
    const game = await prismadb.game.findUnique({
      where: { id: gameId },
      include: {
        _count: {
          select: {
            gamePosts: true,
            achievements: true,
          },
        },
        gamePosts: true,
        achievements: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            _count: {
              select: {
                achievementPosts: true,
              },
            },
            achievementPosts: true,
          },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error getting game: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  try {
    const { title, description, image } = await req.json();

    const existingGame = await prismadb.game.findUnique({
      where: { id: gameId },
    });

    if (!existingGame) {
      return NextResponse.json(
        { error: "Game couldn't be found" },
        { status: 404 }
      );
    }

    const updatedGame = await prismadb.game.update({
      where: { id: gameId },
      data: {
        title,
        description,
        image,
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("Error updating game: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  try {
    const game = await prismadb.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    await prismadb.game.delete({
      where: { id: gameId },
      include: {
        favoritedBy: true,
        gamePosts: true,
        achievements: true,
      },
    });

    return NextResponse.json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error deleting game: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
