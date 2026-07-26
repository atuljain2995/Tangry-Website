export type BlogSection = {
  heading: string;
  body: string[];
  links?: Array<{ label: string; href: string }>;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Overrides excerpt in meta description when set (150–160 chars ideal). */
  seoDescription?: string;
  author: string;
  authorRole: string;
  date: string;
  updated: string;
  readTime: string;
  category: 'Recipes' | 'Health' | 'Tips' | 'Education';
  image: string;
  imageAlt: string;
  tags: string[];
  productLinks: Array<{ label: string; href: string }>;
  sections: BlogSection[];
  faqs?: Array<{ question: string; answer: string }>;
  midArticleCta?: { label: string; href: string };
  endArticleCtas?: Array<{ label: string; href: string }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'health-benefits-turmeric',
    title: '10 Everyday Benefits of Turmeric in Indian Cooking',
    excerpt:
      'A practical guide to using haldi in daily meals, from dal and sabzi to milk, marinades, and pickles.',
    author: 'Tangry Team',
    authorRole: 'Jaipur spice makers',
    date: '2026-04-23',
    updated: '2026-04-27',
    readTime: '5 min read',
    category: 'Health',
    image: '/images/categories/essentials.png',
    imageAlt: 'Tangry essential spices including turmeric for everyday Indian cooking',
    tags: ['turmeric', 'haldi', 'everyday cooking'],
    productLinks: [{ label: 'Shop Turmeric Powder', href: '/products/turmeric-powder' }],
    sections: [
      {
        heading: 'Why turmeric belongs in daily cooking',
        body: [
          'Turmeric, or haldi, is one of the first spices added to many Indian dishes because it gives food warm color, earthy aroma, and a familiar home-style base.',
          'For families, it works in dal, sabzi, khichdi, kadhi, pickles, marinades, and masala milk. For restaurants and hotels, consistent turmeric color helps keep gravies and prep batches predictable.',
        ],
      },
      {
        heading: 'Best ways to use haldi',
        body: [
          'Add a small pinch while sauteing onions or vegetables so it blooms in oil instead of tasting raw.',
          'Use it in marinades with salt, chilli, curd, ginger, garlic, or lemon so the flavor settles before cooking.',
          'Store turmeric away from moisture and direct heat. Fresh aroma and clean packing matter more than buying the biggest pack at the lowest price.',
        ],
      },
      {
        heading: 'How Tangry thinks about essentials',
        body: [
          'Tangry essentials are packed for kitchens that cook often: home cooks, small food businesses, and restaurants that need dependable flavor without unnecessary fillers.',
          'If your household uses turmeric every day, choose a pack size you can finish while the aroma is still fresh. Commercial kitchens can ask for bulk pricing once monthly usage is clear.',
        ],
      },
    ],
  },
  {
    slug: 'authentic-garam-masala-recipe',
    title: 'How to Use Garam Masala Without Overpowering Food',
    excerpt:
      'Learn when to add garam masala, how much to use, and how to balance it in home and restaurant-style cooking.',
    author: 'Tangry Team',
    authorRole: 'Recipe and product team',
    date: '2026-04-23',
    updated: '2026-04-27',
    readTime: '7 min read',
    category: 'Recipes',
    image: '/images/categories/spices.png',
    imageAlt: 'Tangry masalas for Indian gravies and everyday recipes',
    tags: ['garam masala', 'recipes', 'spices'],
    productLinks: [
      { label: 'Shop Spices & Masalas', href: '/categories/spices-masalas' },
      { label: 'Request Restaurant Bulk Pricing', href: '/wholesale' },
    ],
    sections: [
      {
        heading: 'Add it near the end',
        body: [
          'Garam masala is usually best added near the end of cooking because its aroma comes from warm spices that can fade if boiled for too long.',
          'For one family-sized dish, start with a small pinch, taste, and then adjust. Restaurants should standardize the measure per kilogram of gravy or cooked vegetables so every batch tastes the same.',
        ],
      },
      {
        heading: 'Balance aroma with the base masala',
        body: [
          'A strong garam masala cannot fix a weak base. Cook onions, tomatoes, ginger, garlic, salt, and chilli properly first, then use garam masala as the finishing layer.',
          'If the dish tastes bitter or too sharp, reduce the quantity and add it later in the process.',
        ],
      },
      {
        heading: 'Storage matters',
        body: [
          'Keep blended masalas airtight and away from stove heat. Heat and moisture reduce aroma quickly, especially in busy kitchens.',
          'For food-service use, keep a smaller working jar near the stove and store the main pack in a cool, dry place.',
        ],
      },
    ],
  },
  {
    slug: 'difference-kashmiri-chilli',
    title: 'Kashmiri Chilli vs Regular Red Chilli: What to Use When',
    excerpt:
      'Kashmiri vs regular red chilli — color, heat, and when to use each in gravies, tandoori, pav bhaji, and pickles.',
    seoDescription:
      'Kashmiri vs regular red chilli — color, heat & when to use each. Shop authentic red chilli powder at Tangry Spices, Jaipur. FSSAI licensed.',
    author: 'Tangry Team',
    authorRole: 'Spice sourcing team',
    date: '2026-04-23',
    updated: '2026-07-26',
    readTime: '4 min read',
    category: 'Education',
    image: '/images/categories/spices.png',
    imageAlt: 'Tangry spice blends for color and flavor in Indian cooking',
    tags: ['kashmiri chilli', 'red chilli', 'education', 'spice guide'],
    productLinks: [
      { label: 'Shop Red Chilli Powder', href: '/products/red-chilli-powder' },
      { label: 'Browse All Masalas', href: '/products' },
      { label: 'Pav Bhaji Masala', href: '/products/pav-bhaji-masala' },
    ],
    midArticleCta: {
      label: 'Shop Red Chilli Powder',
      href: '/products/red-chilli-powder',
    },
    endArticleCtas: [
      { label: 'Shop Red Chilli Powder', href: '/products/red-chilli-powder' },
      { label: 'Browse All Products', href: '/products' },
    ],
    faqs: [
      {
        question: 'What is the difference between Kashmiri chilli and regular red chilli?',
        answer:
          'Kashmiri chilli is prized for deep red color and milder heat. Regular red chilli adds sharper spice. Many Indian gravies and marinades use a blend of both for color plus controlled heat.',
      },
      {
        question: 'When should I use Kashmiri chilli powder?',
        answer:
          'Use Kashmiri-style chilli for color-forward dishes: paneer gravies, tandoori marinades, pav bhaji, butter chicken, and bright red chutneys where you want red color without overwhelming heat.',
      },
      {
        question: 'Can I substitute regular red chilli for Kashmiri chilli?',
        answer:
          'You can substitute in a pinch, but regular red chilli is usually hotter. Start with half the quantity and add more only after tasting, or blend both types for balanced color and heat.',
      },
      {
        question: 'Which Tangry product works for Kashmiri-style cooking?',
        answer:
          'Tangry Red Chilli Powder is ground for everyday Indian cooking and works in gravies, snacks, and marinades. Browse masalas and essentials at tangryspices.com/products.',
      },
      {
        question: 'How should I store chilli powder?',
        answer:
          'Keep chilli powder in an airtight jar away from stove heat and moisture. Use a dry spoon and finish opened packs within a few months for the best aroma and color.',
      },
    ],
    sections: [
      {
        heading: 'The simple difference',
        body: [
          'Kashmiri chilli is usually chosen for bright red color and milder heat. Regular red chilli is chosen when the dish needs more sharpness and spice.',
          'For hotel gravies, tandoori marinades, and street-food snacks, many cooks use a blend so the dish gets both color and controlled heat.',
        ],
        links: [
          { label: 'Red Chilli Powder', href: '/products/red-chilli-powder' },
          { label: 'All masalas', href: '/categories/spices-masalas' },
        ],
      },
      {
        heading: 'When to use each type',
        body: [
          'Use Kashmiri chilli for color-forward dishes like paneer gravies, tandoori marinades, pav bhaji, and bright red chutneys.',
          'Use hotter red chilli when the recipe needs a clear spicy kick, such as pickles, chutneys, and snack masalas.',
        ],
        links: [
          { label: 'Pav Bhaji Masala', href: '/products/pav-bhaji-masala' },
          { label: 'Sweet Lemon Pickle', href: '/products/sweet-lemon-pickle' },
          { label: 'Indian spices guide', href: '/blog/indian-spices-guide' },
        ],
      },
      {
        heading: 'Buying tip',
        body: [
          'Do not judge chilli only by color. Aroma, freshness, grind quality, and heat level all affect the final dish.',
          'If you cook for customers, test a small batch first and document the quantity that gives the right color and heat.',
        ],
        links: [{ label: 'Shop Tangry Spices', href: '/products' }],
      },
    ],
  },
  {
    slug: 'spice-storage-tips',
    title: '5 Spice Storage Tips for Fresher Masalas',
    excerpt:
      'Keep masalas, ready powders, and pickles tasting fresh with simple storage habits for home and commercial kitchens.',
    author: 'Tangry Team',
    authorRole: 'Quality and packing team',
    date: '2026-04-23',
    updated: '2026-04-27',
    readTime: '6 min read',
    category: 'Tips',
    image: '/images/categories/ready-to-eat.png',
    imageAlt: 'Tangry ready powders and masalas packed for freshness',
    tags: ['storage', 'freshness', 'kitchen tips'],
    productLinks: [
      { label: 'Shop Ready Powders', href: '/categories/ready-to-eat' },
      { label: 'Shop Essentials', href: '/categories/essentials' },
    ],
    sections: [
      {
        heading: 'Keep moisture away',
        body: [
          'Always use a dry spoon. Moisture causes clumping and can damage aroma faster than normal air exposure.',
          'In restaurants, avoid keeping the main pack open near steam, dishwash areas, or boiling counters.',
        ],
      },
      {
        heading: 'Use smaller working jars',
        body: [
          'Keep a small jar for daily use and refill it from the main pack. This keeps the larger pack fresh for longer.',
          'Label jars clearly so cooks do not mix similar-looking masalas during peak service.',
        ],
      },
      {
        heading: 'Buy based on actual usage',
        body: [
          'A larger pack is useful only when you can finish it within a reasonable time. For low-use spices, smaller packs usually taste better by the last spoon.',
          'For wholesale customers, track weekly usage before ordering bulk quantities.',
        ],
      },
    ],
  },
  {
    slug: 'indian-spices-guide',
    title: 'Indian Spices Guide for New Home Cooks',
    excerpt:
      'A beginner-friendly guide to building a useful Indian spice box with essentials, blends, and finishing powders.',
    author: 'Tangry Team',
    authorRole: 'Customer education team',
    date: '2026-04-23',
    updated: '2026-04-27',
    readTime: '10 min read',
    category: 'Education',
    image: '/images/categories/essentials.png',
    imageAlt: 'Tangry essentials and masalas for a beginner Indian spice box',
    tags: ['beginners', 'indian cuisine', 'spice box'],
    productLinks: [
      { label: 'Shop All Products', href: '/products' },
      { label: 'Dabeli Masala', href: '/products/dabeli-masala' },
      { label: 'Gun Powder Podi', href: '/products/gun-powder-podi-masala' },
      { label: 'Chaas Masala', href: '/products/chaas-masala' },
      { label: 'Browse Essentials', href: '/categories/essentials' },
    ],
    sections: [
      {
        heading: 'Start with essentials',
        body: [
          'A useful spice box starts with turmeric, cumin, coriander, chilli, salt, and a few whole spices depending on what you cook most often.',
          'Do not buy too many spices at once. Freshness matters, especially when you are still learning your cooking rhythm.',
        ],
      },
      {
        heading: 'Add blends for repeat dishes',
        body: [
          'Blends like pav bhaji masala, dabeli masala, sambhar masala, and chai masala save time when you cook the same dishes repeatedly.',
          'For families, one or two favorite blends are enough to begin. For cafes or hotels, blends help standardize taste across cooks.',
        ],
      },
      {
        heading: 'Keep one finishing powder',
        body: [
          'A finishing powder such as jeeravan, chaas masala, or gun powder can quickly lift snacks, curd, rice, poha, and tiffin meals.',
          'These are especially useful for homemakers, students, small food counters, and quick-service kitchens.',
        ],
      },
    ],
  },
  {
    slug: 'biryani-masala-secrets',
    title: 'The Secret to Better Biryani Masala at Home',
    excerpt:
      'Learn how aroma, layering, salt, heat, and resting time make biryani taste fuller without making it harsh.',
    author: 'Tangry Team',
    authorRole: 'Recipe and product team',
    date: '2026-04-23',
    updated: '2026-04-27',
    readTime: '8 min read',
    category: 'Recipes',
    image: '/images/categories/spices.png',
    imageAlt: 'Tangry masala blends for rich Indian rice dishes',
    tags: ['biryani', 'masala', 'recipes'],
    productLinks: [
      { label: 'Browse Spices & Masalas', href: '/categories/spices-masalas' },
      { label: 'Wholesale for Hotels', href: '/wholesale' },
    ],
    sections: [
      {
        heading: 'Aroma should build in layers',
        body: [
          'Good biryani does not depend only on one spoon of masala. Aroma comes from rice, fried onions, herbs, whole spices, the main masala, and resting time.',
          'Add masala to the marinated base and keep a lighter aromatic layer near the end so the final dish smells fresh when opened.',
        ],
      },
      {
        heading: 'Do not overuse masala',
        body: [
          'Too much masala can make biryani bitter, dusty, or heavy. Start with a measured quantity and adjust after testing one batch.',
          'Hotels and caterers should write down the masala quantity per kilogram of rice and per kilogram of protein or vegetables.',
        ],
      },
      {
        heading: 'Rest before serving',
        body: [
          'After dum or final cooking, rest biryani for a few minutes before serving. This helps aroma settle and makes the rice taste more balanced.',
          'For service counters, keep the biryani covered so aroma stays in the vessel instead of escaping before the customer receives it.',
        ],
      },
    ],
  },
];

export const blogCategories = ['All', 'Recipes', 'Health', 'Tips', 'Education'] as const;

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
