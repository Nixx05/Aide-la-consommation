import { useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { FilterPanel } from '../components/FilterPanel';
import { Logo } from '../components/Logo';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { SearchBar } from '../components/SearchBar';
import { MIN_QUERY_LENGTH, useProductSearch } from '../hooks/useProductSearch';
import { colors, MAX_WIDTH, radius, spacing } from '../theme';
import type { Product } from '../types/product';
import { applyFilters, NO_FILTERS, type Filters } from '../utils/filters';

const SUGGESTIONS = ['Yaourt nature', 'Céréales', 'Biscuits', 'Cola', 'Pâte à tartiner'];

type Props = {
  initialQuery: string;
  onBack: () => void;
};

export function SearchScreen({ initialQuery, onBack }: Props) {
  // `text` = ce qui est tapé, `query` = ce qui a été validé et envoyé à l'API
  const [text, setText] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const { results, status, error, retry } = useProductSearch(query);

  const filtered = applyFilters(results, filters);
  const activeFilters = (filters.maxNutriScore ? 1 : 0) + filters.excludedAllergens.length;

  const submit = (value = text) => {
    Keyboard.dismiss();
    setText(value);
    setQuery(value.trim());
  };

  const openProduct = (product: Product) => {
    Keyboard.dismiss();
    setSelected(product);
  };

  const renderBody = () => {
    if (query.length < MIN_QUERY_LENGTH) {
      return (
        <View>
          <EmptyState
            emoji="🥗"
            title="Que cherchez-vous ?"
            message="Tapez le nom d'un produit, une marque ou un code-barres, puis lancez la recherche."
          />
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <Pressable key={s} style={styles.suggestion} onPress={() => submit(s)} accessibilityRole="button">
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }
    if (status === 'loading') {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Recherche sur Open Food Facts…</Text>
        </View>
      );
    }
    if (status === 'error') {
      return (
        <EmptyState
          emoji="⚠️"
          title="La recherche a échoué"
          message={`${error ?? ''}\nVérifiez votre connexion ou réessayez dans quelques secondes.`}
          actionLabel="Réessayer"
          onAction={retry}
        />
      );
    }
    if (results.length === 0) {
      return (
        <EmptyState
          emoji="🔍"
          title={`Aucun résultat pour « ${query} »`}
          message="Vérifiez l'orthographe ou essayez un terme plus général."
        />
      );
    }
    if (filtered.length === 0) {
      return (
        <EmptyState
          emoji="🧺"
          title="Aucun produit ne correspond aux filtres"
          message={`${results.length} produits trouvés, mais aucun ne passe les filtres choisis.`}
          actionLabel="Retirer les filtres"
          onAction={() => setFilters(NO_FILTERS)}
        />
      );
    }
    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => <ProductCard product={item} onPress={openProduct} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <Text style={styles.count}>
            {filtered.length} produit{filtered.length > 1 ? 's' : ''}
            {activeFilters > 0 ? ` sur ${results.length}` : ''}
          </Text>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.inner}>
          <View style={styles.topRow}>
            <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Retour à l'accueil">
              <View style={styles.logoRow}>
                <Text style={styles.back}>‹</Text>
                <Logo size={26} />
              </View>
            </Pressable>
            <Pressable
              onPress={() => setShowFilters((v) => !v)}
              style={[styles.filterButton, (showFilters || activeFilters > 0) && styles.filterButtonActive]}
              accessibilityRole="button"
            >
              <Text style={[styles.filterButtonText, (showFilters || activeFilters > 0) && styles.filterButtonTextActive]}>
                Filtres{activeFilters > 0 ? ` (${activeFilters})` : ''}
              </Text>
            </Pressable>
          </View>
          <SearchBar value={text} onChangeText={setText} onSubmit={() => submit()} autoFocus={!initialQuery} />
          {showFilters && <FilterPanel filters={filters} onChange={setFilters} />}
        </View>
      </View>

      <View style={[styles.body, styles.inner]}>{renderBody()}</View>

      <ProductDetailModal product={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  back: { color: colors.textMuted, fontSize: 28, lineHeight: 28, marginTop: -4 },
  filterButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  filterButtonActive: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLight },
  filterButtonText: { fontWeight: '600', color: colors.text },
  filterButtonTextActive: { color: colors.primary },
  body: { flex: 1 },
  loader: { marginTop: 48, alignItems: 'center', gap: spacing.md },
  loaderText: { color: colors.textMuted },
  list: { padding: spacing.lg, paddingBottom: spacing.xl },
  count: { fontSize: 13, color: colors.textMuted, fontWeight: '600', marginBottom: spacing.sm },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  suggestion: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  suggestionText: { color: colors.primary, fontWeight: '600' },
});
