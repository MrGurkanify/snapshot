/**
 * 📁 File : ProductsDisplayAll.js
 * 🛤️  Path  : ~/developpement /snapshot/components/products/ProductsDisplayAll.js
 * 📅 Created at : 2025-04-11
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

/**
 * 📁 File : ProductsDisplayAll.js
 * 🛤️  Path  : ~/developpement/snapshot/components/products/ProductsDisplayAll.js
 * 📅 Created at : 2025-04-11
 * 👤 Author  : William Balikel
 * ✍️  Description : Affiche tous les produits créés par l’utilisateur
 */

import { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ProductCard from './ProductCard';
import { API_BASE_URL } from '../../lib/api';

export default function ProductsDisplayAll({ user, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/all`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.warn('⚠️ Erreur backend :', errorText);
          return;
        }

        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error('❌ Erreur chargement produits :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const filtered = products.filter((p) =>
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View className="mt-10">
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  if (filtered.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500 text-xl">No products found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/product-edit?productId=${item._id}&supplierId=${item.supplier}`)}
        >
          <ProductCard product={item} />
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingBottom: 100 }}
      className="px-4"
    />
  );
}
