# Architecture

L'organisation reprend celle du projet web de nos collègues (`ProjetWeb-main`, Spring Boot),
adaptée à une application Expo / React Native.

## Correspondance avec le projet web

| Projet web (Java / Spring Boot) | Notre projet (TypeScript / React Native) | Rôle |
| --- | --- | --- |
| `com/Product.java` | `src/model/Product.ts` | Le modèle : à quoi ressemble un produit |
| `DemoApplication.java` | `src/controller/ProductController.ts` | Appel à l'API Open Food Facts + filtres |
| `templates/homePage.html` | `src/screens/HomeScreen.tsx` | Page d'accueil |
| `templates/search.html` | `src/screens/SearchScreen.tsx` | Page de recherche |
| `static/css/style.css` | `src/style/theme.ts` + les `StyleSheet` de chaque fichier | Couleurs et mise en forme |
| routes `@GetMapping("/")`, `("/recherche")` | `App.tsx` | Choix de la page affichée |
| — | `src/components/` | Morceaux d'interface réutilisés dans les pages |

## Vue d'ensemble

```
App.tsx  (choisit la page : accueil ou recherche)
   │
   ├── screens/HomeScreen.tsx     page d'accueil
   └── screens/SearchScreen.tsx   page de recherche
            │
            ├── components/                    morceaux d'interface
            └── controller/ProductController.ts ── internet ──▶ API Open Food Facts
                        │
                        └── model/Product.ts   (type des produits)
```

Il n'y a pas de back-end ni de base de données à nous : l'application appelle
directement l'API publique Open Food Facts (même API que le projet web).

## Chemin d'une recherche

1. L'utilisateur tape un texte et appuie sur **Rechercher** (`SearchBar`).
2. `SearchScreen` appelle `searchProducts(texte)` du contrôleur.
3. Le contrôleur envoie la requête `cgi/search.pl` à Open Food Facts (même URL que le projet web).
   Si elle échoue (erreur 503 fréquente), il réessaie avec `search.openfoodfacts.org`.
4. Chaque produit reçu est transformé en `Product` par `createProduct`.
5. `SearchScreen` garde la liste, applique les filtres (`isValidNutriScore`, `isAllergenFree`)
   et affiche une `ProductCard` par produit. Un clic ouvre `ProductDetail`.

Le détail de chaque fichier est dans [notes-du-code.md](notes-du-code.md).
