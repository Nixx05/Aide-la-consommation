// Page de recherche (équivalent de search.html) : barre de recherche, filtres, résultats et fiche produit.

import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isAllergenFree, isValidNutriScore, searchProducts } from '../controller/ProductController';
import { FilterPanel } from '../components/FilterPanel';
import { Logo } from '../components/Logo';
import { Message } from '../components/Message';
import { ProductCard } from '../components/ProductCard';
import { ProductDetail } from '../components/ProductDetail';
import { SearchBar } from '../components/SearchBar';
import { colors, MAX_WIDTH } from '../style/theme';
import { NutriScore, Product } from '../model/Product';

const SUGGESTIONS = ['Yaourt nature', 'Céréales', 'Biscuits', 'Cola', 'Pâte à tartiner'];

type Props = {
  firstSearch: string; // recherche tapée sur la page d'accueil
  goHome: () => void;
};

export function SearchScreen({ firstSearch, goHome }: Props) {
  // Recherche
  const [text, setText] = useState(firstSearch); // ce qui est tapé dans la barre
  const [searchedText, setSearchedText] = useState(''); // dernière recherche envoyée
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filtres
  const [showFilters, setShowFilters] = useState(false);
  const [nutriScore, setNutriScore] = useState<NutriScore | null>(null);
  const [allergens, setAllergens] = useState<string[]>([]);

  // Produit dont la fiche est ouverte
  const [selected, setSelected] = useState<Product | null>(null);

  // Si on arrive depuis l'accueil avec une recherche, on la lance tout de suite
  useEffect(() => {
    if (firstSearch !== '') search(firstSearch);
  }, []);

  async function search(value: string) {
    Keyboard.dismiss();
    setText(value);
    value = value.trim();
    if (value.length < 2) return;

    setSearchedText(value);
    setLoading(true);
    setError('');
    try {
      const results = await searchProducts(value);
      setProducts(results);
    } catch (e) {
      setError("Impossible de contacter Open Food Facts. Vérifiez votre connexion.");
    }
    setLoading(false);
  }

  // Les produits qui passent les filtres
  const filteredProducts = products.filter(
    (p) => isValidNutriScore(p, nutriScore) && isAllergenFree(p, allergens),
  );
  const filterCount = (nutriScore ? 1 : 0) + allergens.length;

  // Ce qu'on affiche sous la barre de recherche
  function renderResults() {
    if (searchedText === '') {
      return (
        <View>
          <Message emoji="🥗" title="Que cherchez-vous ?" text="Tapez un produit, une marque ou un code-barres." />
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <Pressable key={s} style={styles.suggestion} onPress={() => search(s)}>
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }
    if (loading) {
      return <ActivityIndicator style={{ marginTop: 48 }} size="large" color={colors.primary} />;
    }
    if (error !== '') {
      return <Message emoji="⚠️" title="La recherche a échoué" text={error} buttonText="Réessayer" onPress={() => search(searchedText)} />;
    }
    if (products.length === 0) {
      return <Message emoji="🔍" title={`Aucun résultat pour « ${searchedText} »`} text="Essayez un terme plus général." />;
    }
    if (filteredProducts.length === 0) {
      return (
        <Message
          emoji="🧺"
          title="Aucun produit ne correspond aux filtres"
          buttonText="Retirer les filtres"
          onPress={() => {
            setNutriScore(null);
            setAllergens([]);
          }}
        />
      );
    }
    return (
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => <ProductCard product={item} onPress={() => setSelected(item)} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <Text style={styles.count}>
            {filteredProducts.length} produit(s){filterCount > 0 ? ` sur ${products.length}` : ''}
          </Text>
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.center}>
          <View style={styles.topRow}>
            <Pressable onPress={goHome} style={styles.backRow}>
              <Text style={styles.back}>‹</Text>
              <Logo size={26} />
            </Pressable>
            <Pressable
              onPress={() => setShowFilters(!showFilters)}
              style={[styles.filterButton, filterCount > 0 && styles.filterButtonOn]}
            >
              <Text style={[styles.filterText, filterCount > 0 && { color: colors.primary }]}>
                Filtres{filterCount > 0 ? ` (${filterCount})` : ''}
              </Text>
            </Pressable>
          </View>

          <SearchBar value={text} onChange={setText} onSearch={() => search(text)} />

          {showFilters && (
            <FilterPanel
              nutriScore={nutriScore}
              setNutriScore={setNutriScore}
              allergens={allergens}
              setAllergens={setAllergens}
            />
          )}
        </View>
      </View>

      <View style={[styles.center, { flex: 1 }]}>{renderResults()}</View>

      <ProductDetail product={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
  header: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, padding: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  back: { color: colors.textMuted, fontSize: 28, lineHeight: 28, marginTop: -4 },
  filterButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  filterButtonOn: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLight },
  filterText: { fontWeight: '600', color: colors.text },
  count: { fontSize: 13, color: colors.textMuted, fontWeight: '600', marginBottom: 8 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 16, paddingHorizontal: 16 },
  suggestion: { backgroundColor: colors.primaryLight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  suggestionText: { color: colors.primary, fontWeight: '600' },
});
