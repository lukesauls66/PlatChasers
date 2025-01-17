import prismadb from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    const existingGame = await prismadb.game.findUnique({
      where: { id: gameId },
    });

    if (!existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
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

    const newAchievement = await prismadb.achievement.create({
      data: {
        title,
        description,
        image: imageUrl,
        gameId,
      },
    });

    return NextResponse.json(newAchievement, { status: 201 });
  } catch (error) {
    console.error("Error creating new achievement:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
