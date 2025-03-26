import { View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

// Custom Components import
import { decodeJWT } from '../lib/decodeJWT';


export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // au chargement du composant ou de la homescreen il load le token de l'utilisateur
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync('userToken');

      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        // on décode le token
        const decoded = decodeJWT(token);
        // si erreur on sort du try pour aller directement dans le catch 
        // si le decode n'a pas fonctionné on sort du try pour aller dans le catch
        if (!decoded) throw new Error('Token non décodable');
        // sinon on set l'email de l'utilisateur (c'est qu'on a réussi à décoder le token)
        setEmail(decoded.email);

      } 
      catch (error) {
        // si il y a une erreur il delete le token
        console.error('Token invalide:', error);
        await SecureStore.deleteItemAsync('userToken');
        router.replace('/login');
        
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    // si le user appuie sur le boutton logout il delete le token et le redirige vers la page de login
    await SecureStore.deleteItemAsync('userToken');
    router.replace('/login');
  };

  return (
    <>
      <View className="bg-white h-full w-full flex-1 justify-center items-center">
        <StatusBar style="light" />
        <Image className="w-full h-full absolute" source={require('./../assets/images/background.png')} />
      </View>

      <View className="w-full h-full flex justify-around pt-40 pb-10 absolute items-center">
        <Text className="text-3xl font-bold text-white text-center">Bienvenue {email || 'utilisateur'} 👋</Text>

        <TouchableOpacity onPress={handleLogout} className="mt-10 bg-red-500 px-6 py-3 rounded-xl">
          <Text className="text-white font-bold text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
