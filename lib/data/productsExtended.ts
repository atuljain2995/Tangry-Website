import { ProductExtended } from '../types/database';

// Extended product data with pricing and variants for ecommerce
export const PRODUCTS_EXTENDED: ProductExtended[] = [
  {
    id: '1',
    slug: 'garam-masala',
    name: 'Garam Masala',
    description: 'A royal blend of 13 authentic spices perfect for rich curries and special occasions. Our signature Garam Masala brings the authentic taste of India to your kitchen.',
    category: 'Blended Spices',
    subcategory: 'Premium Blends',
    variants: [
      {
        id: 'gm-50g',
        name: '50g',
        sku: 'EVR-GM-50',
        price: 45,
        compareAtPrice: 55,
        stock: 500,
        weight: 50,
        isAvailable: true
      },
      {
        id: 'gm-100g',
        name: '100g',
        sku: 'EVR-GM-100',
        price: 85,
        compareAtPrice: 100,
        stock: 300,
        weight: 100,
        isAvailable: true
      },
      {
        id: 'gm-200g',
        name: '200g',
        sku: 'EVR-GM-200',
        price: 160,
        compareAtPrice: 190,
        stock: 200,
        weight: 200,
        isAvailable: true
      }
    ],
    images: [
      '/products/garam-masala-1.jpg',
      '/products/garam-masala-2.jpg'
    ],
    features: [
      'Blend of 13 premium spices',
      'No artificial colors or preservatives',
      'Triple-washed and sun-dried',
      'Perfect for curries and gravies'
    ],
    ingredients: [
      'Coriander',
      'Cumin',
      'Black Pepper',
      'Cardamom',
      'Cinnamon',
      'Cloves',
      'Bay Leaf',
      'Nutmeg',
      'Mace'
    ],
    nutritionalInfo: {
      'Energy': '320 kcal',
      'Protein': '12g',
      'Carbohydrates': '45g',
      'Fat': '8g'
    },
    usageInstructions: 'Add 1-2 teaspoons to your curry during final stages of cooking for best aroma and flavor.',
    shelfLife: '12 months from date of packaging',
    certifications: ['FSSAI', 'ISO 22000', 'Organic'],
    tags: ['best-seller', 'premium', 'authentic'],
    metaTitle: 'Buy Garam Masala Online - Authentic Indian Spice Blend | Tangry',
    metaDescription: 'Premium Garam Masala made from 13 authentic spices. Perfect for curries, gravies & traditional dishes. Free shipping on orders above ₹499.',
    keywords: ['garam masala', 'buy garam masala online', 'indian spice blend', 'authentic garam masala'],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 1247,
    minOrderQuantity: 1,
    maxOrderQuantity: 50,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    slug: 'turmeric-powder',
    name: 'Turmeric Powder',
    description: 'Pure, organic turmeric powder with high curcumin content. Sourced from the best farms in India for authentic color and health benefits.',
    category: 'Pure Spices',
    variants: [
      {
        id: 'tp-100g',
        name: '100g',
        sku: 'EVR-TP-100',
        price: 50,
        compareAtPrice: 60,
        stock: 1000,
        weight: 100,
        isAvailable: true
      },
      {
        id: 'tp-200g',
        name: '200g',
        sku: 'EVR-TP-200',
        price: 95,
        compareAtPrice: 115,
        stock: 800,
        weight: 200,
        isAvailable: true
      },
      {
        id: 'tp-500g',
        name: '500g',
        sku: 'EVR-TP-500',
        price: 220,
        compareAtPrice: 270,
        stock: 400,
        weight: 500,
        isAvailable: true
      }
    ],
    images: [
      '/products/turmeric-1.jpg',
      '/products/turmeric-2.jpg'
    ],
    features: [
      'High curcumin content (5%+)',
      'Organically grown',
      'Vibrant golden color',
      'Anti-inflammatory properties'
    ],
    ingredients: ['100% Pure Turmeric'],
    nutritionalInfo: {
      'Energy': '312 kcal',
      'Protein': '9.7g',
      'Carbohydrates': '67.1g',
      'Curcumin': '5.2g'
    },
    usageInstructions: 'Use 1/2 teaspoon per serving in curries, dal, or golden milk.',
    shelfLife: '18 months from date of packaging',
    certifications: ['FSSAI', 'Organic India', 'ISO 22000'],
    tags: ['organic', 'health', 'best-seller'],
    metaTitle: 'Buy Organic Turmeric Powder Online - High Curcumin | Tangry',
    metaDescription: 'Premium organic turmeric powder with high curcumin content. Perfect for cooking and health. Order now with free shipping!',
    keywords: ['turmeric powder', 'organic turmeric', 'haldi powder', 'buy turmeric online'],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 2341,
    minOrderQuantity: 1,
    maxOrderQuantity: 100,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '3',
    slug: 'eazy-chef-paneer-tikka-masala',
    name: 'Eazy Chef - Paneer Tikka Masala',
    description: 'Complete spice mix for restaurant-style Paneer Tikka Masala. Be a chef in minutes! Just add paneer and follow simple instructions.',
    category: 'Eazy Chef',
    variants: [
      {
        id: 'ec-ptm-50g',
        name: '50g Pack',
        sku: 'EVR-EC-PTM-50',
        price: 40,
        stock: 600,
        weight: 50,
        isAvailable: true
      }
    ],
    images: [
      '/products/eazy-chef-paneer-tikka.jpg'
    ],
    features: [
      'Ready in 15 minutes',
      'Restaurant-style taste',
      'No chopping or grinding',
      'Serves 4 people'
    ],
    ingredients: [
      'Coriander',
      'Cumin',
      'Red Chilli',
      'Kasuri Methi',
      'Garam Masala',
      'Ginger',
      'Garlic',
      'Tomato Powder'
    ],
    usageInstructions: 'Mix with yogurt, marinate paneer, cook with gravy base. Detailed recipe inside.',
    shelfLife: '12 months from date of packaging',
    certifications: ['FSSAI', 'ISO 22000'],
    tags: ['new', 'quick-cook', 'easy'],
    metaTitle: 'Eazy Chef Paneer Tikka Masala Mix - Ready in 15 Minutes | Tangry',
    metaDescription: 'Restaurant-style Paneer Tikka Masala in just 15 minutes. Complete spice mix with easy instructions. Order now!',
    keywords: ['paneer tikka masala', 'ready to cook', 'instant masala mix', 'eazy chef'],
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 456,
    minOrderQuantity: 1,
    maxOrderQuantity: 30,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date()
  },
  {
    id: '4',
    slug: 'red-chilli-powder',
    name: 'Red Chilli Powder',
    description: 'Premium red chilli powder with perfect balance of heat and color. Made from carefully selected chillies for authentic Indian taste.',
    category: 'Pure Spices',
    variants: [
      {
        id: 'rcp-100g',
        name: '100g',
        sku: 'EVR-RCP-100',
        price: 55,
        compareAtPrice: 65,
        stock: 900,
        weight: 100,
        isAvailable: true
      },
      {
        id: 'rcp-200g',
        name: '200g',
        sku: 'EVR-RCP-200',
        price: 105,
        compareAtPrice: 125,
        stock: 700,
        weight: 200,
        isAvailable: true
      },
      {
        id: 'rcp-500g',
        name: '500g',
        sku: 'EVR-RCP-500',
        price: 245,
        compareAtPrice: 295,
        stock: 300,
        weight: 500,
        isAvailable: true
      }
    ],
    images: [
      '/products/red-chilli-powder-1.jpg'
    ],
    features: [
      'Perfect heat level',
      'Rich red color',
      'No artificial colors',
      'Triple-washed and sun-dried'
    ],
    usageInstructions: 'Use according to taste preference. Start with 1/2 teaspoon and adjust.',
    shelfLife: '12 months from date of packaging',
    certifications: ['FSSAI', 'ISO 22000'],
    tags: ['essential', 'pure'],
    metaTitle: 'Buy Red Chilli Powder Online - Premium Quality | Tangry',
    metaDescription: 'Premium red chilli powder with perfect heat and color. No artificial colors. Free shipping on orders above ₹499.',
    keywords: ['red chilli powder', 'lal mirch powder', 'buy chilli powder', 'indian spices'],
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 1876,
    minOrderQuantity: 1,
    maxOrderQuantity: 100,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '5',
    slug: 'biryani-masala',
    name: 'Biryani Masala',
    description: 'Aromatic blend of spices specially crafted for authentic biryani. Perfect for both vegetable and meat biryani.',
    category: 'Blended Spices',
    subcategory: 'Rice Specialties',
    variants: [
      {
        id: 'bm-50g',
        name: '50g',
        sku: 'EVR-BM-50',
        price: 50,
        stock: 400,
        weight: 50,
        isAvailable: true
      },
      {
        id: 'bm-100g',
        name: '100g',
        sku: 'EVR-BM-100',
        price: 95,
        stock: 250,
        weight: 100,
        isAvailable: true
      }
    ],
    images: [
      '/products/biryani-masala-1.jpg'
    ],
    features: [
      'Authentic Hyderabadi blend',
      'Rich aroma',
      'Perfect for layering',
      'Works with all rice varieties'
    ],
    ingredients: [
      'Coriander',
      'Cumin',
      'Black Pepper',
      'Cardamom',
      'Cinnamon',
      'Cloves',
      'Bay Leaf',
      'Star Anise',
      'Mace',
      'Nutmeg'
    ],
    usageInstructions: 'Add 2 teaspoons per kg of rice/meat while cooking biryani.',
    shelfLife: '12 months from date of packaging',
    certifications: ['FSSAI', 'ISO 22000'],
    tags: ['premium', 'aromatic'],
    metaTitle: 'Buy Biryani Masala Online - Authentic Hyderabadi Blend | Tangry',
    metaDescription: 'Premium Biryani Masala for authentic taste. Perfect blend of aromatic spices. Order now with free shipping!',
    keywords: ['biryani masala', 'hyderabadi biryani spice', 'buy biryani masala online'],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 923,
    minOrderQuantity: 1,
    maxOrderQuantity: 40,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Helper function to get product by slug
export function getProductBySlug(slug: string): ProductExtended | undefined {
  return PRODUCTS_EXTENDED.find(p => p.slug === slug);
}

// Helper function to get products by category
export function getProductsByCategory(category: string): ProductExtended[] {
  return PRODUCTS_EXTENDED.filter(p => p.category === category);
}

// Helper function to get featured products
export function getFeaturedProducts(): ProductExtended[] {
  return PRODUCTS_EXTENDED.filter(p => p.isFeatured);
}

// Helper function to get best sellers
export function getBestSellers(): ProductExtended[] {
  return PRODUCTS_EXTENDED.filter(p => p.isBestSeller);
}

// Helper function to get new products
export function getNewProducts(): ProductExtended[] {
  return PRODUCTS_EXTENDED.filter(p => p.isNew);
}

