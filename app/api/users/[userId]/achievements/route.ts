import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const { achievementId, isUnlocked } = await req.json();

    const achievement = await prismadb.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found" });
    }

    const updatedAchievement = await prismadb.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
      update: {
        isUnlocked,
      },
      create: {
        userId,
        achievementId,
        isUnlocked,
      },
    });

    const gameId = achievement.gameId;

    if (isUnlocked) {
      const gameAchievements = await prismadb.achievement.findMany({
        where: { gameId },
      });

      const unlockedAchievements = await prismadb.userAchievement.findMany({
        where: {
          userId,
          achievementId: {
            in: gameAchievements.map((achievement) => achievement.id),
          },
          isUnlocked: true,
        },
      });

      if (unlockedAchievements.length === gameAchievements.length) {
        await prismadb.userFavoriteGame.update({
          where: {
            userId_gameId: { userId, gameId },
          },
          data: {
            isCompleted: true,
          },
        });
      }
    } else {
      await prismadb.userFavoriteGame.update({
        where: {
          userId_gameId: { userId, gameId },
        },
        data: {
          isCompleted: false,
        },
      });
    }

    return NextResponse.json(updatedAchievement);
  } catch (error) {
    console.error("Error updating achievement:", error);
    return NextResponse.json(
      { error: "Failed to unlock achievement" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const url = new URL(req.url);
  const achievementId = url.searchParams.get("achievementId");

  if (!achievementId) {
    return NextResponse.json(
      { error: "Achievement ID is required" },
      { status: 400 }
    );
  }

  try {
    const achievement = await prismadb.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found" });
    }

    const gameId = achievement.gameId;

    await prismadb.userAchievement.delete({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    });

    const gameAchievements = await prismadb.achievement.findMany({
      where: { gameId },
    });

    const unlockedAchievements = await prismadb.userAchievement.findMany({
      where: {
        userId,
        achievementId: {
          in: gameAchievements.map((achievement) => achievement.id),
        },
        isUnlocked: true,
      },
    });

    const isGameCompleted =
      unlockedAchievements.length === gameAchievements.length;

    await prismadb.userFavoriteGame.update({
      where: {
        userId_gameId: { userId, gameId },
      },
      data: {
        isCompleted: isGameCompleted,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting achievement relation:", error);
    return NextResponse.json(
      { error: "Failed to lock achievement" },
      { status: 500 }
    );
  }
}
