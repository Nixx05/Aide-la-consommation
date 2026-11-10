import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, levelColors, radius, spacing } from '../theme';
import type { Nutrients, Product } from '../types/product';
import { nutrientLevel } from '../utils/nutrition';
import { formatNutrient } from '../utils/text';
import { NovaBadge } from './NovaBadge';
import { NutriScoreBadge } from './NutriScoreBadge';
import { ProductImage } from './ProductImage';

type Props = { product: Product; onPress: (product: Product) => void };

function Chip({ label, nutrient, value }: { label: string; nutrient: keyof Nutrients; value: number | null }) {
  const level = nutrientLevel(nutrient, value);
  const color = level ? levelColors[level] : colors.textMuted;
  return (
    <View style={styles.chip}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.chipText}>
        {label} {formatNutrient(value)}
      </Text>
    </View>
  );
}

export function ProductCard({ product, onPress }: Props) {
  const colorants = product.additives.filter((a) => a.isColorant).length;

  return (
    <Pressable
      onPress={() => onPress(product)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.brand}`}
    >
      <ProductImage product={product} size={64} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand} · {product.quantity}
        </Text>

        <View style={styles.scores}>
          <NutriScoreBadge score={product.nutriScore} />
          <NovaBadge nova={product.nova} />
        </View>

        <View style={styles.chips}>
          <Chip label="Sucres" nutrient="sugars" value={product.nutrients.sugars} />
          <Chip label="Gras" nutrient="fat" value={product.nutrients.fat} />
        </View>

        <Text style={styles.additives}>
          {product.additives.length === 0
            ? '✓ Sans additif'
            : `${product.additives.length} additif${product.additives.length > 1 ? 's' : ''}`}
          {colorants > 0 && (
            <Text style={styles.colorants}>
              {' '}· {colorants} colorant{colorants > 1 ? 's' : ''}
            </Text>
          )}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.7 },
  body: { flex: 1, gap: 4 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  brand: { fontSize: 13, color: colors.textMuted },
  scores: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: 2 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { fontSize: 12, color: colors.text },
  additives: { fontSize: 12, color: colors.textMuted },
  colorants: { color: colors.danger, fontWeight: '600' },
});
