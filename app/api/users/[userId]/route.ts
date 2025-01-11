import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  try {
    const user = await prismadb.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { games: true, gamePosts: true, achievementPosts: true },
        },
        games: {
          select: {
            game: {
              select: {
                title: true,
                image: true,
                isCompleted: true,
              },
            },
          },
        },
        gamePosts: true,
        achievementPosts: true,
        accounts: {
          select: {
            id: true,
            userId: true,
            type: true,
            provider: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completedGameCount = await prismadb.userFavoriteGame.count({
      where: {
        userId: user.id,
        game: { isCompleted: true },
      },
    });

    const userWithCompletedGames = {
      ...user,
      _count: {
        ...user._count,
        completedGameCount,
      },
    };

    return NextResponse.json(userWithCompletedGames);
  } catch (error) {
    console.error("Error getting user: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  const existingUser = await prismadb.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return NextResponse.json(
      { error: "User couldn't be found" },
      { status: 404 }
    );
  }

  try {
    const {
      firstName,
      lastName,
      image,
      email,
      username,
      underReview,
      isAdmin,
    } = await req.json();

    const updatedUser = await prismadb.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        image,
        email,
        username,
        underReview,
        isAdmin,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  try {
    const user = await prismadb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prismadb.user.delete({
      where: { id: userId },
      include: {
        games: true,
        gamePosts: true,
        achievementPosts: true,
        accounts: true,
      },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user: ", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
