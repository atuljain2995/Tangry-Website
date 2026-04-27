import { ProductExtended } from '../types/database';

/** Fallback catalog when DB is empty — Tangry Jaipur product lines */
export const PRODUCTS_EXTENDED: ProductExtended[] = [
  {
    id: '1',
    slug: 'dabeli-masala',
    name: 'Dabeli Masala',
    description:
      'Authentic dabeli masala blended in Jaipur. Warm, tangy, and balanced for stuffed buns and potato filling—just like street stalls across Gujarat and Rajasthan.',
    category: 'Spices & Masalas',
    variants: [
      {
        id: 'dm-200g',
        name: '200g',
        sku: 'TGR-DBL-200',
        price: 89,
        compareAtPrice: 105,
        stock: 280,
        weight: 200,
        isAvailable: true,
      },
    ],
    images: ['/products/dabeli-masala.jpg'],
    features: [
      'Small-batch blended in Jaipur',
      'No artificial colours',
      'FSSAI licensed facility',
      'Sealed for freshness',
    ],
    ingredients: [
      'Coriander',
      'Cumin',
      'Dry mango',
      'Red chilli',
      'Cloves',
      'Cinnamon',
      'Salt',
      'Spices',
    ],
    certifications: ['FSSAI', 'ISO 22000'],
    tags: ['featured', 'masala', 'jaipur'],
    metaTitle: 'Dabeli Masala | Authentic blend from Jaipur | Tangry',
    metaDescription:
      'Buy Tangry Dabeli Masala online—Jaipur-made blend for street-style dabeli. FSSAI licensed. Fast delivery across India.',
    keywords: ['dabeli masala', 'buy dabeli masala', 'jaipur masala', 'tangry'],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isHeroProduct: false,
    rating: 4.8,
    reviewCount: 186,
    minOrderQuantity: 1,
    maxOrderQuantity: 40,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    slug: 'turmeric-powder',
    name: 'Turmeric Powder',
    description:
      'Bright, aromatic turmeric (haldi)—essential for everyday cooking. Packed in Jaipur under FSSAI supervision for purity you can trust.',
    category: 'Essentials',
    variants: [
      {
        id: 'tp-100g',
        name: '100g',
        sku: 'TGR-TUR-100',
        price: 52,
        compareAtPrice: 62,
        stock: 800,
        weight: 100,
        isAvailable: true,
      },
      {
        id: 'tp-200g',
        name: '200g',
        sku: 'TGR-TUR-200',
        price: 98,
        compareAtPrice: 118,
        stock: 550,
        weight: 200,
        isAvailable: true,
      },
    ],
    images: ['/products/turmeric-powder.jpg'],
    features: ['Lab-checked batches', 'Vibrant colour', 'Finely ground', 'Sealed pack'],
    ingredients: ['100% Turmeric'],
    certifications: ['FSSAI', 'ISO 22000'],
    tags: ['essential', 'haldi', 'jaipur'],
    metaTitle: 'Turmeric Powder (Haldi) | Tangry Essentials | Jaipur',
    metaDescription:
      'Pure turmeric powder from Tangry, packed in Jaipur. Shop 100g and 200g packs with pan-India delivery.',
    keywords: ['turmeric powder', 'haldi', 'buy turmeric online', 'tangry'],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isHeroProduct: false,
    rating: 4.9,
    reviewCount: 412,
    minOrderQuantity: 1,
    maxOrderQuantity: 80,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    slug: 'gun-powder-podi',
    name: 'Gun Powder (Podi Masala)',
    description:
      'South Indian–style podi with lentils, chillies, and curry leaves—sprinkle on idli, dosa, or rice. Made fresh in small runs for bold flavour.',
    category: 'Ready to Eat',
    variants: [
      {
        id: 'gp-100g',
        name: '100g',
        sku: 'TGR-GUN-100',
        price: 78,
        compareAtPrice: 92,
        stock: 220,
        weight: 100,
        isAvailable: true,
      },
    ],
    images: ['/products/gun-powder-podi.jpg'],
    features: [
      'Crunchy lentil base',
      'Adjustable heat',
      'No preservatives claimed',
      'Resealable pack',
    ],
    ingredients: ['Urad dal', 'Chana dal', 'Red chilli', 'Curry leaves', 'Salt', 'Spices'],
    certifications: ['FSSAI', 'ISO 22000'],
    tags: ['podi', 'gun powder', 'featured'],
    metaTitle: 'Gun Powder Podi Masala | Tangry Ready Powders',
    metaDescription:
      'Tangry Gun Powder (podi)—sprinkle on idli, dosa, or rice. Order online from Tangry, Jaipur.',
    keywords: ['gun powder masala', 'podi', 'idli podi', 'tangry'],
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    isHeroProduct: false,
    rating: 4.7,
    reviewCount: 96,
    minOrderQuantity: 1,
    maxOrderQuantity: 30,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date(),
  },
  {
    id: '4',
    slug: 'vada-pav-chutney',
    name: 'Vada Pav Chutney',
    description:
      'Dry garlic-coconut chutney style mix for Mumbai-style vada pav—tangy, garlicky, and addictive. A Tangry favourite from our ready-to-eat powder line.',
    category: 'Ready to Eat',
    variants: [
      {
        id: 'vpc-200g',
        name: '200g',
        sku: 'TGR-VPC-200',
        price: 115,
        compareAtPrice: 135,
        stock: 180,
        weight: 200,
        isAvailable: true,
      },
    ],
    images: ['/products/vada-pav-chutney.jpg'],
    features: [
      'Garlic-forward',
      'Pairs with batata vada',
      'Dry sprinkle format',
      'Consistent grind',
    ],
    ingredients: ['Garlic', 'Coconut', 'Peanuts', 'Red chilli', 'Salt', 'Spices'],
    certifications: ['FSSAI', 'ISO 22000'],
    tags: ['chutney', 'street food', 'new'],
    metaTitle: 'Vada Pav Chutney Powder | Tangry',
    metaDescription:
      'Dry vada pav chutney mix from Tangry—perfect with batata vada and pav. Shipped from Jaipur.',
    keywords: ['vada pav chutney', 'dry garlic chutney', 'tangry'],
    isFeatured: false,
    isNew: true,
    isBestSeller: true,
    isHeroProduct: false,
    rating: 4.8,
    reviewCount: 74,
    minOrderQuantity: 1,
    maxOrderQuantity: 25,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date(),
  },
  {
    id: '5',
    slug: 'pav-bhaji-masala',
    name: 'Pav Bhaji Masala',
    description:
      'Rich, red pav bhaji masala for bhaji that tastes like your favourite corner stall—balanced for home cooks and busy weeknights.',
    category: 'Spices & Masalas',
    variants: [
      {
        id: 'pbm-200g',
        name: '200g',
        sku: 'TGR-PBV-200',
        price: 95,
        compareAtPrice: 112,
        stock: 310,
        weight: 200,
        isAvailable: true,
      },
    ],
    images: ['/products/pav-bhaji-masala.jpg'],
    features: [
      'Bold colour & aroma',
      'Works with mixed vegetables',
      'Small-batch Jaipur blend',
      'Trusted by home cooks',
    ],
    ingredients: [
      'Coriander',
      'Cumin',
      'Fennel',
      'Black pepper',
      'Dry mango',
      'Kashmiri chilli',
      'Salt',
      'Spices',
    ],
    certifications: ['FSSAI', 'ISO 22000'],
    tags: ['pav bhaji', 'masala', 'bestseller'],
    metaTitle: 'Pav Bhaji Masala | Jaipur blend | Tangry',
    metaDescription:
      'Shop Tangry Pav Bhaji Masala—200g pack, blended in Jaipur. Authentic taste for homemade bhaji.',
    keywords: ['pav bhaji masala', 'buy pav bhaji masala online', 'tangry'],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isHeroProduct: false,
    rating: 4.8,
    reviewCount: 268,
    minOrderQuantity: 1,
    maxOrderQuantity: 40,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

export function getProductBySlug(slug: string): ProductExtended | undefined {
  return PRODUCTS_EXTENDED.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): ProductExtended[] {
  return PRODUCTS_EXTENDED.filter((p) => p.category === category);
}

export function getFeaturedProducts(): ProductExtended[] {
  return PRODUCTS_EXTENDED.filter((p) => p.isFeatured);
}

export function getBestSellers(): ProductExtended[] {
  return PRODUCTS_EXTENDED.filter((p) => p.isBestSeller);
}

export function getNewProducts(): ProductExtended[] {
  return PRODUCTS_EXTENDED.filter((p) => p.isNew);
}
