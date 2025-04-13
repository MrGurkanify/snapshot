/**
 * 📁 File : ProfilScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/ProfilScreen.js
 * 📅 Created at : 2025-04-12
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */




import { View, Text, KeyboardAvoidingView, ScrollView, Platform , TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import * as Linking from 'expo-linking';


// Custom components
import LabelForm from '../components/home/LabelForm';
import LabelInput from '../components/home/LabelInput';
import GenderButtons from '../components/home/GenderButtons';

import { API_BASE_URL } from '../lib/api';
import { userSession } from '../lib/userSession';
import { isAppOnline } from '../lib/network';
import { removeData } from '../lib/dataOps';

export default function ProfilScreen() {
  const [user, setUser] = useState(null);
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');

  // Load user session
  useEffect(() => {
    const loadUser = async () => {
      const session = await userSession();
      if (session.valid) {
        setUser(session.decoded);
        setEmail(session.decoded.email);
      }
    };
    loadUser();
  }, []);

  // Load profile from cache when user is available
  useEffect(() => {
    if (!user) return;

    const loadProfileFromCache = async () => {
      const profileKey = `@snapshot_profile_cache_${user.userId}`;
      const cached = await AsyncStorage.getItem(profileKey);
      if (!cached) return;

      const data = JSON.parse(cached);

      if (!data.firstName && !data.lastName) {
        console.warn('⚠️ Données du cache vides — pas de restore');
        return;
      }

      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setGender(data.gender || 'Male');
      setHasLoadedProfile(true);
    };

    loadProfileFromCache();
  }, [user]);

  // Save profile to cache when modified
  useEffect(() => {
    // if (!hasLoadedProfile) return;

    const saveProfileToCache = async () => {
      const session = await userSession();
      if (!session.valid) return;

      if (!firstName && !lastName ) {
        console.warn('🚫 Données vides — pas de sauvegarde cache');
        return;
      }

      const profileKey = `@snapshot_profile_cache_${session.decoded.userId}`;
      const data = {
        userId: session.decoded.userId,
        firstName,
        lastName,
        gender,
      };

      try {
        await AsyncStorage.setItem(profileKey, JSON.stringify(data));
        console.log('✅ Données profil sauvegardées en cache');
      } catch (e) {
        console.error('❌ Erreur de sauvegarde cache', e);
      }
    };

    saveProfileToCache();
  }, [firstName, lastName, gender]);

  // Sync to backend
  useEffect(() => {
    const syncUserProfile = async () => {
      if (!user) return;

      const online = await isAppOnline();
      if (!online) return;

      const token = (await userSession()).token;

      if (!firstName.trim() && !lastName.trim()) {
        console.log('⛔ useEffect 5 — PUT annulé : données locales vides');
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/profil`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          console.log('🆕 Aucun profil — envoi POST');

          const createRes = await fetch(`${API_BASE_URL}/api/profil`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ firstName, lastName, email, gender }),
          });

          if (createRes.ok) console.log('✅ Profil créé');
          else console.warn('❌ Échec création profil');
        } else if (res.ok) {
          const dbProfile = await res.json();
          const localProfile = { firstName, lastName, email, gender };

          const hasDiff = Object.keys(localProfile).some(
            (key) => localProfile[key]?.toString() !== dbProfile[key]?.toString()
          );

          if (hasDiff) {
            console.log('🔁 Différences détectées → envoi PATCH');
            const patchRes = await fetch(`${API_BASE_URL}/api/profil`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(localProfile),
            });

            if (patchRes.ok) console.log('✅ Profil mis à jour');
            else console.warn('❌ Échec mise à jour');
          }
        }
      } catch (e) {
        console.error('❌ Erreur sync profil:', e);
      }
    };

    syncUserProfile();
  }, [firstName, lastName, email, gender]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <View className="flex-row justify-center items-center mt-5">
          <Text className="text-lg font-semibold text-gray-400">Profil</Text>
        </View>

        <View className="bg-white flex flex-start">
          <LabelForm>
            <LabelInput label="First name" value={firstName} onChangeText={setFirstName} />
            <LabelInput label="Last name" value={lastName} onChangeText={setLastName} />
            <LabelInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              disabled={true}
            />
            <GenderButtons gender={gender} setGender={setGender} />
          </LabelForm>
        </View>

        <View className="mt-10 items-center">
            <Text className="text-sm text-gray-400 text-center">
              Need help or want more features?
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('mailto:support@snapshotfa.st?subject=Support%20Request')
              }
            >
              <Text className="text-blue-500 underline mt-1">
                Contact our support team
              </Text>
            </TouchableOpacity>
        </View>


      </ScrollView>
    </KeyboardAvoidingView>
  );
}
