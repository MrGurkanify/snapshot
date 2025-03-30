import { View, Text , TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router';
import { PlusIcon } from 'react-native-heroicons/outline';

export default function AddButton() {
    const router = useRouter();

  return ( <>
    <View className='items-center mt-4'>
        <TouchableOpacity
            onPress={() => router.push('/add-supplier')}
            className="w-12 h-12  rounded-full bg-blue-500 items-center justify-center mt-4"
            accessibilityLabel="Ajouter un fournisseur"
            >
            <PlusIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-red-300 text-sm mt-1">Add supplier</Text>
    </View>
    </>
  )


}