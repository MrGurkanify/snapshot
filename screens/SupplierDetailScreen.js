/**
 * 📁 File : SupplierDetailScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/SupplierDetailScreen.js
 * 📅 Created at : 2025-04-08
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */
import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import HeaderBar from '../components/products/HeaderBar';
import ProductsDisplay from '../components/products/ProductsDisplay';
import AddButton from '../components/home/AddButton';


import { API_BASE_URL } from '../lib/api';
import { userSession } from '../lib/userSession';
import {useRouter} from 'expo-router';



export default function SupplierDetailScreen() {
  const { supplierId, supplierName } = useLocalSearchParams();
  const [productCount, setProductCount] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProductCount = async () => {
      const session = await userSession();
      if (!session.valid) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/products/count?supplierId=${supplierId}`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        const data = await res.json();
        setProductCount(data.count ?? 0);
      } catch (err) {
        console.error('❌ Erreur fetch product count dans SupplierDetailScreen:', err);
      }
    };

    fetchProductCount();
  }, [supplierId]);

  return (
    <View className="flex-1 bg-white">
      <HeaderBar 
        title={supplierName} 
        onModify={() => router.push(`/edit-supplier?supplierId=${supplierId}`)}

      />

      {/* ✅ Tag KPI */}
      {productCount !== null && (
        <View className="bg-yellow-200 self-start px-3 py-1 ml-4 mt-1 mb-7 rounded-full">
          <Text className="text-blue-700 font-medium">Products: {productCount}</Text>
        </View>
      )}

      <ProductsDisplay supplierId={supplierId} />

      <AddButton 
              route={`add-product?supplierId=${supplierId}`}
              label="Add product"
      />

    </View>
  );
}
