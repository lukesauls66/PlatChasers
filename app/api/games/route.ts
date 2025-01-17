import prismadb from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import currentUser from "@/app/actions/currentUser";

export async function GET() {
  try {
    const user = await currentUser();

    const games = await prismadb.game.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        _count: {
          select: { gamePosts: true, achievements: true },
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
            unlockedBy: {
              where: {
                userId: user?.id,
              },
              select: {
                isUnlocked: true,
              },
            },
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    const existingGame = await prismadb.game.findUnique({
      where: { title },
    });

    if (existingGame) {
      return NextResponse.json(
        { error: "Game title not available" },
        { status: 422 }
      );
    }

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

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

    const newGame = await prismadb.game.create({
      data: {
        title,
        description,
        image: imageUrl,
      },
    });

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error("Error creating new game:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
