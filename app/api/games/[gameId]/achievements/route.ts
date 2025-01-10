import prismadb from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const { gameId } = await params;
  const { title, description, image } = await req.json();

  try {
    const existingGame = await prismadb.game.findUnique({
      where: { id: gameId },
    });

    if (!existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
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

    const newAchievement = await prismadb.achievement.create({
      data: {
        title,
        description,
        image,
        gameId,
      },
    });

    return NextResponse.json(newAchievement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
