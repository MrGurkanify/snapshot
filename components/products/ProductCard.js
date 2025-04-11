/**
 * 📁 File : ProductCard.js
 * 🛤️  Path  : ~/developpement /snapshot/components/products/ProductCard.js
 * 📅 Created at : 2025-04-09
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';



export default function ProductCard({ product }) {
  const router = useRouter();

  return (

    <TouchableOpacity
      className="flex-row bg-white border border-gray-200 rounded-2xl mb-4 p-3 items-center"
      onPress={() => {
          if (product._id && product.supplier) {
            router.push(`/product-edit?productId=${product._id}&supplierId=${product.supplier}`);
          } else {
            console.warn('❌ Produit incomplet :', product);
          }
      }}
    >
      <Image
        source={{ uri: product.images[0] }}
        className="w-20 h-20 rounded-xl mr-4"
      />
      <View className="flex-1">
        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
            {product.productName || 'Nom produit'}
          </Text>
          <Text className="text-base font-semibold text-gray-800">
            {product.price ? `${product.price} €` : 'Prix non défini'}
          </Text>
        </View>
        <Text className="text-sm text-gray-500 mr-4" numberOfLines={2}>
          {product.description || 'Aucune description'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
