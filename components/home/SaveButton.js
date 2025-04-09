/**
 * 📁 File : SaveButton.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/SaveButton.js
 * 📅 Created at : 2025-04-05
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

import { View, Text , TouchableOpacity} from 'react-native'


export default function SaveButton() {
  return (
    <View>
        <TouchableOpacity className="bg-green-500 mt-6 px-4 py-3 rounded-xl items-center">
            <Text className="text-white font-semibold">Save changes</Text>
        </TouchableOpacity>
    </View>
  )
}

