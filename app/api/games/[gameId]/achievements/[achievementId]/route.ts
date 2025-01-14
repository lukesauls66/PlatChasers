import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { achievementId: string } }
) {
  const { achievementId } = await params;

  try {
    const achievement = await prismadb.achievement.findUnique({
      where: { id: achievementId },
      include: {
        _count: {
          select: {
            achievementPosts: true,
          },
        },
        achievementPosts: true,
      },
    });

    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Error getting achievement: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { achievementId: string } }
) {
  const { achievementId } = await params;

  try {
    const { title, description, image } = await req.json();

    const existingAchievement = await prismadb.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!existingAchievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    const updatedAchievement = await prismadb.achievement.update({
      where: { id: achievementId },
      data: {
        title,
        description,
        image,
      },
    });

    return NextResponse.json(updatedAchievement);
  } catch (error) {
    console.error("Error updating achievement: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { achievementId: string } }
) {
  const { achievementId } = await params;

  try {
    const achievement = await prismadb.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    await prismadb.achievement.delete({
      where: { id: achievementId },
      include: {
        achievementPosts: true,
      },
    });

    return NextResponse.json({ message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Error deleting achievement: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
