const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const accountId = process.env.R2_ACCOUNT_ID || "4f0ee97949dd41bd8444b251ccb2f5f5";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "c80eddc768d381ffebdc7b028b50a94f";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "af54c4fdeffdfe32b4e38ab3e68bf894d6d791e35e4efc5c134f49a62115f895";
const bucketName = process.env.R2_BUCKET_NAME || "98studio";
const publicUrl = (process.env.R2_PUBLIC_URL || "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev").replace(/\/$/, "");

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function uploadToR2({ key, body, contentType }) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `${publicUrl}/${key}`;
}

module.exports = {
  s3Client,
  uploadToR2,
  bucketName,
  publicUrl,
};
