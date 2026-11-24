import type { Additive, NovaGroup, NutriScore, Product } from '../types/product';
import { allergenLabel } from '../utils/filters';
import type { ProductRepository } from './ProductRepository';

// Même API que le projet web : Open Food Facts (gratuite, sans clé).
// On passe par fr.openfoodfacts.org pour avoir les noms en français.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://fr.openfoodfacts.org';

// Nouveau moteur de recherche d'Open Food Facts. On ne s'en sert que si l'ancienne
// recherche (cgi/search.pl) est surchargée : elle renvoie souvent une erreur 503.
const SEARCH_URL = 'https://search.openfoodfacts.org/search';

// On ne demande que les champs qu'on affiche, sinon la réponse est énorme.
const FIELDS = [
  'code',
  'product_name',
  'brands',
  'quantity',
  'categories',
  'image_front_small_url',
  'nutriscore_grade',
  'nova_group',
  'nutriments',
  'additives_tags',
  'allergens_tags',
  'labels',
].join(',');

const PAGE_SIZE = 30;

/** Convertit un produit renvoyé par l'API vers notre modèle Product. */
function toProduct(p: any): Product {
  const n = p.nutriments ?? {};

  // "a" à "e", sinon l'API renvoie "unknown" ou "not-applicable"
  const grade = String(p.nutriscore_grade ?? '').toLowerCase();
  const nutriScore = ['a', 'b', 'c', 'd', 'e'].includes(grade) ? (grade as NutriScore) : null;

  const novaNumber = Number(p.nova_group);
  const nova = novaNumber >= 1 && novaNumber <= 4 ? (novaNumber as NovaGroup) : null;

  // Les additifs arrivent sous la forme "en:e150d"
  const additives: Additive[] = (p.additives_tags ?? []).map((tag: string) => {
    const code = tag.replace(/^\w+:/, '').toUpperCase();
    const num = parseInt(code.slice(1), 10);
    return { code, name: code, isColorant: num >= 100 && num <= 199 };
  });

  // Les catégories vont de la plus générale à la plus précise : on garde la dernière
  const categories = toList(p.categories);

  return {
    code: String(p.code ?? ''),
    name: p.product_name || 'Nom inconnu',
    brand: toList(p.brands)[0] ?? '',
    quantity: p.quantity ?? '',
    category: categories[categories.length - 1] ?? '',
    imageUrl: p.image_front_small_url || null,
    nutriScore,
    nova,
    nutrients: {
      energyKcal: numberOrNull(n['energy-kcal_100g']),
      fat: numberOrNull(n.fat_100g),
      saturatedFat: numberOrNull(n['saturated-fat_100g']),
      sugars: numberOrNull(n.sugars_100g),
      salt: numberOrNull(n.salt_100g),
      fiber: numberOrNull(n.fiber_100g),
      proteins: numberOrNull(n.proteins_100g),
    },
    additives,
    allergens: (p.allergens_tags ?? []).map(allergenLabel),
    labels: toList(p.labels),
  };
}

/**
 * Marques, catégories et labels : l'ancienne API renvoie un texte "a, b, c",
 * le nouveau moteur renvoie un tableau ou un objet par langue ({ fr: [...], en: [...] }).
 */
function toList(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return value.fr ?? toList(value.original);
  return String(value)
    .split(',')
    .map((v) => v.trim().replace(/^[a-z]{2}:/, '')) // enlève le préfixe de langue "fr:"
    .filter(Boolean);
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

async function getJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur lors de l'appel à l'API (${response.status})`);
  }
  return response.json();
}

/** Recherche "classique", la même que dans le projet web. */
async function searchClassic(query: string): Promise<any[]> {
  const url =
    `${API_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}` +
    `&search_simple=1&action=process&json=1&page_size=${PAGE_SIZE}&fields=${FIELDS}`;
  const data = await getJson(url);
  return data.products ?? [];
}

/** Recherche de secours avec le nouveau moteur (mêmes noms de champs, réponse dans "hits"). */
async function searchFallback(query: string): Promise<any[]> {
  const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}&langs=fr&page_size=${PAGE_SIZE}&fields=${FIELDS}`;
  const data = await getJson(url);
  return data.hits ?? [];
}

export const apiProductRepository: ProductRepository = {
  async search(query) {
    let products: any[];
    try {
      products = await searchClassic(query);
    } catch {
      products = await searchFallback(query);
    }

    // On enlève les fiches vides (sans nom ni code), il y en a pas mal sur Open Food Facts
    return products.filter((p) => p.code && p.product_name).map(toProduct);
  },

  async getByCode(code) {
    const data = await getJson(`${API_URL}/api/v2/product/${code}.json?fields=${FIELDS}`);
    return data.status === 1 ? toProduct(data.product) : null;
  },
};
