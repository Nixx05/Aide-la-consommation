# Architecture

## Vue d'ensemble

```
┌──────────────────────────── mobile/ (Expo) ────────────────────────────┐
│                                                                         │
│  screens/  ──utilise──▶  hooks/  ──appelle──▶  services/productService  │
│     │                                             │                     │
│     ▼                                             ├─ mockProductRepository  (aujourd'hui)
│  components/                                      └─ apiProductRepository   (à venir)
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

- **Aujourd'hui** : `mockProductRepository` lit `src/data/mockProducts.ts`.
- **Demain** : l'équipe API crée `apiProductRepository` (même interface) et change
  une seule ligne dans `src/services/index.ts`. Aucun écran n'a besoin d'être modifié.

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
