/**
 * 📁 File : ProductsScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/ProductsScreen.js
 * 📅 Created at : 2025-04-11
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Network from 'expo-network';
import { useRouter } from 'expo-router';

import { decodeJWT } from '../lib/decodeJWT';
import { API_BASE_URL, API_CDN_URL } from '../lib/api';
import { syncUnsyncedData } from '../lib/offline';
import { userSession } from '../lib/userSession'; 

import HeaderBar from '../components/home/HeaderBar';
import TabBar from '../components/home/TabBar';
import ProductsDisplayAll from '../components/products/ProductsDisplayAll';
import SearchBarInput from '../components/home/SearchBarInput';

export default function Products() {
  const [syncing, setSyncing] = useState(false);
  const [isOnline , setIsOnline ] = useState(true);
  const [user, setUser] = useState(null);
  const [supplierCount, setSupplierCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const session = await userSession();
  
      if (!session.valid) {
        console.warn('❌ Session invalide — redirection login');
        router.replace('/login');
        return;
      }
  
      setUser({
        token: session.token,
        userId: session.decoded.userId,
        email: session.decoded.email,
        username: session.decoded.userName,
      });
  
      console.log('✅ User chargé dans ProductScreen');
    };
  
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
        console.error('Erreur compteurs products :', err);
      }
    };
    fetchCounts();
  }, [user]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const network = await Network.getNetworkStateAsync();
        const connected = network.isConnected && network.isInternetReachable;

        let isBackendOnline = false;
        let isCdnOnline = false;

        try {
          const backendPing = await fetch(`${API_BASE_URL}/api/ping`);
          isBackendOnline = backendPing.ok;
        } catch {}

        try {
          const cdnPing = await fetch(`${API_CDN_URL}/ping`);
          isCdnOnline = cdnPing.ok;
        } catch {}

        setIsOnline(connected && isBackendOnline && isCdnOnline);
      } catch {
        setIsOnline(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 20000); // 20 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOnline || !user) return;
    const syncNow = async () => {
      setSyncing(true);
      await syncUnsyncedData(user.token, user.userId);
      setSyncing(false);
    };
    syncNow();
  }, [isOnline]);

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-lg">Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <StatusBar style="dark" />

      <HeaderBar supplierCount={supplierCount} productCount={productCount} user={user} isOnline={isOnline} syncing={syncing}/>

      <SearchBarInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search product..." />

      <Text className="text-lg font-semibold text-gray-800 mt-3 mb-4">All products:</Text>

      <View className="h-[300px]">
        <ProductsDisplayAll user={user} searchQuery={searchQuery} />
      </View>

      {/* Pas de bouton Add ici */}
    </SafeAreaView>
  );
}
