import { Buffer } from "buffer";
import { action } from "./_generated/server";
import { v } from "convex/values";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {setRateLimit} from "./Redis/GitHubData/GithubToken";

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export const uploadThumbnail = action({
  args: {
    fileName: v.string(),
    contentType: v.string(),
    fileData: v.bytes(),
  },
  handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await setRateLimit("uploadThumbnail",identity.subject)


    const safeName = args.fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const key = `thumbnails/${Date.now()}-${safeName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: "we-kraft",
        Key: key,
        Body: Buffer.from(args.fileData),
        ContentType: args.contentType,
        CacheControl: "no-store",
      })
    );


    return {
      key,
      url: `https://we-kraft.s3.eu-north-1.amazonaws.com/${key}`,
    };
  },
});



// Delete image from teh S3
export const deleteThumbnail = action({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {


    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    await setRateLimit("deleteThumbnail",identity.subject)

    await s3.send(
      new DeleteObjectCommand({
        Bucket: "we-kraft",
        Key: args.key,
      })
    );

    return { success: true };
  },
});
