/**
 * 📁 File : SuppliersScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/SuppliersScreen.js
 * 📅 Created at : 2025-03-28
 * 👤 Author  : William Balikel
 * ✍️  Description : SuppliersScreen pour afficher la liste des fournisseurs scrollable horizontalement
 * 
 */


import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { mockSuppliers , mockProducts } from '../data/mockData';

export default function SupplierScreen() {
    const [selectedSupplier, setSelectedSupplier] = useState(mockSuppliers[0]);
  
    return (
      <View className="flex-1 bg-white">
        {/* SupplierHeader scroll horizontal */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-10 px-4">
          {mockSuppliers.map((supplier) => (
            <TouchableOpacity
              key={supplier.id}
              onPress={() => setSelectedSupplier(supplier)}
              className={`mr-4 px-4 py-2 rounded-full border ${selectedSupplier.id === supplier.id ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}
            >
              <Text className={`${selectedSupplier.id === supplier.id ? 'text-white' : 'text-gray-700'} font-semibold`}>
                {supplier.name} ({supplier.products})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
  
        {/* Product List vertical scroll */}
        <FlatList
          data={mockProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity className="flex-row items-center bg-black/5 p-4 rounded-xl mb-4">
              <Image source={item.image} className="w-16 h-16 rounded-lg mr-4" />
              <Text className="text-lg font-semibold">{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
  

