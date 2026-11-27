// Carte d'un produit dans la liste des résultats (comme .product-item dans le projet web).

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { isColorant } from '../controller/ProductController';
import { Product } from '../model/Product';
import { colors, nutriScoreColors } from '../style/theme';

type Props = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: Props) {
  const colorants = product.additives.filter(isColorant).length;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.image} />
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.grey}>
          {product.brand} {product.quantity}
        </Text>

        <View style={styles.row}>
          <NutriScore score={product.nutriScore} />
          <Text style={styles.grey}>NOVA {product.nova ?? '?'}</Text>
        </View>

        <Text style={styles.grey}>
          Sucres : {show(product.sugars)} · Gras : {show(product.fat)}
        </Text>
        <Text style={styles.grey}>
          {product.additives.length} additif(s)
          {colorants > 0 && <Text style={styles.red}> dont {colorants} colorant(s)</Text>}
        </Text>
      </View>
    </Pressable>
  );
}

// Carré de couleur avec la lettre du Nutri-Score (comme la div .nutriscore du projet web)
export function NutriScore({ score }: { score: string | null }) {
  if (score === null) {
    return <Text style={styles.grey}>Nutri-Score ?</Text>;
  }
  return (
    <View style={[styles.score, { backgroundColor: nutriScoreColors[score] }]}>
      <Text style={styles.scoreText}>{score.toUpperCase()}</Text>
    </View>
  );
}

// 12.5 -> "12.5 g" et null -> "?"
export function show(value: number | null, unit = 'g'): string {
  if (value === null) return '?';
  return Math.round(value * 10) / 10 + ' ' + unit;
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, backgroundColor: colors.white, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border },
  image: { width: 64, height: 64, borderRadius: 8, backgroundColor: colors.lightGreen },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 15, fontWeight: 'bold', color: colors.text },
  grey: { fontSize: 13, color: colors.grey },
  red: { color: colors.red, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  score: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  scoreText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
});
