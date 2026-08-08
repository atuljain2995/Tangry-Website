import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'],
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 480, position: 'centre' },
      { name: 'hero', width: 1200, height: 630, position: 'centre' },
    ],
  },
  admin: {
    useAsTitle: 'alt',
    description: 'Upload images for blog posts and recipes',
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
};
