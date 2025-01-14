import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;
  const { achievementId, isUnlocked } = await req.json();

  try {
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
