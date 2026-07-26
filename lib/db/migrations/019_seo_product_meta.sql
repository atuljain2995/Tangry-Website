-- SEO meta updates for high-impression GSC product pages (Task 6)
-- Titles omit "| Tangry Spices" — the Next.js layout adds that suffix via absolute title.

UPDATE products SET
  meta_title = 'Sweet Lemon Pickle — Buy Online, Jaipur',
  meta_description = 'Homestyle sweet lemon pickle from Tangry Spices, Jaipur. Tangy, mildly sweet Rajasthani pickle. FSSAI licensed. Free shipping on orders ₹500+.',
  updated_at = NOW()
WHERE slug = 'sweet-lemon-pickle';

UPDATE products SET
  meta_title = 'Gun Powder Podi Masala — Buy Online, Jaipur',
  meta_description = 'Tangry Gun Powder (podi) for idli, dosa & rice. Roasted lentils & curry leaves. From ₹75. Order online from Jaipur. FSSAI certified.',
  updated_at = NOW()
WHERE slug = 'gun-powder-podi-masala';

UPDATE products SET
  meta_title = 'Dabeli Masala 200g — Buy Online, Jaipur',
  meta_description = 'Authentic Kutchi-style dabeli masala blended in Jaipur. Street-food flavour at home — ₹190 for 200g. FSSAI licensed. Free shipping ₹500+.',
  updated_at = NOW()
WHERE slug = 'dabeli-masala';

UPDATE products SET
  meta_title = 'Turmeric Powder (Haldi) — Buy Online, Jaipur',
  meta_description = 'Bright, aromatic haldi for daily Indian cooking. 100g & 200g packs from ₹65. FSSAI & ISO 22000 certified. Ships across India from Jaipur.',
  updated_at = NOW()
WHERE slug = 'turmeric-powder';

UPDATE products SET
  meta_title = 'Chaas Masala — Buy Online, Jaipur',
  meta_description = 'Cooling chaas masala for buttermilk & shikanji. Minty, spicy Tangry blend from Jaipur. FSSAI licensed. Order online with fast delivery.',
  updated_at = NOW()
WHERE slug = 'chaas-masala';
