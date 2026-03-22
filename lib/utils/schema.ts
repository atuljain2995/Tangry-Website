// Structured data (JSON-LD) generators for SEO

import { ProductExtended } from '../types/database';
import { COMPANY_INFO } from '../data/constants';

/**
 * Generate Organization schema
 */
const orgPostalAddress = {
  '@type': 'PostalAddress' as const,
  streetAddress:
    'A7, Marg No A5, Khatipura Road, Kumawat Colony, Jhotwara',
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
    alternateName: ['Tangry Spices', COMPANY_INFO.legalName],
    url: 'https://tangryspices.com',
    logo: 'https://tangryspices.com/logo.png',
    description: `${COMPANY_INFO.brandName} — ${COMPANY_INFO.tagline}. Authentic spices and masalas from ${COMPANY_INFO.legalName}, Jaipur.`,
    address: orgPostalAddress,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.phoneTel,
      contactType: 'Customer Service',
      email: COMPANY_INFO.email,
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.facebook.com/tangryspices',
      'https://www.instagram.com/tangryspices',
      'https://www.youtube.com/tangryspices',
      'https://twitter.com/tangryspices',
    ],
  };
}

/**
 * Generate Product schema
 */
export function getProductSchema(product: ProductExtended) {
  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const highestPrice = Math.max(...product.variants.map(v => v.price));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'Tangry',
    },
    sku: product.variants[0]?.sku || product.id,
    category: product.category,
    offers: {
      '@type': 'AggregateOffer',
      url: `https://tangryspices.com/products/${product.slug}`,
      priceCurrency: 'INR',
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      availability: product.variants.some(v => v.isAvailable && v.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Tangry Spices',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
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
 * Generate FAQ schema
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
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
 * Generate LocalBusiness schema
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://tangryspices.com',
    name: 'Tangry',
    image: 'https://tangryspices.com/logo.png',
    telephone: COMPANY_INFO.phoneTel,
    email: COMPANY_INFO.email,
    address: orgPostalAddress,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '26.9124',
      longitude: '75.7873',
    },
    url: 'https://tangryspices.com',
    priceRange: '₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
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
    url: 'https://tangryspices.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tangryspices.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

