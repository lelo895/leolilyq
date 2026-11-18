import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'Missing media key' });
  }

  // Sanitize key (strip any directory traversal)
  const sanitizedKey = String(key).replace(/\.\./g, '').replace(/^\//, '');

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'lelo-films',
      Key: sanitizedKey,
    });

    // 120 seconds expiry: sufficient time for the browser <video> player to initiate buffered streaming
    // while preventing public leaking or permanent hotlinking
    const streamUrl = await getSignedUrl(s3, command, { expiresIn: 120 });

    return res.status(200).json({ streamUrl });
  } catch (err) {
    console.error('R2 Presign Error:', err);
    return res.status(500).json({ error: 'Failed to generate secure stream' });
  }
}
