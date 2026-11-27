// Fiche détaillée d'un produit, qui s'ouvre par-dessus la liste.

import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, MAX_WIDTH } from '../style/theme';
import { Nutrients, Product } from '../model/Product';
import { formatValue, levelColors, nutrientLevel } from '../style/format';
import { NovaBadge, novaText, NutriScoreBadge } from './Badges';
import { brandAndQuantity, ProductImage } from './ProductCard';

// Lignes du tableau des valeurs nutritionnelles
const ROWS: { key: keyof Nutrients; label: string; unit?: string }[] = [
  { key: 'energyKcal', label: 'Énergie', unit: 'kcal' },
  { key: 'fat', label: 'Matières grasses' },
  { key: 'saturatedFat', label: '   dont acides gras saturés' },
  { key: 'sugars', label: 'Sucres' },
  { key: 'salt', label: 'Sel' },
  { key: 'fiber', label: 'Fibres' },
  { key: 'proteins', label: 'Protéines' },
];

type Props = {
  product: Product | null; // null = fiche fermée
  onClose: () => void;
};

export function ProductDetail({ product, onClose }: Props) {
  if (product === null) return null;

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.close}>Fermer</Text>
        </Pressable>

        <ScrollView contentContainerStyle={styles.content}>
          {/* En-tête : image, nom, marque */}
          <View style={styles.header}>
            <ProductImage product={product} size={96} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.muted}>{brandAndQuantity(product)}</Text>
              <Text style={styles.category}>{product.category}</Text>
            </View>
          </View>

          {/* Nutri-Score et NOVA */}
          <View style={styles.scores}>
            <View style={[styles.box, styles.scoreBox]}>
              <NutriScoreBadge score={product.nutriScore} big />
              <Text style={styles.muted}>Qualité nutritionnelle</Text>
            </View>
            <View style={[styles.box, styles.scoreBox]}>
              <NovaBadge nova={product.nova} />
              <Text style={styles.muted}>{novaText(product.nova)}</Text>
            </View>
          </View>

          {/* Valeurs nutritionnelles */}
          <View style={styles.box}>
            <Text style={styles.title}>Valeurs nutritionnelles (pour 100 g)</Text>
            {ROWS.map((row) => {
              const value = product.nutrients[row.key];
              const level = nutrientLevel(row.key, value);
              return (
                <View key={row.key} style={styles.line}>
                  <Text style={styles.text}>{row.label}</Text>
                  <Text style={styles.text}>
                    {level && <Text style={{ color: levelColors[level], fontWeight: '700' }}>{level}   </Text>}
                    {formatValue(value, row.unit)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Additifs */}
          <View style={styles.box}>
            <Text style={styles.title}>Additifs ({product.additives.length})</Text>
            {product.additives.length === 0 && <Text style={styles.good}>✓ Aucun additif</Text>}
            <View style={styles.tags}>
              {product.additives.map((additive) => (
                <Text key={additive.code} style={additive.isColorant ? styles.tagRed : styles.tag}>
                  {additive.code}
                  {additive.isColorant ? ' · colorant' : ''}
                </Text>
              ))}
            </View>
          </View>

          {/* Allergènes */}
          <View style={styles.box}>
            <Text style={styles.title}>Allergènes</Text>
            {product.allergens.length === 0 && <Text style={styles.muted}>Aucun allergène déclaré</Text>}
            <View style={styles.tags}>
              {product.allergens.map((allergen) => (
                <Text key={allergen} style={styles.tag}>
                  {allergen}
                </Text>
              ))}
            </View>
          </View>

          {/* Labels */}
          <View style={styles.box}>
            <Text style={styles.title}>Labels</Text>
            {product.labels.length === 0 && <Text style={styles.muted}>Aucun label</Text>}
            <View style={styles.tags}>
              {product.labels.map((label) => (
                <Text key={label} style={styles.tagGreen}>
                  {label}
                </Text>
              ))}
            </View>
          </View>

          <Text style={styles.footer}>Code-barres : {product.code}</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  closeButton: { alignSelf: 'flex-end', padding: 16 },
  close: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  content: { padding: 16, paddingTop: 0, gap: 16, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
  header: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  name: { fontSize: 20, fontWeight: '800', color: colors.text },
  category: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  scores: { flexDirection: 'row', gap: 12 },
  scoreBox: { flex: 1 },
  box: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'stretch',
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  text: { fontSize: 14, color: colors.text },
  muted: { fontSize: 13, color: colors.textMuted },
  good: { color: colors.primary, fontWeight: '600' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: colors.background, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, fontSize: 13, overflow: 'hidden' },
  tagRed: { backgroundColor: colors.redLight, color: colors.red, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, fontSize: 13, fontWeight: '700', overflow: 'hidden' },
  tagGreen: { backgroundColor: colors.primaryLight, color: colors.primary, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, fontSize: 13, fontWeight: '600', overflow: 'hidden' },
  footer: { textAlign: 'center', color: colors.textMuted, fontSize: 12, marginBottom: 24 },
});
