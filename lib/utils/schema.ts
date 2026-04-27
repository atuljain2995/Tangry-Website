// Structured data (JSON-LD) generators for SEO

import { ProductExtended, Review } from '../types/database';
import { COMPANY_INFO, SOCIAL_LINKS } from '../data/constants';

const SITE_URL = 'https://www.tangryspices.com';

function toAbsoluteUrl(url: string): string {
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

/**
 * Generate Organization schema
 */
const orgPostalAddress = {
  '@type': 'PostalAddress' as const,
  streetAddress: 'A7, Marg No A5, Khatipura Road, Kumawat Colony, Jhotwara',
  addressLocality: 'Jaipur',
  postalCode: '302012',
  addressRegion: 'Rajasthan',
  addressCountry: 'IN',
};

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tangry',
    alternateName: ['Tangry Spices'],
    url: 'https://www.tangryspices.com',
    logo: 'https://www.tangryspices.com/images/logo-512.png',
    description: `${COMPANY_INFO.brandName} — ${COMPANY_INFO.tagline}. Authentic spices and masalas from Jaipur, Rajasthan.`,
    address: orgPostalAddress,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.phoneTel,
      contactType: 'Customer Service',
      email: COMPANY_INFO.email,
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.twitter,
    ],
  };
}

/**
 * Generate ProductGroup + hasVariant schema with per-SKU Offer,
 * AggregateRating, and Review objects.
 *
 * Structure:
 *   ProductGroup (parent — brand, images, ratings, reviews)
 *     └─ hasVariant[] → Product (per variant — sku, weight, individual Offer)
 *
 * Falls back to a single flat Product when there is only one variant.
 */
export function getProductSchema(product: ProductExtended, reviews: Review[] = []) {
  const productUrl = `${SITE_URL}/products/${product.slug}`;

  const absoluteImages = product.images.length
    ? product.images.map(toAbsoluteUrl)
    : [`${SITE_URL}/products/placeholder.png`];

  const aggregateRating =
    product.rating && product.reviewCount > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
          bestRating: '5',
          worstRating: '1',
        }
      : undefined;

  const reviewObjects =
    reviews.length > 0
      ? reviews.map((r) => ({
          '@type': 'Review',
          name: r.title,
          reviewBody: r.comment,
          datePublished: r.createdAt.toISOString().split('T')[0],
          author: {
            '@type': 'Person',
            name: r.userName,
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: r.rating,
            bestRating: '5',
            worstRating: '1',
          },
        }))
      : undefined;

  const brand = { '@type': 'Brand', name: 'Tangry' };

  // Build per-variant Product + Offer objects
  const variantSchemas = product.variants.map((v) => {
    const price = Number(v.price);
    const availability =
      v.isAvailable && v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';

    const offer: Record<string, unknown> = {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: Number.isFinite(price) ? price : 0,
      availability,
      seller: { '@type': 'Organization', name: 'Tangry' },
    };

    // Emit priceValidUntil when a compare-at (sale) price is present
    if (v.compareAtPrice && v.compareAtPrice > price) {
      offer.priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
    }

    return {
      '@type': 'Product' as const,
      name: `${product.name} – ${v.name}`,
      sku: v.sku,
      description: product.description,
      image: absoluteImages,
      brand,
      weight: {
        '@type': 'QuantitativeValue' as const,
        value: v.weight,
        unitCode: 'GRM',
      },
      offers: offer,
    };
  });

  // Single variant → flat Product (no ProductGroup wrapper needed)
  if (variantSchemas.length <= 1) {
    const single = variantSchemas[0];
    return {
      '@context': 'https://schema.org',
      '@type': 'Product' as const,
      '@id': `${productUrl}#product`,
      name: product.name,
      url: productUrl,
      description: product.description,
      image: absoluteImages,
      brand,
      sku: single?.sku ?? product.id,
      category: product.category,
      weight: single?.weight,
      aggregateRating,
      review: reviewObjects,
      offers: single?.offers,
    };
  }

  // Multiple variants → ProductGroup + hasVariant
  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup' as const,
    '@id': `${productUrl}#product`,
    name: product.name,
    url: productUrl,
    description: product.description,
    image: absoluteImages,
    brand,
    category: product.category,
    productGroupID: product.id,
    variesBy: 'https://schema.org/weight',
    aggregateRating,
    review: reviewObjects,
    hasVariant: variantSchemas,
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Recipe schema
 */
export function getRecipeSchema(recipe: {
  name: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  category: string;
  cuisine: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: recipe.image,
    author: {
      '@type': 'Organization',
      name: 'Tangry Spices',
    },
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    recipeYield: recipe.servings,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((instruction, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: instruction,
    })),
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine,
    keywords: [recipe.category, recipe.cuisine, 'Indian cooking', 'spices'],
  };
}

/**
 * Generate LocalBusiness schema — enriched for local SEO
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'FoodEstablishment'],
    '@id': 'https://www.tangryspices.com/#local-business',
    name: 'Tangry',
    alternateName: 'Tangry Spices',
    description:
      'Authentic spices, masalas, pickles, and condiments handcrafted in Jaipur, Rajasthan. FSSAI licensed and ISO 22000 certified.',
    image: [
      'https://www.tangryspices.com/images/logo-512.png',
      'https://www.tangryspices.com/images/logo-full.png',
    ],
    telephone: COMPANY_INFO.phoneTel,
    email: COMPANY_INFO.email,
    url: 'https://www.tangryspices.com',
    address: orgPostalAddress,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '26.935058',
      longitude: '75.757109',
    },
    hasMap: 'https://www.google.com/maps?q=26.935058,75.757109',
    priceRange: '₹₹',
    servesCuisine: ['Indian', 'Rajasthani'],
    paymentAccepted: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'],
    currenciesAccepted: 'INR',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '00:00',
        closes: '00:00',
        description: 'Closed',
      },
    ],
    sameAs: [
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.twitter,
    ],
    founder: {
      '@type': 'Person',
      name: 'Maya Jain',
    },
    legalName: COMPANY_INFO.legalName,
    taxID: 'FSSAI 12225026001713',
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Food Safety License',
        name: 'FSSAI License',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Food Safety and Standards Authority of India',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Quality Certification',
        name: 'ISO 22000',
      },
    ],
  };
}

/**
 * Generate WebSite schema with SearchAction
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tangry Spices',
    url: 'https://www.tangryspices.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.tangryspices.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate FAQPage schema from question/answer pairs.
 * Useful for AI citation even though Google dropped FAQ rich results
 * for most commercial sites (Aug 2023).
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Build standard FAQ pairs for a product from its structured data.
 */
export function getProductFAQs(
  product: ProductExtended,
): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];

  faqs.push({
    question: `What is ${product.name} from Tangry Spices?`,
    answer:
      product.description ||
      `${product.name} is a premium spice product from Tangry Spices, Jaipur. FSSAI licensed, ISO 22000 certified.`,
  });

  if (product.usageInstructions) {
    faqs.push({
      question: `How to use ${product.name}?`,
      answer: product.usageInstructions,
    });
  }

  if (product.shelfLife) {
    faqs.push({
      question: `What is the shelf life of ${product.name}?`,
      answer: `The shelf life of ${product.name} is ${product.shelfLife}. Store in a cool, dry place away from direct sunlight.`,
    });
  }

  const variants = product.variants;
  if (variants.length > 0) {
    const sizes = variants.map((v) => v.name).join(', ');
    const prices = variants.map((v) => `${v.name}: ₹${v.price}`).join(', ');
    faqs.push({
      question: `What sizes and prices does ${product.name} come in?`,
      answer: `${product.name} is available in ${sizes}. Prices: ${prices}.`,
    });
  }

  faqs.push({
    question: `Is ${product.name} FSSAI certified?`,
    answer: `Yes. All Tangry products are FSSAI licensed (12225026001713) and manufactured in an ISO 22000 certified facility in Jhotwara, Jaipur.`,
  });

  return faqs;
}
