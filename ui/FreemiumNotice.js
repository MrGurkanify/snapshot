/**
 * 📁 File : FreemiumNotice.js
 * 🛤️  Path  : ~/developpement /snapshot/ui/FreemiumNotice.js
 * 📅 Created at : 2025-04-13
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

// components/ui/FreemiumNotice.js
import { View , Text , TouchableOpacity , Linking } from 'react-native';

export default function FreemiumNotice() {
  return ( <>
        
        <View className="flex justify-center items-center mt-10 ">
            <Text className="text-red-500 text-sm text-center font-bold">
            Limited version 
            </Text>
            <Text className="text-red-500 text-sm text-center mt-1 font-bold">
            - Only a few suppliers allowed -
            </Text>
           

            <Text className="text-gray-500 text-xs text-center mt-1">
            Learn more about unlocking full access on our website
            </Text>

            <View className="mt-7 mb-7">
                <TouchableOpacity   onPress={() => Linking.openURL("https://snapshotfa.st")}>
                    <Text className="text-blue-500 underline text-center mt-1 text-sm">
                        snapshotfa.st
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
            

    </>
  );
}
