/**
 * One-off: generates recipe hero images via the Gemini image model and writes
 * them to public/images/recipes/. Requires GEMINI_API_KEY in .env.local.
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { mkdir, writeFile } from 'fs/promises';

config({ path: resolve(process.cwd(), '.env.local') });

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
const OUT_DIR = resolve(process.cwd(), 'public/images/recipes');

const STYLE =
  'Professional food photography, appetising, styled on a rustic Indian home kitchen surface, ' +
  'soft natural window daylight, shallow depth of field, 16:9 landscape composition, high detail, ' +
  'no text, no watermark, no packaging, no logos.';

const IMAGES: { file: string; prompt: string }[] = [
  {
    file: 'peri-peri-fries.jpg',
    prompt: `Overhead shot of crispy golden french fries piled in a steel bowl, generously dusted with vivid red-orange chilli-garlic peri peri seasoning, scattered fresh chopped coriander, a lemon wedge on the side. ${STYLE}`,
  },
  {
    file: 'vada-pav.jpg',
    prompt: `Two authentic Mumbai vada pav on a steel plate, golden deep-fried batata vada inside soft pav buns, coarse red dry garlic chutney powder visible at the edges, a blistered fried green chilli beside them. ${STYLE}`,
  },
  {
    file: 'dabeli.jpg',
    prompt: `Kutchi dabeli on a steel plate: soft pav bun filled with spiced mashed potato, topped generously with fine yellow sev, bright red pomegranate seeds, roasted peanuts and fresh coriander. Gujarati street food styling. ${STYLE}`,
  },
  {
    file: 'masala-chaas.jpg',
    prompt: `Two tall glasses of frothy white Indian spiced buttermilk (masala chaas) with a thick foam head, fresh mint leaf garnish, a light dusting of roasted cumin on top, condensation on the glass, ice cubes. Bright refreshing summer mood. ${STYLE}`,
  },
  {
    file: 'poha-jeeravan.jpg',
    prompt: `A bowl of fluffy yellow Indori poha (flattened rice) topped with thin crispy sev, pomegranate seeds, roasted peanuts and fresh coriander, a lemon wedge on the side, cup of chai nearby. Indian breakfast scene, morning light. ${STYLE}`,
  },
  {
    file: 'podi-idli.jpg',
    prompt: `White steamed idli cut into wedges, tossed in glossy ghee and coated in coarse red-brown South Indian podi powder, served on a steel plate with a small mound of podi and a spoon of ghee beside. ${STYLE}`,
  },
  {
    file: 'pav-bhaji.jpg',
    prompt: `Mumbai pav bhaji: deep red buttery mashed vegetable curry in a steel plate with a cube of butter melting on top, chopped raw onion and a lemon wedge on the side, two golden butter-toasted pav buns. ${STYLE}`,
  },
  {
    file: 'paratha-lemon-pickle.jpg',
    prompt: `Flaky triangular whole-wheat Rajasthani paratha with visible golden layers on a steel plate, a small bowl of glossy sweet lemon pickle and a bowl of thick white curd alongside. Homestyle Indian breakfast. ${STYLE}`,
  },
];

async function generate(prompt: string): Promise<Buffer> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'x-goog-api-key': API_KEY as string, 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const image = parts.find((p: { inlineData?: { data: string } }) => p.inlineData?.data);

  if (!image) {
    throw new Error(`No image in response: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return Buffer.from(image.inlineData.data, 'base64');
}

async function main() {
  if (!API_KEY) throw new Error('GEMINI_API_KEY missing from .env.local');
  await mkdir(OUT_DIR, { recursive: true });

  for (const { file, prompt } of IMAGES) {
    try {
      const buf = await generate(prompt);
      await writeFile(resolve(OUT_DIR, file), buf);
      console.log(`OK   ${file}  (${Math.round(buf.length / 1024)} KB)`);
    } catch (err) {
      console.error(`FAIL ${file}: ${(err as Error).message}`);
    }
  }
}

main();
