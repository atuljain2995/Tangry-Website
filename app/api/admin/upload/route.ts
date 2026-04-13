import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/auth/user';
import { uploadProductImage } from '@/lib/storage';

const UPLOAD_DIR = 'public/images';
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function getExtension(mime: string, filename: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  if (map[mime]) return map[mime];
  const ext = path.extname(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return ext;
  return '.jpg';
}

/**
 * POST /api/admin/upload
 * FormData field: "file" (image file)
 * Returns { url: "https://... or /images/xxx.jpg" } on success. Admin only.
 * Uses R2 (if configured) or Supabase Storage; otherwise falls back to public/images (local dev only).
 */
export async function POST(request: NextRequest) {
  const profile = await requireAdmin();
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Allowed types: JPEG, PNG, WebP, GIF' }, { status: 400 });
    }

    const ext = getExtension(file.type, file.name);
    const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const fileName = `${baseName}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const storageUrl = await uploadProductImage(buffer, fileName, file.type);
    if (storageUrl) {
      return NextResponse.json({ url: storageUrl });
    }

    // Fallback: local filesystem (local dev only; not persisted on Vercel)
    const dir = path.join(process.cwd(), UPLOAD_DIR);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    await writeFile(filePath, buffer);

    const url = `/images/${fileName}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
