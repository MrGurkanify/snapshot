/**
 * 📁 File : ProductCard.js
 * 🛤️  Path  : ~/developpement /snapshot/components/products/ProductCard.js
 * 📅 Created at : 2025-04-09
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ArrowRightIcon } from 'react-native-heroicons/outline';

export default function ProductCard({ product }) {
  return (
    <TouchableOpacity className="flex-row bg-white border border-gray-200 rounded-2xl mb-4 p-3 items-center">
      <Image
        source={{ uri: product.images[0] }}
        className="w-20 h-20 rounded-xl mr-4"
      />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
          {product.productName || 'Nom produit'}
        </Text>
        <Text className="text-sm text-gray-500" numberOfLines={2}>
          {product.description || 'Aucune description'}
        </Text>
      </View>
      <ArrowRightIcon size={22} color="gray" />
    </TouchableOpacity>
  );
}
