// Carte d'un produit dans la liste des résultats.

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shadow } from '../style/theme';
import { Product } from '../model/Product';
import { formatValue, levelColors, nutrientLevel } from '../style/format';
import { NovaBadge, NutriScoreBadge } from './Badges';

type Props = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: Props) {
  const colorants = product.additives.filter((a) => a.isColorant).length;

  let additivesText = '✓ Sans additif';
  if (product.additives.length > 0) {
    additivesText = `${product.additives.length} additif(s)`;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}>
      <ProductImage product={product} size={64} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.brand}>{brandAndQuantity(product)}</Text>

        <View style={styles.row}>
          <NutriScoreBadge score={product.nutriScore} />
          <NovaBadge nova={product.nova} />
        </View>

        <View style={styles.row}>
          <Nutrient label="Sucres" name="sugars" value={product.nutrients.sugars} />
          <Nutrient label="Gras" name="fat" value={product.nutrients.fat} />
        </View>

        <Text style={styles.small}>
          {additivesText}
          {colorants > 0 && <Text style={styles.colorants}> · {colorants} colorant(s)</Text>}
        </Text>
      </View>
    </Pressable>
  );
}

// Un point de couleur (vert / orange / rouge) + la valeur
function Nutrient({ label, name, value }: { label: string; name: string; value: number | null }) {
  const level = nutrientLevel(name, value);
  const color = level ? levelColors[level] : colors.textMuted;
  return (
    <View style={styles.nutrient}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.nutrientText}>
        {label} {formatValue(value)}
      </Text>
    </View>
  );
}

// Image du produit, ou la première lettre de la marque s'il n'y a pas d'image
export function ProductImage({ product, size }: { product: Product; size: number }) {
  if (product.imageUrl) {
    return <Image source={{ uri: product.imageUrl }} style={{ width: size, height: size }} resizeMode="contain" />;
  }
  return (
    <View style={[styles.noImage, { width: size, height: size }]}>
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{product.brand.charAt(0).toUpperCase() || '?'}</Text>
    </View>
  );
}

// "Danone · 125 g" (sans le point si une des deux infos manque)
export function brandAndQuantity(product: Product): string {
  return [product.brand, product.quantity].filter((text) => text !== '').join(' · ');
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 12, padding: 12, gap: 12, ...shadow },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  brand: { fontSize: 13, color: colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 2 },
  nutrient: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  nutrientText: { fontSize: 12, color: colors.text },
  small: { fontSize: 12, color: colors.textMuted },
  colorants: { color: colors.red, fontWeight: '600' },
  noImage: { borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  initial: { color: colors.primary, fontWeight: '800' },
});
