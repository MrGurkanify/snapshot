/**
 * 📁 File : HeaderBar.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/HeaderBar.js
 * 📅 Created at : 2025-04-05
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



import { View, Text, ActivityIndicator } from 'react-native';




export default function HeaderBar({ supplierCount, productCount, isOnline, syncing }) {
  



  return (
    <View className="flex-row items-center justify-center h-10 mb-16 ">
      

      {/* tags balises */}
      <View className="flex-row justify-between space-x-8 gap-6 ">
            <View className="">
              <Text className={`font-bold text-xl ${isOnline ? 'bg-green-300 px-2 py-1 rounded-full text-yellow-700' : ' bg-orange-500 text-yellow-400 rounded-full px-2 py-1'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
              {syncing && <ActivityIndicator size="small" color="#15803d" />}
            </View>

            <View className="bg-blue-100 px-2 py-1 rounded-full">
              <Text className="text-blue-700 font-medium text-xl">Suppliers: {supplierCount}</Text>
            </View>

            <View className="bg-yellow-200 px-2 py-1 rounded-full">
              <Text className="text-blue-700 font-medium text-xl">Products: {productCount}</Text>
            </View>
      </View>
    </View>
  );
}
