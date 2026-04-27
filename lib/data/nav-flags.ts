/**
 * Hide Recipes in header when you have no real content yet.
 * Blog stays visible because the site now has crawlable article pages.
 * Set NEXT_PUBLIC_SHOW_RECIPES_NAV=false in .env to hide recipes.
 */
export function showRecipesInNav(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_RECIPES_NAV !== 'false';
}

export function showThemeToggle(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_THEME_TOGGLE === 'true';
}
