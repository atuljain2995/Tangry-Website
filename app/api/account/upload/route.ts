import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getSessionUser } from '@/lib/auth/session';
import { uploadProductImage } from '@/lib/storage';

const UPLOAD_DIR = 'public/avatars';
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB avatars
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function getExtension(mime: string, filename: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  if (map[mime]) return map[mime];
  const ext = path.extname(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return ext === '.jpeg' ? '.jpg' : ext;
  return '.jpg';
}

/**
 * POST /api/account/upload — profile photo for signed-in customer (not admin-gated).
 */
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image too large (max 2MB)' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Use JPEG, PNG, or WebP' }, { status: 400 });
    }

    const ext = getExtension(file.type, file.name);
    const fileName = `avatars/${user.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const storageUrl = await uploadProductImage(buffer, fileName, file.type);
    if (storageUrl) {
      return NextResponse.json({ url: storageUrl });
    }

    const dir = path.join(process.cwd(), UPLOAD_DIR);
    await mkdir(dir, { recursive: true });
    const localName = `${user.id}-${Date.now()}${ext}`;
    const filePath = path.join(dir, localName);
    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/avatars/${localName}` });
  } catch (e) {
    console.error('Account upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
