import { apiProductRepository } from './apiProductRepository';
import { mockProductRepository } from './mockProductRepository';
import type { ProductRepository } from './ProductRepository';

/**
 * Point unique de choix de la source de données.
 * Par défaut on utilise l'API Open Food Facts.
 * Pour travailler hors ligne : mettre EXPO_PUBLIC_USE_MOCK=true dans mobile/.env.local
 */
const useMock = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export const productRepository: ProductRepository = useMock ? mockProductRepository : apiProductRepository;

export type { ProductRepository };
