import type { NutriScore, Product } from '../types/product';

// Les 14 allergènes à déclaration obligatoire (même liste que les filtres du projet web).
// Clé = tag Open Food Facts, valeur = nom affiché.
export const ALLERGENS: Record<string, string> = {
  'en:peanuts': 'Arachide',
  'en:celery': 'Céleri',
  'en:crustaceans': 'Crustacés',
  'en:gluten': 'Gluten',
  'en:nuts': 'Fruits à coque',
  'en:milk': 'Lait',
  'en:lupin': 'Lupin',
  'en:eggs': 'Œuf',
  'en:fish': 'Poisson',
  'en:molluscs': 'Mollusques',
  'en:mustard': 'Moutarde',
  'en:sesame-seeds': 'Sésame',
  'en:soybeans': 'Soja',
  'en:sulphur-dioxide-and-sulphites': 'Sulfites',
};

/** "en:milk" -> "Lait". Si on ne connaît pas le tag, on l'affiche sans le préfixe. */
export function allergenLabel(tag: string): string {
  return ALLERGENS[tag] ?? tag.replace(/^\w+:/, '').replace(/-/g, ' ');
}

const NUTRISCORE_ORDER: Record<NutriScore, number> = { a: 1, b: 2, c: 3, d: 4, e: 5 };

/** true si le Nutri-Score du produit est au moins aussi bon que celui choisi. */
export function isValidNutriScore(product: Product, maxScore: NutriScore | null): boolean {
  if (!maxScore) return true; // pas de filtre
  if (!product.nutriScore) return false; // score inconnu : on l'écarte
  return NUTRISCORE_ORDER[product.nutriScore] <= NUTRISCORE_ORDER[maxScore];
}

/** true si le produit ne contient aucun des allergènes cochés. */
export function isAllergenFree(product: Product, excluded: string[]): boolean {
  return excluded.every((allergen) => !product.allergens.includes(allergen));
}

export type Filters = {
  maxNutriScore: NutriScore | null;
  excludedAllergens: string[];
};

export const NO_FILTERS: Filters = { maxNutriScore: null, excludedAllergens: [] };

export function applyFilters(products: Product[], filters: Filters): Product[] {
  return products.filter(
    (p) => isValidNutriScore(p, filters.maxNutriScore) && isAllergenFree(p, filters.excludedAllergens),
  );
}
