// Fiche détaillée d'un produit, qui s'ouvre par-dessus la liste quand on clique sur une carte.

import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { isColorant } from '../controller/ProductController';
import { Product } from '../model/Product';
import { colors } from '../style/theme';
import { NutriScore, show } from './ProductCard';

type Props = {
  product: Product | null; // null = fiche fermée
  onClose: () => void;
};

export function ProductDetail({ product, onClose }: Props) {
  if (product === null) return null;

  return (
    <Modal animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        <Pressable onPress={onClose}>
          <Text style={styles.close}>‹ Retour</Text>
        </Pressable>

        {product.image && <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />}
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.grey}>
          {product.brand} {product.quantity}
        </Text>

        <View style={styles.row}>
          <NutriScore score={product.nutriScore} />
          <Text style={styles.text}>NOVA {product.nova ?? '?'}</Text>
        </View>

        <Text style={styles.title}>Valeurs pour 100 g</Text>
        <Line label="Énergie" value={show(product.energy, 'kcal')} />
        <Line label="Matières grasses" value={show(product.fat)} />
        <Line label="dont acides gras saturés" value={show(product.saturatedFat)} />
        <Line label="Sucres" value={show(product.sugars)} />
        <Line label="Sel" value={show(product.salt)} />
        <Line label="Fibres" value={show(product.fiber)} />
        <Line label="Protéines" value={show(product.proteins)} />

        <Text style={styles.title}>Additifs</Text>
        {product.additives.length === 0 && <Text style={styles.text}>Aucun additif</Text>}
        {product.additives.map((additive) => (
          <Text key={additive} style={isColorant(additive) ? styles.red : styles.text}>
            {additive} {isColorant(additive) ? '(colorant)' : ''}
          </Text>
        ))}

        <Text style={styles.title}>Allergènes</Text>
        <Text style={styles.text}>
          {product.allergens.length === 0 ? 'Aucun allergène déclaré' : product.allergens.join(', ')}
        </Text>

        <Text style={styles.grey}>Code-barres : {product.code}</Text>
      </ScrollView>
    </Modal>
  );
}

// Une ligne du tableau des valeurs nutritionnelles
function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text style={styles.text}>{label}</Text>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 48, gap: 8, width: '100%', maxWidth: 700, alignSelf: 'center' },
  close: { color: colors.green, fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  image: { width: 120, height: 120 },
  name: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  title: { fontSize: 17, fontWeight: 'bold', color: colors.text, marginTop: 16 },
  text: { fontSize: 15, color: colors.text },
  grey: { fontSize: 14, color: colors.grey },
  red: { fontSize: 15, color: colors.red, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
});
