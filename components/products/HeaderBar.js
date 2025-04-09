/**
 * 📁 File : HeaderBar.js
 * 🛤️  Path  : ~/developpement /snapshot/components/products/HeaderBar.js
 * 📅 Created at : 2025-04-09
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */


// 📁 components/products/HeaderBar.js

import { View, Text, TouchableOpacity } from 'react-native';
import LeftArrow from '../../components/home/LeftArrow';
import ModifyButton from '../../components/home/ModifyButton';
import { useRouter } from 'expo-router';

export default function HeaderBar({ title = 'Détails', onModify }) {
  const router = useRouter();

  return (
    <View className="flex-row justify-between mt-7 mb-5 items-center px-4 py-3 bg-white">
      
      {/* Bouton retour */}
      <LeftArrow />

      {/* Titre centré */}
      
      <Text className="text-lg font-semibold text-gray-400 text-center mr-10">{title}</Text>
      
      {/* Bouton modifier */}
      <ModifyButton onModify={onModify}/>
      

    </View>
  );
}
