import { mockProductRepository } from './mockProductRepository';
import type { ProductRepository } from './ProductRepository';

/**
 * Point unique de choix de la source de données.
 * Quand l'API sera prête : créer apiProductRepository et le brancher ici.
 */
export const productRepository: ProductRepository = mockProductRepository;

export type { ProductRepository };
