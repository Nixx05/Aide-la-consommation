// Panneau des filtres : Nutri-Score minimum + allergènes à exclure.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, nutriScoreColors } from '../style/theme';
import { NutriScore } from '../model/Product';
import { ALLERGENS } from '../controller/ProductController';

type Props = {
  nutriScore: NutriScore | null;
  setNutriScore: (score: NutriScore | null) => void;
  allergens: string[];
  setAllergens: (allergens: string[]) => void;
};

const SCORES: NutriScore[] = ['a', 'b', 'c', 'd', 'e'];

export function FilterPanel({ nutriScore, setNutriScore, allergens, setAllergens }: Props) {
  // Coche ou décoche un allergène
  function toggleAllergen(allergen: string) {
    if (allergens.includes(allergen)) {
      setAllergens(allergens.filter((a) => a !== allergen));
    } else {
      setAllergens([...allergens, allergen]);
    }
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Nutri-Score minimum</Text>
      <View style={styles.row}>
        <Chip text="Tous" active={nutriScore === null} onPress={() => setNutriScore(null)} />
        {SCORES.map((score) => (
          <Chip
            key={score}
            text={score.toUpperCase()}
            color={nutriScoreColors[score]}
            active={nutriScore === score}
            onPress={() => setNutriScore(score)}
          />
        ))}
      </View>

      <Text style={styles.title}>Sans allergène</Text>
      <View style={styles.row}>
        {Object.values(ALLERGENS).map((allergen) => (
          <Chip
            key={allergen}
            text={allergen}
            active={allergens.includes(allergen)}
            onPress={() => toggleAllergen(allergen)}
          />
        ))}
      </View>
    </View>
  );
}

// Un bouton arrondi qui devient coloré quand il est sélectionné
function Chip({ text, active, color = colors.primary, onPress }: { text: string; active: boolean; color?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}>
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, gap: 8, marginTop: 12 },
  title: { fontSize: 13, fontWeight: '700', color: colors.text },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.background },
  chipText: { fontSize: 13, color: colors.text, fontWeight: '600' },
});
