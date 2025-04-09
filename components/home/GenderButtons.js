/**
 * 📁 File : GenderButtons.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/GenderButtons.js
 * 📅 Created at : 2025-04-06
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

import { View, Text , TouchableOpacity } from 'react-native'


export default function GenderButtons({gender , setGender}) {
  return ( <>
    {/* Gender Buttons */}
        <View className="mt-3 ">
            <Text className="text-lg font-base text-gray-500 mb-3">Gender</Text>
            <View className="flex-row items-center justify-around gap-3">
                {['Male', 'Female', 'Other'].map((option) => (
                <TouchableOpacity
                    key={option}
                    className={`p-2 w-24 rounded-2xl border font-semibold ${
                    gender === option ? 'bg-lime-600 border-gray-700' : 'bg-indigo-400 border-gray-400'
                    }`}
                    onPress={() => setGender(option)}
                >
                    <Text className="text-white text-xl text-center ">{option}</Text>
                </TouchableOpacity>
                ))}
            </View>
        </View>

</>
  )
}