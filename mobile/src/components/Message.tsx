// Message affiché au milieu de l'écran (pas de résultat, erreur...), avec un bouton optionnel.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../style/theme';

type Props = {
  emoji: string;
  title: string;
  text?: string;
  buttonText?: string;
  onPress?: () => void;
};

export function Message({ emoji, title, text, buttonText, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {text && <Text style={styles.text}>{text}</Text>}
      {buttonText && (
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 48, gap: 8 },
  emoji: { fontSize: 44 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'center' },
  text: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  button: { marginTop: 8, backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
