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
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSearch} // touche Entrée
        placeholder="Entrez le nom d'un produit"
        placeholderTextColor={colors.grey}
      />
      <Pressable style={styles.button} onPress={onSearch}>
        <Text style={styles.buttonText}>Rechercher</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    minWidth: 0,
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: { backgroundColor: colors.green, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold' },
});
