
/**
 * 📁 File : SupplierEditScreen.js
 * 🛤️  Path  : ~/developpement/snapshot/screens/SupplierEditScreen.js
 * 📅 Created at : 2025-04-10
 * 👤 Author  : William Balikel
 * ✍️  Description : Édition d’un fournisseur avec prefill, cache, PATCH sécurisé
 */

import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView,
  Platform, Image, TouchableOpacity, Modal, Pressable, Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TrashIcon } from 'react-native-heroicons/solid';
import { BlurView } from 'expo-blur';
import * as Network from 'expo-network';


import AsyncStorage from '@react-native-async-storage/async-storage';


import LeftArrow from '../components/home/LeftArrow';
import LabelForm from '../components/home/LabelForm';
import LabelInput from '../components/home/LabelInput';
import NoteArea from '../components/home/NoteArea';
import AddPhotoButton from '../components/home/AddPhotoButton';
import AddSupplierButton from '../components/home/AddSupplierButton';
import ImageViewer from '../components/home/ImageViewer';

import { API_BASE_URL , API_CDN_URL } from '../lib/api';
import { userSession } from '../lib/userSession';
import { saveData, loadData, removeData } from '../lib/dataOps';

export default function SupplierEditScreen() {
  const { supplierId } = useLocalSearchParams();
  const router = useRouter();

  const [supplierName, setSupplierName] = useState('');
  const [contactName, setContactName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [note, setNote] = useState('');

  const [initialData, setInitialData] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [user, setUser] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const cacheKey = `@edit_supplier_${supplierId}`;

  useEffect(() => {
    const fetchSessionAndData = async () => {
      const session = await userSession();
      if (!session.valid) return router.replace('/login');
      setUser(session);

      try {
        const res = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}`, {
          headers: { Authorization: `Bearer ${session.token}` }
        });

        const data = await res.json();
        if (res.ok) {
          setInitialData(data);
          setSupplierName(data.supplierName || '');
          setContactName(data.contactName || '');
          setTelephone(data.telephone || '');
          setSupplierEmail(data.supplierEmail || '');
          setNote(data.note || '');
          setSelectedImages(data.selectedImages || []);
        } else {
          console.warn('⚠️ Erreur chargement fournisseur :', data.message);
        }
      } catch (err) {
        console.error('❌ Erreur réseau GET supplier :', err);
      }
    };

    fetchSessionAndData();
  }, [supplierId]);

  useEffect(() => {
    const current = { supplierName, contactName, telephone, supplierEmail, note, selectedImages };
    saveData(cacheKey, current);
  }, [supplierName, contactName, telephone, supplierEmail, note, selectedImages]);

  useEffect(() => {
    const preloadCache = async () => {
      const cached = await loadData(cacheKey);
      if (cached) {
        setSupplierName(cached.supplierName || '');
        setContactName(cached.contactName || '');
        setTelephone(cached.telephone || '');
        setSupplierEmail(cached.supplierEmail || '');
        setNote(cached.note || '');
        setSelectedImages(cached.selectedImages || []);
      }
    };
    preloadCache();
  }, []);

  const handleRemoveImage = (index) => {
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  };

  const confirmRemoveImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImages((prev) => prev.filter((_, i) => i !== selectedImageIndex));
      setSelectedImageIndex(null);
      setIsModalVisible(false);
    }
  };

  const hasChanges = () => {
    return (
      supplierName !== initialData.supplierName ||
      contactName !== initialData.contactName ||
      telephone !== initialData.telephone ||
      supplierEmail !== initialData.supplierEmail ||
      note !== initialData.note ||
      JSON.stringify(selectedImages) !== JSON.stringify(initialData.selectedImages)
    );
  };

  const handleUpdateSupplier = async () => {
    if (!hasChanges()) {
      Alert.alert('Aucune modification', 'Aucun changement détecté.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        supplierName,
        contactName,
        telephone,
        supplierEmail,
        note,
        selectedImages
      };

      const res = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Alert.alert('Succès', 'Fournisseur modifié.');
        await removeData(cacheKey);
        router.back();
      } else {
        const text = await res.text();
        console.warn('❌ PATCH échoué :', text);
        Alert.alert('Erreur', 'Échec de la mise à jour.');
      }
    } catch (err) {
      console.error('❌ Erreur réseau PATCH :', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSupplier = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      if (res.ok) {
        console.log('✅ Supplier supprimé');
  
        // Nettoyage cache local
        await AsyncStorage.removeItem(`@edit_supplier_${supplierId}`);
  
        // BONUS : suppression dans le CDN (optionnel, voir plus bas)
        await fetch(`${API_CDN_URL}/delete/supplier`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.userId,
            supplierId,
          }),
        });
  
        // Redirection + Toast éventuel
        Alert.alert('Fournisseur supprimé', 'Le fournisseur a été supprimé avec succès.');
        router.replace('/home');
      } else {
        Alert.alert('Erreur', 'La suppression a échoué.');
      }
    } catch (e) {
      console.error('❌ Erreur delete :', e);
      Alert.alert('Erreur réseau', 'Impossible de supprimer le fournisseur.');
    } finally {
      setDeleteModalVisible(false);
    }
  };



  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        {/* Modal suppression image */}
        <Modal visible={isModalVisible} transparent animationType="fade">
          <BlurView intensity={50} tint="dark" className="flex-1 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Supprimer l'image ?</Text>
              <Text className="text-gray-600 mb-6">Voulez-vous vraiment supprimer cette image ?</Text>
              <View className="flex-row justify-end space-x-4 gap-10">
                <Pressable onPress={() => setIsModalVisible(false)} className="px-4 py-2 rounded-md bg-green-200">
                  <Text className="text-green-800">Annuler</Text>
                </Pressable>
                <Pressable onPress={confirmRemoveImage} className="px-4 py-2 rounded-md bg-red-500">
                  <Text className="text-white">Supprimer</Text>
                </Pressable>
              </View>
            </View>
          </BlurView>
        </Modal>

        <View className="flex-row items-center mt-10 mb-5 gap-12">
          <LeftArrow />
          <Text className="text-lg font-semibold text-gray-400">
            Modify {initialData?.supplierName || ''}
          </Text>
        </View>

        <LabelForm>
          <LabelInput label="Name" value={supplierName} onChangeText={setSupplierName} />
          <LabelInput label="Contact name" value={contactName} onChangeText={setContactName} />
          <LabelInput label="Telephone" value={telephone} onChangeText={setTelephone} keyboardType="numeric" />
          <LabelInput
            label="Email"
            value={supplierEmail}
            onChangeText={setSupplierEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <NoteArea
            label="Note"
            value={note}
            onChangeText={setNote}
            placeholder="Add a note about this supplier"
          />
        </LabelForm>

        <ImageViewer images={selectedImages} onTrashPress={handleRemoveImage} />
        <AddPhotoButton onImageSelected={(uri) => setSelectedImages((prev) => [...prev, uri])} currentCount={selectedImages.length} />
        
        
        
        <AddSupplierButton
          onPress={handleUpdateSupplier}
          label="Modify"
          disabled={!hasChanges() || isLoading}
          loading={isLoading}
        />

        

        <Modal visible={deleteModalVisible} transparent animationType="fade">
          <BlurView intensity={50} tint="dark" className="flex-1 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Delete this supplier ?</Text>
              <Text className="text-gray-600 mb-6">
              This action is irreversible. All related data and images will be deleted. 
              </Text>
              <View className="flex-row justify-end gap-6">
                <Pressable onPress={() => setDeleteModalVisible(false)} className="bg-gray-200 px-4 py-2 rounded-md">
                  <Text className="text-gray-700">Cancel</Text>
                </Pressable>
                <Pressable onPress={handleDeleteSupplier} className="bg-red-500 px-4 py-2 rounded-md">
                  <Text className="text-white">Delete</Text>
                </Pressable>
              </View>
            </View>
          </BlurView>
        </Modal>

        <TouchableOpacity
          onPress={() => setDeleteModalVisible(true)}
          className="bg-red-600 p-3 w-52 rounded-2xl mt-16 mb-20 self-center"
        >
          <Text className="text-white text-xl text-center font-semibold">Delete this supplier</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
