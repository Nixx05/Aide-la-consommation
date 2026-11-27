// Les badges Nutri-Score (A à E) et NOVA (1 à 4).

import { StyleSheet, Text, View } from 'react-native';
import { colors, novaColors, nutriScoreColors } from '../style/theme';
import { Nova, NutriScore } from '../model/Product';

const LETTERS: NutriScore[] = ['a', 'b', 'c', 'd', 'e'];

// Les 5 lettres, celle du produit est plus grande et les autres sont pâles
export function NutriScoreBadge({ score, big = false }: { score: NutriScore | null; big?: boolean }) {
  if (score === null) {
    return <Text style={styles.unknown}>Nutri-Score ?</Text>;
  }

  const size = big ? 30 : 18;

  return (
    <View style={styles.row}>
      {LETTERS.map((letter) => {
        const isActive = letter === score;
        return (
          <View
            key={letter}
            style={[
              styles.letterBox,
              {
                backgroundColor: nutriScoreColors[letter],
                width: isActive ? size * 1.35 : size,
                height: isActive ? size * 1.35 : size,
                opacity: isActive ? 1 : 0.35,
              },
            ]}
          >
            <Text style={[styles.letter, { fontSize: size * 0.6 }]}>{letter.toUpperCase()}</Text>
          </View>
        );
      })}
    </View>
  );
}

const NOVA_TEXT = {
  1: 'Non transformé',
  2: 'Ingrédient culinaire',
  3: 'Transformé',
  4: 'Ultra-transformé',
};

export function NovaBadge({ nova }: { nova: Nova | null }) {
  const color = nova ? novaColors[nova] : colors.textMuted;
  return (
    <View style={[styles.nova, { borderColor: color }]}>
      <Text style={[styles.novaText, { color: color }]}>NOVA {nova || '?'}</Text>
    </View>
  );
}

export function novaText(nova: Nova | null): string {
  return nova ? NOVA_TEXT[nova] : 'Transformation inconnue';
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  letterBox: { alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  letter: { color: '#fff', fontWeight: '800' },
  unknown: {
    fontSize: 11,
    color: colors.textMuted,
    backgroundColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  nova: { borderWidth: 1.5, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1, alignSelf: 'flex-start' },
  novaText: { fontSize: 11, fontWeight: '800' },
});
