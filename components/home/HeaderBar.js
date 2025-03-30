import { View, Text, Image } from 'react-native'



export default function HeaderBar({ supplierCount, productCount , user }) {
  
  return (
    <View className="flex-row items-center justify-between h-10 mb-16 " >
          
          <Image className="w-16 h-16 rounded-full border border-gray-300"
            source={require('../../assets/images/gurkan2.jpg')}
            
          />

          <View className="flex-row space-x-4">
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 font-medium">#Suppliers: {supplierCount}</Text>
              </View>

              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 font-medium">#Products: {productCount}</Text>
              </View>
          </View>
          
          
      </View>
  )
}