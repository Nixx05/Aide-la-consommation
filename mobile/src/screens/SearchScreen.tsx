import { useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { SearchBar } from '../components/SearchBar';
import { MIN_QUERY_LENGTH, useProductSearch } from '../hooks/useProductSearch';
import { colors, radius, spacing } from '../theme';
import type { Product } from '../types/product';

const SUGGESTIONS = ['Yaourt', 'Céréales', 'Biscuits', 'Cola', 'Pâte à tartiner'];

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const { results, status, error, debouncedQuery, retry } = useProductSearch(query);

  const openProduct = (product: Product) => {
    Keyboard.dismiss();
    setSelected(product);
  };

  const renderBody = () => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      return (
        <View>
          <EmptyState
            emoji="🥗"
            title="Trouvez des aliments plus sains"
            message="Recherchez un produit par son nom, sa marque ou son code-barres pour voir son Nutri-Score, ses sucres, ses matières grasses et ses additifs."
          />
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <Pressable key={s} style={styles.suggestion} onPress={() => setQuery(s)} accessibilityRole="button">
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }
    if (status === 'loading' && results.length === 0) {
      return <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />;
    }
    if (status === 'error') {
      return (
        <EmptyState
          emoji="⚠️"
          title="La recherche a échoué"
          message={error ?? undefined}
          actionLabel="Réessayer"
          onAction={retry}
        />
      );
    }
    if (status === 'success' && results.length === 0) {
      return (
        <EmptyState
          emoji="🔍"
          title={`Aucun résultat pour « ${debouncedQuery} »`}
          message="Vérifiez l'orthographe ou essayez un terme plus général."
        />
      );
    }
    return (
      <FlatList
        data={results}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => <ProductCard product={item} onPress={openProduct} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.count}>
              {results.length} produit{results.length > 1 ? 's' : ''}
            </Text>
            {status === 'loading' && <ActivityIndicator size="small" color={colors.primary} />}
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>NutriChoix</Text>
        <Text style={styles.subtitle}>Choisissez mieux ce que vous mangez</Text>
        <View style={styles.searchWrapper}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
      </View>

      <View style={styles.body}>{renderBody()}</View>

      <ProductDetailModal product={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md, gap: 2 },
  title: { fontSize: 28, fontWeight: '800', color: colors.primary },
  subtitle: { fontSize: 14, color: colors.textMuted },
  searchWrapper: { marginTop: spacing.md },
  body: { flex: 1 },
  loader: { marginTop: 48 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  listHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  count: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
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
