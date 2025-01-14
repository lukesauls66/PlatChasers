import prismadb from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";
import currentUser from "@/app/actions/currentUser";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; gamePostId: string }> }
) {
  const { gamePostId } = await params;
  const user = await currentUser();

  try {
    const { body } = await req.json();

    const existingPost = await prismadb.gamePost.findUnique({
      where: { id: gamePostId, userId: user?.id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post couldn't be found" },
        { status: 404 }
      );
    }

    if (!user || user.id !== existingPost.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!body) {
      return NextResponse.json({ error: "Body is required" }, { status: 400 });
    }

    const updatedPost = await prismadb.gamePost.update({
      where: { id: gamePostId },
      data: {
        body,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; gamePostId: string }> }
) {
  const { gamePostId } = await params;
  const user = await currentUser();

  try {
    const post = await prismadb.gamePost.findUnique({
      where: { id: gamePostId, userId: user?.id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (!user || user.id !== post.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prismadb.gamePost.delete({
      where: { id: gamePostId },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
