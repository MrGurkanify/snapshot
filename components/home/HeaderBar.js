/**
 * 📁 File : HeaderBar.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/HeaderBar.js
 * 📅 Created at : 2025-04-05
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */




import { View, Text, Image , ActivityIndicator } from 'react-native'



export default function HeaderBar({ supplierCount, productCount , user , isOnline , syncing}) {
  
  return (
    <View className="flex-row items-center justify-between h-10 mb-16 " >
          {/* Avatar balise */}
          <Image className="w-20 h-20 rounded-full border border-gray-300"
            source={require('../../assets/images/gurkan2.jpg')}
            
          />
          {/* tags balises */}
          <View className="flex-row justify-around space-x-4 gap-3">

              <View className="bg-green-300 px-2 py-1 rounded-full">
                  <Text className={`font-medium ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                  </Text>
                  {syncing && <ActivityIndicator size="small" color="#15803d" />}
              </View>

              <View className="bg-blue-100 px-2 py-1 rounded-full">
                <Text className="text-blue-700 font-medium">Suppliers: {supplierCount}</Text>
              </View>

              <View className="bg-yellow-200 px-2 py-1 rounded-full">
                <Text className="text-blue-700 font-medium">Products: {productCount}</Text>
              </View>
          </View>
          
          
      </View>
  )
}