export interface RecipeInstruction {
  step: number;
  text: string;
}

export interface Recipe {
  id: number;
  slug: string;
  title: string;
  /** Short one-liner for cards and previews. Keep under ~120 chars. */
  excerpt: string;
  description: string;
  seoDescription: string;
  keywords: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  cuisine: string;
  image: string;
  imageAlt: string;
  author: string;
  date: string;
  updated: string;
  featured: boolean;
  ingredients: string[];
  instructions: RecipeInstruction[];
  tips: string[];
  productLink: { label: string; href: string };
}

export const recipes: Recipe[] = [
  {
    id: 1,
    slug: 'peri-peri-masala-fries',
    title: 'How to Make Crispy Peri Peri Fries (Best Fried & Air-Fryer Recipe)',
    excerpt:
      'Crispy double-fried or air-fried potatoes tossed in bold chilli-garlic peri peri masala.',
    description:
      'Looking for the ultimate street-style Peri Peri fries recipe? This step-by-step guide teaches you how to get crispy, golden french fries tossed in an aromatic, bold chilli-garlic seasoning at home.\n\nWhether you start with freshly cut potatoes or frozen fries, the seasoning is what separates a flat, salty fry from a genuinely craveable one. Tangry Peri Peri Masala is a chilli-garlic blend made in Jhotwara, Jaipur, built to hit the tangy-hot balance that works just as well on roasted corn and grilled paneer as it does on fries.\n\nWe cover both the traditional double-fry method for maximum crunch and an easy air-fryer alternative for a lighter under-30-minute snack. Serve hot alongside your favourite wraps, burgers, or a bowl of Tangry Fresh Tomato Ketchup!',
    seoDescription:
      'Learn how to make crispy peri peri masala fries at home (deep-fried or air-fryer). Tossed in Tangry chilli-garlic peri peri seasoning for ultimate flavor.',
    keywords: [
      'peri peri fries recipe',
      'peri peri fries at home',
      'how to make peri peri fries air fryer',
      'masala fries recipe indian',
      'spicy garlic french fries',
      'tangry peri peri masala recipe',
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    difficulty: 'Easy',
    category: 'Snacks',
    cuisine: 'Indian',
    image: '/images/recipes/peri-peri-fries.jpg',
    imageAlt: 'Crispy peri peri masala fries in a steel bowl with fresh coriander and a lemon half',
    author: 'Tangry Spices',
    date: '2026-08-08',
    updated: '2026-08-08',
    featured: true,
    ingredients: [
      '3 large Russet or Yukon Gold potatoes (best for high starch)',
      'Vegetable oil for deep frying (or spray oil for air fryer)',
      '1½ to 2 tsp Tangry Peri Peri Masala (adjust based on heat tolerance)',
      '½ tsp pink salt (reduce if using pre-salted frozen fries)',
      '1 tbsp fresh lime juice',
      '2 tbsp fresh coriander leaves, finely chopped',
      '½ tsp chat masala (optional, for extra tanginess)',
    ],
    instructions: [
      {
        step: 1,
        text: 'Peel the potatoes and slice them into even, thin strips (around 1 cm thick). To prevent browning and reduce excess sugar, submerge the cut potatoes in cold water and rinse for 5 minutes. Pat completely dry with a lint-free kitchen towel — any residual surface moisture will prevent the fries from becoming crispy.',
      },
      {
        step: 2,
        text: 'Heat frying oil in a deep pan or kadai to 160°C (medium heat). Fry the potato strips in small batches for 5–6 minutes. At this step, the goal is to fully cook the internal potato starch without coloring the outside. Remove with a slotted spoon and drain on paper towels.',
      },
      {
        step: 3,
        text: 'Raise the oil temperature to 180°C (high heat). Return the par-cooked potatoes to the hot oil and flash-fry for 3–4 minutes until they turn a deep golden-brown and acquire a crisp crust. Drain immediately.',
      },
      {
        step: 4,
        text: 'While the fries are piping hot, transfer them into a large metal mixing bowl. Immediately sprinkle Tangry Peri Peri Masala and a pinch of salt. Toss vigorously so the hot steam and oil draw out the full aroma of the spice layer.',
      },
      {
        step: 5,
        text: 'Drizzle a squeeze of fresh lime juice and scatter the chopped green coriander. Give it one final toss and serve immediately while hot and crispy.',
      },
    ],
    tips: [
      'For the Air Fryer method: Toss the raw dry potato strips with 1 tbsp oil, arrange in a single layer, and cook at 200°C for 18–20 minutes. Shake the basket every 5 minutes, then dust with Tangry Peri Peri Masala right after pulling them out.',
      'Always season when wet or hot: Masalas will only stick to fries if there is active moisture or surface oil. If they cool down, the spices will fall to the bottom of the bowl.',
      'Our Peri Peri spice blend is also incredible over boiled sweet corn, roasted paneer, or home-popped popcorn.',
    ],
    productLink: { label: 'Buy Tangry Peri Peri Masala', href: '/products/peri-peri-masala' },
  },
  {
    id: 2,
    slug: 'vada-pav-chutney-recipe',
    title: 'Authentic Mumbai Vada Pav Recipe with Dry Garlic Chutney Powder',
    excerpt:
      'Spiced batata vada in soft pav, layered with coarse dry garlic chutney — Mumbai street style.',
    description:
      'Craving Mumbai street food? This authentic Vada Pav recipe lets you prepare the famous spiced batata vada encased in a fluffy pav bun. The hallmark of any perfect vada pav is the pungent, fiery red dry garlic chutney.\n\nTraditionally, making this dry chutney means roasting coconut, garlic, and peanuts with red chillies, then grinding them coarse. Tangry Vada Pav Chutney does that work for you — a Jaipur-milled dry chutney of garlic, coconut, peanuts, red chilli, salt, and spices, ground to the coarse texture that a proper vada pav needs.\n\nFollow this simple guide to fry up crispy turmeric-spiced potato balls (vada), coat them in a seasoned chickpea batter, and assemble them in pavs with our dry chutney. Perfect for rainy days, weekend snacks, or family high-tea!',
    seoDescription:
      'Replicate street-style Mumbai vada pav at home in 40 mins. Crispy batata vada paired with fluffy bun & Tangry Ready Dry Garlic-Peanut Chutney powder.',
    keywords: [
      'vada pav recipe',
      'dry garlic chutney for vada pav',
      'mumbai street style vada pav',
      'how to make batata vada crispy',
      'vada pav ingredients list',
      'vada pav chutney powder',
    ],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    category: 'Street Food',
    cuisine: 'Indian',
    image: '/images/recipes/vada-pav.jpg',
    imageAlt: 'Two Mumbai vada pav on a steel plate with dry garlic chutney and a fried green chilli',
    author: 'Tangry Spices',
    date: '2026-08-08',
    updated: '2026-08-08',
    featured: true,
    ingredients: [
      '4 premium pav buns',
      '3 large potatoes, boiled, peeled, and mashed',
      '1 tsp mustard seeds (rai)',
      '10 fresh curry leaves (kadi patta)',
      '2 spicy green chillies, minced',
      '½ tsp turmeric powder (haldi)',
      '1 tsp hand-ground ginger-garlic paste',
      'Salt to taste',
      '1 cup premium chickpea flour (besan)',
      '¼ tsp red chilli powder',
      'A pinch of baking soda (for extra fluffy batter)',
      'Water to achieve thick coating consistency',
      'Refined oil for deep frying',
      '4 tbsp Tangry Vada Pav Chutney (dry garlic powder, use generously)',
      '4 whole green chillies (fried on the side for authentic presentation)',
    ],
    instructions: [
      {
        step: 1,
        text: 'Prepare the potato filling: Heat 1 tbsp of oil in a kadai. Temper with mustard seeds until they crackle, then add curry leaves, green chillies, and ginger-garlic paste. Sauté for 30 seconds. Stir in turmeric powder and immediately add the mashed potatoes and salt. Mix thoroughly on low heat for 2 minutes. Transfer to a plate to cool.',
      },
      {
        step: 2,
        text: 'Once cool enough to handle, divide the seasoned potato mixture into 8 uniform round balls. Press slightly to flatten them just a fraction (traditional Mumbai round-oval shape).',
      },
      {
        step: 3,
        text: 'Whisk the batter: In a deep bowl, combine besan, red chilli powder, turmeric, a pinch of salt, and baking soda. Whisk in water slowly until you get a smooth, lump-free batter with a thick cream-like consistency.',
      },
      {
        step: 4,
        text: 'Fry the vadas: Heat oil in a deep kadai to 175°C. Submerge each potato vada into the besan batter, ensuring it’s completely coated. Gently lower them into the hot oil. Fry in batches of three for 3–4 minutes, turning occasionally until sweet-golden and crisp. Drain.',
      },
      {
        step: 5,
        text: 'Assemble: Slice each pav bun horizontally, keeping one side attached. Heat a pan and lightly butter-toast the buns if desired, then dress the bottom inner surface with a thick, generous layer of Tangry Vada Pav Chutney powder.',
      },
      {
        step: 6,
        text: 'Slide a piping hot batata vada in the center of the pav. Place a lightly salted, blistered fried green chilli on top, press down gently, and enjoy Mumbai’s favorite breakfast instantly.',
      },
    ],
    tips: [
      'Avoid soggy pavs: Mumbai vada pav stalls never put wet mint-coriander green chutney unless requested because it dampens the soft bun. Stick to a thick bed of Tangry Dry Garlic Chutney as your main flavor driver.',
      'The Batter Test: If the batter is too thin, it will run off the potato ball and create oily tails. If too thick, the wrap will taste doughy. It should hold cleanly in place when you dip your finger.',
      'Our dry garlic chutney powder is also great for sprinkling over plain butter-toast, fried pakoras, or dahi vada.',
    ],
    productLink: { label: 'Buy Tangry Vada Pav Chutney', href: '/products/vada-pav-chutney' },
  },
  {
    id: 3,
    slug: 'dabeli-recipe',
    title: 'Famous Kutchi Dabeli Recipe — Street Style Gujarati Pav',
    excerpt:
      'Sweet-spicy potato filling in pav, topped with sev, pomegranate and roasted peanuts.',
    description:
      'Indulge in Kutchi Dabeli, an iconic sweet, spicy, and tangy street snack originating from the Mandvi region of Kutch, Gujarat. Soft pav bun stuffed with mashed potato seasoned with a warm spice blend, then garnished with pomegranate, masala peanuts, and crunchy fine sev.\n\nThe heart of this recipe is the dabeli masala. Tangry Dabeli Masala is built on coriander, cumin, dry mango, red chilli, cloves, and cinnamon — the warm-and-tangy combination that gives dabeli its distinctive sweet-spicy backbone. It is blended in small batches in Jhotwara, Jaipur.\n\nThis recipe comes together fast when you have pre-boiled potatoes and a jar of ready dabeli masala. Master the street-stall assembly order to get those distinct juicy, crispy, and warm textures at home!',
    seoDescription:
      'Step-by-step Kutchi Dabeli recipe containing crispy sev, sweet pomegranate & potato filling prepared with authentic Tangry Dabeli Masala.',
    keywords: [
      'kutchi dabeli recipe',
      'dabeli recipe at home',
      'how to make dabeli masala potato',
      'gujarati pav recipe',
      'best dabeli spice blend online',
      'street style dabeli filling',
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Street Food',
    cuisine: 'Indian',
    image: '/images/recipes/dabeli.jpg',
    imageAlt: 'Kutchi dabeli topped with fine sev, pomegranate seeds and roasted peanuts on a steel plate',
    author: 'Tangry Spices',
    date: '2026-08-08',
    updated: '2026-08-08',
    featured: true,
    ingredients: [
      '4 soft pav buns',
      '3 large potatoes, boiled and thoroughly mashed',
      '2 to 2½ tsp Tangry Dabeli Masala',
      '1 tbsp butter or oil (for potato cooking)',
      '3 tbsp sweet tamarind-date chutney (imli-khajur)',
      '2 tbsp fresh grated or desiccated coconut',
      '3 tbsp juicy pomegranate seeds (anar)',
      '3 tbsp salty spiced masala peanuts',
      '½ cup fine nylon sev (chickpea vermicelli)',
      'Salt to taste',
      'Butter for pan-toasting pav',
      '¼ cup chopped fresh coriander leaves',
    ],
    instructions: [
      {
        step: 1,
        text: 'Sauté the masala: Heat 1 tbsp of oil or butter in a non-stick pan over low heat. Add Tangry Dabeli Masala and stir for 20 seconds. Low heat lets the clove and cinnamon notes open up without scorching the blend.',
      },
      {
        step: 2,
        text: 'Cook the filling: Add the mashed potatoes to the bloomed masala, followed by salt and 2 tbsp of water. Mix vigorously until the potato turns into a smooth, glossy, uniform brown paste. Cook for 3 minutes, then turn off heat.',
      },
      {
        step: 3,
        text: 'Prep the dabeli plate: Spread the cooked potato mixture evenly on a plate. Layer the top with desiccated coconut, a handful of spicy peanuts, sweet pomegranate seeds, and fresh coriander. This represents the traditional street-stall visual base.',
      },
      {
        step: 4,
        text: 'Toast the pav: Slip a knife through the pav buns, horizontally split. Add butter to a hot griddle (tawa) and lightly toast both the outer and inner crusts of the buns.',
      },
      {
        step: 5,
        text: 'Assemble: Spread sweet tamarind-date chutney on the inner sides of the warm pav. Scoop a generous portion of the loaded spicy potato dabeli filling into the center. Pack with extra roasted peanuts and pomegranate seeds.',
      },
      {
        step: 6,
        text: 'Press and roll: Close the pav bun, press down gently, and dip the exposed edges into a plate of fine nylon sev so the crispy chickpea noodles stick to the sweet-spicy filling. Serve immediately!',
      },
    ],
    tips: [
      'Why Pomegranate is essential: The juicy, sweet burst of cold pomegranate seeds balancing the warm, spicy potato paste is the defining signature of Kutchi Dabeli. Do not skip it!',
      'Garnish variety: Stalls in Gujarat often add a drop of spicy garlic water ("lehsun paani") to the potato mix for extra bite. You can recreate this by blending 1 tsp of our Vada Pav Chutney with a little warm water.',
      'Pre-prep for parties: The spiced potato paste and sweet tamarind chutney can be made a day in advance. Warm the potato mix, toast the buns, and assemble live.',
    ],
    productLink: { label: 'Buy Tangry Dabeli Masala', href: '/products/dabeli-masala' },
  },
  {
    id: 4,
    slug: 'chaas-recipe-masala-buttermilk',
    title: 'Classic Masala Chaas Recipe (Frothy Summer Spiced Buttermilk)',
    excerpt:
      'Cold, frothy spiced buttermilk whisked in 5 minutes — the classic Indian summer cooler.',
    description:
      'Stay cool with Masala Chaas (spiced buttermilk), India’s favourite summer cooler. Whipped up in under 5 minutes, this traditional drink combines thick curd, chilled water, and a ready spice seasoning.\n\nMaking chaas from scratch usually means grinding mint, ginger, green chillies, and roasted cumin every single time. Tangry Chaas Masala replaces that step entirely — scoop, whisk, done. No grinding, no prep, no shopping list.\n\nThis recipe walks through getting the curd-to-water ratio right and whisking hard enough to build that thick layer of froth on top, which is what separates a proper glass of chaas from watered-down curd.',
    seoDescription:
      'Make frothy Masala Chaas (buttermilk) in 5 minutes with Tangry Chaas Masala. The classic Indian summer cooler — no grinding, no prep.',
    keywords: [
      'masala chaas recipe',
      'spiced buttermilk indian',
      'how to make masala buttermilk',
      'chaas masala ingredients powder',
      'summer drinks indian home style',
      'digestive curd drink',
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: 'Easy',
    category: 'Drinks',
    cuisine: 'Indian',
    image: '/images/recipes/masala-chaas.jpg',
    imageAlt: 'Two tall glasses of frothy masala chaas garnished with mint and roasted cumin',
    author: 'Tangry Spices',
    date: '2026-08-08',
    updated: '2026-08-08',
    featured: true,
    ingredients: [
      '1 cup thick plain curd (dahi), well-chilled',
      '2 cups water, iced or chilled',
      '¾ tsp Tangry Chaas Masala (adjust to taste)',
      '1 pinch black salt (kala namak, for extra digestif minerals)',
      '4 ice cubes',
      'Fresh mint leaves and coriander sprigs for serving',
    ],
    instructions: [
      {
        step: 1,
        text: 'Whip the curd: Scoop the chilled plain curd into a deep mixing pitcher or blender container. Whisk manually with a traditional wooden churner (madani) or blend on low for 10 seconds until the paste is slick and uniform.',
      },
      {
        step: 2,
        text: 'Dilute: Pour in 1.5 to 2 cups of ice-cold water. A 1:2 ratio of curd-to-water keeps the chaas light, drinkable, and digestive.',
      },
      {
        step: 3,
        text: 'Spice: Sprinkle Tangry Chaas Masala and a tiny pinch of extra black salt. Whisk or blend vigorously on high for 30 seconds. This step incorporates air, creating a rich, frothy, head of foam at the top of the buttermilk.',
      },
      {
        step: 4,
        text: 'Decant: Add ice cubes to two tall serving glasses. Pour the frothy, spiced buttermilk over the ice, garnish with a light dusting of Tangry Chaas Masala and fresh mint, and serve immediately.',
      },
    ],
    tips: [
      'Maintain the froth: Chaas is best consumed fresh within minutes of whipping. If kept in the fridge, the curd solids and water will separate. Give it a quick stir or whisk before pouring.',
      'After a heavy meal: A glass of chaas after lunch is the standard Indian way to finish a rich meal — it is light, cooling, and far easier than a fizzy drink.',
      'Our Chaas Masala is versatile — dust it over watermelon salad, raita, sliced cucumber, or fresh lemonade.',
    ],
    productLink: { label: 'Buy Tangry Chaas Masala', href: '/products/chaas-masala' },
  },
  {
    id: 5,
    slug: 'poha-with-jeeravan-masala',
    title: 'Indori & Rajasthani Poha Recipe with Jain Jeeravan Masala',
    excerpt:
      'Fluffy yellow poha finished with jeeravan masala, crisp sev and pomegranate.',
    description:
      'Learn how to make fluffy, light, tangy Indori-style Poha, Central India\'s iconic breakfast dish. Flattened rice steam-cooked with turmeric and mustard seeds, balanced sweet-and-sour, then finished with a generous dusting of jeeravan masala.\n\nJeeravan (also spelled jiraban) is a Marwari finishing spice from the Jodhpur–Indore belt. Unlike a base masala, it is never cooked into the dish — it is dusted over the plate at the very end so its roasted, tangy aroma stays sharp. Tangry Jain Jeeravan Masala is made in Jaipur in the Jain style, without onion or garlic.\n\nTopped with crunchy Indori sev, roasted peanuts, and sweet pomegranate, this 20-minute breakfast is one of the easiest ways to start the day well.',
    seoDescription:
      'Prepare Indori-style fluffy Poha at home in 20 minutes. Served with crunchy sev, pomegranate & aromatic Tangry Jain Jeeravan finishing masala.',
    keywords: [
      'indori poha recipe',
      'jeeravan masala poha',
      'how to make fluffy poha at home',
      'rajasthani yellow poha',
      'jain breakfast dishes',
      'jiraban masala online',
    ],
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: 'Easy',
    category: 'Breakfast',
    cuisine: 'Indian',
    image: '/images/recipes/poha-jeeravan.jpg',
    imageAlt: 'Bowl of yellow Indori poha topped with sev, peanuts and pomegranate, served with chai',
    author: 'Tangry Spices',
    date: '2026-08-08',
    updated: '2026-08-08',
    featured: false,
    ingredients: [
      '1½ cups thick or medium flattened rice flakes (poha)',
      '1 tbsp refined cooking oil',
      '½ tsp black mustard seeds (rai)',
      '½ tsp cumin seeds (jeera)',
      '10 fresh curry leaves',
      '1 small onion, finely minced (skip for strict Jain preparation)',
      '1 spicy green chilli, sliced (skip if preferred mild)',
      '¼ tsp turmeric powder (haldi)',
      '½ tsp fine caster sugar (key for Indori balance)',
      'Salt to taste',
      '1 tbsp fresh lemon juice',
      '1½ tsp Tangry Jain Jeeravan Masala (retained for final dusting)',
      '¼ cup Indori sev or nylon ratlami sev',
      '2 tbsp sweet pomegranate seeds (optional garnish)',
    ],
    instructions: [
      {
        step: 1,
        text: 'Wash the poha: Place the flat rice flakes in a colander. Rinse under cold tap water for 10–12 seconds, gently turning them with your fingers so every grain is washed. Drain completely and let rest in the colander for 5 minutes. The poha will absorb the retained water and swell up, becoming fluffy but separate.',
      },
      {
        step: 2,
        text: 'The Tempering (Tadka): Heat oil in a kadai over medium heat. Crackle the mustard seeds and cumin seeds, then toss in curry leaves, green chilli, and onion. Sauté for 3 minutes until the onion is pink and soft. (For Jain version, skip onion and green chilli.)',
      },
      {
        step: 3,
        text: 'Season: Lower the heat. Sprinkle turmeric powder, salt, sugar, and 1 tbsp of water. Stir well. The brief water vapor distributes the turmeric color and melts the sugar into the oil base.',
      },
      {
        step: 4,
        text: 'Steam: Add the softened poha to the pan. Turn and fold with a rubber spatula using very gentle movements — stir too hard and the fragile poha grains will mash. Cover and let steam on low heat for 2–3 minutes.',
      },
      {
        step: 5,
        text: 'Finish: Extinguish the stove. Drizzle fresh lemon juice and toss. Scoop the steaming yellow poha onto serving bowls.',
      },
      {
        step: 6,
        text: 'The Jeeravan Magic: Liberally dust Tangry Jain Jeeravan Masala directly over the plated poha. Cover with crispy Indori sev, roasted peanuts, and sweet pomegranate seeds. Serve immediately with hot chai!',
      },
    ],
    tips: [
      'Why Jeeravan goes at the end: Heating jeeravan masala in oil cooks off the volatile top notes that make it worth using. Stalls in Indore and Jodhpur always dust it cold, straight onto the plate, so you get the aroma the moment it is served.',
      'Check poha thickness: Never use thin (paper) poha — it turns to mush in the colander. Always buy medium or thick poha flakes.',
      'Jeeravan also works on potato chips, roasted papad, cucumber slices, and plain khichdi.',
    ],
    productLink: { label: 'Buy Tangry Jain Jeeravan Masala', href: '/products/jain-jeeravan-masala' },
  },
  {
    id: 6,
    slug: 'gun-powder-podi-idli',
    title: 'Ghee Podi Idli Recipe (South Indian Gun Powder Snack)',
    excerpt:
      'Leftover idlis tossed in ghee and coarse podi masala — ready in five minutes.',
    description:
      'Turn plain or leftover idlis into Ghee Podi Idli, a fast and deeply aromatic South Indian comfort dish. Perfect as a 5-minute breakfast, a lunchbox filler, or a quick evening snack.\n\nPodi (also called idli podi or gun powder) is a coarse dry condiment built on roasted lentils, curry leaves, and dry red chillies. Tangry Gun Powder is made in Jaipur with urad dal, chana dal, red chilli, and curry leaves, ground to the coarse, nutty texture that clings properly to ghee-coated idli.\n\nThe method could not be simpler: toss bite-sized idlis in warm sesame oil or ghee, then coat them in podi. Spicy, nutty, and no chutney-grinding required.',
    seoDescription:
      'Learn how to make spicy Ghee Podi Idli in 5 minutes with Tangry Gun Powder (milagai podi). Perfect lunchbox or breakfast option.',
    keywords: [
      'podi idli recipe',
      'ghee podi idli',
      'south indian gun powder recipe',
      'how to use idli podi',
      'milagai podi ingredients powder',
      'quick breakfast idli',
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: 'Easy',
    category: 'Breakfast',
    cuisine: 'South Indian',
    image: '/images/recipes/podi-idli.jpg',
    imageAlt: 'Idli wedges tossed in ghee and coated with coarse red-brown podi masala',
    author: 'Tangry Spices',
    date: '2026-08-08',
    updated: '2026-08-08',
    featured: false,
    ingredients: [
      '8 medium-sized idlis (best if leftover or slightly cooled)',
      '2 to 3 tsp Tangry Gun Powder (Podi Masala, adjust to taste)',
      '1½ tbsp pure cow ghee or authentic wood-pressed sesame oil',
      'A tiny pinch of salt (idlis are already salted, but helps coat)'
    ],
    instructions: [
      {
        step: 1,
        text: 'Prep the idlis: Cut each cooled idli into 4 bite-sized wedges. If you are using freshly steamed idlis, let them cool on a plate for 5 minutes — hot, steaming idlis are too soft and will break apart when tossed.',
      },
      {
        step: 2,
        text: 'Heat grease: Warm 1½ tbsp of pure cow ghee or cold-pressed sesame oil (gingelly oil) in a wide pan or wok on medium-low heat. Sesame oil delivers an authentic Tamil Nadu temple flavor, while ghee offers a rich, sweet texture children love.',
      },
      {
        step: 3,
        text: 'Coat: Throw in the sliced idli wedges and stir-fry for 1 minute until the outsides absorb the grease and become lightly firm.',
      },
      {
        step: 4,
        text: 'Dust the Podi: Sprinkle Tangry Gun Powder and a pinch of salt evenly over the idlis. Toss gently with a flat spatula for 1 minute until every idli wedge is coated in a thick, coarse layer of spicy red-brown podi. Serve hot with filtered coffee!',
      },
    ],
    tips: [
      'Use leftover idlis: Leftover, refrigerated idlis work best for Podi because they are dry and firm. They absorb oil/ghee beautifully without breaking.',
      'Dosa version: Spread a thin ladle of batter to make a crispy dosa. Drizzle ghee on top, and scatter 1 tsp of Tangry Gun Powder over the wet batter. Fold and roll — no side chutneys needed.',
      'Our Gun Powder contains premium split pulses — avoid storing the jar in damp cupboards to maintain its signature crunch.',
    ],
    productLink: { label: 'Buy Tangry Gun Powder (Podi Masala)', href: '/products/gun-powder-podi-masala' },
  },
  {
    id: 7,
    slug: 'pav-bhaji-recipe',
    title: 'Best Mumbai Street Style Pav Bhaji Recipe (Step-by-Step)',
    excerpt:
      'Rich, buttery, deep-red mashed vegetable bhaji with butter-toasted pav.',
    description:
      'Craving real, buttery, spicy Mumbai Pav Bhaji? This step-by-step recipe delivers that rich, deep-red, restaurant-style mashed vegetable curry served with buttery toasted pav.\n\nThe secret to chowpatty-style pav bhaji is two things: properly caramelising the tomato base, and the masala blend. Tangry Pav Bhaji Masala uses Kashmiri chilli for natural colour, with coriander, cumin, fennel, black pepper, and dry mango (amchur) giving it the tangy edge that stops all that butter from tasting heavy.\n\nBelow you will find the full method — including the in-pan mashing technique — to get a smooth, deeply flavoured bhaji at home in under 45 minutes.',
    seoDescription:
      'The ultimate step-by-step Mumbai street style Pav Bhaji recipe. Rich, buttery vegetable curry flavored with natural red Tangry Pav Bhaji Masala.',
    keywords: [
      'mumbai pav bhaji recipe',
      'how to make pav bhaji at home',
      'pav bhaji masala powder',
      'rich buttery pav bhaji',
      'restaurant style pav bhaji secret',
      'mashing vegetables for bhaji',
    ],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    category: 'Street Food',
    cuisine: 'Indian',
    image: '/images/recipes/pav-bhaji.jpg',
    imageAlt: 'Mumbai pav bhaji with melting butter, chopped onion, lemon and butter-toasted pav',
    author: 'Tangry Spices',
    date: '2026-08-08',
    updated: '2026-08-08',
    featured: true,
    ingredients: [
      '3 medium potatoes, boiled and peeled',
      '1 cup cauliflower florets, steamed soft',
      '½ cup sweet green peas (steamed)',
      '1 large capsicum (shimla mirch), minced',
      '2 large juicy red tomatoes, finely chopped',
      '1 large onion, minced',
      '1 tbsp ginger-garlic paste',
      '2 tbsp Tangry Pav Bhaji Masala',
      '½ tsp extra Kashmiri red chilli powder (for extra color)',
      '4 tbsp pure salted butter',
      '2 tbsp vegetable cooking oil',
      'Salt to taste',
      '1 tbsp fresh lemon juice',
      '¼ cup fresh coriander, chopped',
      '8 soft pav buns (for serving)',
    ],
    instructions: [
      {
        step: 1,
        text: 'The Flavor Base: Heat 1 tbsp of butter and 2 tbsp of vegetable oil in a large flat pan or tawa. Add the minced onion and sauté for 5 minutes on medium-high until golden brown. Adding oil keeps the butter from burning at high temperatures.',
      },
      {
        step: 2,
        text: 'Aromatics: Add the ginger-garlic paste and sauté for 1 minute until raw smell goes away. Add the finely minced capsicum and stir-fry for 2 minutes.',
      },
      {
        step: 3,
        text: 'Tomato reduction: Add the tomatoes and salt. Cook on medium heat for 6–7 minutes, pressing with a spoon, until the tomatoes turn mushy, release their juices, and oil/butter separates from the corners. This slow reduction builds the sweet, caramelized body of the bhaji.',
      },
      {
        step: 4,
        text: 'Bloom Masala: Lower the heat, sprinkle Tangry Pav Bhaji Masala and extra Kashmiri chilli powder. Stir-fry for 30 seconds so the blend opens up in the hot fat before the vegetables go in.',
      },
      {
        step: 5,
        text: 'Mash direct: Add the boiled potatoes, cauliflower, and green peas, along with ¼ cup of warm water. Use a flat metal potato masher to press and mash the vegetables directly in the pan until smooth and creamy yet retaining a tiny bit of texture.',
      },
      {
        step: 6,
        text: 'Simmer: Add another ½ cup of water and 2 tbsp of butter. Simmer on low-medium heat for 8 minutes, stirring frequently so the starch doesn’t burn. The bhaji should have a thick, pourable, velvety porridge-like consistency.',
      },
      {
        step: 7,
        text: 'Present: Stir in lemon juice and fresh coriander. Turn off the stove. Toast pav buns on a buttery hot tawa with a dusting of extra pav bhaji masala, and serve hot together!',
      },
    ],
    tips: [
      'Secret to the red colour: Use deep red, ripe tomatoes. Their acidity reacting with the Kashmiri chilli in the masala is what produces that crimson restaurant look naturally.',
      'Double Butter: Adding butter once with onions and again during the final simmer incorporates the dairy fats into the vegetable fibers, resulting in a silkier mouthfeel.',
      'Tangry Pav Bhaji Masala is also superb for seasoning spiced vegetable tawa pulao, masala khichdi, or cheesy bread-rolls.',
    ],
    productLink: { label: 'Buy Tangry Pav Bhaji Masala', href: '/products/pav-bhaji-masala' },
  },
  {
    id: 8,
    slug: 'rajasthani-paratha-sweet-lemon-pickle',
    title: 'Flaky Rajasthani Paratha Recipe paired with Homestyle Sweet Lemon Pickle',
    excerpt:
      'Ghee-laminated flaky paratha served with sweet-tangy lemon pickle and cold curd.',
    description:
      'Discover the timeless comfort of flaky, ghee-laminated Rajasthani paratha served with sweet lemon pickle — a sweet-tangy citrus breakfast plate that is a staple in households across Jaipur and Jodhpur.\n\nA good sweet lemon pickle balances citrus sourness against sugar. Tangry Sweet Lemon Pickle is made in Jhotwara, Jaipur with lemon, sugar, salt, red chilli, turmeric, fenugreek seeds, fennel, mustard seeds, and asafoetida — a sweet-tangy achar rather than a sharply sour one, which is what makes it work so well with ghee-cooked flatbread.\n\nThis recipe covers the fold-and-roll lamination technique that gives paratha its distinct flaky layers. Served with a spoon of sweet lemon pickle and a bowl of cold curd, it is the classic homestyle breakfast — and a reliable travel meal.',
    seoDescription:
      'Learn how to roll flaky layered Rajasthani parathas, served with sweet-tangy Tangry Sweet Lemon Pickle and cold curd. Classic homestyle recipe.',
    keywords: [
      'sweet lemon pickle online',
      'meetha nimbu achar with paratha',
      'flaky rajasthani paratha recipe',
      'achar paratha breakfast',
      'meetha nimbu ka achar',
      'lemon pickle jaipur',
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Breakfast',
    cuisine: 'Indian',
    image: '/images/recipes/paratha-lemon-pickle.jpg',
    imageAlt: 'Flaky Rajasthani paratha served with sweet lemon pickle and a bowl of fresh curd',
    author: 'Tangry Spices',
    date: '2026-08-08',
    updated: '2026-08-08',
    featured: false,
    ingredients: [
      '2 cups premium whole wheat flour (atta)',
      '½ tsp salt',
      '1 tsp oil or ghee (infused into dough)',
      '¾ cup cold water (to knead a pliable dough)',
      'Ghee or unsalted white butter for frying flatbread',
      '4 to 6 tsp Tangry Sweet Lemon Pickle (served side)',
      '1 cup thick, cold plain dahi (yogurt)'
    ],
    instructions: [
      {
        step: 1,
        text: 'Knead the base dough: Combine wheat flour, salt, and 1 tsp of oil in a wide plate (parat). Add water slowly and knead for 5–7 minutes into a smooth, malleable, soft dough. Cover with a damp cloth and let it rest for 15 minutes — resting relaxes the wheat gluten, resulting in softer parathas.',
      },
      {
        step: 2,
        text: 'Layer (Lamination): Divide the rested dough into 8 equal round balls. Dust a board with flour and roll a ball into a circular disc (approx 6 inches). Paint a thin layer of ghee over the circle, fold it in half to make a semi-circle, brush ghee again, and fold once more into a layered triangle.',
      },
      {
        step: 3,
        text: 'Roll triangle: Gently roll the triangular dough packet outward, maintaining its shape. Check that the edges are even and not too thick.',
      },
      {
        step: 4,
        text: 'Tawa cook: Place the triangle paratha on a piping hot iron grid (tawa). Cook on medium-high for 1 minute until small bubbles rise on the surface, then flip.',
      },
      {
        step: 5,
        text: 'Ghee crust: Smear ½ tsp of ghee over the top, flip again, and paint ghee on the second side. Press down on the edges with a flat spatula or clean cloth. This traps hot steam between the folded ghee-laminated layers. Cook until golden-brown roasted spots cover both faces. Cook all parathas.',
      },
      {
        step: 6,
        text: 'Serve: Break the parathas gently with your hand to bloom the internal layers. Serve scorching hot with a generous scoop of sweet-tangy Tangry Sweet Lemon Pickle and a bowl of fresh, thick curd.',
      },
    ],
    tips: [
      'Why sweet pickle pairs best: A sharply sour or heavily spiced achar fights a ghee paratha. The sweet-tangy citrus profile of Tangry Sweet Lemon Pickle works as a lighter counterpoint, which is exactly why this pairing is a Rajasthani staple.',
      'Travel snack value: Achar-paratha is the legendary Indian travel meal. Pack ghee-cooked parathas and a jar of sweet lemon pickle in a lunchbox — they stay soft and delicious for up to 24 hours without turning stale.',
      'Our Sweet Lemon Pickle is also wonderful alongside simple yellow dal-rice, khichdi, or stuffed aloo parathas.',
    ],
    productLink: { label: 'Buy Tangry Sweet Lemon Pickle', href: '/products/sweet-lemon-pickle' },
  },
];

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}
