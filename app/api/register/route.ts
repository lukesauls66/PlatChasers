import bcrypt from "bcrypt";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { firstName, lastName, email, username, password } = await req.json();

  try {
    const existingUser = await prismadb.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email not available" },
        { status: 422 }
      );
    }

    if (!firstName) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }
    if (!lastName) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json({
        error: "Password must be 8 characters minimum",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating new user:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
