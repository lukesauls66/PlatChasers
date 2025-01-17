import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; achievementId: string }> }
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; achievementId: string }> }
) {
  const { achievementId } = await params;

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    const existingAchievement = await prismadb.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!existingAchievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    let updatedAchievement;

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
      updatedAchievement = await prismadb.achievement.update({
        where: { id: achievementId },
        data: {
          title,
          description,
          image: imageUrl,
        },
      });
    } else {
      updatedAchievement = await prismadb.achievement.update({
        where: { id: achievementId },
        data: {
          title,
          description,
        },
      });
    }

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
  { params }: { params: Promise<{ gameId: string; achievementId: string }> }
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
