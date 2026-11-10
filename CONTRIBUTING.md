# Guide de contribution

Ce guide s'applique aux 5 membres de l'équipe. Merci de le lire avant votre premier commit.

## 1. Branches

On suit un **Git Flow simplifié** :

| Branche | Rôle | Qui y pousse ? |
| --- | --- | --- |
| `main` | Version stable, livrable (démos, rendus). | Personne en direct : uniquement par PR depuis `develop`. |
| `develop` | Branche d'intégration : tout le travail terminé arrive ici. | Personne en direct : uniquement par PR. |
| `feature/<nom>` | Une fonctionnalité (ex. `feature/filtres`). | Le(s) responsable(s) de la fonctionnalité. |
| `fix/<nom>` | Correction de bug. | N'importe qui. |
| `chore/<nom>` / `docs/<nom>` | Configuration, outillage, documentation. | N'importe qui. |

```
main      ●───────────────────────●  (v0.1.0)          ●  (v0.2.0)
           \                     /                    /
develop     ●───●───────●───────●──────●──────●──────●
                 \     /         \           /
feature/...       ●───●           ●───●───●─
```

### Cycle de travail

```bash
# 1. Partir d'un develop à jour
git switch develop
git pull

# 2. Créer sa branche
git switch -c feature/ma-fonctionnalite

# 3. Travailler, committer souvent
git add .
git commit -m "feat(recherche): ajoute le tri par Nutri-Score"

# 4. Se remettre à jour avec develop avant d'ouvrir la PR
git fetch origin
git merge origin/develop

# 5. Pousser et ouvrir une Pull Request vers develop
git push -u origin feature/ma-fonctionnalite
```

## 2. Conventions de commit

Format [Conventional Commits](https://www.conventionalcommits.org/fr/) :

```
<type>(<portée>): <description courte au présent>
```

| Type | Usage |
| --- | --- |
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Mise en forme, sans changement de logique |
| `refactor` | Réécriture sans changement de comportement |
| `test` | Ajout / modification de tests |
| `chore` | Configuration, dépendances, CI |

Exemples : `feat(fiche): affiche la liste des allergènes`, `fix(recherche): ignore les accents`.

## 3. Pull Requests

- Une PR = un sujet. Gardez-les petites (idéalement < 400 lignes).
- Cible : `develop` (jamais `main`, sauf PR de release).
- Remplir le modèle de PR (description, captures d'écran pour l'UI).
- **Au moins 1 relecture** d'un autre membre avant de fusionner.
- La CI (vérification TypeScript) doit être verte.
- Fusion en **Squash and merge** pour garder un historique lisible.
- Supprimer la branche après fusion.

## 4. Issues et suivi

- Chaque tâche = une issue GitHub, assignée à une personne.
- Le tableau **GitHub Projects** (colonnes *À faire / En cours / En revue / Terminé*) sert au suivi.
- Référencer l'issue dans la PR : `Closes #12`.

## 5. Code

- TypeScript strict : pas de `any` sans justification.
- Composants dans `src/components`, écrans dans `src/screens`.
- **Ne jamais appeler une API directement depuis un composant** : passer par `src/services`.
- Lancer `npm run typecheck` avant de pousser.

## 6. Réglages GitHub à activer (par le propriétaire du dépôt)

Dans *Settings → Branches → Add branch ruleset* pour `main` et `develop` :

- Require a pull request before merging (1 approbation)
- Require status checks to pass (job `typecheck`)
- Block force pushes

Dans *Settings → General* : définir `develop` comme branche par défaut pour que les PR la ciblent automatiquement.
