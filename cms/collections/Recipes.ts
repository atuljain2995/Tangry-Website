import type { CollectionConfig } from 'payload';

export const Recipes: CollectionConfig = {
  slug: 'recipes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'difficulty', 'status', 'featured'],
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
    },
    { name: 'seoDescription', type: 'text', maxLength: 160 },
    {
      name: 'keywords',
      type: 'array',
      fields: [{ name: 'keyword', type: 'text' }],
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'prepTime',
      type: 'number',
      required: true,
      admin: { description: 'Minutes' },
    },
    {
      name: 'cookTime',
      type: 'number',
      required: true,
      admin: { description: 'Minutes' },
    },
    { name: 'servings', type: 'number', required: true },
    {
      name: 'difficulty',
      type: 'select',
      options: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    { name: 'category', type: 'text', required: true },
    { name: 'cuisine', type: 'text', defaultValue: 'Indian' },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'ingredients',
      type: 'array',
      required: true,
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'instructions',
      type: 'array',
      required: true,
      fields: [
        { name: 'step', type: 'number', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
    {
      name: 'tips',
      type: 'array',
      fields: [{ name: 'tip', type: 'textarea' }],
    },
    {
      name: 'productLink',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published', 'scheduled'],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
  ],
};
