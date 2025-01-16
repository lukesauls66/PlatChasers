import prismadb from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";
import formidable from "formidable";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import fs from "fs";

export async function GET() {
  try {
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

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readableStreamToBuffer(
  readableStream: ReadableStream
): Promise<Buffer> {
  const reader = readableStream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

async function requestToIncomingMessage(
  req: Request
): Promise<IncomingMessage> {
  const bodyBuffer = await readableStreamToBuffer(req.body!);

  const readable = new Readable();
  readable._read = () => {};
  readable.push(bodyBuffer);
  readable.push(null);

  const incomingMessage = readable as unknown as IncomingMessage;
  incomingMessage.headers = Object.fromEntries(req.headers.entries());
  return incomingMessage;
}

export async function POST(req: NextRequest) {
  try {
    const incomingReq = await requestToIncomingMessage(req);
    const form = formidable({ multiples: true });

    const parsedData = await new Promise<{ fields: any; files: any }>(
      (resolve, reject) => {
        form.parse(incomingReq, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    const { fields, files } = parsedData;

    const { title, description } = fields;
    const image = files.image ? files.image[0] : null;

    const existingGame = await prismadb.game.findUnique({
      where: { title: title[0] },
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

    if (!image.filepath || !image.mimetype) {
      return NextResponse.json(
        { error: "Invalid image file" },
        { status: 400 }
      );
    }

    const fileKey = `images/${Date.now()}_${image.originalFilename}`;
    const fileBuffer = fs.readFileSync(image.filepath);

    console.log("fileKey: ", fileKey);
    console.log("fileBuffer: ", fileBuffer);

    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: image.mimetype,
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3.send(uploadCommand);

    const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileKey}`;

    const newGame = await prismadb.game.create({
      data: {
        title: title[0],
        description: description[0],
        image: imageUrl,
      },
    });

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error("Error creating new game:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
