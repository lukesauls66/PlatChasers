import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import currentUser from "@/app/actions/currentUser";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingFavorite = await prismadb.userFavoriteGame.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "Game already favorited by this user" },
        { status: 400 }
      );
    }

    const favorite = await prismadb.userFavoriteGame.create({
      data: {
        userId: user.id,
        gameId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Error favoriting game:", error);
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
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingFavorite = await prismadb.userFavoriteGame.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: gameId,
        },
      },
    });

    if (!existingFavorite) {
      return NextResponse.json(
        { error: "Game not favorited by this user" },
        { status: 400 }
      );
    }

    await prismadb.userFavoriteGame.delete({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: gameId,
        },
      },
    });

    return NextResponse.json({ message: "Game unfavorited successfully" });
  } catch (error) {
    console.error("Error unfavoriting game: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
