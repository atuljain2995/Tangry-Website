export interface ProductCategory {
  id: string;
  title: string;
  /** Shorter label for filter chips; full `title` still used for product matching */
  chipLabel?: string;
  description: string;
  bgColor: string;
  products: string[];
}

export interface Product {
  id: number;
  name: string;
  sub: string;
  category: string;
  bgColor: string;
  badgeColor: string;
  badgeText: string;
  svgContent: React.ReactNode;
}

export interface Recipe {
  id: number;
  title: string;
  time: string;
  masala: string;
  tag: string;
}

/** Tangry catalog — Jaipur product lines */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'spices-masalas',
    title: 'Spices & Masalas',
    chipLabel: 'Masalas & spices',
    description:
      'Regional blends from our Jaipur kitchen—dabeli, pav bhaji, sambhar, chole, rajma, pani puri, and more. Hand-mixed in small batches for consistent taste.',
    bgColor: 'bg-orange-50',
    products: ['Dabeli Masala', 'Pav Bhaji Masala', 'Sambhar Masala', 'Chole Masala'],
  },
  {
    id: 'ready-powders',
    title: 'Ready to Eat',
    description:
      'Gun powder (podi), chaat masala, vada pav chutney, bhuna jeera, and everyday finishing spices—ready to sprinkle or stir in.',
    bgColor: 'bg-yellow-50',
    products: ['Gun Powder (Podi)', 'Vada Pav Chutney', 'Chaat Masala', 'Bhuna Jeera Powder'],
  },
  {
    id: 'essentials',
    title: 'Essentials',
    description:
      'Pure turmeric and whole jeera (cumin)—the base of every Indian kitchen, packed fresh from trusted suppliers.',
    bgColor: 'bg-green-50',
    products: ['Turmeric Powder', 'Jeera (Cumin)'],
  },
  {
    id: 'pickles',
    title: 'Pickles',
    description:
      'Traditional lemon, mango, garlic, ker, karonda, mixed veg, and more—homestyle recipes from Rajasthan.',
    bgColor: 'bg-amber-50',
    products: ['Sweet Lemon Pickle', 'Mango Pickle', 'Green Chilli Pickle', 'Mixed Veg Pickle'],
  },
];

export const RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Jaipur-Style Pav Bhaji',
    time: '35 Mins',
    masala: 'Tangry Pav Bhaji Masala',
    tag: 'Street Food',
  },
  {
    id: 2,
    title: 'Dabeli at Home',
    time: '25 Mins',
    masala: 'Tangry Dabeli Masala',
    tag: 'Gujarat & Rajasthan',
  },
  {
    id: 3,
    title: 'Comfort Dal with Jeera Tadka',
    time: '40 Mins',
    masala: 'Tangry Jeera & Turmeric',
    tag: 'Everyday',
  },
];
