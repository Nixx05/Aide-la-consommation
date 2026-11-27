// Contrôleur des produits (équivalent de DemoApplication.java dans le projet web).
// - searchProducts : appelle l'API Open Food Facts et renvoie une liste de Product
// - isValidNutriScore / isAllergenFree : les filtres

import { Product } from '../model/Product';

// Les 14 allergènes (mêmes que les filtres du projet web)
// À gauche le nom donné par l'API, à droite le nom affiché
export const ALLERGENS: { [tag: string]: string } = {
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

export async function searchProducts(query: string): Promise<Product[]> {
  let products;

  try {
    // Construire l'URL de recherche (la même que dans le projet web)
    const url =
      'https://fr.openfoodfacts.org/cgi/search.pl?search_terms=' + encodeURIComponent(query) +
      '&search_simple=1&action=process&json=1&page_size=30';
    const response = await fetch(url);
    const data = await response.json();
    products = data.products;
  } catch {
    // Le serveur est souvent surchargé : dans ce cas on utilise leur autre moteur de recherche
    const url = 'https://search.openfoodfacts.org/search?langs=fr&page_size=30&q=' + encodeURIComponent(query);
    const response = await fetch(url);
    const data = await response.json();
    products = data.hits;
  }

  // On récupère tous les éléments que l'on souhaite afficher
  const productList: Product[] = [];

  for (const product of products) {
    if (!product.product_name) continue; // on ignore les produits sans nom

    const n = product.nutriments || {};

    productList.push({
      code: product.code,
      name: product.product_name,
      brand: firstBrand(product.brands),
      quantity: product.quantity || '',
      image: product.image_front_small_url || null,
      nutriScore: ['a', 'b', 'c', 'd', 'e'].includes(product.nutriscore_grade) ? product.nutriscore_grade : null,
      nova: product.nova_group || null,
      energy: n['energy-kcal_100g'] ?? null,
      fat: n.fat_100g ?? null,
      saturatedFat: n['saturated-fat_100g'] ?? null,
      sugars: n.sugars_100g ?? null,
      salt: n.salt_100g ?? null,
      fiber: n.fiber_100g ?? null,
      proteins: n.proteins_100g ?? null,
      // "en:e322" -> "E322"
      additives: (product.additives_tags || []).map((tag: string) => tag.replace('en:', '').toUpperCase()),
      // "en:milk" -> "Lait"
      allergens: (product.allergens_tags || []).map((tag: string) => ALLERGENS[tag] || tag.replace('en:', '')),
    });
  }

  return productList;
}

// La marque arrive sous la forme "Danone, Activia" (ou ["Danone", "Activia"]) : on garde la première
function firstBrand(brands: any): string {
  if (!brands) return '';
  if (Array.isArray(brands)) return brands[0].replace('xx:', '');
  return brands.split(',')[0].trim();
}

/// Ensemble de fonctions de filtre (mêmes noms que dans le projet web)

// Retourne true si le Nutri-Score du produit est au moins aussi bon que celui sélectionné
export function isValidNutriScore(product: Product, filterScore: string | null): boolean {
  if (filterScore === null) {
    return true; // Pas de filtre, tous les produits sont valides
  }
  if (product.nutriScore === null) {
    return false; // Nutri-Score inconnu
  }

  // Traduire les Nutri-Scores en valeurs numériques
  const nutriScoreMap: { [score: string]: number } = { a: 1, b: 2, c: 3, d: 4, e: 5 };

  return nutriScoreMap[product.nutriScore] <= nutriScoreMap[filterScore];
}

// Retourne false si le produit contient un des allergènes cochés
export function isAllergenFree(product: Product, filterAllergens: string[]): boolean {
  for (const allergen of filterAllergens) {
    if (product.allergens.includes(allergen)) {
      return false;
    }
  }
  return true;
}

// Un additif est un colorant s'il va de E100 à E199
export function isColorant(additive: string): boolean {
  const number = parseInt(additive.slice(1));
  return number >= 100 && number <= 199;
}
