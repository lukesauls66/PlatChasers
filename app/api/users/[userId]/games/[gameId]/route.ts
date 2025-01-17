import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import currentUser from "@/app/actions/currentUser";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; gameId: string }> }
) {
  const { userId, gameId } = await params;

  try {
    const user = await currentUser();

    if (user?.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    const favorite = await prismadb.userFavoriteGame.findUnique({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: gameId,
        },
      },
    });

    return NextResponse.json({ isFavorited: favorite ? true : false });
  } catch (error) {
    console.error("Error getting user favorite game connection", error);
    return NextResponse.json(
      { error: "Failed to fetch connection" },
      { status: 500 }
    );
  }
}
