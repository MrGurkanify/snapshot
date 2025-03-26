import { View, Text , Image , TextInput , TouchableOpacity , ActivityIndicator } from 'react-native'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';import Animated , { FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';

// Custom Components import
import Logo from './../ui/Logo';
import FormInput from './../components/FormInput';
import FormButton from './../components/FormButton';
import TextButtonLink from '../components/TextButtonLink';
import FormFrame from '../components/FormFrame';

import { API_BASE_URL } from '@/lib/api';


// la class absolute permet de mettre l'image en background arrière plan derrière les autres composants 

export default function SignupScreen() {
    const router = useRouter();
    const [username , setUsername] = useState('');
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [isLoading , setIsLoading] = useState(false);

    const isFormValid = username.trim() !== '' && email.trim() !== '' && password.trim() !== '' && password.length >= 6;

    const handleSignup = async () => {
      // si isFormValid est false alors on return et on ne fait rien
        if (!isFormValid) {
            return;
        }
        try {
            console.log('Signup button clicked');
            console.log('Connexion en cours ...');
            const res = await fetch(`${API_BASE_URL}/api/signup`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
              });
            setIsLoading(true);

            const data = await res.json();

            if (!res.ok) {
            console.warn('Signup error:', data.message);
            Toast.show({
              type: 'error',
              text1: 'Erreur',
              text2: data.message || "Impossible de créer le compte.",
            });

            setIsLoading(false);
            return;
            }

            console.log('✅ Signup successful:', data);
            // ici, tu peux router vers l'écran d'envoie d'email comme quoi
            // ils ont bien reçu un email qu'ils doivent clicker pour confirmer leur compte
            // si le user click sur le lien dans l'email alors le backend envoie ok , le flag user verified dans la collection user est mis à true
            // et le user peut se connecter
            // router.push('/wait_for_confirmation');
            Toast.show({
              type: 'success',
              text1: 'Compte créé',
              text2: 'Un email de confirmation a été envoyé 📩',
            });
            // stocke l'email et le password dans le secure store
            // Redirige vers le screen "wait_for_confirmation"
            await SecureStore.setItemAsync('pendingEmail', email);
            await SecureStore.setItemAsync('pendingPassword', password);
            await SecureStore.setItemAsync('autoLoginEmail', email);
            await SecureStore.setItemAsync('autoLoginPassword', password);
            router.push('/wait_for_confirmation');

        } 
        catch (error) {
            console.error('Signup error:', error);
        }
        finally {
            setIsLoading(false);
        }

    }

  return (
    <>

    {/* Background */}
    <View className="bg-white h-full w-full flex-1 justify-center items-center">
      <StatusBar style="light" />
      <Image className="w-full h-full absolute" source={require('./../assets/images/background.png')} />
    </View>

    {/* Lights */}
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

    {/* Form + KeyboardHandler */}
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
              <FormInput label="USERNAME" type="text" value={username} onChangeText={setUsername} />
              <FormInput label="EMAIL" type="email" value={email} onChangeText={setEmail} />
              <FormInput label="PASSWORD" type="password" value={password} onChangeText={setPassword} />
              <FormButton label="Sign up" onPress={handleSignup} isLoading={isLoading} disabled={!isFormValid} />
              <TextButtonLink text="Already have an account ?" label="Login" tohref="/login" />
            </FormFrame>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </>
   
  )
}