/**
 * 📁 File : ProductsDisplay.js
 * 🛤️  Path  : ~/developpement /snapshot/components/products/ProductsDisplay.js
 * 📅 Created at : 2025-04-09
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */


import { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// custom imports
import ProductCard from './ProductCard';
import { API_BASE_URL } from '../../lib/api';

export default function ProductsDisplay({ supplierId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 supplierId:', supplierId);
    const fetchProducts = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const res = await fetch(`${API_BASE_URL}/api/products/count?supplierId=${supplierId}` , {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          }
                        });

        if (!res.ok) {
            const errorText = await res.text();
            console.warn('⚠️ Backend a renvoyé une erreur :', res.status, errorText);
            return;
          }
        const data = await res.json();
        console.log('📦 Données produits reçues :', data);
        setProducts(data.products);
      } catch (err) {
        console.error('Erreur chargement produits :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supplierId]);

  if (loading) {
    return (
      <View className="mt-10">
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }
// c'est la view fallback si on n'a pas de produits pour le supplier 
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <View className="flex-1 items-center justify-center ">
        <Text className="text-gray-500 text-2xl">No Products Found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={{ paddingBottom: 100 }}
      className="px-4"
    />
  );
}
