import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  try {
    const game = await prismadb.game.findUnique({
      where: { id: gameId },
      include: {
        _count: {
          select: {
            gamePosts: true,
            achievements: true,
          },
        },
        gamePosts: true,
        achievements: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            _count: {
              select: {
                achievementPosts: true,
              },
            },
            achievementPosts: true,
          },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error getting game: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKey || !secretAccessKey || !bucketRegion || !bucketName) {
  throw new Error(
    "AWS S3 configuration is missing required environment variables."
  );
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;
    // const { title, description, image } = await req.json();

    const existingGame = await prismadb.game.findUnique({
      where: { id: gameId },
    });

    if (!existingGame) {
      return NextResponse.json(
        { error: "Game couldn't be found" },
        { status: 404 }
      );
    }

    let updatedGame;

    if (image) {
      const fileKey = `images/${Date.now()}_${image.name}`;

      const uploadParams = {
        Bucket: bucketName,
        Key: fileKey,
        Body: new Uint8Array(await image.arrayBuffer()),
        ContentType: image.type,
      };

      const uploadCommand = new PutObjectCommand(uploadParams);
      await s3.send(uploadCommand);

      const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileKey}`;

      updatedGame = await prismadb.game.update({
        where: { id: gameId },
        data: {
          title,
          description,
          image: imageUrl,
        },
      });
    } else {
      updatedGame = await prismadb.game.update({
        where: { id: gameId },
        data: {
          title,
          description,
        },
      });
    }

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("Error updating game: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  try {
    const game = await prismadb.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    await prismadb.game.delete({
      where: { id: gameId },
      include: {
        favoritedBy: true,
        gamePosts: true,
        achievements: true,
      },
    });

    return NextResponse.json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error deleting game: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
