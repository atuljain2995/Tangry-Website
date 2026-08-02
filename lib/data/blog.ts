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
    title: 'Kashmiri Chilli vs Red Chilli: Difference, Heat & Uses',
    excerpt:
      'Kashmiri vs regular red chilli — color, heat, and when to use each in gravies, tandoori, pav bhaji, and pickles.',
    seoDescription:
      "What's the difference between Kashmiri chilli and red chilli? Compare color, heat & best uses for gravies, tandoori, pav bhaji & pickles. Order online.",
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
  {
    slug: 'pav-bhaji-masala-recipe',
    title: 'Pav Bhaji Masala Recipe: How to Get That Mumbai Street-Stall Taste at Home',
    excerpt:
      'A step-by-step pav bhaji recipe with tips on masala quantity, butter, mashing, and the toppings that make it taste like a street-stall bhaji.',
    seoDescription:
      'Pav bhaji masala recipe with proper masala quantity, butter, and mashing tips. Get the same rich, buttery street-stall taste at home. Order online.',
    author: 'Tangry Team',
    authorRole: 'Recipe and product team',
    date: '2026-08-02',
    updated: '2026-08-02',
    readTime: '7 min read',
    category: 'Recipes',
    image: '/images/categories/spices.png',
    imageAlt: 'Tangry pav bhaji masala for rich, buttery Mumbai-style bhaji',
    tags: ['pav bhaji', 'pav bhaji masala', 'recipes', 'street food'],
    productLinks: [
      { label: 'Shop Pav Bhaji Masala', href: '/products/pav-bhaji-masala' },
      { label: 'Browse Spices & Masalas', href: '/categories/spices-masalas' },
    ],
    midArticleCta: {
      label: 'Shop Pav Bhaji Masala',
      href: '/products/pav-bhaji-masala',
    },
    endArticleCtas: [
      { label: 'Shop Pav Bhaji Masala', href: '/products/pav-bhaji-masala' },
      { label: 'Browse All Products', href: '/products' },
    ],
    sections: [
      {
        heading: 'What actually makes street-stall bhaji taste different',
        body: [
          'Most home versions taste thin because the vegetables are boiled and mashed but never cooked down long enough on the tawa with butter and masala. Street vendors mash and fry the mixture on high heat for several minutes so the vegetables break down into a thick, glossy base rather than a watery curry.',
          'The other difference is layering: butter goes in twice, once while sauteing onion, tomato, and masala, and again just before serving so the aroma is fresh when the plate reaches the table.',
        ],
        links: [{ label: 'Shop Pav Bhaji Masala', href: '/products/pav-bhaji-masala' }],
      },
      {
        heading: 'Simple method for 4 servings',
        body: [
          'Boil potato, cauliflower, peas, and capsicum until soft. In a separate pan, saute finely chopped onion in butter until soft, add ginger-garlic paste, then tomato and cook until it turns pulpy.',
          'Add 1.5 to 2 tablespoons of pav bhaji masala along with red chilli powder for color, then add the boiled vegetables with a little water. Mash everything together on medium-high heat for 8-10 minutes, pressing with the back of a spoon until the mixture thickens. Finish with a spoon of butter, a squeeze of lemon, and chopped coriander.',
        ],
      },
      {
        heading: 'Getting the masala quantity right',
        body: [
          'Too much masala makes bhaji taste dusty and bitter; too little leaves it flat. Start with 1.5 tablespoons for 4 servings, taste after mashing, and add more only in small increments.',
          'For dhabas and cloud kitchens, write down the exact masala-to-vegetable ratio per kilogram so every batch tastes the same regardless of who is cooking that shift. Toast pav in butter on the same tawa for the classic street-stall aroma.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much pav bhaji masala should I use for 4 people?',
        answer:
          'Start with 1.5 to 2 tablespoons for a mix of potato, cauliflower, peas, and capsicum serving 4 people, then taste and adjust in small amounts after mashing.',
      },
      {
        question: 'Why does my homemade bhaji taste thin compared to street-stall bhaji?',
        answer:
          'Street vendors mash and fry the vegetable mixture with butter on high heat for several minutes so it thickens and turns glossy. Boiling and mashing without that extra frying time leaves the bhaji watery.',
      },
      {
        question: 'Can I make pav bhaji less spicy for kids?',
        answer:
          'Yes. Reduce the masala slightly and skip extra red chilli powder, then add a little more butter to round out the flavor without heat.',
      },
      {
        question: 'Which Tangry product should I use for pav bhaji?',
        answer:
          'Tangry Pav Bhaji Masala is blended for a rich, red, restaurant-style base. Browse it along with other masalas at tangryspices.com/products.',
      },
    ],
  },
  {
    slug: 'kutchi-dabeli-recipe',
    title: 'Kutchi Dabeli Recipe: How to Make Authentic Dabeli at Home',
    excerpt:
      'A simple dabeli recipe covering the potato filling, dabeli masala quantity, and the sweet, tangy, crunchy toppings that make it authentic.',
    seoDescription:
      'Authentic Kutchi dabeli recipe: potato filling, dabeli masala quantity, chutneys, and crunchy toppings explained step by step. Order dabeli masala online.',
    author: 'Tangry Team',
    authorRole: 'Recipe and product team',
    date: '2026-08-02',
    updated: '2026-08-02',
    readTime: '6 min read',
    category: 'Recipes',
    image: '/images/categories/spices.png',
    imageAlt: 'Tangry dabeli masala for authentic Kutchi-style stuffed buns',
    tags: ['dabeli', 'dabeli masala', 'recipes', 'street food'],
    productLinks: [
      { label: 'Shop Dabeli Masala', href: '/products/dabeli-masala' },
      { label: 'Browse Spices & Masalas', href: '/categories/spices-masalas' },
    ],
    midArticleCta: {
      label: 'Shop Dabeli Masala',
      href: '/products/dabeli-masala',
    },
    endArticleCtas: [
      { label: 'Shop Dabeli Masala', href: '/products/dabeli-masala' },
      { label: 'Browse All Products', href: '/products' },
    ],
    sections: [
      {
        heading: 'What goes into authentic dabeli',
        body: [
          'Dabeli is built from three parts: a spiced, slightly sweet potato filling, a soft pav toasted in butter, and a crunchy, tangy topping of pomegranate, sev, and roasted peanuts. Getting the balance between sweet, tangy, and spicy right is what separates authentic Kutchi dabeli from a generic aloo sandwich.',
          'The potato filling gets its distinct flavor from dabeli masala, tamarind-date chutney, and a garlic chutney, layered rather than mixed into one flat taste.',
        ],
        links: [{ label: 'Shop Dabeli Masala', href: '/products/dabeli-masala' }],
      },
      {
        heading: 'Simple method for 4-6 pav',
        body: [
          'Boil and mash 3-4 medium potatoes. In a pan, heat a little oil, add 2 tablespoons of dabeli masala, a pinch of salt, and the mashed potato, then mix well and cook for 3-4 minutes until the masala coats the potato evenly.',
          'Slit pav and spread tamarind-date chutney on one side and garlic chutney on the other. Fill with the potato mixture, top with sev, roasted peanuts, pomegranate seeds, and chopped coriander, then toast the stuffed pav in butter on a tawa until golden on both sides.',
        ],
      },
      {
        heading: 'Tips for the right texture and taste',
        body: [
          'The potato filling should be soft but not wet; drain boiled potatoes well before mashing so the filling holds its shape inside the pav. Toast the pav just before serving so the outside stays crisp while the filling stays soft.',
          'Food stalls and cafes should keep the potato filling and chutneys prepped separately and assemble on order, since dabeli loses its crunch and toasted texture if it sits fully assembled for too long.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much dabeli masala should I use for 4 potatoes?',
        answer:
          'Use about 2 tablespoons of dabeli masala for 3-4 medium boiled and mashed potatoes, then taste and adjust after mixing.',
      },
      {
        question: 'What toppings go on authentic dabeli?',
        answer:
          'Classic toppings are sev, roasted peanuts, pomegranate seeds, and chopped coriander, along with tamarind-date chutney and garlic chutney spread on the pav.',
      },
      {
        question: 'Can dabeli be made ahead for a party or stall?',
        answer:
          'Prepare the potato filling and chutneys ahead of time, but toast the pav and add crunchy toppings just before serving so the texture stays fresh.',
      },
      {
        question: 'Which Tangry product should I use for dabeli?',
        answer:
          'Tangry Dabeli Masala is blended for the classic sweet-tangy-spicy Kutchi flavor. Browse it along with other masalas at tangryspices.com/products.',
      },
    ],
  },
  {
    slug: 'what-is-jeeravan-masala',
    title: "What Is Jeeravan Masala? Jodhpur's Famous Spice Mix Explained",
    excerpt:
      'Jeeravan masala explained: where it comes from, what it tastes like, and how to use this Marwari spice blend on poha, chaat, and everyday snacks.',
    seoDescription:
      'What is jeeravan masala? Learn its Marwari origins, flavor profile, and how to use it on poha, sandwiches, chaat, and snacks. Order online from Jaipur.',
    author: 'Tangry Team',
    authorRole: 'Spice sourcing team',
    date: '2026-08-02',
    updated: '2026-08-02',
    readTime: '5 min read',
    category: 'Education',
    image: '/images/categories/ready-to-eat.png',
    imageAlt: 'Tangry Jain jeeravan masala, a Marwari finishing spice for poha and snacks',
    tags: ['jeeravan masala', 'rajasthani spices', 'education', 'poha'],
    productLinks: [
      { label: 'Shop Jain Jeeravan Masala', href: '/products/jain-jeeravan-masala' },
      { label: 'Browse Ready to Eat', href: '/categories/ready-to-eat' },
    ],
    midArticleCta: {
      label: 'Shop Jain Jeeravan Masala',
      href: '/products/jain-jeeravan-masala',
    },
    endArticleCtas: [
      { label: 'Shop Jain Jeeravan Masala', href: '/products/jain-jeeravan-masala' },
      { label: 'Browse All Products', href: '/products' },
    ],
    sections: [
      {
        heading: 'A Marwari finishing spice, not a curry masala',
        body: [
          'Jeeravan masala comes from the Marwar region around Jodhpur, where it started as a finishing spice sprinkled over poha, kachori, and samosa rather than a base masala cooked into a gravy. It gets its name from jeera (cumin), though the blend typically includes several other roasted spices for a warm, slightly tangy, layered flavor.',
          'Unlike garam masala or pav bhaji masala, jeeravan is meant to be added at the very end, directly on the plate, so its aroma stays sharp instead of cooking off in oil or gravy.',
        ],
        links: [{ label: 'Shop Jain Jeeravan Masala', href: '/products/jain-jeeravan-masala' }],
      },
      {
        heading: 'Everyday ways to use it',
        body: [
          'Sprinkle jeeravan masala over poha, upma, or bhel just before serving for an instant flavor lift without any extra cooking. It also works well dusted over roasted or fried snacks like kachori, samosa, and namkeen, and stirred into curd or raita for a quick tangy side.',
          'Because it is a Jain-style blend, it works for households and food stalls that avoid onion and garlic in their spice mixes while still wanting a bold, layered flavor.',
        ],
      },
      {
        heading: 'Buying and storing tips',
        body: [
          'Good jeeravan masala should smell roasted and tangy, not flat or dusty. Since it is used as a finishing sprinkle rather than a bulk cooking ingredient, a smaller pack usually lasts a home kitchen for months if kept airtight.',
          'Chaat counters and snack stalls that use it daily should keep a small shaker jar near the serving station and refill it from a sealed main pack to protect aroma between refills.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is jeeravan masala used for?',
        answer:
          'Jeeravan masala is a finishing spice sprinkled over poha, upma, bhel, kachori, samosa, and curd or raita, rather than cooked into a gravy like garam masala.',
      },
      {
        question: 'Where does jeeravan masala originate from?',
        answer:
          'Jeeravan masala originates from the Marwar region around Jodhpur, Rajasthan, where it is traditionally sprinkled on breakfast dishes like poha and snacks.',
      },
      {
        question: 'Is jeeravan masala spicy?',
        answer:
          'It has a warm, tangy, layered flavor rather than sharp heat, though the exact spice level can vary slightly by brand and blend.',
      },
      {
        question: 'Which Tangry product should I buy for jeeravan masala?',
        answer:
          'Tangry Jain Jeeravan Masala is an MP-and-Marwar-style blend made in Jaipur, good for poha, snacks, and chaat. Browse it at tangryspices.com/products.',
      },
    ],
  },
];

export const blogCategories = ['All', 'Recipes', 'Health', 'Tips', 'Education'] as const;

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
