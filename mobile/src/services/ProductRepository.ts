import type { Product } from '../types/product';

/**
 * Interface d'accès aux produits.
 * Implémentations : mockProductRepository (aujourd'hui), apiProductRepository (à venir).
 */
export interface ProductRepository {
  /** Recherche par nom, marque, catégorie ou code-barres. */
  search(query: string): Promise<Product[]>;
  /** Récupère un produit par son code-barres, ou `null` s'il n'existe pas. */
  getByCode(code: string): Promise<Product | null>;
}
