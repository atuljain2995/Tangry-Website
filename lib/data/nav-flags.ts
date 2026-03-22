/**
 * Hide Recipes / Blog in header when you have no real content yet.
 * Set NEXT_PUBLIC_SHOW_RECIPES_NAV=false or NEXT_PUBLIC_SHOW_BLOG_NAV=false in .env
 */
export function showRecipesInNav(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_RECIPES_NAV !== 'false';
}

export function showBlogInNav(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_BLOG_NAV !== 'false';
}
