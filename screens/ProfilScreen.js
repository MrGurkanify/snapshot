/**
 * 📁 File : ProfilScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/ProfilScreen.js
 * 📅 Created at : 2025-04-05
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

import { View, Text , TouchableOpacity } from 'react-native'
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';



import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect , useRef} from 'react'


// Custom components

import LabelForm from '../components/home/LabelForm';
import LabelInput from '../components/home/LabelInput';
import AvatarButton from '../components/home/AvatarButton';
import ModifyButton from '../components/home/ModifyButton';
import SaveButton from '../components/home/SaveButton';
import GenderButtons from '../components/home/GenderButtons';

import { API_BASE_URL, API_CDN_URL } from '../lib/api';
import { userSession } from '../lib/userSession';
import { isAppOnline } from '../lib/network';


export default function ProfilScreen() {

    // State variables
    const [Avatar , setAvatar ] = useState('');
    const [firstName , setFirstName ] = useState('');
    const [lastName , setLastName ] = useState('');
    const [email , setEmail ] = useState('');
    
    
    const [gender , setGender ] = useState('Male');

    const previousAvatarRef = useRef(''); 
    
    // Set the local cache 
    const profileKey = '@snapshot_profile_cache';
    // on build un object avec les states vars pour stocker les données du profil
    const profileData = {
    firstName,
    lastName,
    email,
    
    gender,
    Avatar,
    };

    // set the function to store in the cache 
    const saveProfileToCache = async (data) => {
        try {
          await AsyncStorage.setItem(profileKey, JSON.stringify(data));
          console.log('✅ Données profil sauvegardées en cache');
        } catch (e) {
          console.error('❌ Erreur de sauvegarde cache', e);
        }
      };

    // set the function to load from the cache
    const loadProfileFromCache = async () => {
        try {
          const cached = await AsyncStorage.getItem(profileKey);
          if (cached) {
            const data = JSON.parse(cached);
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setEmail(data.email || '');
            
            setGender(data.gender || null);
            setAvatar(data.avatarUri || '');
            console.log('📦 Profil chargé depuis le cache');
          }
        } catch (e) {
          console.error('⚠️ Erreur de chargement cache', e);
        }
      };
    
    // set the function to store the avatar in the file system
    const saveAvatarToFileSystem = async (uri) => {
        try {
          const fileUri = FileSystem.documentDirectory + '/snapshot/avatars/avatar.jpg';
          await FileSystem.copyAsync({
            from: uri,
            to: fileUri,
          });
          console.log('✅ Avatar sauvegardé dans le système de fichiers');
        } catch (e) {
          console.error('❌ Erreur de sauvegarde avatar', e);
        }
      }

    
    // Récupération email depuis session , useEffect n°1
  useEffect(() => {
    console.log('***** file profilscreen , useEffect n°1 *****');
    
    const loadUser = async () => {
      const session = await userSession();
      if (session.valid) {
        setEmail(session.decoded.email);
        console.log('***** file profilscreen , useEffect n°1 ***** on est dans le useEffect', session.token);
        console.log('***** file profilscreen , useEffect n°1 ***** Token valabel',session.decoded.exp /(10000*60*60));
        
        
      }
    };
    // toujours appeler la fonction déclaré dans le useEffect
    // sinon elle ne sera pas exécutée
    loadUser();
  }, []);

  // loader avatar , useEffect n°2
  // useEffect n°2
useEffect(() => {
  const getAvatar = async () => {
    if (Avatar.startsWith('http')) return; // 🧠 Si déjà mis à jour par CDN → on skippe
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + '/snapshot/avatars/');
    // si presence de files
    if (files.length > 0) {
      const filePath = FileSystem.documentDirectory + '/snapshot/avatars/' + files[0];
      console.log('📦 Avatar local trouvé :', filePath);
      setAvatar(filePath);
    }
  };
  getAvatar();
}, []);



  // loader profil , useEffect n°3
  useEffect(() => {
    loadProfileFromCache();
  }, []);
  
  // save the profile in the cache , useEffect n°4 when the user modify the profile
  useEffect(() => {
    saveProfileToCache({
      firstName,
      lastName,
      email,
      
      gender,
      Avatar,
    });
  }, [firstName, lastName, email, gender, Avatar]);
  

// save the profile in the cache when the user modify the profile , useEffect n°5 
useEffect(() => {
  const syncUserProfile = async () => {
    const online = await isAppOnline();
    if (!online) {
      
      console.log('📡 useEffect 5 — Offline : pas de synchro avec le backend');
      return;
    }

    const session = await userSession();
    if (!session.valid) {
      console.warn('❌ useEffect 5 — Pas de session valide');
      return;
    }

    const token = session.token;

    try {
      console.log('📤 useEffect 5 — Tentative GET profil');
      
      if (!Avatar.startsWith('http')) {
        console.log('⏳ useEffect 5 — Avatar non prêt, on attend le CDN');
        return;
      }

      
      const res = await fetch(`${API_BASE_URL}/api/profil`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 404) {
        console.log('🆕 useEffect 5 — Aucun profil trouvé → envoi POST');

        if (firstName.trim() === '' && lastName.trim() === '') {
          console.warn('🚫 POST annulé — Aucun prénom/nom fourni, pas de création de profil');
          return;
        }
        const createRes = await fetch(`${API_BASE_URL}/api/profil`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            
            gender,
            avatarUri: Avatar,
          }),
        });
        const debugBody = await createRes.text();
        console.log('🛠️ POST status:', createRes.status);
        console.log('📦 Contenu retour POST:', debugBody);
        
        if (createRes.ok) {
          console.log('✅ useEffect 5 — Profil créé avec succès en BDD');
        } else {
          console.warn('❌ useEffect 5 — Échec création profil');
        }
      } else if (res.ok) {
        console.log('📦 useEffect 5 — Profil trouvé → on compare avec le cache');

        const dbProfile = await res.json();

        const localProfile = {
          firstName,
          lastName,
          email,
          
          gender,
          avatarUri: Avatar,
        };

        const hasDiff = Object.keys(localProfile).some(
          (key) => localProfile[key]?.toString() !== dbProfile[key]?.toString()
        );

        if (hasDiff) {
          console.log('🔁 useEffect 5 — Différences détectées → envoi PUT');
          const updateRes = await fetch(`${API_BASE_URL}/api/profil`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(localProfile),
          });

          if (updateRes.ok) {
            console.log('✅ useEffect 5 — Profil mis à jour avec succès');
          } else {
            console.warn('⚠️ useEffect 5 — Échec mise à jour du profil');
          }
        } else {
          console.log('🟢 useEffect 5 — Aucun changement → pas de synchro');
        }
      } else {
        console.warn('⚠️ useEffect 5 — Erreur GET profile');
      }
    } catch (e) {
      console.error('❌ useEffect 5 — Erreur réseau / serveur :', e);
    }
  };

  syncUserProfile();
}, [firstName, lastName, email, gender, Avatar]);


/* Déclenchement automatique
✔️ Vérification de l'état réseau
✔️ Pas d’upload de l’avatar par défaut
✔️ Pas de doublon d’upload
✔️ Remplacement de l’URI locale par l’URL distante (utile pour future synchro BDD) */

// useEffect n°6 : upload avatar vers le cdn .
useEffect(() => {
  const uploadAvatarIfNeeded = async () => {
    const online = await isAppOnline();
    if (!online) return;

    const session = await userSession();
    if (!session.valid) return;

    const userId = session.decoded.userId;

    // 🔁 Évite l'upload si c'est la même image qu'avant
    if (Avatar === previousAvatarRef.current) return;

    // 🚫 Ne rien faire si avatar = astronaute ou image distante
    if (!Avatar || Avatar.includes('astronaute_canard.png') || !Avatar.startsWith('file://')) {
      return;
    }

    try {
      const fileExtension = Avatar.split('.').pop().toLowerCase();
      const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
      const formData = new FormData();
      const uniqueName = `${Date.now()}-${userId}.${fileExtension}`;

      formData.append('userId', userId);
      formData.append('image', {
        uri: Avatar,
        name: uniqueName,
        type: mimeType,
      });

      const res = await fetch(`${API_CDN_URL}/upload/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        console.log('🟢 Avatar uploadé avec succès :', data.fileUrl);
        previousAvatarRef.current = Avatar; // 🧠 Mise à jour du ref
        setAvatar(data.fileUrl);
      }
    } catch (err) {
      console.error('❌ Erreur upload avatar :', err);
    }
  };

  uploadAvatarIfNeeded();
}, [Avatar]);





  return ( <>

<KeyboardAvoidingView className="flex-1 bg-white"
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
  <ScrollView contentContainerStyle={{ padding: 10 }}>
    
    {/* Header */}
        <View className="flex-row justify-center items-center mt-5">
            <Text className="text-lg font-semibold text-gray-400">
              Profil
            </Text>
            {/* <ModifyButton /> */}
        </View>
        <View className=" justify-center items-center mt-6">
            <AvatarButton avatarUri={Avatar} onAvatarChange={(uri) => setAvatar(uri)} />
            {Avatar && (
                <Text className="text-green-600 text-sm mt-2">Profil mis à jour ✅</Text> 
                )}
        </View>
        


    {/* ici ton View avec le formulaire */}

    <View className="bg-white flex flex-start ">

        {/* Formulaire */}
           <LabelForm>
                <LabelInput
                         label="First name"
                         value={firstName}
                         onChangeText={setFirstName}        
                        //  color={'#ffe8cc'}
                />
                       <LabelInput
                         label="Last name"
                         value={lastName}
                         onChangeText={setLastName}
                         color={'#ffe8cc'}
                       />
                       <LabelInput
                         label="Email"
                         value={email}
                         onChangeText={setEmail}
                        //  color={'#ffe8cc'}  
                         autoCapitalize="none"
                         disabled={true}
                    
                       />
                       {/* Date Picker Field */}   

                       
                        <GenderButtons gender={gender} setGender={setGender}/>
            </LabelForm>
            
    </View>

  </ScrollView>
</KeyboardAvoidingView>


        </> )
}