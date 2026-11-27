// Page d'accueil (équivalent de homePage.html dans le projet web).

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../components/SearchBar';
import { colors } from '../style/theme';

const IDEAS = ['Yaourt nature', 'Céréales', 'Biscuits', 'Cola', 'Pâte à tartiner'];

type Props = {
  goToSearch: (text: string) => void;
};

export function HomeScreen({ goToSearch }: Props) {
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>🥗 NutriChoix</Text>

        {/* Bloc vert : titre + recherche */}
        <View style={styles.hero}>
          <Text style={styles.title}>Mangez mieux, sans vous prendre la tête.</Text>
          <Text style={styles.text}>
            Cherchez un produit du supermarché et voyez en un coup d'œil s'il est bon pour vous.
          </Text>
          <SearchBar value={text} onChange={setText} onSearch={() => goToSearch(text)} />

          <View style={styles.row}>
            {IDEAS.map((idea) => (
              <Pressable key={idea} style={styles.idea} onPress={() => goToSearch(idea)}>
                <Text style={styles.ideaText}>{idea}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Ce qu'on trouve dans l'application */}
        <Text style={styles.subtitle}>Ce que vous trouverez sur chaque produit</Text>
        <View style={styles.row}>
          <Card title="Nutri-Score" text="La note de A à E sur la qualité nutritionnelle." />
          <Card title="NOVA" text="Le niveau de transformation, de 1 (brut) à 4 (ultra-transformé)." />
          <Card title="Additifs et allergènes" text="Les additifs (colorants en rouge) et les 14 allergènes." />
        </View>

        <Pressable style={styles.button} onPress={() => goToSearch('')}>
          <Text style={styles.buttonText}>Faire une recherche</Text>
        </Pressable>

        <Text style={styles.footer}>Projet tutoré · Données Open Food Facts</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Une carte blanche avec un titre et un texte
function Card({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.grey}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 20, width: '100%', maxWidth: 900, alignSelf: 'center' },
  logo: { fontSize: 26, fontWeight: 'bold', color: colors.green },
  hero: { backgroundColor: colors.lightGreen, borderRadius: 20, padding: 24, gap: 12 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.darkGreen },
  text: { fontSize: 16, color: colors.text },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  idea: { backgroundColor: colors.white, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  ideaText: { color: colors.green, fontWeight: 'bold' },
  subtitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  card: { flexGrow: 1, flexBasis: 220, backgroundColor: colors.white, borderRadius: 12, padding: 16, gap: 6 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  grey: { color: colors.grey },
  button: { backgroundColor: colors.green, borderRadius: 12, padding: 14, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  footer: { textAlign: 'center', color: colors.grey, fontSize: 12 },
});
