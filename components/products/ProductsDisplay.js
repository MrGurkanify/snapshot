/**
 * 📁 File : ProductsDisplay.js
 * 🛤️  Path  : ~/developpement /snapshot/components/products/ProductsDisplay.js
 * 📅 Created at : 2025-04-09
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

import { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import ProductCard from './ProductCard';
import { API_BASE_URL } from '../../lib/api';
import { userSession } from '../../lib/userSession';

export default function ProductsDisplay({ supplierId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const session = await userSession();
      if (!session.valid) {
        console.warn('❌ Pas de session valide');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/products?supplierId=${supplierId}`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          }
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.warn('⚠️ Backend a renvoyé une erreur :', res.status, errorText);
          return;
        }

        const data = await res.json();
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
      renderItem={({ item }) => (
        <ProductCard product={item} />
      )}
      contentContainerStyle={{ paddingBottom: 100 }}
      className="px-4"
    />
  );
}
