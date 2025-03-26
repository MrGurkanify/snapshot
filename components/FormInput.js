import { View, TextInput, TouchableOpacity } from 'react-native'
import { EyeIcon , EyeSlashIcon } from 'react-native-heroicons/solid';
import { useState } from 'react';


export default function FormInput({label , type , value , onChangeText}) {
    
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    if(type === 'email'){
        return (
            <View className='bg-black/5 p-5 rounded-2xl w-full mt-3 mb-3 border outline-none border-gray-300' >
                <TextInput className='text-2xl' value={value} onChangeText={onChangeText} maxLength={30} placeholderTextColor={'gray'} placeholder={label} autoCapitalize="none" keyboardType="email-address"/>
            </View>  
          )
    }
    if(type === 'password'){
        return (
            <View className='bg-black/5 p-5 rounded-2xl w-full mt-3 mb-3 border outline-none border-gray-300' >
                <TextInput className='text-2xl' value={value} onChangeText={onChangeText} maxLength={20} placeholderTextColor={'gray'} placeholder='PASSWORD' secureTextEntry={!isPasswordVisible} />
                
                <TouchableOpacity className='absolute top-5 right-5 ' onPress={() => setIsPasswordVisible(prev => !prev)}>
                    {isPasswordVisible ? <EyeSlashIcon size={24} color="gray" /> : <EyeIcon size={24} color="gray" />}        
                </TouchableOpacity>
                
            </View>  
          )
    } 
    if(type === 'text'){
        return (
            <View className='bg-black/5 p-5 rounded-2xl w-full mt-3 mb-3 border outline-none border-gray-300' >
                <TextInput className='text-2xl ' value={value} onChangeText={onChangeText} placeholderTextColor={'gray'} placeholder={label} />
            </View>  
          )
    }
  
}