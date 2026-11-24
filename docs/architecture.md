# Architecture

## Vue d'ensemble

```
┌──────────────────────────── mobile/ (Expo) ────────────────────────────┐
│                                                                         │
│  screens/  ──utilise──▶  hooks/  ──appelle──▶  services/productService  │
│     │                                             │                     │
│     ▼                                             ├─ apiProductRepository   (par défaut)
│  components/                                      └─ mockProductRepository  (hors ligne)
│                                                         │
└─────────────────────────────────────────────────────────┼───────────────┘
                                                          ▼
                                            API Open Food Facts / back-end
```

## Principe clé : la couche `services`

Les écrans ne savent pas d'où viennent les données. Ils utilisent l'interface
`ProductRepository` définie dans `src/services/ProductRepository.ts` :

```ts
interface ProductRepository {
  search(query: string): Promise<Product[]>;
  getByCode(code: string): Promise<Product | null>;
}
```

- `apiProductRepository` (par défaut) appelle l'API Open Food Facts, comme le projet web
  de référence : `cgi/search.pl` pour la recherche, puis conversion de chaque produit
  vers notre type `Product` (fonction `toProduct`). Si cette recherche renvoie une erreur
  (souvent 503 quand le serveur est chargé), on passe par `search.openfoodfacts.org`.
- `mockProductRepository` lit `src/data/mockProducts.ts` ; il s'active avec
  `EXPO_PUBLIC_USE_MOCK=true` dans `mobile/.env.local`, pour travailler sans internet.

Les filtres (Nutri-Score minimum, sans allergène) sont dans `src/utils/filters.ts`
(`isValidNutriScore`, `isAllergenFree`) et s'appliquent sur les résultats déjà reçus.

Navigation : `App.tsx` garde l'écran affiché dans un état (`home` ou `search`).

## Modèle de données

Le type `Product` (`src/types/product.ts`) est le contrat entre le front-end et l'API.
Il reprend les champs utiles d'Open Food Facts : Nutri-Score, groupe NOVA, valeurs
nutritionnelles pour 100 g, additifs (dont colorants E100–E199), allergènes, labels.

Toute modification de ce type doit être discutée en équipe (elle impacte tout le monde).

## Brancher l'API (pour l'équipe `feature/integration-api`)

1. Créer `src/services/apiProductRepository.ts` qui implémente `ProductRepository`.
2. Convertir la réponse de l'API vers le type `Product`.
3. Dans `src/services/index.ts`, remplacer `mockProductRepository` par `apiProductRepository`
   (ou lire `EXPO_PUBLIC_USE_MOCK` pour basculer).
4. Mettre l'URL de l'API dans `EXPO_PUBLIC_API_URL` (fichier `.env.local`, non versionné).
