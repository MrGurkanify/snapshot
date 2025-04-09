/**
 * 📁 File : LabelInput.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/LabelInput.js
 * 📅 Created at : 2025-03-30
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



import { View, TextInput , Text } from 'react-native'


export default function LabelInput({label , placeholder=null ,value , onChangeText , color , autoCapitalize= 'sentences' , keyboardType = 'default' ,  autoCorrect= false , disabled= false }) {
  return (
    <View>
      <Text className=" text-lg font-base text-gray-500">{label}</Text>
      <TextInput className={` p-3 rounded-2xl w-full my-3 border outline-none border-gray-300 text-2xl
              ${disabled ? 'bg-gray-200 text-gray-500' : 'bg-black/5 text-black'}` }
                 
                 value={value} onChangeText={onChangeText} 
                 placeholderTextColor={'gray'} placeholder={placeholder} 
                 maxLength={30} // Limite de caractères
                 style={{ textAlignVertical: 'center' }}//, // backgroundColor: color }} // Hauteur du champ de texte
                 autoCapitalize={ autoCapitalize } // Capitalisation automatique
                 keyboardType={keyboardType}
                 autoCorrect={autoCorrect}
                 autoComplete="off"
                 editable={!disabled}
                 />

    </View>
  )
}

