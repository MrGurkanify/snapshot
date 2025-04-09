/**
 * 📁 File : ModifyButton.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/ModifyButton.js
 * 📅 Created at : 2025-04-05
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */




import { View, Text , TouchableOpacity} from 'react-native'
import { PencilSquareIcon } from 'react-native-heroicons/outline';


export default function ModifyButton({ onModify }) {
  return (
    <View className="mr-5">
        {/* Bouton modifier */}
      <TouchableOpacity onPress={onModify}>
        <PencilSquareIcon size={32} color="black" />
      </TouchableOpacity>
    </View>
  )
}
