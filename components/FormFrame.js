import { View } from 'react-native'

export default function FormFrame({children}) {
  return (
    <View className='flex flex-col items-center mx-4 mt-72'>
      {children}
    </View>
  )
}