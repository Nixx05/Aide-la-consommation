import { StyleSheet, Text, View } from 'react-native';
import { colors, novaColors } from '../theme';
import type { NovaGroup } from '../types/product';

export const NOVA_LABELS: Record<NovaGroup, string> = {
  1: 'Non transformé',
  2: 'Ingrédient culinaire',
  3: 'Transformé',
  4: 'Ultra-transformé',
};

export function NovaBadge({ nova }: { nova: NovaGroup | null }) {
  const color = nova ? novaColors[nova] : colors.textMuted;
  return (
    <View
      style={[styles.badge, { borderColor: color }]}
      accessibilityLabel={nova ? `NOVA ${nova}, ${NOVA_LABELS[nova]}` : 'NOVA inconnu'}
    >
      <Text style={[styles.text, { color }]}>NOVA {nova ?? '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderWidth: 1.5, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  text: { fontSize: 11, fontWeight: '800' },
});
