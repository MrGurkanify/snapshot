/**
 * 📁 File : SupplierDetailScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/SupplierDetailScreen.js
 * 📅 Created at : 2025-04-08
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import HeaderBar from '../components/products/HeaderBar';
import ProductsDisplay from '../components/products/ProductsDisplay';

export default function SupplierDetailScreen({ route }) {
//   const { supplierId, supplierName } = route.params;
const { supplierId, supplierName } = useLocalSearchParams();

  return (
    <View className="flex-1  bg-white">
      <HeaderBar title={supplierName} 
                 onModify={() => console.log('✏️ Modifier fournisseur: ', supplierId)} />
      <ProductsDisplay supplierId={supplierId} />
    </View>
  );
}
