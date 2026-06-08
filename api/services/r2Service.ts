import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const r2Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
});

const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'insightonix-files';
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-cfbdd8305a414da696e387e1cde70140.r2.dev';

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await r2Client.send(command);
    const fileUrl = `${publicUrl}/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error('R2 Upload Error:', error);
    throw new Error('Failed to upload file to R2');
  }
}

export async function deleteFromR2(fileName: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('R2 Delete Error:', error);
    throw new Error('Failed to delete file from R2');
  }
}

export function getR2FileName(originalName: string, timestamp: number): string {
  const ext = originalName.split('.').pop();
  const sanitized = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\./g, '-')
    .slice(0, 30);

  return `${sanitized}-${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
}

export function extractFileNameFromUrl(url: string): string {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

export function convertLocalPathToR2Url(localPath: string): string {
  if (!localPath) return '';
  if (localPath.startsWith('http')) return localPath;

  const fileName = localPath.split('/').pop() || '';
  return `${publicUrl}/${fileName}`;
}
