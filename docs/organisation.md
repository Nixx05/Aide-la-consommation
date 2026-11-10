# Organisation de l'équipe (5 membres)

Proposition de répartition — à adapter et à compléter avec vos prénoms.

| Rôle | Membre | Branche(s) | Périmètre |
| --- | --- | --- | --- |
| Lead technique / intégration | _à définir_ | `develop`, `main` | Relecture des PR, releases, CI, architecture |
| Recherche & liste de résultats | _à définir_ | `feature/recherche-produit` ✅, puis `feature/filtres` | Barre de recherche, filtres (Nutri-Score, colorants, sucres…), tri |
| Fiche produit | _à définir_ | `feature/fiche-produit` | Écran détaillé, additifs, allergènes, labels |
| Comparaison | _à définir_ | `feature/comparaison` | Sélection de 2 à 4 produits, tableau comparatif |
| API & données | _à définir_ | `feature/integration-api` | Back-end / Open Food Facts, remplacement du mock |

## Branches déjà créées

| Branche | Statut |
| --- | --- |
| `main` | v0.1.0 — recherche sur données fictives |
| `develop` | Intégration |
| `feature/recherche-produit` | Fusionnée dans `develop` (peut servir de base aux améliorations) |
| `feature/fiche-produit` | À démarrer |
| `feature/filtres` | À démarrer |
| `feature/comparaison` | À démarrer |
| `feature/integration-api` | À démarrer |

## Jalons

| Version | Contenu |
| --- | --- |
| v0.1.0 | Front-end : recherche de produits (données fictives) ✅ |
| v0.2.0 | Filtres + fiche produit complète |
| v0.3.0 | Comparaison de produits |
| v0.4.0 | Branchement à l'API (Open Food Facts / back-end) |
| v1.0.0 | Version finale du projet tutoré |

## Rituels conseillés

- Point d'équipe de 15 min chaque semaine : ce qui est fait, ce qui bloque.
- Relecture des PR sous 48 h.
- Une release (`develop` → `main`) à chaque jalon, avec un tag `vX.Y.Z`.
