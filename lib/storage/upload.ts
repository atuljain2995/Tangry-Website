/**
 * Product image storage abstraction.
 * Tries R2 first (when configured), then Supabase Storage, then returns null
 * so the caller can fall back to local filesystem (local dev only).
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const SUPABASE_BUCKET = 'product-images';

function isR2Configured(): boolean {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;
  return !!(accountId && accessKeyId && secretAccessKey && bucket && publicUrl);
}

/**
 * Upload to Cloudflare R2 via S3-compatible API.
 * Requires: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL.
 * R2_PUBLIC_URL = base URL for public access (e.g. https://pub-xxx.r2.dev or custom domain).
 */
async function uploadToR2(
  buffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string | null> {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBaseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    return null;
  }

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

  const client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return `${publicBaseUrl}/${fileName}`;
  } catch (err) {
    console.error('R2 upload error:', err);
    return null;
  }
}

/**
 * Upload to the public "product-images" bucket via the Supabase Storage HTTP API.
 * Requires SUPABASE_STORAGE_URL (https://<ref>.supabase.co) and SUPABASE_STORAGE_KEY (secret key).
 */
async function uploadToSupabaseStorage(
  buffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string | null> {
  const baseUrl = process.env.SUPABASE_STORAGE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_STORAGE_KEY;
  if (!baseUrl || !key) return null;

  const path = fileName.split('/').map(encodeURIComponent).join('/');
  try {
    const res = await fetch(`${baseUrl}/storage/v1/object/${SUPABASE_BUCKET}/${path}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': contentType,
        'x-upsert': 'true',
      },
      body: new Uint8Array(buffer),
    });
    if (!res.ok) {
      console.error('Supabase Storage upload error:', res.status, await res.text());
      return null;
    }
    return `${baseUrl}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`;
  } catch (err) {
    console.error('Supabase Storage upload error:', err);
    return null;
  }
}

/**
 * Upload a product image. Priority: R2 (if configured) → Supabase Storage → null.
 * Returns the public URL on success, or null if no backend is configured or upload fails.
 */
export async function uploadProductImage(
  buffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string | null> {
  if (isR2Configured()) {
    const url = await uploadToR2(buffer, fileName, contentType);
    if (url) return url;
  }
  return uploadToSupabaseStorage(buffer, fileName, contentType);
}
