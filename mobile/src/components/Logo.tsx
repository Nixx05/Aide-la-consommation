// Logo NutriChoix : une feuille dans un carré vert + le nom.
// La feuille est un carré avec deux coins arrondis, tourné de 45°.

import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../style/theme';

export function Logo({ size = 32 }: { size?: number }) {
  const leaf = size / 2;

  return (
    <View style={styles.row}>
      <View style={[styles.square, { width: size, height: size, borderRadius: size * 0.3 }]}>
        <View
          style={[
            styles.leaf,
            { width: leaf, height: leaf, borderTopLeftRadius: leaf, borderBottomRightRadius: leaf },
          ]}
        />
      </View>
      <Text style={[styles.name, { fontSize: size * 0.7 }]}>
        Nutri<Text style={{ color: colors.primary }}>Choix</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  square: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  leaf: { backgroundColor: '#fff', transform: [{ rotate: '45deg' }] },
  name: { fontWeight: '800', color: colors.text },
});
