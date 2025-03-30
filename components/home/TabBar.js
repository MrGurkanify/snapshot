import { View, Text , TouchableOpacity } from 'react-native'
import {
    HomeIcon,
    BuildingOffice2Icon,
    UserCircleIcon,
  } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';


export default function TabBar() {
    const router = useRouter();
    
  return (
    <View className=" absolute bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-gray-200 flex-row justify-around items-center ">
          <TouchableOpacity>
            <HomeIcon size={26} color="#0EA5E9" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/suppliers')}>
            <BuildingOffice2Icon size={26} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/profile')}>
            <UserCircleIcon size={26} color="gray" />
          </TouchableOpacity>
          
      </View>
  )
}
