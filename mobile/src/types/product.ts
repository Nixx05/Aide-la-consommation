/**
 * Modèle Produit partagé par toute l'application.
 * C'est le "contrat" entre le front-end et la future API :
 * toute modification doit être discutée en équipe.
 */

export type NutriScore = 'a' | 'b' | 'c' | 'd' | 'e';
export type NovaGroup = 1 | 2 | 3 | 4;

/** Valeurs nutritionnelles pour 100 g (ou 100 ml). `null` = valeur inconnue. */
export interface Nutrients {
  energyKcal: number | null;
  fat: number | null;
  saturatedFat: number | null;
  sugars: number | null;
  salt: number | null;
  fiber: number | null;
  proteins: number | null;
}

export interface Additive {
  /** Code européen, ex. "E150d" */
  code: string;
  name: string;
  /** Colorant = additif de la plage E100 à E199 */
  isColorant: boolean;
}

export interface Product {
  /** Code-barres (EAN) */
  code: string;
  name: string;
  brand: string;
  quantity: string;
  category: string;
  imageUrl: string | null;
  nutriScore: NutriScore | null;
  nova: NovaGroup | null;
  nutrients: Nutrients;
  additives: Additive[];
  allergens: string[];
  labels: string[];
}
