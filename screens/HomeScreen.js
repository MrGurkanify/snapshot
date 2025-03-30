
// 1. Token valide ? Sinon redirect
// 2. Token expiré ? Sinon redirect
// 3. Requête vers backend pour vérifier user
//    - si erreur réseau → redirect
//    - si user non trouvé → redirect
// 4. ✅ Tout est bon → on set le user



import { View, Text , Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { decodeJWT } from '../lib/decodeJWT';

import { API_BASE_URL } from '../lib/api';

import HeaderBar from '../components/home/HeaderBar';
import TabBar from '../components/home/TabBar';
import SuppliersDisplay from '../components/home/SuppliersDisplay';
import SearchBarInput from '../components/home/SearchBarInput';
import AddButton from '../components/home/AddButton';

export default function HomeScreen() {

  const [user, setUser] = useState(null);
  const [supplierCount, setSupplierCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync('userToken');

      if (!token) {
        router.replace('/login');
        return;
      }
//  si le if n'a pas trigger , à partir de là, tout est ok
// on a un token valide dans le secure store
// on decode le token pour avoir les infos de l'utilisateur
      const decode = decodeJWT(token);
      const exp = decode.exp * 1000;

// une verification de l'expiration du token 
// on decode le token et on fait les if's verif après
// si le token est expiré, on supprime le vieu token inutile du secure store et on redirige vers la page de login
      if (Date.now() > exp) {
        console.log('Token expiré');
        await SecureStore.deleteItemAsync('userToken');
        setUser(null);
        router.replace('/login');
        return;
      }
// on peut avoir un token residuel alors qu'un user n'existe pas dans la BDD
// on fait une requête vers le backend pour vérifier si l'utilisateur existe
// si c'est le cas , on interroge le backend       
      try {
        const res = await fetch(`${API_BASE_URL}/api/verify-user/${decode.userId}`);
        if (!res.ok) {
          console.log('Utilisateur non trouvé dans la BDD');
          await SecureStore.deleteItemAsync('userToken');
          setUser(null);
          router.replace('/login');
          return;
        }
      } catch (err) {
        console.error('Erreur réseau lors de la vérification utilisateur :', err);
        await SecureStore.deleteItemAsync('userToken');
        setUser(null);
        router.replace('/login');
        return;
      }
// après les if's verif à partir de là, tout est ok
      console.log('HomeScreen , le token :',token);
      console.log('email :',decode.email);
      console.log('userId :',decode.userId);
      console.log('exp :',decode.exp);
      console.log('iat :',decode.iat);
      console.log('username :',decode.userName);
      
      
// on set la var state user avec l'objet     
      setUser({
        token,
        userId: decode.userId,
        email: decode.email,
        username: decode.userName,
      });
      
      setProductCount(5);
      setSupplierCount(10);


    }; // fin de  déclaration loadUser
    // on appelle la fonction loadUser , initial
    loadUser();
  }, []);

  

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <StatusBar style="dark" />

      {/* Header */}
      <HeaderBar supplierCount={supplierCount} productCount={productCount} user={user}/>


      {/* Contenu principal */}
      {/* user?.username c'est la var state et non l'object décodé via le securestor et le userToken */}
      <SearchBarInput value={searchQuery} onChangeText={setSearchQuery} />

      <Text className="text-lg font-semibold text-gray-800 mt-3 mb-4 ">All suppliers:</Text>

      <View className="h-[300px]">
          <SuppliersDisplay user={user} />
      </View>  
      
      <AddButton />

      

      
      
    </SafeAreaView>
  );
}



