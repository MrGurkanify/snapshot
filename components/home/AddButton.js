/**
 * 📁 File : AddButton.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/AddButton.js
 * 📅 Created at : 2025-03-30
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



import { View, Text , TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router';
import { PlusIcon } from 'react-native-heroicons/outline';

export default function AddButton({route , label}) {
    const router = useRouter();

  return ( <>
    <View className='items-center mt-4'>
        <TouchableOpacity
            onPress={() => router.push(`/${route}`)}
            className="w-12 h-12  rounded-full bg-blue-500 items-center justify-center mt-4"
            accessibilityLabel="Ajouter un fournisseur"
            >
            <PlusIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-red-300 text-sm mt-1">{label}</Text>
    </View>
    </>
  )


}