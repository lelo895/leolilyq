/**
 * Cloudflare R2 Upload Script
 * Uploads all video files and webp images from 'public/' to Cloudflare R2 bucket.
 * Run with: npm run upload-films
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const BUCKET = process.env.R2_BUCKET_NAME || 'lelo-films';

const mimeTypes = {
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

function getAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.webp', '.webm', '.mp4', '.mov', '.png', '.jpg', '.svg'].includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

async function uploadFile(absoluteFilePath) {
  const relativePath = path.relative(PUBLIC_DIR, absoluteFilePath);
  const ext = path.extname(absoluteFilePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const stats = fs.statSync(absoluteFilePath);

  // Check if object already exists with matching size
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: relativePath }));
    if (head.ContentLength === stats.size) {
      console.log(`- Skipped [${relativePath}] (already up to date)`);
      return;
    }
  } catch (err) {
    // 404/NoSuchKey means we need to upload
  }

  const fileStream = fs.createReadStream(absoluteFilePath);
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: relativePath,
    Body: fileStream,
    ContentType: contentType,
  });

  await s3.send(command);
  console.log(`✓ Uploaded [${relativePath}] (${(stats.size / 1024).toFixed(0)} KB)`);
}

async function run() {
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID) {
    console.error('Error: Missing R2 environment variables. Ensure .env.local exists.');
    process.exit(1);
  }

  const files = getAllFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} media files (videos + webp images) to sync to R2 bucket [${BUCKET}]:\n`);

  let count = 0;
  for (const file of files) {
    count++;
    try {
      process.stdout.write(`[${count}/${files.length}] `);
      await uploadFile(file);
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err.message);
    }
  }

  console.log(`\n🎉 All ${files.length} media assets synced successfully to Cloudflare R2!`);
}

run();
