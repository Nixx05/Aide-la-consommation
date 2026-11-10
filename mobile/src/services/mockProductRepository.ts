import { mockProducts } from '../data/mockProducts';
import type { Product } from '../types/product';
import { normalizeText } from '../utils/text';
import type { ProductRepository } from './ProductRepository';

/** Latence simulée pour reproduire le comportement d'une vraie API (chargement). */
const FAKE_LATENCY_MS = 350;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function matches(product: Product, terms: string[]): boolean {
  const haystack = normalizeText(
    [product.name, product.brand, product.category, product.code].join(' '),
  );
  // Tous les mots saisis doivent être présents (recherche "ET").
  return terms.every((term) => haystack.includes(term));
}

export const mockProductRepository: ProductRepository = {
  async search(query) {
    await wait(FAKE_LATENCY_MS);
    const terms = normalizeText(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return mockProducts.filter((p) => matches(p, terms));
  },

  async getByCode(code) {
    await wait(FAKE_LATENCY_MS);
    return mockProducts.find((p) => p.code === code) ?? null;
  },
};
