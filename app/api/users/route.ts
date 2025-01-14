import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const demoEmails = [
      "demo-good@example.com",
      "demo-bad@example.com",
      "demo-admin@example.com",
    ];

    const users = await prismadb.user.findMany({
      where: {
        email: {
          notIn: demoEmails,
        },
        isAdmin: false,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        email: true,
        username: true,
        underReview: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { games: true, gamePosts: true, achievementPosts: true },
        },
        games: {
          select: {
            game: {
              select: {
                id: true,
                title: true,
                description: true,
                image: true,
                _count: {
                  select: {
                    achievements: true,
                  },
                },
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
      orderBy: {
        firstName: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
