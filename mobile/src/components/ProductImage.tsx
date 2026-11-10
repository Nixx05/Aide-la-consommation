import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import type { Product } from '../types/product';

/** Image du produit, ou vignette avec l'initiale tant qu'aucune image n'est disponible. */
export function ProductImage({ product, size }: { product: Product; size: number }) {
  if (product.imageUrl) {
    return (
      <Image
        source={{ uri: product.imageUrl }}
        style={{ width: size, height: size, borderRadius: 10 }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    );
  }
  return (
    <View style={[styles.placeholder, { width: size, height: size }]}>
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>
        {product.brand.charAt(0).toUpperCase() || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: colors.primary, fontWeight: '800' },
});
