# NutriChoix — Aide à la consommation d'aliments sains

Application mobile (projet tutoré) qui permet de **rechercher des produits alimentaires par leur nom** et, à terme, de les **comparer** selon des critères nutritionnels : Nutri-Score, sucres, matières grasses, additifs, colorants…

> **État actuel (v0.2.0)** : page d'accueil, recherche branchée sur l'API **Open Food Facts**, filtres Nutri-Score et allergènes.

## Fonctionnalités

| Fonctionnalité | Statut |
| --- | --- |
| Recherche de produit par nom / marque / code-barres | ✅ v0.1.0 |
| Fiche produit (Nutri-Score, NOVA, valeurs pour 100 g, additifs) | ✅ v0.1.0 |
| Page d'accueil | ✅ v0.2.0 |
| Filtres Nutri-Score minimum et « sans allergène » | ✅ v0.2.0 |
| Comparaison de produits | 🔜 `feature/comparaison` |
| Connexion à l'API Open Food Facts | ✅ v0.2.0 |
| Scan de code-barres | 💡 idée |

## Stack technique

- [Expo](https://expo.dev) + React Native + TypeScript
- react-native-web pour la version navigateur
- Données : API Open Food Facts (pas de back-end à nous)

## Démarrer

Le plus simple sous Windows : double-cliquer sur **`LANCER_WEB.bat`** (navigateur) ou **`LANCER_TELEPHONE.bat`** (QR code pour Expo Go).

À la main :

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
│       ├── model/          # Product.ts : le modèle produit
│       ├── controller/     # ProductController.ts : appel à l'API + filtres
│       ├── screens/        # Les pages (accueil, recherche)
│       ├── components/     # Morceaux d'interface réutilisables
│       └── style/          # Couleurs et formatage
├── docs/                   # Documentation du projet
└── .github/                # CI, modèles d'issues et de pull requests
```

## Travailler en équipe

Voir **[CONTRIBUTING.md](CONTRIBUTING.md)** : branches, conventions de commit, pull requests.
Chaque fichier est expliqué dans **[docs/notes-du-code.md](docs/notes-du-code.md)**, et la répartition des tâches dans **[docs/organisation.md](docs/organisation.md)**.
