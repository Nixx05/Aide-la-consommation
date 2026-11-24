import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
};

export function SearchBar({ value, onChangeText, onSubmit, autoFocus }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.container}>
        <Text style={styles.icon} accessibilityElementsHidden importantForAccessibility="no">
          ⌕
        </Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder="Nutella, yaourt nature, 3017620422003…"
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          autoFocus={autoFocus}
          accessibilityLabel="Rechercher un produit"
        />
        {value.length > 0 && (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Effacer la recherche"
            style={styles.clear}
          >
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>
      <Pressable
        onPress={onSubmit}
        style={({ pressed }) => [styles.button, pressed && { backgroundColor: colors.primaryDark }]}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Rechercher</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  icon: { fontSize: 22, color: colors.textMuted, marginRight: spacing.sm },
  input: { flex: 1, fontSize: 16, color: colors.text, height: '100%', minWidth: 0 },
  clear: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: { fontSize: 11, color: colors.textMuted, fontWeight: '700' },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    height: 48,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
