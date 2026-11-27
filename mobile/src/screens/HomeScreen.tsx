// Page d'accueil (équivalent de homePage.html) : présentation de l'application + recherche rapide.

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NovaBadge, NutriScoreBadge } from '../components/Badges';
import { Logo } from '../components/Logo';
import { SearchBar } from '../components/SearchBar';
import { colors, shadow } from '../style/theme';

const SUGGESTIONS = ['Yaourt nature', 'Céréales', 'Biscuits', 'Cola', 'Pâte à tartiner'];

type Props = {
  goToSearch: (text: string) => void;
};

export function HomeScreen({ goToSearch }: Props) {
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        {/* Barre du haut */}
        <View style={styles.nav}>
          <View style={[styles.center, styles.navRow]}>
            <Logo size={30} />
            <Pressable onPress={() => goToSearch('')} style={styles.navButton}>
              <Text style={styles.navButtonText}>Rechercher</Text>
            </Pressable>
          </View>
        </View>

        {/* Bloc principal : titre, recherche et exemple */}
        <View style={styles.hero}>
          <View style={[styles.center, styles.heroRow]}>
            <View style={styles.heroLeft}>
              <Text style={styles.badge}>Gratuit · données Open Food Facts</Text>
              <Text style={styles.heroTitle}>
                Mangez <Text style={{ color: colors.primary }}>mieux</Text>,{'\n'}sans vous prendre la tête.
              </Text>
              <Text style={styles.heroText}>
                NutriChoix vous dit en un coup d'œil si un produit du supermarché est bon pour vous,
                et vous aide à trouver une meilleure alternative.
              </Text>
              <SearchBar value={text} onChange={setText} onSearch={() => goToSearch(text)} />
              <View style={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <Pressable key={s} style={styles.suggestion} onPress={() => goToSearch(s)}>
                    <Text style={styles.suggestionText}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Exemple (pas de vrais produits) */}
            <View style={styles.example}>
              <Text style={styles.exampleTitle}>EXEMPLE DE COMPARAISON</Text>
              <ExampleRow name="Yaourt nature" detail="Sucres 4,5 g · sans additif" score="a" nova={1} />
              <ExampleRow name="Céréales au chocolat" detail="Sucres 28 g · 2 additifs" score="d" nova={4} />
              <ExampleRow name="Soda" detail="Sucres 10,6 g · 1 colorant" score="e" nova={4} />
            </View>
          </View>
        </View>

        {/* Comment ça marche */}
        <View style={styles.center}>
          <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
          <View style={styles.grid}>
            <Card title="1. Cherchez" text="Tapez un nom de produit, une marque ou son code-barres." />
            <Card title="2. Comparez" text="Nutri-Score, transformation, sucres, gras, additifs : tout est sur la même carte." />
            <Card title="3. Choisissez" text="Filtrez les meilleurs produits ou ceux sans vos allergènes." />
          </View>

          {/* Ce qu'on affiche */}
          <Text style={styles.sectionTitle}>Ce que vous trouverez sur chaque produit</Text>
          <View style={styles.grid}>
            <Card title="Nutri-Score" text="La note de A à E sur la qualité nutritionnelle.">
              <NutriScoreBadge score="b" />
            </Card>
            <Card title="Transformation" text="Le groupe NOVA : de 1 (brut) à 4 (ultra-transformé).">
              <NovaBadge nova={4} />
            </Card>
            <Card title="Additifs et allergènes" text="Les additifs (colorants en rouge) et les 14 allergènes.">
              <Text style={styles.redTag}>E150d</Text>
            </Card>
          </View>

          {/* Bandeau final */}
          <View style={styles.cta}>
            <Text style={styles.ctaTitle}>Prêt à remplir un panier plus sain ?</Text>
            <Pressable onPress={() => goToSearch('')} style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Commencer une recherche</Text>
            </Pressable>
          </View>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <View style={[styles.center, styles.footerRow]}>
            <Logo size={20} />
            <Text style={styles.footerText}>Projet tutoré · Données Open Food Facts, base alimentaire libre</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Une ligne de l'exemple de comparaison
function ExampleRow({ name, detail, score, nova }: { name: string; detail: string; score: 'a' | 'd' | 'e'; nova: 1 | 4 }) {
  return (
    <View style={styles.exampleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.exampleName}>{name}</Text>
        <Text style={styles.muted}>{detail}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <NutriScoreBadge score={score} />
        <NovaBadge nova={nova} />
      </View>
    </View>
  );
}

// Une carte blanche avec un titre et un texte (et un badge au-dessus si on en donne un)
function Card({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <View style={styles.card}>
      {children}
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.muted}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { width: '100%', maxWidth: 1040, alignSelf: 'center', paddingHorizontal: 16 },

  nav: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 12 },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navButton: { borderWidth: 1, borderColor: colors.primary, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  navButtonText: { color: colors.primary, fontWeight: '700' },

  hero: { backgroundColor: colors.primaryLight, paddingVertical: 40 },
  heroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 32, alignItems: 'center' },
  heroLeft: { flexGrow: 1, flexBasis: 320, maxWidth: 760, gap: 12 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  heroTitle: { fontSize: 38, lineHeight: 44, fontWeight: '800', color: colors.text },
  heroText: { fontSize: 16, lineHeight: 24, color: colors.textMuted },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestion: { backgroundColor: colors.white, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  suggestionText: { color: colors.primary, fontWeight: '600', fontSize: 13 },

  example: { flexGrow: 1, flexBasis: 280, maxWidth: 420, backgroundColor: colors.white, borderRadius: 20, padding: 16, gap: 12, ...shadow },
  exampleTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  exampleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  exampleName: { fontSize: 15, fontWeight: '700', color: colors.text },

  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 40, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { flexGrow: 1, flexBasis: 220, backgroundColor: colors.white, borderRadius: 12, padding: 16, gap: 8, alignItems: 'flex-start', ...shadow },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  muted: { fontSize: 13, lineHeight: 19, color: colors.textMuted },
  redTag: { backgroundColor: colors.redLight, color: colors.red, fontSize: 12, fontWeight: '700', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },

  cta: { backgroundColor: colors.primaryDark, borderRadius: 20, padding: 32, alignItems: 'center', gap: 16, marginTop: 40 },
  ctaTitle: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  ctaButton: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  ctaButtonText: { color: colors.primaryDark, fontWeight: '800', fontSize: 16 },

  footer: { marginTop: 40, paddingVertical: 24, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  footerRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  footerText: { fontSize: 12, color: colors.textMuted },
});
