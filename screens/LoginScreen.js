import { View, Text , Image , TouchableOpacity } from 'react-native'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Animated , { FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useState , useEffect , useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useFocusEffect } from 'expo-router';




// Custom Components import
import Logo from './../ui/Logo';
import FormInput from './../components/FormInput';
import FormButton from './../components/FormButton';
import TextButtonLink from '../components/TextButtonLink';
import FormFrame from './../components/FormFrame';

import { API_BASE_URL } from '../lib/api';
import { isAppOnline } from '../lib/network';
import { userSession } from '../lib/userSession';

// la class absolute permet de mettre l'image en background arrière plan derrière les autres composants 

export default function LoginScreen() {
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [isLoading , setIsLoading] = useState(false);
    const router = useRouter();
    
    // on vérifie si le formulaire est valide
    // grosse validation
    const isFormValid = email.trim() !== '' && password.trim() !== '' && password.length >= 6;
/* 
    useEffect(() => { 
      console.log('Rechargement...')
      // déclaration de la fonction loadAutoLogin dans le useEffect
      const loadAutoLogin = async () => {
        const savedEmail = await SecureStore.getItemAsync('autoLoginEmail');
        const savedPassword = await SecureStore.getItemAsync('autoLoginPassword');
    
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
    
        
      };
    // appel initial de la fonction loadAutoLogin dans le useEffect
    // si on appelait pas comme ca dans le useEffect, la fonction ne serait jamais appelée 
      loadAutoLogin();
    }, []); */

    

useFocusEffect(
  useCallback(() => {
    const loadAutoLogin = async () => {
      const savedEmail = await SecureStore.getItemAsync('autoLoginEmail');
      const savedPassword = await SecureStore.getItemAsync('autoLoginPassword');

      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) setPassword(savedPassword);
      console.log('Rechargement...');
      console.log('Email récupéré :', savedEmail);
      console.log('Password récupéré :', savedPassword);

    };

    loadAutoLogin();
  }, [])
);



const handleLogin = async () => {
  if (!isFormValid) return;

  console.log('login button clicked');
  console.log('connexion en cours ...');
  setIsLoading(true);

  try {
    const online = await isAppOnline();

    if (!online) {
      console.warn('📴 Mode offline détecté — on vérifie la présence d’un token');
      const session = await userSession();

      if (session.valid) {
        console.log('✅ Token valide en local — accès autorisé (offline)');
        router.push('/home');
        return;
      } else {
        console.warn('❌ Aucun token valide — login impossible offline');
        return;
      }
    }

    // En ligne → Login classique
    const res = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.warn('❌ Login échoué :', data.message);
      return;
    }

    await SecureStore.setItemAsync('userToken', data.token);
    console.log('✅ Login en ligne réussi — token sauvegardé');
    router.push('/home');

  } catch (error) {
    console.error('Erreur réseau :', error);
  } finally {
    setIsLoading(false);
  }
};
    
    return (
      <>
        {/* Background */}
        {/* <View className="bg-white h-full w-full flex-1 justify-center items-center">
          <StatusBar style="light" />
          <Image className="w-full h-full absolute" source={require('./../assets/images/background.png')} />
        </View> */}
    
        {/* Animations */}
        <View className="flex-row justify-around w-full absolute">
          <Animated.Image
            entering={FadeInUp.delay(300).duration(1000).springify().damping(2).mass(2)}
            className="w-[90] h-[225]"
            source={require('../assets/images/light.png')}
          />
          <Animated.Image
            entering={FadeInUp.delay(500).duration(1000).springify().damping(2).mass(2)}
            className="w-[65] h-[160]"
            source={require('../assets/images/light.png')}
          />
        </View>
    
        {/* Form & Keyboard handling */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full h-full absolute"
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="pt-40 pb-10">
                <FormFrame>
                  <FormInput label="EMAIL" type="email" value={email} onChangeText={setEmail} />
                  <FormInput label="PASSWORD" type="password" value={password} onChangeText={setPassword} />
                  {password.length > 0 && password.length < 6 && (
                    <Text className="text-red-500 font-bold text-sm mt-1">Mot de passe trop court (min 6 caractères)</Text>
                  )}
                  <FormButton label="Login" onPress={handleLogin} isLoading={isLoading} disabled={!isFormValid} />
                  <TextButtonLink text="Don't have an account ?" label="Sign up" tohref="/signup" />
                </FormFrame>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </>
    );
  
}