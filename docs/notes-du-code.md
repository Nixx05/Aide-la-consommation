# Notes du code — NutriChoix

Tout notre code est dans `mobile/App.tsx` et `mobile/src/` (8 fichiers).
Le reste du dossier `mobile/` est créé par les outils (voir la partie 7).

L'organisation reprend celle du projet web de nos collègues (`ProjetWeb-main`, Java / Spring Boot) :

| Projet web des collègues | Notre projet | Rôle |
| --- | --- | --- |
| `Product.java` | `src/model/Product.ts` | À quoi ressemble un produit |
| `DemoApplication.java` | `src/controller/ProductController.ts` | Appel à l'API + filtres |
| `homePage.html` | `src/screens/HomeScreen.tsx` | Page d'accueil |
| `search.html` | `src/screens/SearchScreen.tsx` | Page de recherche |
| `style.css` | `src/style/theme.ts` | Couleurs |
| routes `"/"` et `"/recherche"` | `App.tsx` | Quelle page afficher |
| — | `src/components/` | Morceaux réutilisés : barre de recherche, carte produit, fiche produit |

---

## 1. `App.tsx` — quelle page afficher

```ts
const [page, setPage] = useState<'home' | 'search'>('home');
```

`page` vaut `'home'` (accueil) ou `'search'` (recherche).
Quand on cherche quelque chose sur l'accueil, `goToSearch(texte)` garde le texte et passe à `'search'`.

`useState` = une variable que React surveille : quand elle change, l'écran se redessine.

---

## 2. `src/model/Product.ts` — le modèle (comme `Product.java`)

La liste des informations d'un produit : nom, marque, image, Nutri-Score, NOVA,
valeurs pour 100 g (sucres, gras, sel…), additifs, allergènes.
`null` veut dire « information inconnue ».

En Java il faut une classe avec getters et setters ; en TypeScript un simple `type` suffit.

---

## 3. `src/controller/ProductController.ts` — l'API et les filtres (comme `DemoApplication.java`)

C'est **le seul fichier qui va sur internet**.

### `searchProducts(query)`
1. On construit l'URL de recherche Open Food Facts (la même que nos collègues).
2. `fetch(url)` envoie la requête, `response.json()` lit la réponse (JSON).
3. Si ça plante (le serveur d'Open Food Facts est souvent surchargé), le `catch` réessaie
   avec leur autre moteur de recherche (`search.openfoodfacts.org`).
4. Une boucle `for` parcourt les produits et crée un `Product` pour chacun,
   comme la boucle `for (JsonNode product : products)` de nos collègues.

Petites transformations dans la boucle :
- Nutri-Score : on garde seulement `a` à `e` (l'API peut répondre `"unknown"`).
- Additifs : `"en:e322"` devient `"E322"`.
- Allergènes : `"en:milk"` devient `"Lait"` grâce à la liste `ALLERGENS`.
- `?? null` veut dire « si la valeur n'existe pas, mettre `null` ».

`async` / `await` : la requête prend du temps, `await` attend la réponse.

### Les filtres (mêmes noms que chez nos collègues)
- `isValidNutriScore(produit, "b")` : on traduit les lettres en nombres
  (`a = 1` … `e = 5`) et on garde le produit si son score est meilleur ou égal.
- `isAllergenFree(produit, ["Lait"])` : renvoie `false` si le produit contient un allergène coché.
- `isColorant("E150D")` : un colorant est un additif entre E100 et E199.

---

## 4. `src/screens/HomeScreen.tsx` — la page d'accueil (comme `homePage.html`)

De haut en bas : le titre, la barre de recherche, des idées de recherche,
3 cartes qui expliquent Nutri-Score / NOVA / additifs, un bouton « Faire une recherche ».

`Card` est une petite fonction en bas du fichier pour ne pas écrire 3 fois la même carte.

---

## 5. `src/screens/SearchScreen.tsx` — la page de recherche (comme `search.html`)

Les variables (`useState`) :

| Variable | Rôle |
| --- | --- |
| `text` | ce qui est tapé dans la barre |
| `products` | les produits reçus de l'API |
| `message` | le texte affiché s'il n'y a pas de produits (« Aucun produit trouvé »…) |
| `loading` | vrai pendant la recherche (rond qui tourne) |
| `selected` | le produit dont la fiche est ouverte |
| `showFilters`, `nutriScore`, `allergens` | les filtres |

- `search()` : appelle `searchProducts`, range les produits ou met un message d'erreur.
- `filteredProducts` : les produits qui passent les deux filtres.
- `Choice` : un bouton de filtre, coloré quand il est sélectionné.
- `useEffect(..., [])` : s'exécute une seule fois à l'ouverture de la page,
  pour lancer la recherche tapée sur l'accueil.

On ne cherche pas à chaque lettre tapée : seulement au clic sur « Rechercher » ou avec Entrée.

---

## 6. `src/components/` — les morceaux réutilisés

| Fichier | Ce qu'il affiche |
| --- | --- |
| `SearchBar.tsx` | Le champ de texte + le bouton « Rechercher » (utilisé sur les 2 pages) |
| `ProductCard.tsx` | Une carte produit : image, nom, marque, Nutri-Score, NOVA, sucres, gras, additifs. Contient aussi `NutriScore` (le carré de couleur avec la lettre, comme la div `.nutriscore` de nos collègues) et `show` (affiche `"12.5 g"` ou `"?"`). |
| `ProductDetail.tsx` | La fiche complète qui s'ouvre au clic (`Modal`) : valeurs pour 100 g, additifs (colorants en rouge), allergènes |

### Le style
En bas de chaque fichier, `StyleSheet.create({...})` = l'équivalent du CSS.
Les noms ressemblent au CSS : `backgroundColor`, `borderRadius`, `fontSize`…
Les couleurs viennent de `src/style/theme.ts`.

---

## 7. Le reste du dossier (créé par les outils)

| Élément | C'est quoi |
| --- | --- |
| `node_modules/` | Les frameworks téléchargés par `npm install` (pas envoyé sur GitHub) |
| `package.json` | La liste des frameworks et les commandes (`npm start`, `npm run web`) |
| `package-lock.json` | Les versions exactes, écrit automatiquement |
| `app.json` | Nom et icône de l'appli |
| `assets/` | Les icônes |
| `index.ts` | Dit à Expo que l'appli commence dans `App.tsx` |
| `tsconfig.json` | Réglages de TypeScript |
| `.expo/` | Fichiers temporaires d'Expo |

---

## 8. Téléphone et ordinateur : un seul code

- **React Native** transforme le code en appli téléphone (`View` devient un composant natif).
- **react-native-web** transforme le même code en page web (`View` devient une `div`).
- **Expo** lance le tout : QR code pour **Expo Go** sur le téléphone, ou navigateur sur le PC.
- `SafeAreaView` évite l'encoche du téléphone ; `maxWidth` garde le contenu centré sur ordinateur.

## 9. Lancer le projet

- `LANCER_WEB.bat` : double-clic → l'appli s'ouvre dans le navigateur (http://localhost:8081).
- `LANCER_TELEPHONE.bat` : double-clic → QR code à scanner avec Expo Go (même Wi-Fi que le PC).

La première fois, le script fait `npm install` pour télécharger les frameworks.

## 10. Outils utilisés

TypeScript, React, React Native, Expo + Expo Go, react-native-web,
react-native-safe-area-context, expo-status-bar, API Open Food Facts, Node.js / npm,
Git, GitHub, GitHub Actions (vérification automatique `npm run typecheck`).
