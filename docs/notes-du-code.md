# Notes du code — NutriChoix

L'organisation reprend celle du projet web de nos collègues (voir le tableau de
correspondance dans [architecture.md](architecture.md)).

Ce document explique chaque partie du code, dans l'ordre où il est conseillé de les lire.
Tout le code de l'application est dans le dossier `mobile/`.

---

## 0. Lancer le projet

| Fichier | Ce qu'il fait |
| --- | --- |
| `LANCER_WEB.bat` | Double-clic → installe les dépendances la 1re fois (`npm install`), puis lance `npm run web` : l'appli s'ouvre dans le navigateur sur http://localhost:8081. |
| `LANCER_TELEPHONE.bat` | Pareil, mais lance `npm start` : un QR code s'affiche, on le scanne avec **Expo Go** sur le téléphone (même Wi-Fi que le PC). |
| `mobile/package.json` | Liste des librairies (expo, react, react-native, react-native-web…) et des commandes (`start`, `web`, `typecheck`). |

Quand on lance, Expo démarre **Metro**, qui assemble tous les fichiers TypeScript en un seul
fichier JavaScript lu par le navigateur ou par Expo Go. Quand on modifie un fichier,
l'appli se met à jour toute seule.

---

## 1. `App.tsx` — le point d'entrée

C'est le premier composant affiché. Il garde en mémoire **la page affichée** dans un état :

```ts
const [page, setPage] = useState<'home' | 'search'>('home');
```

- `page === 'home'` → on affiche `HomeScreen`
- `page === 'search'` → on affiche `SearchScreen`

Quand on fait une recherche sur l'accueil, `goToSearch(texte)` garde le texte dans
`firstSearch` et passe à la page de recherche, qui lancera cette recherche.

On n'utilise pas de librairie de navigation : pour deux pages, un simple état suffit.

---

## 2. `src/model/Product.ts` — le modèle (comme `Product.java`)

Décrit à quoi ressemble un produit dans **notre** application (type `Product`) :
nom, marque, image, Nutri-Score, NOVA, valeurs pour 100 g, additifs, allergènes, labels.

- `NutriScore` = `'a' | 'b' | 'c' | 'd' | 'e'`
- `Nova` = `1 | 2 | 3 | 4`
- `null` veut dire « valeur inconnue »

Différence avec `Product.java` : en TypeScript on n'a pas besoin de classe avec getters/setters,
un simple `type` suffit pour décrire les champs.

Grâce à TypeScript, si on se trompe de nom de champ (ex : `product.nom` au lieu de
`product.name`), l'erreur est signalée avant même de lancer l'appli (`npm run typecheck`).

---

## 3. `src/controller/ProductController.ts` — le contrôleur (comme `DemoApplication.java`)

**Le seul fichier qui communique avec internet.** Il est organisé comme le contrôleur
du projet web : d'abord la recherche, puis l'« ensemble de fonctions de filtre ».

### `searchProducts(query)` (équivalent de `searchPage` dans le projet web)
1. Construit l'URL de recherche Open Food Facts (la même que le projet web) :
   `https://fr.openfoodfacts.org/cgi/search.pl?search_terms=...&json=1...`
2. Envoie la requête avec `fetch` (fonction intégrée à JavaScript, l'équivalent de `RestTemplate`).
3. **Si ça échoue** (le serveur renvoie souvent une erreur 503 quand il est surchargé),
   on réessaie avec le nouveau moteur de recherche `search.openfoodfacts.org`.
4. Parcourt les produits avec une boucle `for` (comme le `for (JsonNode product : products)`
   du projet web) et crée un `Product` pour chacun avec `createProduct`.

`async` / `await` : la requête prend du temps, `await` attend la réponse sans bloquer l'appli.

`try { ... } catch { ... }` : si une erreur arrive dans le `try`, on passe dans le `catch`
(comme en Java).

### `FIELDS`
La liste des champs qu'on demande à l'API. Sans ça, chaque produit contient des centaines
d'informations inutiles et la réponse est beaucoup plus lourde.

### `createProduct(product)`
Transforme un produit **au format de l'API** en `Product` (comme le `new Product(...)` du projet web) :
- garde le Nutri-Score seulement s'il vaut a, b, c, d ou e (l'API peut renvoyer `"unknown"`) ;
- garde le NOVA seulement s'il vaut 1 à 4 ;
- `"en:e150d"` → `{ code: "E150D", isColorant: true }` (colorant = E100 à E199) ;
- `"en:milk"` → `"Lait"` (avec la table `ALLERGENS`) ;
- récupère les valeurs pour 100 g dans `nutriments`.

### `toList(value)`
`"Danone, Activia"` → `["Danone", "Activia"]`, en enlevant les préfixes de langue (`fr:`, `en:`).
Le moteur de secours renvoie déjà un tableau, d'où les petits `if`.

### Les filtres (mêmes noms que dans le projet web)
- `ALLERGENS` : les 14 allergènes obligatoires (les mêmes que les cases de `search.html`).
- `isValidNutriScore(produit, "b")` → vrai si le produit est A ou B.
  Comme dans le projet web, on traduit les lettres en nombres avec `nutriScoreMap`
  (a = 1 … e = 5) et on compare.
- `isAllergenFree(produit, ["Lait", "Gluten"])` → faux dès qu'un allergène coché est présent.

Les filtres s'appliquent sur les résultats déjà reçus : pas de nouvel appel à l'API.

---

## 4. `src/style/theme.ts` — les couleurs (comme `style.css`)

Toutes les couleurs au même endroit (`colors.primary` = vert NutriChoix, etc.), plus
les couleurs officielles du Nutri-Score (comme les `.nutriscore[data-score="a"]` de `style.css`)
et du NOVA. Changer une couleur ici la change partout.

- `MAX_WIDTH` : largeur max du contenu sur ordinateur, sinon tout serait étiré.
- `shadow` : l'ombre légère sous les cartes.

En React Native il n'y a pas de fichier CSS : chaque fichier a son `StyleSheet.create({...})`
en bas, qui utilise ces couleurs.

---

## 5. `src/style/format.ts` — affichage des valeurs

- `formatValue(12.5)` → `"12,5 g"` ; `formatValue(null)` → `"—"`.
- `nutrientLevel("sugars", 30)` → `"Élevé"`. Les seuils (pour 100 g) sont ceux des repères
  « feu tricolore » : par exemple pour les sucres, faible ≤ 5 g, élevé > 22,5 g.
- `levelColors` : vert pour Faible, orange pour Modéré, rouge pour Élevé.

---

## 6. `App.tsx` et les routes

Dans le projet web, `@GetMapping("/")` affiche l'accueil et `@GetMapping("/recherche")` la recherche.
Chez nous c'est `App.tsx` (voir partie 1) qui choisit la page avec l'état `page`.

---

## 7. `src/screens/HomeScreen.tsx` — la page d'accueil (comme `homePage.html`)

Uniquement de l'affichage, de haut en bas :
1. barre du haut (logo + bouton Rechercher) ;
2. bloc vert : titre, texte, barre de recherche, idées de recherche, exemple de comparaison ;
3. « Comment ça marche ? » (3 cartes) ;
4. « Ce que vous trouverez sur chaque produit » (3 cartes avec un badge) ;
5. bandeau vert foncé avec un bouton ;
6. pied de page.

`Card` et `ExampleRow` sont de petits composants définis en bas du fichier pour éviter
de répéter le même code plusieurs fois.

La mise en page s'adapte à l'écran grâce à `flexWrap: 'wrap'` : sur ordinateur les cartes
sont côte à côte, sur téléphone elles passent les unes sous les autres.

---

## 8. `src/screens/SearchScreen.tsx` — la page de recherche (comme `search.html`)

C'est la page principale. Elle contient plusieurs **états** (`useState`) :

| État | Rôle |
| --- | --- |
| `text` | ce qui est tapé dans la barre |
| `searchedText` | la dernière recherche envoyée |
| `products` | les produits reçus de l'API |
| `loading` | vrai pendant la recherche (affiche le rond de chargement) |
| `error` | message d'erreur si l'API ne répond pas |
| `showFilters`, `nutriScore`, `allergens` | les filtres |
| `selected` | le produit dont la fiche est ouverte |

### `search(value)`
Appelée quand on clique sur Rechercher, sur une idée, ou au chargement si on vient de l'accueil.
Elle met `loading` à vrai, appelle `searchProducts` du contrôleur, range le résultat dans `products`
(ou un message dans `error`), puis remet `loading` à faux.

La recherche ne se lance **pas à chaque lettre tapée** : l'API limite le nombre de
recherches par minute.

### `filteredProducts`
Les produits qui passent les deux filtres. Recalculé à chaque affichage.

### `renderResults()`
Choisit quoi afficher selon la situation : idées de recherche → chargement → erreur →
aucun résultat → aucun résultat après filtres → liste des produits (`FlatList`).

`FlatList` est le composant React Native pour afficher une liste : il ne dessine que
les éléments visibles, c'est plus rapide qu'une boucle classique.

`useEffect(() => {...}, [])` : le code à l'intérieur s'exécute une seule fois, à
l'ouverture de la page (pour lancer la recherche tapée sur l'accueil).

---

## 9. `src/components/` — les morceaux d'interface

Un composant = une fonction qui reçoit des **props** (paramètres) et renvoie ce qu'il faut afficher.

| Fichier | Ce qu'il affiche | Props principales |
| --- | --- | --- |
| `Logo.tsx` | La feuille dans le carré vert + « NutriChoix ». La feuille est un carré avec deux coins arrondis, tourné de 45°. | `size` |
| `SearchBar.tsx` | Le champ de texte, la croix pour effacer et le bouton Rechercher. Entrée lance aussi la recherche (`onSubmitEditing`). | `value`, `onChange`, `onSearch` |
| `Badges.tsx` | `NutriScoreBadge` : les 5 lettres, celle du produit en grand. `NovaBadge` : « NOVA 4 » dans la couleur du groupe. | `score`, `nova` |
| `ProductCard.tsx` | Une carte de la liste : image, nom, marque, badges, sucres/gras avec un point de couleur, nombre d'additifs. Contient aussi `ProductImage` (l'image, ou l'initiale de la marque s'il n'y en a pas). | `product`, `onPress` |
| `ProductDetail.tsx` | La fiche complète qui s'ouvre par-dessus (`Modal`) : tableau des valeurs, additifs, allergènes, labels. | `product` (`null` = fermée), `onClose` |
| `FilterPanel.tsx` | Les boutons de filtres. `Chip` = un bouton arrondi qui se colore quand il est sélectionné. | les filtres et les fonctions pour les changer |
| `Message.tsx` | Un message centré (emoji, titre, texte) avec un bouton optionnel : erreur, aucun résultat… | `emoji`, `title`, `text`, `buttonText`, `onPress` |

### Le style
Chaque fichier a un `StyleSheet.create({...})` en bas : c'est l'équivalent du CSS.
Les noms ressemblent au CSS mais en camelCase : `backgroundColor`, `borderRadius`, `fontSize`…
`flexDirection: 'row'` met les éléments côte à côte, sinon ils sont les uns sous les autres.

---

## 10. Outils utilisés

| Outil | Rôle |
| --- | --- |
| TypeScript | Langage (JavaScript + types) |
| React / React Native | Interface en composants, appli mobile |
| Expo + Expo Go | Lancer et tester l'appli sur téléphone sans Android Studio / Xcode |
| react-native-web | Même appli dans le navigateur |
| react-native-safe-area-context | Évite l'encoche du téléphone |
| expo-status-bar | Barre d'état du téléphone |
| API Open Food Facts | Les données des produits |
| Node.js / npm | Installer et lancer le projet |
| Git / GitHub / GitHub Actions | Versions du code, Pull Requests, vérification automatique (`typecheck`) |
