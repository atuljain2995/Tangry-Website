/**
 * Migrates existing static blog/recipe data from lib/data/*.ts into Payload CMS.
 *
 * Usage: PAYLOAD_SECRET=... DATABASE_URL=... npx tsx scripts/migrate-to-cms.ts
 *
 * Run this ONCE after you've started the CMS for the first time (tables created)
 * and created the initial admin user at /admin.
 */
import 'dotenv/config';

async function main() {
  const { getPayload } = await import('payload');
  const { default: config } = await import('../payload.config');

  const payload = await getPayload({ config });

  // Create default author
  const existingAuthors = await payload.find({ collection: 'authors', where: { name: { equals: 'Tangry Spices' } }, limit: 1 });
  let authorId: string;
  if (existingAuthors.docs.length > 0) {
    authorId = existingAuthors.docs[0].id as string;
    console.log('Author already exists:', authorId);
  } else {
    const author = await payload.create({
      collection: 'authors',
      data: { name: 'Tangry Spices', role: 'Jaipur spice makers' },
    });
    authorId = author.id as string;
    console.log('Created author:', authorId);
  }

  // --- Migrate Recipes ---
  const { recipes } = await import('../lib/data/recipes');
  console.log(`\nMigrating ${recipes.length} recipes...`);

  for (const recipe of recipes) {
    const exists = await payload.find({ collection: 'recipes', where: { slug: { equals: recipe.slug } }, limit: 1 });
    if (exists.docs.length > 0) {
      console.log(`  ⏭ Recipe "${recipe.slug}" already exists, skipping`);
      continue;
    }

    await payload.create({
      collection: 'recipes',
      data: {
        title: recipe.title,
        slug: recipe.slug,
        seoDescription: recipe.seoDescription,
        keywords: recipe.keywords.map((k) => ({ keyword: k })),
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        category: recipe.category,
        cuisine: recipe.cuisine,
        featured: recipe.featured,
        ingredients: recipe.ingredients.map((item) => ({ item })),
        instructions: recipe.instructions.map((i) => ({ step: i.step, text: i.text })),
        tips: recipe.tips.map((tip) => ({ tip })),
        productLink: recipe.productLink,
        author: authorId,
        publishedAt: recipe.date,
        status: 'published',
      },
    });
    console.log(`  ✓ Recipe "${recipe.slug}" created`);
  }

  // --- Migrate Blog Posts ---
  const { blogPosts } = await import('../lib/data/blog');
  console.log(`\nMigrating ${blogPosts.length} blog posts...`);

  for (const post of blogPosts) {
    const exists = await payload.find({ collection: 'blog-posts', where: { slug: { equals: post.slug } }, limit: 1 });
    if (exists.docs.length > 0) {
      console.log(`  ⏭ Blog "${post.slug}" already exists, skipping`);
      continue;
    }

    await payload.create({
      collection: 'blog-posts',
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        seoDescription: post.seoDescription || post.excerpt,
        category: post.category,
        tags: post.tags.map((tag) => ({ tag })),
        productLinks: post.productLinks,
        faqs: post.faqs || [],
        author: authorId,
        publishedAt: post.date,
        status: 'published',
      },
    });
    console.log(`  ✓ Blog "${post.slug}" created`);
  }

  console.log('\n✅ Migration complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
