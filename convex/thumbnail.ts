"use node";

import { Buffer } from "buffer";
import { action } from "./_generated/server";
import { v } from "convex/values";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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
    console.log("Upload Image is Running at : ", Date.now())

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

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


    console.log("Upload Image is Finshed at : ", Date.now())


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
  handler: async (_, args) => {
    console.log("Delete Image is Running at : ", Date.now())
    await s3.send(
      new DeleteObjectCommand({
        Bucket: "we-kraft",
        Key: args.key,
      })
    );

    console.log("Delete Image is Finshed at : ", Date.now())
    return { success: true };
  },
});
