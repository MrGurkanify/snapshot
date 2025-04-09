/**
 * 📁 File : SearchBarInput.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/SearchBarInput.js
 * 📅 Created at : 2025-04-04
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



import { View, TextInput , TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon , XMarkIcon } from 'react-native-heroicons/solid';

export default function SearchBarInput({ value, onChangeText }) {

  return (
    <View className="flex-row items-center bg-black/5 px-4 py-3 rounded-2xl w-full mt-3 mb-3 border border-gray-300 gap-4">
            <MagnifyingGlassIcon size={24} color="gray" className="mr-3" />
            
            <TextInput
                className="flex-1 text-2xl text-gray-800"
                value={value}
                onChangeText={onChangeText}
                maxLength={20}
                placeholder="search"
                placeholderTextColor="gray"
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType="default"  
            />

            {/* Barre verticale fine */}
          
            <View className="w-px h-6 bg-gray-300 mx-2" />
           

            {/* Bouton pour effacer */}
            
            <TouchableOpacity onPress={() => onChangeText('')}>
                <XMarkIcon size={22} color="red" />
            </TouchableOpacity>
         

    </View>

  );
}
