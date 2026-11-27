// Modèle Product (équivalent de Product.java dans le projet web).
// Un produit = toutes les informations qu'on affiche dans l'application.
// null = information inconnue.

export type Product = {
  code: string; // code-barres
  name: string;
  brand: string;
  quantity: string;
  image: string | null;
  nutriScore: string | null; // "a", "b", "c", "d" ou "e"
  nova: number | null; // 1 (brut) à 4 (ultra-transformé)

  // Valeurs pour 100 g
  energy: number | null; // kcal
  fat: number | null;
  saturatedFat: number | null;
  sugars: number | null;
  salt: number | null;
  fiber: number | null;
  proteins: number | null;

  additives: string[]; // ex : ["E322", "E150D"]
  allergens: string[]; // ex : ["Lait", "Gluten"]
};
