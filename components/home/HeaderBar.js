/**
 * 📁 File : HeaderBar.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/HeaderBar.js
 * 📅 Created at : 2025-04-05
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ← à ajouter tout en haut


export default function HeaderBar({ supplierCount, productCount, user, isOnline, syncing }) {
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    const loadAvatar = async () => {
      if (!user) return;
    
      const localPath = `${FileSystem.documentDirectory}avatar.jpg`;
    
      // 🟢 Online → on prend depuis le CDN (stocké dans AsyncStorage)
      if (isOnline) {
        try {
          const cdnUrl = await AsyncStorage.getItem('@avatar_cdn_url');
          if (cdnUrl) {
            setAvatarUri(cdnUrl);
            console.log('🌐 Avatar chargé depuis le CDN :', cdnUrl);
            return;
          }
        } catch (err) {
          console.warn('⚠️ Erreur lecture avatar CDN depuis AsyncStorage');
        }
      }
    
      // 🔴 Offline → on tente de charger depuis le cache local
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (fileInfo.exists) {
        setAvatarUri(localPath);
        console.log('📦 Avatar chargé depuis le disque local :', localPath);
        return;
      }
    
      // 🧑‍🚀 Fallback si rien trouvé
      setAvatarUri(require('../../assets/images/astronaute_canard.png'));
    };
    

    loadAvatar();
  }, [isOnline, user]);

  return (
    <View className="flex-row items-center justify-between h-10 mb-16">
      {/* Avatar dynamique */}
      <Image
        className="w-20 h-20 rounded-full border border-gray-300"
        source={typeof avatarUri === 'string' ? { uri: avatarUri } : avatarUri}
      />

      {/* tags balises */}
      <View className="flex-row justify-around space-x-4 gap-3">
        <View className="bg-green-300 px-2 py-1 rounded-full">
          <Text className={`font-medium ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          {syncing && <ActivityIndicator size="small" color="#15803d" />}
        </View>

        <View className="bg-blue-100 px-2 py-1 rounded-full">
          <Text className="text-blue-700 font-medium">Suppliers: {supplierCount}</Text>
        </View>

        <View className="bg-yellow-200 px-2 py-1 rounded-full">
          <Text className="text-blue-700 font-medium">Products: {productCount}</Text>
        </View>
      </View>
    </View>
  );
}
