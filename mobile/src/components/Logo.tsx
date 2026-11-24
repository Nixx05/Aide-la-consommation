import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  size?: number;
  /** Texte en blanc, pour un fond vert */
  light?: boolean;
};

/**
 * Logo NutriChoix : une feuille dans un carré vert + le nom.
 * La feuille est un simple carré avec deux coins arrondis, tourné de 45°.
 */
export function Logo({ size = 32, light = false }: Props) {
  const leaf = size * 0.5;
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="NutriChoix">
      <View
        style={[
          styles.mark,
          { width: size, height: size, borderRadius: size * 0.3 },
          light && { backgroundColor: '#fff' },
        ]}
      >
        <View
          style={[
            styles.leaf,
            {
              width: leaf,
              height: leaf,
              borderTopLeftRadius: leaf,
              borderBottomRightRadius: leaf,
              backgroundColor: light ? colors.primary : '#fff',
            },
          ]}
        />
      </View>
      <Text style={[styles.name, { fontSize: size * 0.7 }]}>
        <Text style={{ color: light ? '#fff' : colors.text }}>Nutri</Text>
        <Text style={{ color: light ? colors.primaryLight : colors.primary }}>Choix</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  leaf: { transform: [{ rotate: '45deg' }] },
  name: { fontWeight: '800', letterSpacing: -0.5 },
});
