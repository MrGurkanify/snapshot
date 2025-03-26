
'use client';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('userToken');

      if (token) {
        router.replace('/home');
      } else {
        router.replace('/signup');
      }

      setChecking(false);
    };

    checkToken();
  }, []);

  // Affiche un petit loader le temps de la redirection
  if (checking) {
    return (
      <>
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
        <Toast />
      </>
    );
  }

  return null;
}

