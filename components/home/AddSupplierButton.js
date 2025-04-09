/**
 * 📁 File : AddSupplierButton.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/AddSupplierButton.js
 * 📅 Created at : 2025-03-30
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */


import { View, Text , TouchableOpacity, ActivityIndicator } from 'react-native'


export default function AddSupplierButton({onPress, disabled, loading , label }) {
  return (
    <View className="flex-1 items-center justify-center m-4 ">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={`p-5 w-44 border border-3 border-blue-600 rounded-3xl items-center justify-center
        ${disabled ? 'bg-gray-300' : 'bg-orange-300'}`}
        disabled={disabled}
        >
        {loading ? (
          <ActivityIndicator size={36} color="#0000ff" />
        ) : (
          <Text className="text-xl text-gray-600 font-semibold">{label}</Text>
        )}

        
      </TouchableOpacity>
      
    </View>
  )
} 