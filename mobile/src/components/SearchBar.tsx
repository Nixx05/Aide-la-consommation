// Barre de recherche : champ de texte + bouton "Rechercher".
// Utilisée sur la page d'accueil et sur la page de recherche.

import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../style/theme';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSearch: () => void;
};

export function SearchBar({ value, onChange, onSearch }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <Text style={styles.icon}>⌕</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSearch} // touche Entrée
          placeholder="Nutella, yaourt nature, 3017620422003…"
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoCorrect={false}
        />
        {value !== '' && (
          <Pressable onPress={() => onChange('')} style={styles.clear}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      <Pressable onPress={onSearch} style={({ pressed }) => [styles.button, pressed && { backgroundColor: colors.primaryDark }]}>
        <Text style={styles.buttonText}>Rechercher</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: { fontSize: 22, color: colors.textMuted, marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: colors.text, height: '100%', minWidth: 0 },
  clear: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  clearText: { fontSize: 11, color: colors.textMuted, fontWeight: '700' },
  button: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center', height: 48 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
