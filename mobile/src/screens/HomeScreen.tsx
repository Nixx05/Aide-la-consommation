import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../components/Logo';
import { NovaBadge } from '../components/NovaBadge';
import { NutriScoreBadge } from '../components/NutriScoreBadge';
import { SearchBar } from '../components/SearchBar';
import { colors, MAX_WIDTH, radius, shadow, spacing } from '../theme';
import type { NovaGroup, NutriScore } from '../types/product';

const SUGGESTIONS = ['Yaourt nature', 'Céréales', 'Biscuits', 'Cola', 'Pâte à tartiner'];

// Exemple affiché dans la carte de droite (ce ne sont pas de vrais produits)
const EXAMPLE: { name: string; detail: string; score: NutriScore; nova: NovaGroup }[] = [
  { name: 'Yaourt nature', detail: 'Sucres 4,5 g · sans additif', score: 'a', nova: 1 },
  { name: 'Céréales au chocolat', detail: 'Sucres 28 g · 2 additifs', score: 'd', nova: 4 },
  { name: 'Soda', detail: 'Sucres 10,6 g · 1 colorant', score: 'e', nova: 4 },
];

const STEPS = [
  { title: 'Cherchez', text: "Tapez un nom de produit, une marque ou son code-barres." },
  { title: 'Comparez', text: 'Nutri-Score, transformation, sucres, gras, additifs : tout est sur la même carte.' },
  { title: 'Choisissez', text: 'Filtrez les meilleurs produits ou ceux sans vos allergènes, et faites votre choix.' },
];

type Props = {
  /** Ouvre l'écran de recherche, avec une recherche déjà lancée si `query` est renseigné. */
  onSearch: (query: string) => void;
};

export function HomeScreen({ onSearch }: Props) {
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Barre du haut */}
        <View style={styles.nav}>
          <View style={[styles.inner, styles.navRow]}>
            <Logo size={30} />
            <Pressable onPress={() => onSearch('')} style={styles.navButton} accessibilityRole="button">
              <Text style={styles.navButtonText}>Rechercher</Text>
            </Pressable>
          </View>
        </View>

        {/* Bloc principal */}
        <View style={styles.hero}>
          <View style={[styles.inner, styles.heroRow]}>
            <View style={styles.heroLeft}>
              <Text style={styles.badge}>Gratuit · données Open Food Facts</Text>
              <Text style={styles.heroTitle}>
                Mangez <Text style={styles.highlight}>mieux</Text>,{'\n'}sans vous prendre la tête.
              </Text>
              <Text style={styles.heroText}>
                NutriChoix vous dit en un coup d'œil si un produit du supermarché est bon pour vous,
                et vous aide à trouver une meilleure alternative.
              </Text>
              <SearchBar value={text} onChangeText={setText} onSubmit={() => onSearch(text.trim())} />
              <View style={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <Pressable key={s} style={styles.suggestion} onPress={() => onSearch(s)} accessibilityRole="button">
                    <Text style={styles.suggestionText}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.exampleCard}>
              <Text style={styles.exampleTitle}>Exemple de comparaison</Text>
              {EXAMPLE.map((item) => (
                <View key={item.name} style={styles.exampleRow}>
                  <View style={styles.exampleText}>
                    <Text style={styles.exampleName}>{item.name}</Text>
                    <Text style={styles.exampleDetail}>{item.detail}</Text>
                  </View>
                  <View style={styles.exampleBadges}>
                    <NutriScoreBadge score={item.score} />
                    <NovaBadge nova={item.nova} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Comment ça marche */}
        <View style={styles.section}>
          <View style={styles.inner}>
            <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
            <View style={styles.grid}>
              {STEPS.map((step, i) => (
                <View key={step.title} style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{step.title}</Text>
                  <Text style={styles.cardText}>{step.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Ce qu'on affiche */}
        <View style={styles.section}>
          <View style={styles.inner}>
            <Text style={styles.sectionTitle}>Ce que vous trouverez sur chaque produit</Text>
            <View style={styles.grid}>
              <View style={styles.card}>
                <NutriScoreBadge score="b" />
                <Text style={styles.cardTitle}>Nutri-Score</Text>
                <Text style={styles.cardText}>
                  La note de A à E sur la qualité nutritionnelle. Filtrez pour ne garder que les meilleurs.
                </Text>
              </View>
              <View style={styles.card}>
                <NovaBadge nova={4} />
                <Text style={styles.cardTitle}>Transformation</Text>
                <Text style={styles.cardText}>
                  Le groupe NOVA indique si un aliment est brut (1) ou ultra-transformé (4).
                </Text>
              </View>
              <View style={styles.card}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>E150d</Text>
                </View>
                <Text style={styles.cardTitle}>Additifs et allergènes</Text>
                <Text style={styles.cardText}>
                  Les additifs (colorants mis en avant) et les 14 allergènes, avec un filtre « sans allergène ».
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Appel à l'action */}
        <View style={styles.section}>
          <View style={styles.inner}>
            <View style={styles.cta}>
              <Text style={styles.ctaTitle}>Prêt à remplir un panier plus sain ?</Text>
              <Pressable
                onPress={() => onSearch('')}
                style={({ pressed }) => [styles.ctaButton, pressed && { opacity: 0.85 }]}
                accessibilityRole="button"
              >
                <Text style={styles.ctaButtonText}>Commencer une recherche</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.inner, styles.footerRow]}>
            <Logo size={20} />
            <Text style={styles.footerText}>
              Projet tutoré · Données Open Food Facts, base alimentaire collaborative et libre
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { width: '100%', maxWidth: 1040, alignSelf: 'center', paddingHorizontal: spacing.lg },

  nav: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.md },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navButton: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: 6 },
  navButtonText: { color: colors.primary, fontWeight: '700' },

  hero: { backgroundColor: colors.primaryLight, paddingVertical: 40 },
  heroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 32, alignItems: 'center' },
  heroLeft: { flexGrow: 1, flexBasis: 320, maxWidth: MAX_WIDTH, gap: spacing.md },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  heroTitle: { fontSize: 38, lineHeight: 44, fontWeight: '800', color: colors.text, letterSpacing: -1 },
  highlight: { color: colors.primary },
  heroText: { fontSize: 16, lineHeight: 24, color: colors.textMuted, marginBottom: spacing.xs },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  suggestion: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: 5 },
  suggestionText: { color: colors.primary, fontWeight: '600', fontSize: 13 },

  exampleCard: {
    flexGrow: 1,
    flexBasis: 280,
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow,
  },
  exampleTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exampleText: { flex: 1, gap: 2 },
  exampleName: { fontSize: 15, fontWeight: '700', color: colors.text },
  exampleDetail: { fontSize: 12, color: colors.textMuted },
  exampleBadges: { alignItems: 'flex-end', gap: 6 },

  section: { paddingTop: 40 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: spacing.lg, letterSpacing: -0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  step: { flexGrow: 1, flexBasis: 220, gap: spacing.sm, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surface, ...shadow },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: '#fff', fontWeight: '800' },
  card: {
    flexGrow: 1,
    flexBasis: 220,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: 'flex-start',
    ...shadow,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  cardText: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
  tag: { backgroundColor: '#FDECEA', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { color: colors.danger, fontSize: 12, fontWeight: '700' },

  cta: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    paddingVertical: 32,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.lg,
  },
  ctaTitle: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  ctaButton: { backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: spacing.xl, paddingVertical: 12 },
  ctaButtonText: { color: colors.primaryDark, fontWeight: '800', fontSize: 16 },

  footer: { marginTop: 40, paddingVertical: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  footerRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  footerText: { fontSize: 12, color: colors.textMuted },
});
