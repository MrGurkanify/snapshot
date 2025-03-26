import { View , Image} from 'react-native'

export default function Logo() {
  return (
    <View className= "flex justify-center items-center">
      <Image className="w-3 h-3" source={require('./../assets/images/logo.png')} />
    </View>
  )
}