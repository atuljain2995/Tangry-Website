# Component Structure Quick Reference

## 🎯 Next.js App Router Component Architecture

### File Organization

```
📁 everest-clone/
│
├── 📁 app/                      # Next.js App Router (Routes)
│   ├── layout.tsx              # ✅ Root layout (fonts, metadata)
│   ├── page.tsx                # ✅ Home page (section composition)
│   └── globals.css             # ✅ Tailwind v4 + animations
│
├── 📁 components/               # All React Components
│   │
│   ├── 📁 ui/                  # Atomic Reusable Components
│   │   ├── ChiliIcon.tsx       # Custom logo SVG
│   │   ├── NavLink.tsx         # Animated navigation link
│   │   └── index.ts            # Export barrel
│   │
│   ├── 📁 layout/              # Persistent Layout Components
│   │   ├── Header.tsx          # Top bar + navigation
│   │   ├── Footer.tsx          # Footer with links
│   │   ├── MobileMenu.tsx      # Mobile slide menu
│   │   └── index.ts            # Export barrel
│   │
│   └── 📁 sections/            # Page Section Components
│       ├── Hero.tsx            # Auto-rotating carousel
│       ├── Stats.tsx           # Stats cards
│       ├── ProductCategories.tsx # Category showcase
│       ├── FeaturedProducts.tsx  # Filterable products
│       ├── About.tsx           # About/heritage
│       ├── BuyOnline.tsx       # E-commerce links
│       ├── Recipes.tsx         # Recipe cards
│       ├── Newsletter.tsx      # Email subscription
│       └── index.ts            # Export barrel
│
└── 📁 lib/                     # Data & Utilities
    └── 📁 data/
        ├── constants.ts        # App constants
        └── products.ts         # Product data & types
```

## 📦 Component Categories

### 1. **UI Components** (`components/ui/`)

**Purpose**: Small, reusable building blocks

| Component   | Purpose         | Props                                 |
| ----------- | --------------- | ------------------------------------- |
| `ChiliIcon` | Logo SVG        | `className?: string`                  |
| `NavLink`   | Navigation link | `href, children, isMobile?, onClick?` |

**When to add here**: Buttons, inputs, icons, badges

---

### 2. **Layout Components** (`components/layout/`)

**Purpose**: Persistent across all pages

| Component    | Purpose           | State                    |
| ------------ | ----------------- | ------------------------ |
| `Header`     | Top bar + nav     | Prop: `onMenuOpen`       |
| `Footer`     | Site footer       | None                     |
| `MobileMenu` | Mobile navigation | Props: `isOpen, onClose` |

**When to add here**: Navigation, sidebars, headers, footers

---

### 3. **Section Components** (`components/sections/`)

**Purpose**: Feature-complete page sections

| Component           | Purpose          | Client/Server     |
| ------------------- | ---------------- | ----------------- |
| `Hero`              | Carousel hero    | Client (useState) |
| `Stats`             | Statistics       | Server            |
| `ProductCategories` | Category cards   | Server            |
| `FeaturedProducts`  | Product grid     | Client (filters)  |
| `About`             | Company info     | Server            |
| `BuyOnline`         | E-commerce links | Server            |
| `Recipes`           | Recipe cards     | Server            |
| `Newsletter`        | Email form       | Server            |

**When to add here**: New features, landing sections

---

## 🔧 How to Use Components

### Example 1: Import Individual Components

```typescript
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
```

### Example 2: Import from Barrel (Cleaner)

```typescript
import { Header, Footer } from '@/components/layout';
import { Hero, Stats } from '@/components/sections';
```

### Example 3: Compose a Page

```typescript
// app/page.tsx
import { Header, Footer } from '@/components/layout';
import { Hero, Stats, About } from '@/components/sections';

export default function Home() {
  return (
    <main>
      <Header onMenuOpen={handleOpen} />
      <Hero />
      <Stats />
      <About />
      <Footer />
    </main>
  );
}
```

---

## 🎨 Component Patterns

### Pattern 1: Server Component (Default)

```typescript
// components/sections/Stats.tsx
export const Stats = () => {
  return <section>...</section>;
};
```

**Use when**: No interactivity needed

### Pattern 2: Client Component

```typescript
// components/sections/Hero.tsx
'use client';

import { useState } from 'react';

export const Hero = () => {
  const [slide, setSlide] = useState(0);
  return <section>...</section>;
};
```

**Use when**: Need hooks, event handlers, browser APIs

### Pattern 3: Component with Props

```typescript
interface HeaderProps {
  onMenuOpen: () => void;
}

export const Header = ({ onMenuOpen }: HeaderProps) => {
  return <nav>...</nav>;
};
```

---

## 📊 Data Management

### Centralized Data

```typescript
// lib/data/products.ts
export const PRODUCT_CATEGORIES = [
  { id: 'blended', title: 'Blended Spices', ... }
];

// Usage in component
import { PRODUCT_CATEGORIES } from '@/lib/data/products';
```

### Constants

```typescript
// lib/data/constants.ts
export const COMPANY_INFO = {
  phone: '1800-123-4567',
  email: 'consumer@everestspices.com',
};
```

---

## ➕ Adding New Features

### Step 1: Create Component

```typescript
// components/sections/NewFeature.tsx
export const NewFeature = () => {
  return (
    <section className="py-20 bg-white">
      <h2>New Feature</h2>
    </section>
  );
};
```

### Step 2: Export from Barrel

```typescript
// components/sections/index.ts
export { NewFeature } from './NewFeature';
```

### Step 3: Add to Page

```typescript
// app/page.tsx
import { NewFeature } from '@/components/sections';

export default function Home() {
  return (
    <main>
      {/* ... other sections */}
      <NewFeature />
    </main>
  );
}
```

---

## 🚀 Creating New Pages

### Example: About Page

```
1. Create: app/about/page.tsx
2. Reuse components:
```

```typescript
// app/about/page.tsx
import { Header, Footer } from '@/components/layout';
import { About } from '@/components/sections';

export const metadata = {
  title: "About Us - Everest Spices"
};

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

---

## 🎯 Best Practices

### ✅ DO:

- Keep components focused (single responsibility)
- Use TypeScript interfaces for props
- Extract reusable logic into custom hooks
- Use semantic HTML (`<header>`, `<section>`, `<footer>`)
- Keep components under 200 lines

### ❌ DON'T:

- Mix data fetching with presentation
- Create deeply nested components
- Put business logic in UI components
- Duplicate code across components

---

## 🔍 Component Checklist

When creating a new component, ask:

1. **Is it reusable?** → `components/ui/`
2. **Is it layout-related?** → `components/layout/`
3. **Is it a page section?** → `components/sections/`
4. **Does it need state?** → Add `'use client'`
5. **Does it need data?** → Import from `lib/data/`

---

## 📝 Quick Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check linting
npm run lint
```

---

## 🎨 Tailwind Classes Reference

```typescript
// Brand Colors
'bg-[#D32F2F]'; // Primary Red
'bg-[#B71C1C]'; // Dark Red
'bg-[#FFC107]'; // Yellow/Gold
'text-[#D32F2F]'; // Text Red

// Responsive
'md:text-4xl'; // Medium screens+
'lg:grid-cols-3'; // Large screens+

// Common Patterns
'hover:bg-[#D32F2F] transition duration-300';
'transform hover:-translate-y-1';
'shadow-lg hover:shadow-2xl';
```

---

## 📚 Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Full architecture docs
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Patterns](https://www.patterns.dev/react)
