import prismadb from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";
import currentUser from "@/app/actions/currentUser";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const user = await currentUser();

  try {
    const { body } = await req.json();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!body) {
      return NextResponse.json({ error: "Body is required" }, { status: 400 });
    }

    const post = await prismadb.gamePost.create({
      data: {
        body,
        gameId,
        userId: user?.id,
        username: user?.username,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating new game post:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
