// Page de recherche (équivalent de search.html dans le projet web).
// En haut : la barre de recherche et les filtres. En dessous : les produits trouvés.

import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '../components/ProductCard';
import { ProductDetail } from '../components/ProductDetail';
import { SearchBar } from '../components/SearchBar';
import { ALLERGENS, isAllergenFree, isValidNutriScore, searchProducts } from '../controller/ProductController';
import { Product } from '../model/Product';
import { colors, nutriScoreColors } from '../style/theme';

type Props = {
  firstSearch: string; // recherche tapée sur la page d'accueil
  goHome: () => void;
};

export function SearchScreen({ firstSearch, goHome }: Props) {
  const [text, setText] = useState(firstSearch); // ce qui est tapé dans la barre
  const [products, setProducts] = useState<Product[]>([]); // produits trouvés
  const [message, setMessage] = useState('Entrez le nom d\'un produit.'); // message affiché à la place des produits
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null); // produit dont la fiche est ouverte

  // Filtres
  const [showFilters, setShowFilters] = useState(false);
  const [nutriScore, setNutriScore] = useState<string | null>(null);
  const [allergens, setAllergens] = useState<string[]>([]);

  // Si on arrive depuis l'accueil avec une recherche, on la lance tout de suite
  useEffect(() => {
    if (firstSearch !== '') search();
  }, []);

  async function search() {
    if (text.trim() === '') {
      setMessage('Veuillez entrer un nom de produit.');
      return;
    }
    setLoading(true);
    try {
      const result = await searchProducts(text);
      setProducts(result);
      setMessage(result.length === 0 ? 'Aucun produit trouvé.' : '');
    } catch {
      setProducts([]);
      setMessage("Erreur lors de l'appel à l'API. Vérifiez votre connexion et réessayez.");
    }
    setLoading(false);
  }

  // Coche ou décoche un allergène
  function toggleAllergen(allergen: string) {
    if (allergens.includes(allergen)) {
      setAllergens(allergens.filter((a) => a !== allergen));
    } else {
      setAllergens([...allergens, allergen]);
    }
  }

  // On applique les filtres sur les produits trouvés
  const filteredProducts = products.filter(
    (product) => isValidNutriScore(product, nutriScore) && isAllergenFree(product, allergens),
  );

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* En-tête */}
        <View style={styles.header}>
          <Pressable onPress={goHome}>
            <Text style={styles.logo}>‹ NutriChoix</Text>
          </Pressable>
          <Pressable onPress={() => setShowFilters(!showFilters)}>
            <Text style={styles.link}>{showFilters ? 'Masquer les filtres' : 'Filtres'}</Text>
          </Pressable>
        </View>

        <SearchBar value={text} onChange={setText} onSearch={search} />

        {/* Filtres */}
        {showFilters && (
          <View style={styles.filters}>
            <Text style={styles.title}>NUTRI-SCORE MINIMUM</Text>
            <View style={styles.row}>
              <Choice label="Tous" active={nutriScore === null} onPress={() => setNutriScore(null)} />
              {['a', 'b', 'c', 'd', 'e'].map((score) => (
                <Choice
                  key={score}
                  label={score.toUpperCase()}
                  color={nutriScoreColors[score]}
                  active={nutriScore === score}
                  onPress={() => setNutriScore(score)}
                />
              ))}
            </View>

            <Text style={styles.title}>SANS ALLERGÈNES</Text>
            <View style={styles.row}>
              {Object.values(ALLERGENS).map((allergen) => (
                <Choice
                  key={allergen}
                  label={allergen}
                  active={allergens.includes(allergen)}
                  onPress={() => toggleAllergen(allergen)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Résultats */}
        {loading && <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 40 }} />}

        {!loading && message !== '' && <Text style={styles.message}>{message}</Text>}

        {!loading && products.length > 0 && (
          <Text style={styles.grey}>
            {filteredProducts.length} produit(s) sur {products.length}
          </Text>
        )}

        {!loading &&
          filteredProducts.map((product) => (
            <ProductCard key={product.code} product={product} onPress={() => setSelected(product)} />
          ))}
      </ScrollView>

      <ProductDetail product={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

// Un bouton de filtre, coloré quand il est sélectionné
function Choice({ label, active, color = colors.green, onPress }: { label: string; active: boolean; color?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.choice, active && { backgroundColor: color, borderColor: color }]}>
      <Text style={{ color: active ? colors.white : colors.text }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12, width: '100%', maxWidth: 760, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 24, fontWeight: 'bold', color: colors.green },
  link: { fontSize: 15, fontWeight: 'bold', color: colors.green },
  filters: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.green, padding: 12, gap: 8 },
  title: { fontSize: 13, fontWeight: 'bold', color: colors.darkGreen },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  choice: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  message: { textAlign: 'center', color: colors.grey, fontSize: 15, marginTop: 40 },
  grey: { color: colors.grey },
});
