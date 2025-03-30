/**
 * 📁 File : LabelInput.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/LabelInput.js
 * 📅 Created at : 2025-03-30
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



import { View, TextInput , Text } from 'react-native'


export default function LabelInput({label , placeholder ,value , onChangeText}) {
  return (
    <View>
      <Text className="uppercase text-lg font-base text-gray-500">{label}</Text>
      <TextInput className='bg-black/5  py-3 px-3 rounded-2xl w-full mt-3 mb-3 border outline-none border-gray-300 text-2xl ' 
                 value={value} onChangeText={onChangeText} 
                 placeholderTextColor={'gray'} placeholder={placeholder} 
                 keyboardType="email-address"
                 maxLength={30} // Limite de caractères
                 style={{ textAlignVertical: 'center' }} // Hauteur du champ de texte
                 />

    </View>
  )
}