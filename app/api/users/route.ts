import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prismadb.user.findMany({
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
        games: true,
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

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
