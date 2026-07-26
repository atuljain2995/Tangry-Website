-- SEO meta updates for remaining 13 product pages (snippet audit follow-up)
-- Titles omit "| Tangry Spices" — Next.js adds that suffix via absolute title.

UPDATE products SET
  meta_title = 'Chai Masala — Buy Online, Jaipur',
  meta_description = 'Tangry chai masala for kadak tea, milk and desserts. Warm spice blend from Jaipur. From ₹120. FSSAI licensed. Free shipping on orders ₹500+.',
  updated_at = NOW()
WHERE slug = 'chai-masala';

UPDATE products SET
  meta_title = 'Coriander Powder — Buy Online, Jaipur',
  meta_description = 'Fresh coriander (dhania) powder from Tangry Spices, Jaipur. Sun-dried seeds, cold ground for aroma. FSSAI licensed. Order online with fast delivery.',
  updated_at = NOW()
WHERE slug = 'coriander-powder';

UPDATE products SET
  meta_title = 'Fresh Tomato Ketchup — Buy Online, Jaipur',
  meta_description = 'Homestyle tomato ketchup from Tangry, Jaipur. Tomatoes, garlic and ginger — no artificial colours. From ₹55. FSSAI licensed. Shop online today.',
  updated_at = NOW()
WHERE slug = 'fresh-tomato-ketchup';

UPDATE products SET
  meta_title = 'Green Chilli Pickle — Buy Online, Jaipur',
  meta_description = 'Spicy green chilli pickle from Tangry Spices, Jaipur. Homestyle Rajasthani side for paratha and dal chawal. FSSAI licensed. Free shipping ₹500+.',
  updated_at = NOW()
WHERE slug = 'green-chilli-pickle';

UPDATE products SET
  meta_title = 'Jain Jeeravan Masala — Buy Online, Jaipur',
  meta_description = 'Authentic Jain jeeravan masala from Tangry, Jaipur. MP-style spice blend for poha, snacks and chaat. From ₹75. FSSAI licensed. Buy online.',
  updated_at = NOW()
WHERE slug = 'jain-jeeravan-masala';

UPDATE products SET
  meta_title = 'Kitchen Essential Pack — Buy Online, Jaipur',
  meta_description = 'Tangry kitchen essential masala combo — rajma, chai, peri peri, pav bhaji, dabeli & sambhar. ₹599 gift-ready pack. FSSAI licensed. Ships across India.',
  updated_at = NOW()
WHERE slug = 'kitchen-essential-pack';

UPDATE products SET
  meta_title = 'Pav Bhaji Masala — Buy Online, Jaipur',
  meta_description = 'Street-style pav bhaji masala from Tangry, Jaipur. Rich Mumbai flavour in 50g, 100g & 200g packs from ₹75. FSSAI licensed. Free shipping ₹500+.',
  updated_at = NOW()
WHERE slug = 'pav-bhaji-masala';

UPDATE products SET
  meta_title = 'Peri Peri Masala — Buy Online, Jaipur',
  meta_description = 'Tangry peri peri masala for fries, corn, snacks and grills. Bold heat from Jaipur. FSSAI licensed. Order online — free shipping on orders ₹500+.',
  updated_at = NOW()
WHERE slug = 'peri-peri-masala';

UPDATE products SET
  meta_title = 'Ready to Eat Gift Hamper — Buy Online, Jaipur',
  meta_description = 'Tangry ready-to-eat gift hamper — masalas, podis & chutneys from Jaipur. Perfect festive or corporate gift at ₹699. FSSAI licensed. Order online.',
  updated_at = NOW()
WHERE slug = 'ready-to-eat-gift-hamper';

UPDATE products SET
  meta_title = 'Red Chilli Powder — Buy Online, Jaipur',
  meta_description = 'Bright red chilli powder from Tangry Spices, Jaipur. Sun-dried, cold ground for gravies and marinades. From ₹150. FSSAI licensed. Buy online today.',
  updated_at = NOW()
WHERE slug = 'red-chilli-powder';

UPDATE products SET
  meta_title = 'Sambhar Masala — Buy Online, Jaipur',
  meta_description = 'South Indian sambhar masala from Tangry, Jaipur. Balanced blend for authentic sambhar and rasam. From ₹65. FSSAI licensed. Free shipping ₹500+.',
  updated_at = NOW()
WHERE slug = 'sambhar-masala';

UPDATE products SET
  meta_title = 'Sweet Mango Relish — Buy Online, Jaipur',
  meta_description = 'Sweet raw mango relish from Tangry Spices, Jaipur. Family-friendly pickle for paratha and dal rice. FSSAI licensed. Order online with fast delivery.',
  updated_at = NOW()
WHERE slug = 'sweet-mango-relish';

UPDATE products SET
  meta_title = 'Vada Pav Chutney Powder — Buy Online, Jaipur',
  meta_description = 'Mumbai-style dry vada pav chutney from Tangry, Jaipur. Garlic-forward mix for batata vada and pav. 100g & 200g from ₹99. FSSAI licensed. Buy online.',
  updated_at = NOW()
WHERE slug = 'vada-pav-chutney';
