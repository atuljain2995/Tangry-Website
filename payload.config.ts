import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { buildConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
import { Media } from './cms/collections/Media';
import { Authors } from './cms/collections/Authors';
import { BlogPosts } from './cms/collections/BlogPosts';
import { Recipes } from './cms/collections/Recipes';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // /admin is the existing in-house dashboard, so Payload is served from /cms.
  routes: {
    admin: '/cms',
  },
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' — Tangry CMS',
    },
  },
  editor: lexicalEditor(),
  collections: [Media, Authors, BlogPosts, Recipes, {
    slug: 'users',
    auth: true,
    admin: { useAsTitle: 'email' },
    fields: [
      { name: 'name', type: 'text' },
      { name: 'role', type: 'select', options: ['admin', 'editor', 'author'], defaultValue: 'author' },
    ],
  }],
  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-payload-secret-at-least-32-chars',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.PAYLOAD_DATABASE_URL || process.env.DATABASE_URL || '',
    },
  }),
  plugins: [
    s3Storage({
      collections: { media: { prefix: 'cms' } },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'ap-south-1',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'cms/payload-types.ts'),
  },
});
