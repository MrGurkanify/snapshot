import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router';

export default function TextButtonLink({ text, label , tohref }) {
  const router = useRouter();
  
  return (
    <View className='flex-row justify-center mt-10 mb-6 '>
        <View> 
            <Text>{text}</Text>
        </View>

        <TouchableOpacity onPress={ () => router.push(tohref) } >
            <Text className="text-sky-500 font-bold mb-6">{label}</Text>
        </TouchableOpacity>
    </View>
  )
}
