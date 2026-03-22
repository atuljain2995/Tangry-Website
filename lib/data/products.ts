export interface ProductCategory {
  id: string;
  title: string;
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

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'blended',
    title: 'Blended Spices',
    description: "Nothing can beat the delicious taste of traditional Indian spice blends! Tangry's range of blended spices are hand-crafted & the ingredients are sourced from India's renowned spice lands.",
    bgColor: 'bg-orange-50',
    products: ['Garam Masala', 'Pav Bhaji Masala', 'Chicken Masala', 'Biryani Masala']
  },
  {
    id: 'pure',
    title: 'Pure Spices',
    description: "Pure spices play an integral part in Indian cuisine. We, at Tangry, believe in offering spices that are rich & authentic.",
    bgColor: 'bg-yellow-50',
    products: ['Turmeric Powder', 'Red Chilli Powder', 'Coriander Powder', 'Cumin Powder']
  },
  {
    id: 'herbs-seasonings',
    title: 'Herbs & Seasonings',
    description:
      'Herbs and seasoning blends to add bold flavour to everyday meals—Italian mixes, pizza & pasta, Mexican, Chinese-style notes, and more.',
    bgColor: 'bg-green-50',
    products: ['Italian Seasoning', 'Pizza & Pasta', 'Mexican', 'Chinese']
  },
  {
    id: 'ready-to-cook',
    title: 'Ready to Cook',
    description:
      'Ready-to-use spice mixes for authentic Indian dishes—quick weeknight cooking without compromising on taste.',
    bgColor: 'bg-blue-50',
    products: ['Paneer Butter Masala', 'Dal Tadka', 'Rajma Masala', 'Chole Masala']
  },
  {
    id: 'exotic',
    title: 'Exotic Range',
    description: "Pure, premium, and exotic. Tangry's Kesar Milk Masala and Saffron are must-haves for all traditional and mouth-watering shahi Indian feasts.",
    bgColor: 'bg-purple-50',
    products: ['Saffron', 'Kesar Milk Masala']
  },
  {
    id: 'paste',
    title: 'Paste',
    description: "Ginger Garlic paste that tastes fresh & delicious just like the homemade one. Made using finest of the gingers and garlics.",
    bgColor: 'bg-amber-50',
    products: ['Ginger Garlic Paste', 'Garlic Paste', 'Ginger Paste']
  }
];

export const RECIPES: Recipe[] = [
  {
    id: 1,
    title: "Paneer Butter Masala",
    time: "40 Mins",
    masala: "Tangry Shahi Paneer Masala",
    tag: "North Indian"
  },
  {
    id: 2,
    title: "Mumbai Pav Bhaji",
    time: "30 Mins",
    masala: "Tangry Pav Bhaji Masala",
    tag: "Street Food"
  },
  {
    id: 3,
    title: "Spicy Chicken Chettinad",
    time: "55 Mins",
    masala: "Tangry Chicken Masala",
    tag: "South Indian"
  }
];

