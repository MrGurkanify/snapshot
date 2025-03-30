/**
 * 📁 File : LabelForm.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/LabelForm.js
 * 📅 Created at : 2025-03-30
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */


import { View } from 'react-native'

export default function LabelForm({children}) {
  return (
    <View className='flex mx-4 mt-5'>
      {children}
    </View>
  )
}