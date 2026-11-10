import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, levelColors, radius, spacing } from '../theme';
import type { Nutrients, Product } from '../types/product';
import { LEVEL_LABEL, nutrientLevel } from '../utils/nutrition';
import { formatNutrient } from '../utils/text';
import { NOVA_LABELS, NovaBadge } from './NovaBadge';
import { NutriScoreBadge } from './NutriScoreBadge';
import { ProductImage } from './ProductImage';

type Props = { product: Product | null; onClose: () => void };

const NUTRIENT_ROWS: { key: keyof Nutrients; label: string; unit?: string; indent?: boolean }[] = [
  { key: 'energyKcal', label: 'Énergie', unit: 'kcal' },
  { key: 'fat', label: 'Matières grasses' },
  { key: 'saturatedFat', label: 'dont acides gras saturés', indent: true },
  { key: 'sugars', label: 'Sucres' },
  { key: 'salt', label: 'Sel' },
  { key: 'fiber', label: 'Fibres' },
  { key: 'proteins', label: 'Protéines' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Tags({ items, empty, tone = 'neutral' }: { items: string[]; empty: string; tone?: 'neutral' | 'good' }) {
  if (items.length === 0) return <Text style={styles.muted}>{empty}</Text>;
  return (
    <View style={styles.tags}>
      {items.map((item) => (
        <View key={item} style={[styles.tag, tone === 'good' && styles.tagGood]}>
          <Text style={[styles.tagText, tone === 'good' && styles.tagGoodText]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function ProductDetailModal({ product, onClose }: Props) {
  return (
    <Modal visible={product !== null} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      {product && (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fermer">
              <Text style={styles.close}>Fermer</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.hero}>
              <ProductImage product={product} size={96} />
              <View style={styles.heroText}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.brand}>
                  {product.brand} · {product.quantity}
                </Text>
                <Text style={styles.category}>{product.category}</Text>
              </View>
            </View>

            <View style={styles.scoreRow}>
              <View style={styles.scoreBox}>
                <NutriScoreBadge score={product.nutriScore} size="large" />
                <Text style={styles.scoreLabel}>Qualité nutritionnelle</Text>
              </View>
              <View style={styles.scoreBox}>
                <NovaBadge nova={product.nova} />
                <Text style={styles.scoreLabel}>{product.nova ? NOVA_LABELS[product.nova] : 'Transformation inconnue'}</Text>
              </View>
            </View>

            <Section title="Valeurs nutritionnelles (pour 100 g)">
              {NUTRIENT_ROWS.map(({ key, label, unit, indent }) => {
                const value = product.nutrients[key];
                const level = nutrientLevel(key, value);
                return (
                  <View key={key} style={styles.nutrientRow}>
                    <Text style={[styles.nutrientLabel, indent && styles.indent]}>{label}</Text>
                    <View style={styles.nutrientRight}>
                      {level && (
                        <Text style={[styles.level, { color: levelColors[level] }]}>{LEVEL_LABEL[level]}</Text>
                      )}
                      <Text style={styles.nutrientValue}>{formatNutrient(value, unit)}</Text>
                    </View>
                  </View>
                );
              })}
            </Section>

            <Section title={`Additifs (${product.additives.length})`}>
              {product.additives.length === 0 ? (
                <Text style={styles.good}>✓ Aucun additif</Text>
              ) : (
                product.additives.map((a) => (
                  <View key={a.code} style={styles.additiveRow}>
                    <Text style={styles.additiveCode}>{a.code}</Text>
                    <Text style={styles.additiveName}>{a.name}</Text>
                    {a.isColorant && (
                      <View style={styles.colorantTag}>
                        <Text style={styles.colorantText}>Colorant</Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </Section>

            <Section title="Allergènes">
              <Tags items={product.allergens} empty="Aucun allergène déclaré" />
            </Section>

            <Section title="Labels">
              <Tags items={product.labels} empty="Aucun label" tone="good" />
            </Section>

            <Text style={styles.footer}>Code-barres : {product.code}</Text>
          </ScrollView>
        </SafeAreaView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  close: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  content: { padding: spacing.lg, paddingTop: 0, gap: spacing.lg },
  hero: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  heroText: { flex: 1, gap: 4 },
  name: { fontSize: 20, fontWeight: '800', color: colors.text },
  brand: { fontSize: 14, color: colors.textMuted },
  category: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  scoreRow: { flexDirection: 'row', gap: spacing.md },
  scoreBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreLabel: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  nutrientLabel: { fontSize: 14, color: colors.text },
  indent: { paddingLeft: spacing.md, color: colors.textMuted, fontSize: 13 },
  nutrientRight: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  level: { fontSize: 12, fontWeight: '700' },
  nutrientValue: { fontSize: 14, fontWeight: '600', color: colors.text, minWidth: 64, textAlign: 'right' },
  additiveRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  additiveCode: { fontWeight: '700', color: colors.text, width: 56 },
  additiveName: { flex: 1, color: colors.text },
  colorantTag: { backgroundColor: '#FDECEA', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  colorantText: { color: colors.danger, fontSize: 11, fontWeight: '700' },
  good: { color: colors.primary, fontWeight: '600' },
  muted: { color: colors.textMuted },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: { backgroundColor: colors.background, borderRadius: radius.lg, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 13, color: colors.text },
  tagGood: { backgroundColor: colors.primaryLight },
  tagGoodText: { color: colors.primary, fontWeight: '600' },
  footer: { textAlign: 'center', color: colors.textMuted, fontSize: 12, marginBottom: spacing.xl },
});
