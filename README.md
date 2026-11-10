# NutriChoix — Aide à la consommation d'aliments sains

Application mobile (projet tutoré) qui permet de **rechercher des produits alimentaires par leur nom** et, à terme, de les **comparer** selon des critères nutritionnels : Nutri-Score, sucres, matières grasses, additifs, colorants…

> **État actuel (v0.1.0)** : front-end mobile avec recherche de produits sur des **données fictives**.
> Le branchement à une API (Open Food Facts ou back-end maison) est prévu dans une étape suivante.

## Fonctionnalités

| Fonctionnalité | Statut |
| --- | --- |
| Recherche de produit par nom / marque / code-barres | ✅ v0.1.0 |
| Fiche produit (Nutri-Score, NOVA, valeurs pour 100 g, additifs) | ✅ v0.1.0 |
| Filtres (Nutri-Score, sans colorants, sucres max…) | 🔜 `feature/filtres` |
| Comparaison de produits | 🔜 `feature/comparaison` |
| Connexion à l'API Open Food Facts / back-end | 🔜 `feature/integration-api` |
| Scan de code-barres | 💡 idée |

## Stack technique

- [Expo](https://expo.dev) + React Native + TypeScript
- Données : couche `services/` interchangeable (mock aujourd'hui, API demain)

## Démarrer

Prérequis : Node.js ≥ 20 et l'application **Expo Go** sur votre téléphone.

```bash
cd mobile
npm install
npm start          # puis scanner le QR code avec Expo Go
npm run web        # ou tester dans le navigateur
npm run typecheck  # vérification TypeScript
```

## Structure du dépôt

```
.
├── mobile/                 # Application mobile Expo
│   ├── App.tsx             # Point d'entrée
│   └── src/
│       ├── components/     # Composants UI réutilisables
│       ├── screens/        # Écrans
│       ├── hooks/          # Logique réutilisable (recherche, debounce…)
│       ├── services/       # Accès aux données (mock ↔ API)
│       ├── data/           # Données fictives
│       ├── types/          # Types TypeScript (modèle Produit)
│       ├── theme/          # Couleurs, espacements
│       └── utils/          # Fonctions utilitaires
├── docs/                   # Documentation du projet
└── .github/                # CI, modèles d'issues et de pull requests
```

## Travailler en équipe

Voir **[CONTRIBUTING.md](CONTRIBUTING.md)** : branches, conventions de commit, pull requests.
L'architecture est décrite dans **[docs/architecture.md](docs/architecture.md)** et la répartition des tâches dans **[docs/organisation.md](docs/organisation.md)**.
