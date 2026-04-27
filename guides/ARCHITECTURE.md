# Everest Spices Clone - Architecture Documentation

## 📁 Project Structure

```
everest-clone/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Home page (composition of sections)
│   └── globals.css              # Global styles & Tailwind imports
│
├── components/                   # All React components
│   ├── ui/                      # Reusable UI components
│   │   ├── ChiliIcon.tsx       # Custom chili logo icon
│   │   ├── NavLink.tsx         # Navigation link with hover effect
│   │   └── index.ts            # Barrel export
│   │
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx          # Top bar + main navigation
│   │   ├── Footer.tsx          # Footer with links and contact
│   │   ├── MobileMenu.tsx      # Slide-in mobile menu
│   │   └── index.ts            # Barrel export
│   │
│   └── sections/                # Page sections (feature-based)
│       ├── Hero.tsx            # Hero carousel with 2 slides
│       ├── Stats.tsx           # Statistics cards
│       ├── ProductCategories.tsx # Product category showcase
│       ├── FeaturedProducts.tsx  # Filterable product grid
│       ├── About.tsx           # About/heritage section
│       ├── BuyOnline.tsx       # E-commerce platform links
│       ├── Recipes.tsx         # Recipe cards
│       ├── Newsletter.tsx      # Email subscription form
│       └── index.ts            # Barrel export
│
├── lib/                         # Utilities & data
│   └── data/
│       ├── constants.ts        # App constants (company info, URLs)
│       └── products.ts         # Product data & types
│
└── public/                      # Static assets
```

## 🏗️ Architecture Principles

### 1. **Component-Based Architecture**

- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: UI components can be used across multiple sections
- **Maintainability**: Easy to locate and update specific features

### 2. **Feature-Based Organization**

```
Layout Components  → Shared across pages (Header, Footer)
Section Components → Page-specific features (Hero, Stats, etc.)
UI Components      → Atomic reusable elements (NavLink, Icons)
```

### 3. **Data Layer**

- All data is centralized in `lib/data/`
- Type-safe with TypeScript interfaces
- Easy to migrate to API calls later

### 4. **Next.js App Router Best Practices**

- Server Components by default
- Client Components marked with `'use client'` (for interactivity)
- Path aliases (`@/components`, `@/lib`) for clean imports

## 📦 Component Categories

### UI Components (`components/ui/`)

**Purpose**: Reusable, atomic UI elements

- `ChiliIcon.tsx` - Custom SVG logo icon
- `NavLink.tsx` - Styled navigation link with underline animation

**When to add**: Small, reusable elements used across multiple sections

### Layout Components (`components/layout/`)

**Purpose**: Persistent layout elements

- `Header.tsx` - Top bar + navigation (sticky)
- `Footer.tsx` - Site footer with links
- `MobileMenu.tsx` - Responsive mobile navigation

**When to add**: Components that appear on all/most pages

### Section Components (`components/sections/`)

**Purpose**: Self-contained page sections

- `Hero.tsx` - Hero carousel with auto-slide
- `Stats.tsx` - Company statistics
- `ProductCategories.tsx` - Product category cards
- `FeaturedProducts.tsx` - Filterable product grid
- `About.tsx` - Company about section
- `BuyOnline.tsx` - E-commerce platform links + hashtag banner
- `Recipes.tsx` - Recipe cards
- `Newsletter.tsx` - Email subscription

**When to add**: New page sections or features

## 🎯 Component Patterns

### 1. **Client vs Server Components**

```typescript
// Server Component (default)
export const Stats = () => {
  return <section>...</section>;
};

// Client Component (needs interactivity)
'use client';
export const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  // ...
};
```

**Use Client Components when you need:**

- `useState`, `useEffect`, or other React hooks
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `document`)

### 2. **Props Pattern**

```typescript
interface ComponentProps {
  title: string;
  isActive?: boolean; // Optional
  onClose: () => void; // Callback
}

export const Component = ({ title, isActive = false, onClose }: ComponentProps) => {
  // ...
};
```

### 3. **Composition Pattern**

```typescript
// page.tsx - Compose sections
export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <Footer />
    </main>
  );
}
```

## 📋 Data Management

### Current Approach: Static Data

```typescript
// lib/data/products.ts
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'blended', title: 'Blended Spices', ... },
  // ...
];
```

### Future: API Integration

```typescript
// lib/api/products.ts
export async function getProducts() {
  const res = await fetch('/api/products');
  return res.json();
}

// In component
const products = await getProducts(); // Server Component
```

## 🔄 Adding New Features

### Adding a New Section

1. **Create section component**:

   ```typescript
   // components/sections/NewSection.tsx
   export const NewSection = () => {
     return (
       <section className="py-20">
         {/* Content */}
       </section>
     );
   };
   ```

2. **Export from index**:

   ```typescript
   // components/sections/index.ts
   export { NewSection } from './NewSection';
   ```

3. **Add to page**:

   ```typescript
   // app/page.tsx
   import { NewSection } from '@/components/sections';

   export default function Home() {
     return (
       <main>
         {/* ... */}
         <NewSection />
       </main>
     );
   }
   ```

### Adding a New Page

1. **Create new route folder**:

   ```
   app/about/page.tsx
   ```

2. **Reuse existing components**:

   ```typescript
   // app/about/page.tsx
   import { Header, Footer } from '@/components/layout';
   import { About } from '@/components/sections';

   export default function AboutPage() {
     return (
       <main>
         <Header />
         <About />
         <Footer />
       </main>
     );
   }
   ```

## 🎨 Styling Approach

### Tailwind CSS v4

```css
/* globals.css */
@import 'tailwindcss';

/* Custom animations */
@keyframes scroll {
  /* ... */
}
```

### Component Styling

- **Utility-first**: Use Tailwind classes directly
- **Responsive**: Use `md:`, `lg:` prefixes
- **Custom colors**: Use brand colors consistently
  - Primary: `[#D32F2F]` (Red)
  - Secondary: `[#FFC107]` (Yellow)
  - Dark: `[#B71C1C]`

## 🔍 State Management

### Local State (Current)

```typescript
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

### Future: Context API (if needed)

```typescript
// contexts/AppContext.tsx
export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  // ...
};
```

## 🚀 Performance Considerations

1. **Code Splitting**: Each section is lazy-loaded automatically
2. **Image Optimization**: Use Next.js `<Image>` component
3. **Font Loading**: Preloaded in `layout.tsx`
4. **Server Components**: Default to server rendering

## 📝 Naming Conventions

- **Components**: PascalCase (`Hero.tsx`, `NavLink.tsx`)
- **Files**: PascalCase for components, camelCase for utilities
- **Props**: camelCase (`onClose`, `isActive`)
- **CSS Classes**: Tailwind utilities (kebab-case)
- **Constants**: UPPER_SNAKE_CASE (`PRODUCT_CATEGORIES`)

## 🧪 Testing Structure (Future)

```
__tests__/
├── components/
│   ├── ui/
│   ├── layout/
│   └── sections/
└── e2e/
    └── homepage.spec.ts
```

## 📚 Further Reading

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Component Patterns](https://www.patterns.dev/react)
