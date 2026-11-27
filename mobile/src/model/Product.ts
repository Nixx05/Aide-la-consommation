// Modèle Product (équivalent de Product.java dans le projet web).

export type NutriScore = 'a' | 'b' | 'c' | 'd' | 'e';
export type Nova = 1 | 2 | 3 | 4;

export type Additive = {
  code: string; // ex : "E150D"
  isColorant: boolean; // les colorants vont de E100 à E199
};

// Valeurs pour 100 g. null = valeur inconnue.
export type Nutrients = {
  energyKcal: number | null;
  fat: number | null;
  saturatedFat: number | null;
  sugars: number | null;
  salt: number | null;
  fiber: number | null;
  proteins: number | null;
};

export type Product = {
  code: string; // code-barres
  name: string;
  brand: string;
  quantity: string;
  category: string;
  imageUrl: string | null;
  nutriScore: NutriScore | null;
  nova: Nova | null;
  nutrients: Nutrients;
  additives: Additive[];
  allergens: string[];
  labels: string[];
};
