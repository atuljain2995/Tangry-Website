# SEO URL Architecture

## Recommended canonical structure

| Content type         | Canonical URL pattern                                                  | Indexable                       | Notes                                             |
| -------------------- | ---------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------- |
| Homepage             | `/`                                                                    | Yes                             | Primary brand landing page                        |
| Static brand pages   | `/about`, `/contact`, `/wholesale`, `/shipping-policy`, `/track-order` | Yes                             | Keep stable and linked in sitemap                 |
| Product listing hub  | `/products`                                                            | Yes                             | Main commercial hub                               |
| Product categories   | `/categories/[slug]`                                                   | Yes                             | Indexable taxonomy landing pages with unique copy |
| Product detail pages | `/products/[slug]`                                                     | Yes                             | Primary revenue pages                             |
| Search/filter states | `/products?category=...`, `/search?q=...`                              | Usually no as canonical targets | Useful for UX, not primary SEO landing pages      |
| Blog listing         | `/blog`                                                                | Optional                        | Keep `noindex` until article detail pages exist   |
| Blog articles        | `/blog/[slug]`                                                         | Only if implemented             | Do not link to these until they exist             |
| Recipes listing      | `/recipes`                                                             | Optional                        | Keep `noindex` until recipe detail pages exist    |
| Recipe detail pages  | `/recipes/[slug]`                                                      | Only if implemented             | Do not link to these until they exist             |

## Current to target mapping

| Current route/pattern                                 | Current status                 | Target / action                                     |
| ----------------------------------------------------- | ------------------------------ | --------------------------------------------------- |
| `/products/[slug]`                                    | Good                           | Keep as canonical product URL                       |
| `/products?category=pickles`                          | Good for filters, weak for SEO | Keep for filtering UX only                          |
| `/category/pickles`                                   | Broken / did not exist         | Replace with `/categories/pickles`                  |
| Product breadcrumbs pointing to `/category/...`       | Incorrect                      | Point to `/categories/[slug]`                       |
| Homepage category cards linking to filtered products  | Acceptable UX                  | Point to `/categories/[slug]` for SEO landing pages |
| Sitemap without category pages                        | Incomplete                     | Include `/categories/[slug]`                        |
| `/blog` linking to `/blog/[slug]` without route       | Incorrect                      | Remove article links until detail pages exist       |
| `/recipes` linking to `/recipes/[slug]` without route | Incorrect                      | Remove recipe links until detail pages exist        |

## Rules to keep going forward

1. Every indexable URL should have a real route, canonical, metadata, and internal links.
2. Never include non-existent URLs in breadcrumbs, JSON-LD, or sitemap.
3. Use one canonical taxonomy path only: `/categories/[slug]`.
4. Treat query parameters as stateful filters, not primary landing pages.
5. Do not link to article or recipe detail URLs until those pages exist.
