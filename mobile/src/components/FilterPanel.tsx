import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, nutriScoreColors, radius, spacing } from '../theme';
import type { NutriScore } from '../types/product';
import { ALLERGENS, type Filters } from '../utils/filters';

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const SCORES: NutriScore[] = ['a', 'b', 'c', 'd', 'e'];

export function FilterPanel({ filters, onChange }: Props) {
  const toggleAllergen = (allergen: string) => {
    const excluded = filters.excludedAllergens.includes(allergen)
      ? filters.excludedAllergens.filter((a) => a !== allergen)
      : [...filters.excludedAllergens, allergen];
    onChange({ ...filters, excludedAllergens: excluded });
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Nutri-Score minimum</Text>
      <View style={styles.row}>
        <Chip label="Tous" active={filters.maxNutriScore === null} onPress={() => onChange({ ...filters, maxNutriScore: null })} />
        {SCORES.map((score) => (
          <Chip
            key={score}
            label={score.toUpperCase()}
            color={nutriScoreColors[score]}
            active={filters.maxNutriScore === score}
            onPress={() => onChange({ ...filters, maxNutriScore: score })}
          />
        ))}
      </View>

      <Text style={styles.title}>Sans allergène</Text>
      <View style={styles.row}>
        {Object.values(ALLERGENS).map((allergen) => (
          <Chip
            key={allergen}
            label={allergen}
            active={filters.excludedAllergens.includes(allergen)}
            onPress={() => toggleAllergen(allergen)}
          />
        ))}
      </View>
    </View>
  );
}

function Chip({ label, active, color, onPress }: { label: string; active: boolean; color?: string; onPress: () => void }) {
  const activeColor = color ?? colors.primary;
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: activeColor, borderColor: activeColor }]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: { fontSize: 13, fontWeight: '700', color: colors.text },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.xs },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.background,
  },
  chipText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
});
