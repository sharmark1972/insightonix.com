/**
 * Script to upload all existing files from /uploads folder to R2
 * Run: npm run upload:r2
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

dotenv.config();

const r2Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || 'https://e20bfdb968e364b46cb8623c32a2b8ca.r2.cloudflarestorage.com',
  forcePathStyle: true,
});

const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'insightonix-files';
const uploadsDir = path.resolve('./uploads');

async function uploadFileToR2(filePath: string, fileName: string): Promise<boolean> {
  try {
    const fileContent = fs.readFileSync(filePath);
    const mimeType = getMimeType(filePath);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: mimeType,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error);
    return false;
  }
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.zip': 'application/zip',
    '.txt': 'text/plain',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

async function main() {
  console.log('🚀 Starting File Upload to R2...\n');

  // Verify credentials
  const accessKey = process.env.CLOUDFLARE_ACCESS_KEY_ID;
  const secretKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;

  if (!accessKey || !secretKey) {
    console.log('❌ ERROR: Missing credentials!');
    console.log('   - CLOUDFLARE_ACCESS_KEY_ID:', accessKey ? '✓ Set' : '✗ Missing');
    console.log('   - CLOUDFLARE_SECRET_ACCESS_KEY:', secretKey ? '✓ Set' : '✗ Missing');
    console.log('\n   Make sure .env file has these variables!');
    process.exit(1);
  }

  console.log(`✓ Credentials loaded`);
  console.log(`✓ Endpoint: ${endpoint || 'default R2'}`);
  console.log(`✓ Bucket: ${bucketName}`);
  console.log(`✓ Source: ${uploadsDir}\n`);

  // Check if uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    console.log('❌ /uploads folder not found!');
    process.exit(1);
  }

  try {
    // Get all files recursively
    const allFiles: { path: string; name: string }[] = [];

    function walkDir(dir: string) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else {
          // Store relative path from uploads folder
          const relativePath = path.relative(uploadsDir, filePath);
          allFiles.push({
            path: filePath,
            name: relativePath.replace(/\\/g, '/'), // Convert Windows paths to forward slash
          });
        }
      }
    }

    walkDir(uploadsDir);

    if (allFiles.length === 0) {
      console.log('ℹ️  No files found in /uploads folder');
      process.exit(0);
    }

    console.log(`📁 Found ${allFiles.length} file(s) to upload\n`);

    let successCount = 0;
    let failCount = 0;

    // Upload files with progress
    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i];
      const progress = `[${i + 1}/${allFiles.length}]`;

      process.stdout.write(`${progress} Uploading: ${file.name}... `);

      const success = await uploadFileToR2(file.path, file.name);

      if (success) {
        console.log('✓');
        successCount++;
      } else {
        console.log('✗');
        failCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Upload Summary:`);
    console.log(`   ✓ Success: ${successCount}`);
    if (failCount > 0) {
      console.log(`   ✗ Failed: ${failCount}`);
    }
    console.log('='.repeat(50));

    if (failCount === 0) {
      console.log('\n✅ All files uploaded successfully to R2!');
      console.log('\n🎉 You can now safely delete the /uploads folder');
      process.exit(0);
    } else {
      console.log(`\n⚠️  ${failCount} file(s) failed to upload. Please check credentials.`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Upload process failed:', error);
    process.exit(1);
  }
}

main();
