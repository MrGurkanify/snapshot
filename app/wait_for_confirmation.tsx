'use client';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { API_BASE_URL } from '../lib/api';

export default function WaitForConfirmation() {
  const router = useRouter();
  const [email, setEmail] = useState('');


  useEffect(() => {
    let interval;
    

    const init = async () => {
      const pendingEmail = await SecureStore.getItemAsync('pendingEmail');
      const pendingPassword = await SecureStore.getItemAsync('pendingPassword');

      
      if (pendingEmail) setEmail(pendingEmail);
  
      const checkActivation = async () => {

        console.log('[Polling] Checking for activation…');
        // si pas d'email en attente on sort
        if (!pendingEmail) return;
        
  
        try {
          const res = await fetch(`${API_BASE_URL}/api/check-activation?email=${pendingEmail}`);
          console.log('requete fetch effectué');
          const data = await res.json();
          console.log('[Polling] Response:', data);
  
          // si l'app à pu vérifier l'email a été vérifié càd clické sur le lien alors 
          // on arrête le polling et on redirige vers la page de login
          if (data.isEmailActivated) {
            clearInterval(interval);
  
            await SecureStore.setItemAsync('autoLoginEmail', pendingEmail);
            await SecureStore.setItemAsync('autoLoginPassword', pendingPassword);
            await SecureStore.deleteItemAsync('pendingEmail');
            await SecureStore.deleteItemAsync('pendingPassword');
  
            router.replace('/login');
          }
        } catch (err) {
          console.error('Erreur de vérification:', err);
        }
      };
  
      interval = setInterval(checkActivation, 5000);
      checkActivation();
    };
  
    init();
  // cleaning up the interval dans le useEffect
    return () => clearInterval(interval);
  }, []);
  

  return (
    <View className="flex-1 items-center justify-center bg-white px-10">
      <Text className="text-2xl font-bold text-center mb-4">📩 Vérification en attente</Text>
      <Text className="text-center text-lg mb-8">
        Un email a été envoyé à {email}. Veuillez cliquer sur le lien pour activer votre compte.
      </Text>
      <ActivityIndicator size="large" color="#0EA5E9" />
      <Text className="text-center text-gray-500 mt-6">Vérification en cours...</Text>
    </View>
  );
}
