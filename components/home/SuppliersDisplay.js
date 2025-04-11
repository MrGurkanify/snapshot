/**
 * 📁 File : SuppliersDisplay.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/SuppliersDisplay.js
 * 📅 Created at : 2025-04-04
 * 👤 Author  : William Balikel
 * ✍️  Description : Component that displays suppliers (filtered by query)
 */

import { Text, FlatList, View } from 'react-native';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../lib/api';
import SupplierCard from './SupplierCard';

export default function SuppliersDisplay({ user, searchQuery }) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/suppliers?userId=${user.userId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        setSuppliers(data.suppliers);
        console.log('📦 Suppliers data received:', data);
      } catch (error) {
        console.error('Fetch suppliers error:', error);
      }
    };

    fetchSuppliers();
  }, [user]);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const query = searchQuery.toLowerCase();
    return (
      supplier.supplierName.toLowerCase().includes(query) ||
      supplier.contactName?.toLowerCase().includes(query) ||
      supplier.supplierEmail?.toLowerCase().includes(query)
    );
  });

  const shouldShowMessage = suppliers.length === 0 || filteredSuppliers.length === 0;

  return (
    <View className="mb-6 h-[300px]">
      <FlatList
        data={filteredSuppliers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <SupplierCard supplier={item} user={user} />}
        showsVerticalScrollIndicator={false}
      />

      {shouldShowMessage && (
        <Text className="text-center text-gray-400 mt-4">
          No suppliers found
        </Text>
      )}
    </View>
  );
}
