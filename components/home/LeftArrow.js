/**
 * 📁 File : LeftArrow.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/LeftArrow.js
 * 📅 Created at : 2025-03-30
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



import { Text ,TouchableOpacity } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';

export default function LeftArrow() {
  const router = useRouter();

  return (
      
      <TouchableOpacity onPress={() => router.back()} className=" flex-row items-center">
        <ArrowLeftIcon size={32} color="#0EA5E9" />
        <Text className="ml-2 font-bold text-blue-500 text-lg">Back</Text>
      </TouchableOpacity>

    
  );
}
