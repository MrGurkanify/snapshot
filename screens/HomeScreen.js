/**
 * 📁 File : HomeScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/HomeScreen.js
 * 📅 Created at : 2025-04-04
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */


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
import * as Network from 'expo-network';

import { useRouter } from 'expo-router';
import { syncUnsyncedData } from '../lib/offline'; 
import { decodeJWT } from '../lib/decodeJWT';
import { API_BASE_URL, API_CDN_URL } from '../lib/api';


import HeaderBar from '../components/home/HeaderBar';
import TabBar from '../components/home/TabBar';
import SuppliersDisplay from '../components/home/SuppliersDisplay';
import SearchBarInput from '../components/home/SearchBarInput';
import AddButton from '../components/home/AddButton';



export default function HomeScreen() {

  const [syncing, setSyncing] = useState(false);
  const [isOnline , setIsOnline ] = useState(true);
  const [user, setUser] = useState(null);
  const [supplierCount, setSupplierCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  

  const router = useRouter();
  console.log('👤 user dans HomeScreen :', user);

 

  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync('userToken');

// les if(s) validation
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
// après les if's validation & verif à partir de là, tout est ok
// on set la var state user avec l'objet     

      setUser({
        token,
        userId: decode.userId,
        email: decode.email,
        username: decode.userName,
      });

      // on appelle fetchCounts ici 
      
      
      console.log('\n\n\n');
      console.log('user : ',user);
      console.log('\n\n\n');
      console.log('decode: ',decode);
      
      setProductCount(5);
      setSupplierCount(10);


    }; // fin de  déclaration loadUser
    // on appelle la fonction loadUser , initial
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) return;
  
    const fetchCounts = async () => {
      try {
        const [supplierRes, productRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/suppliers/count`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch(`${API_BASE_URL}/api/products/count`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
  
        const supplierData = await supplierRes.json();
        const productData = await productRes.json();
  
        setSupplierCount(supplierData.count || 0);
        setProductCount(productData.count || 0);
      } catch (err) {
        console.error('❌ Erreur récupération des compteurs :', err);
      }
    };
  
    fetchCounts();
  }, [user]); // 🔁 dès que `user` est défini


  // useEffect avec un timer pour vérifier la connexion
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const network = await Network.getNetworkStateAsync();
        const connected = network.isConnected && network.isInternetReachable;
        console.log('🔁 Ping vers :');
        const backendPing = await fetch(`${API_BASE_URL}/api/ping`);
        console.log('Backend →', `${API_BASE_URL}/api/ping`);

        const cdnPing = await fetch(`${API_CDN_URL}/ping`);
        console.log('CDN →', `${API_CDN_URL}/ping`);

        const isBackendOnline = backendPing.ok;
        const isCdnOnline = cdnPing.ok;
  
        if (connected && isBackendOnline && isCdnOnline) {
          setIsOnline(true);
          console.log('🟢 Tous les services sont en ligne');
        } else {
          setIsOnline(false);
          console.warn('⚠️ Un ou plusieurs services sont inaccessibles');
        }
      } catch {
        setIsOnline(false);
      }
    };
  
    checkConnection();
  
    const interval = setInterval(checkConnection, 10000); // check toutes les 10s
    return () => clearInterval(interval);
  }, []);

  /* Dès que le isOnline passe à true 
  (donc connexion réseau + ping backend + ping CDN OK),
Et que user est défini (token + userId),
👉 la fonction syncUnsyncedData() est déclenchée automatiquement. */

  useEffect(() => {
    // Dès que isOnline devient true (et qu'on a un user)
    if (!isOnline || !user) return;
  // si isonline false et pas de user on execute pas le useEffect
    const syncNow = async () => {
      console.log('🔁 Connexion retrouvée : lancement de sync...');
      setSyncing(true);
      await syncUnsyncedData(user.token, user.userId);
      setSyncing(false);
    };
  
    syncNow();
  }, [isOnline]);




  // if (!user) return null;
  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-lg">Chargement...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <StatusBar style="dark" />

      {/* Header */}
      <HeaderBar supplierCount={supplierCount} productCount={productCount} user={user} isOnline={isOnline} syncing={syncing}/>


      {/* Contenu principal */}
      {/* user?.username c'est la var state et non l'object décodé via le securestor et le userToken */}
      <SearchBarInput value={searchQuery} onChangeText={setSearchQuery} />

      <Text className="text-lg font-semibold text-gray-800 mt-3 mb-4 ">All suppliers:</Text>

      <View className="h-[300px]">
          <SuppliersDisplay user={user} searchQuery={searchQuery} />
      </View>  
      
      <AddButton route={'add-supplier'} label={'Add supplier'}/>

      
    </SafeAreaView>
  );
}


