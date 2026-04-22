// Structured data (JSON-LD) generators for SEO

import { ProductExtended } from "../types/database";
import { COMPANY_INFO, SOCIAL_LINKS } from "../data/constants";

const SITE_URL = "https://www.tangryspices.com";

function toAbsoluteUrl(url: string): string {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

/**
 * Generate Organization schema
 */
const orgPostalAddress = {
  "@type": "PostalAddress" as const,
  streetAddress: "A7, Marg No A5, Khatipura Road, Kumawat Colony, Jhotwara",
  addressLocality: "Jaipur",
  postalCode: "302012",
  addressRegion: "Rajasthan",
  addressCountry: "IN",
};

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tangry",
    alternateName: ["Tangry Spices"],
    url: "https://www.tangryspices.com",
    logo: "https://www.tangryspices.com/images/logo-512.png",
    description: `${COMPANY_INFO.brandName} — ${COMPANY_INFO.tagline}. Authentic spices and masalas from Jaipur, Rajasthan.`,
    address: orgPostalAddress,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY_INFO.phoneTel,
      contactType: "Customer Service",
      email: COMPANY_INFO.email,
      availableLanguage: ["English", "Hindi"],
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
 * Generate Product schema with AggregateRating
 */
export function getProductSchema(product: ProductExtended) {
  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const prices = product.variants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price >= 0);

  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const absoluteImages = product.images.length
    ? product.images.map(toAbsoluteUrl)
    : [`${SITE_URL}/products/placeholder.png`];

  const aggregateRating =
    product.rating && product.reviewCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
          bestRating: "5",
          worstRating: "1",
        }
      : undefined;

  const availability = product.variants.some(
    (v) => v.isAvailable && v.stock > 0,
  )
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    url: productUrl,
    description: product.description,
    image: absoluteImages,
    brand: {
      "@type": "Brand",
      name: "Tangry",
    },
    sku: product.variants[0]?.sku || product.id,
    category: product.category,
    aggregateRating,
    offers: {
      "@type": "AggregateOffer",
      url: productUrl,
      priceCurrency: "INR",
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      offerCount: product.variants.length || 1,
      availability,
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
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
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    description: recipe.description,
    image: recipe.image,
    author: {
      "@type": "Organization",
      name: "Tangry Spices",
    },
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    recipeYield: recipe.servings,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((instruction, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: instruction,
    })),
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine,
    keywords: [recipe.category, recipe.cuisine, "Indian cooking", "spices"],
  };
}

/**
 * Generate FAQ schema
 */
export function getFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate LocalBusiness schema — enriched for local SEO
 */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FoodEstablishment"],
    "@id": "https://www.tangryspices.com/#local-business",
    name: "Tangry",
    alternateName: "Tangry Spices",
    description:
      "Authentic spices, masalas, pickles, and condiments handcrafted in Jaipur, Rajasthan. FSSAI licensed and ISO 22000 certified.",
    image: [
      "https://www.tangryspices.com/images/logo-512.png",
      "https://www.tangryspices.com/images/logo-full.png",
    ],
    telephone: COMPANY_INFO.phoneTel,
    email: COMPANY_INFO.email,
    url: "https://www.tangryspices.com",
    address: orgPostalAddress,
    geo: {
      "@type": "GeoCoordinates",
      latitude: "26.935058",
      longitude: "75.757109",
    },
    hasMap:
      "https://www.google.com/maps?q=26.935058,75.757109",
    priceRange: "₹₹",
    servesCuisine: ["Indian", "Rajasthani"],
    paymentAccepted: [
      "Cash",
      "UPI",
      "Credit Card",
      "Debit Card",
      "Net Banking",
    ],
    currenciesAccepted: "INR",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "00:00",
        closes: "00:00",
        description: "Closed",
      },
    ],
    sameAs: [
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.twitter,
    ],
    founder: {
      "@type": "Person",
      name: "Atul Jain",
    },
    legalName: COMPANY_INFO.legalName,
    taxID: "FSSAI 12225026001713",
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Food Safety License",
        name: "FSSAI License",
        recognizedBy: {
          "@type": "Organization",
          name: "Food Safety and Standards Authority of India",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Quality Certification",
        name: "ISO 22000",
      },
    ],
  };
}

/**
 * Generate WebSite schema with SearchAction
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tangry Spices",
    url: "https://www.tangryspices.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://www.tangryspices.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}
