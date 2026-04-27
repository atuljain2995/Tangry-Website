/**
 * Product image storage abstraction.
 * Tries R2 first (when configured), then Supabase Storage, then returns null
 * so the caller can fall back to local filesystem (local dev only).
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { supabaseAdmin } from '@/lib/db/supabase';

const STORAGE_BUCKET = 'product-images';

function isR2Configured(): boolean {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;
  return !!(accountId && accessKeyId && secretAccessKey && bucket && publicUrl);
}

function isSupabaseStorageConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(url && key && key !== 'placeholder-service-key');
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
 * Upload to Supabase Storage.
 * Requires a public bucket named "product-images" in Supabase Dashboard → Storage.
 */
async function uploadToSupabaseStorage(
  buffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string | null> {
  if (!isSupabaseStorageConfigured()) {
    return null;
  }

  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error('Supabase Storage upload error:', error);
    return null;
  }

  const { data: urlData } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
  return urlData?.publicUrl ?? null;
}

/**
 * Upload a product image to the configured storage backend.
 * Priority: R2 (if env vars set) → Supabase Storage → null.
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

  const url = await uploadToSupabaseStorage(buffer, fileName, contentType);
  if (url) return url;

  return null;
}
