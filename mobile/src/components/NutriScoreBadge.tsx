import { StyleSheet, Text, View } from 'react-native';
import { colors, nutriScoreColors } from '../theme';
import type { NutriScore } from '../types/product';

type Props = { score: NutriScore | null; size?: 'small' | 'large' };

const LETTERS: NutriScore[] = ['a', 'b', 'c', 'd', 'e'];

/** Reproduction simplifiée du logo Nutri-Score (la lettre du produit est agrandie). */
export function NutriScoreBadge({ score, size = 'small' }: Props) {
  const large = size === 'large';
  const cell = large ? 30 : 18;

  if (!score) {
    return (
      <View style={[styles.unknown, { height: cell }]} accessibilityLabel="Nutri-Score inconnu">
        <Text style={styles.unknownText}>Nutri-Score ?</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`Nutri-Score ${score.toUpperCase()}`}
    >
      {LETTERS.map((letter) => {
        const active = letter === score;
        return (
          <View
            key={letter}
            style={[
              styles.cell,
              {
                width: active ? cell * 1.35 : cell,
                height: active ? cell * 1.35 : cell,
                backgroundColor: nutriScoreColors[letter],
                opacity: active ? 1 : 0.35,
                borderRadius: active ? cell * 0.4 : 3,
                zIndex: active ? 1 : 0,
              },
            ]}
          >
            <Text style={[styles.letter, { fontSize: active ? cell * 0.8 : cell * 0.55 }]}>
              {letter.toUpperCase()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { alignItems: 'center', justifyContent: 'center', marginHorizontal: -1 },
  letter: { color: '#fff', fontWeight: '800' },
  unknown: {
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    justifyContent: 'center',
  },
  unknownText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
});
