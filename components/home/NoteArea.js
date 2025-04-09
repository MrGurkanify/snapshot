/**
 * 📁 File : NoteArea.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/NoteArea.js
 * 📅 Created at : 2025-03-30
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */


import { View, Text , TextInput  } from 'react-native'


export default function NoteArea( { value , onChangeText , color , autoCapitalize= 'sentences' , placeholder}) {
  return ( <>
    
      <Text className="text-xl mb-2 text-gray-500">Note: </Text>
      <TextInput
        multiline
        numberOfLines={5} // ou plus selon la hauteur que tu veux
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="bg-black/5 h-32 py-3 px-3 rounded-2xl w-full mb-3 border outline-none border-gray-300 text-xl"
        maxLength={120}
        // style={{ backgroundColor: color }} 
        autoCapitalize={ autoCapitalize } // Capitalisation automatique
        autoComplete="off"
        />
    </>
  )
}
