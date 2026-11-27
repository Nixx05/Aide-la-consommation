// Contrôleur des produits (équivalent de DemoApplication.java dans le projet web).
// - appelle l'API Open Food Facts et transforme la réponse en liste de Product
// - contient les fonctions de filtre (Nutri-Score, allergènes)

import { Nova, NutriScore, Product } from '../model/Product';

const API_URL = 'https://fr.openfoodfacts.org';
const BACKUP_URL = 'https://search.openfoodfacts.org/search';

// On demande seulement les champs qu'on affiche
const FIELDS =
  'code,product_name,brands,quantity,categories,image_front_small_url,nutriscore_grade,' +
  'nova_group,nutriments,additives_tags,allergens_tags,labels';

// Les 14 allergènes obligatoires : tag de l'API -> nom affiché (mêmes que dans search.html)
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

// Recherche de produits par nom, marque ou code-barres
export async function searchProducts(query: string): Promise<Product[]> {
  let products;

  try {
    // Construire l'URL de recherche (la même que dans le projet web)
    const url = `${API_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=30&fields=${FIELDS}`;
    const data = await getJson(url);
    products = data.products;
  } catch {
    // Si le serveur est surchargé (erreur 503 fréquente), on passe par le nouveau moteur de recherche
    const url = `${BACKUP_URL}?q=${encodeURIComponent(query)}&langs=fr&page_size=30&fields=${FIELDS}`;
    const data = await getJson(url);
    products = data.hits;
  }

  // On garde les produits qui ont un nom, et on récupère les éléments que l'on souhaite afficher
  const productList: Product[] = [];
  for (const product of products) {
    if (product.code && product.product_name) {
      productList.push(createProduct(product));
    }
  }
  return productList;
}

// Envoie la requête et renvoie la réponse en JSON
async function getJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur lors de l'appel à l'API (${response.status})`);
  }
  return response.json();
}

// Crée un Product à partir d'un produit renvoyé par l'API
function createProduct(product: any): Product {
  const n = product.nutriments || {};

  // Nutri-Score : on garde seulement a, b, c, d ou e (l'API peut renvoyer "unknown")
  let nutriScore: NutriScore | null = null;
  if (['a', 'b', 'c', 'd', 'e'].includes(product.nutriscore_grade)) {
    nutriScore = product.nutriscore_grade;
  }

  // NOVA : on garde seulement 1, 2, 3 ou 4
  let nova: Nova | null = null;
  if ([1, 2, 3, 4].includes(Number(product.nova_group))) {
    nova = Number(product.nova_group) as Nova;
  }

  // Additifs : "en:e150d" devient { code: "E150D", isColorant: true }
  const additives = [];
  for (const tag of product.additives_tags || []) {
    const code = tag.replace('en:', '').toUpperCase();
    const number = parseInt(code.slice(1));
    additives.push({ code: code, isColorant: number >= 100 && number <= 199 });
  }

  // Allergènes : "en:milk" devient "Lait"
  const allergens = [];
  for (const tag of product.allergens_tags || []) {
    allergens.push(ALLERGENS[tag] || tag.replace('en:', ''));
  }

  const categories = toList(product.categories);

  return {
    code: product.code,
    name: product.product_name,
    brand: toList(product.brands)[0] || '',
    quantity: product.quantity || '',
    category: categories[categories.length - 1] || '', // la plus précise est la dernière
    imageUrl: product.image_front_small_url || null,
    nutriScore: nutriScore,
    nova: nova,
    nutrients: {
      energyKcal: numberOrNull(n['energy-kcal_100g']),
      fat: numberOrNull(n.fat_100g),
      saturatedFat: numberOrNull(n['saturated-fat_100g']),
      sugars: numberOrNull(n.sugars_100g),
      salt: numberOrNull(n.salt_100g),
      fiber: numberOrNull(n.fiber_100g),
      proteins: numberOrNull(n.proteins_100g),
    },
    additives: additives,
    allergens: allergens,
    labels: toList(product.labels),
  };
}

// Transforme "a, b, c" en ["a", "b", "c"] et enlève les préfixes "fr:", "en:"
// (le moteur de secours renvoie déjà un tableau, ou un objet { fr: [...] })
function toList(value: any): string[] {
  let list: string[] = [];
  if (typeof value === 'string') list = value.split(',');
  else if (Array.isArray(value)) list = value;
  else if (value && value.fr) list = value.fr;

  return list.map((item) => item.trim().replace(/^[a-z]{2}:/, '')).filter((item) => item !== '');
}

function numberOrNull(value: any): number | null {
  return typeof value === 'number' ? value : null;
}

/// Ensemble de fonctions de filtre (mêmes noms que dans le projet web)

// Retourne true si le Nutri-Score du produit est au moins aussi bon que celui sélectionné
export function isValidNutriScore(product: Product, filterScore: NutriScore | null): boolean {
  if (filterScore === null) {
    return true; // Pas de filtre, tous les produits sont valides
  }

  // Traduire les Nutri-Scores en valeurs numériques
  const nutriScoreMap = { a: 1, b: 2, c: 3, d: 4, e: 5 };

  // Si le Nutri-Score du produit est inconnu, il n'est pas valide
  if (product.nutriScore === null) {
    return false;
  }

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
