export const HERO_PATTERN = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e31e24' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

/**
 * Business details. `legalName` is shown on the public site in the footer only;
 * use `brandName` / “Tangry” everywhere else.
 */
export const COMPANY_INFO = {
  brandName: 'Tangry',
  tagline: 'Taste of Home',
  legalName: 'Maya Enterprises',
  /** Human-readable for UI */
  phone: '+91 77330 09952',
  /** Use in tel: links and structured data */
  phoneTel: '+917733009952',
  email: 'tangryspices@gmail.com',
  wholesaleEmail: 'tangryspices@gmail.com',
  address:
    'A7, Marg No A5, Khatipura Road, Kumawat Colony, Jhotwara, Jaipur 302012, Rajasthan, India',
  certifications: [
    'FSSAI Licensed (12225026001713)',
    'ISO 22000 Certified',
  ],
} as const;

/** @tangryspices — update if handles change */
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/tangryspices',
  instagram: 'https://www.instagram.com/tangryspices',
  youtube: 'https://www.youtube.com/tangryspices',
  twitter: 'https://twitter.com/tangryspices',
} as const;

export const NAVIGATION_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Our Story", href: "/#our-story" },
  { label: "Recipes", href: "#recipes" },
  { label: "Contact", href: "#contact" },
];

