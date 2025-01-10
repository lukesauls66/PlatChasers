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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error getting user: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

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
  req: Request,
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
