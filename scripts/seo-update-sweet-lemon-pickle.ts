/**
 * One-off: strengthen SEO content for sweet-lemon-pickle PDP (GSC: ranks
 * position ~27 for "sweet lemon pickle", 32 impressions, 0 clicks — needs
 * more on-page keyword depth, not a net-new page).
 * Run: npx tsx scripts/seo-update-sweet-lemon-pickle.ts
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const description = `Tangry Sweet Lemon Pickle offers the perfect sweet-tangy balance that pairs beautifully with everyday Indian meals. This Jaipur-made Rajasthani-style sweet lemon pickle adds gentle citrus brightness and depth to simple food, making each bite more enjoyable.

Prepared with lemon and traditional pickle spices, the flavor profile is rounded with pleasant sweetness, mild warmth, and a clean tangy finish. It is ideal for families who like flavorful pickles without extreme heat, and for anyone searching for an authentic homestyle sweet lemon pickle instead of a mass-market, overly sour jar.

How to use: serve a small spoon of sweet lemon pickle with paratha, thepla, dal-rice, and lunchbox rotis. You can also pair it with khichdi, stuffed flatbreads, curd rice, and dry sabzi meals where a sweet-citrus side improves balance.

Why Tangry: produced in Jaipur with quality-led batch preparation, FSSAI licensed standards, and an ISO 22000-oriented process framework for hygiene and consistency in every jar of sweet lemon pickle.

Serving suggestion: pair with methi thepla, plain yogurt, and roasted papad, or enjoy with soft phulka and dal for a comforting homestyle plate. It also travels well with curd rice and other travel meals.`;

async function main() {
  const { data, error } = await supabase
    .from('products')
    .update({
      meta_title: 'Sweet Lemon Pickle Online — Homestyle Rajasthani Achar | Tangry Spices',
      meta_description:
        'Buy sweet lemon pickle online from Tangry Spices, Jaipur. Homestyle Rajasthani sweet-tangy lemon achar. FSSAI licensed. Free shipping on orders ₹500+.',
      keywords: [
        'sweet lemon pickle',
        'sweet lemon pickle online',
        'rajasthani lemon pickle',
        'meetha nimbu achar',
        'homemade lemon pickle jaipur',
      ],
      description,
    })
    .eq('slug', 'sweet-lemon-pickle')
    .select('slug, meta_title, meta_description, keywords');

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
}

main();
