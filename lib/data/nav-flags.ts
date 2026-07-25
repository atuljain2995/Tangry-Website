/**
 * Recipes are hidden from nav by default until real Tangry-linked content exists.
 * Set NEXT_PUBLIC_SHOW_RECIPES_NAV=true in .env to show the link.
 */
export function showRecipesInNav(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_RECIPES_NAV === 'true';
}

export function showThemeToggle(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_THEME_TOGGLE === 'true';
}
