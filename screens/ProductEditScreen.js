/**
 * 📁 File : ProductEditScreen.js
 * 🛤️  Path  : ~/developpement/snapshot/screens/ProductEditScreen.js
 * 📅 Created at : 2025-04-11
 * 👤 Author  : William Balikel
 * ✍️  Description : Édition d’un produit avec prefill, cache, PATCH sécurisé, suppression CDN
 */

import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView,
  Platform, Alert, Modal, Pressable, TouchableOpacity
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TrashIcon } from 'react-native-heroicons/solid';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LeftArrow from '../components/home/LeftArrow';
import LabelForm from '../components/home/LabelForm';
import LabelInput from '../components/home/LabelInput';
import NoteArea from '../components/home/NoteArea';
import AddPhotoButton from '../components/home/AddPhotoButton';
import AddSupplierButton from '../components/home/AddSupplierButton';
import ImageViewer from '../components/home/ImageViewer';

import { API_BASE_URL, API_CDN_URL } from '../lib/api';
import { userSession } from '../lib/userSession';
import { saveData, loadData, removeData } from '../lib/dataOps';

export default function ProductEditScreen() {
  const router = useRouter();
  const { productId, supplierId } = useLocalSearchParams();

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const [initialData, setInitialData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageIndexToDelete, setImageIndexToDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cacheKey = `@edit_product_${productId}`;

  useEffect(() => {
    // le fait que cette fonction qui suit soit dans un useEffect est très important
    // en plus on le nomme init comme pour démarrage 
    // il permet de switcher d'écran quand y a plus de token de session 
    // ramene le user directement vers /login ce qui arrive toutes les 30 minutes
    const init = async () => {
      const session = await userSession();
      if (!session.valid) return router.replace('/login');
      setUser(session);

      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${session.token}` }
        });
        // res.json() convertit la réponse JSON en object javascript
        const data = await res.json();
// si c'est 200 c'est que tout va bien
// on initialise les states vars avec les données reçues du backend concernant le produit
        if (res.ok) {
          setInitialData(data);
          setProductName(data.productName || '');
          setDescription(data.description || '');
          setPrice(data.price || '');
          setSelectedImages(data.images || []);
        } else {
          console.warn('❌ Erreur GET produit :', data.message);
        }
      } catch (err) {
        console.error('❌ Erreur réseau produit :', err);
      }
    };
    init();
  }, [productId]);


// le useEffect qui suit est pour le cache
// on save le cache 
  useEffect(() => {
    const saveCache = () => {
      // on créé un objet data avec les données du produit  
      const data = { productName, description, price, selectedImages };
      saveData(cacheKey, data);
    };
    saveCache();
    // on save grace au trigger du useEffect sur les sondes ici .
  }, [productName, description, price, selectedImages]);



// on load le cache à chaque chargement du composant par react 
// drôle est la schématique d'appelle du useEffect 
  useEffect(() => {
    const preload = async () => {
      const cached = await loadData(cacheKey);
      if (cached) {
        setProductName(cached.productName || '');
        setDescription(cached.description || '');
        setPrice(cached.price || '');
        setSelectedImages(cached.selectedImages || []);
      }
    };
    preload();
  }, []);
// notre sonde de détection de changement
  // on compare les données initiales avec les données modifiées
  // si elles sont différentes, on retourne true
  const hasChanges = () => {
    return (
      productName !== initialData.productName ||
      description !== initialData.description ||
      price !== initialData.price ||
      JSON.stringify(selectedImages) !== JSON.stringify(initialData.images)
    );
  };


// au cas ou on appui sur le button modify alors qu'il n'y a pas de changement
  const handleUpdateProduct = async () => {
    if (!hasChanges()) {
      Alert.alert('Aucune modification détectée.');
      return;
    }
    // nous empeche d'envoyer 2 fois la modification au backend
    // c'est une balise de marqueur dans le code syntax super intéressente comme approche
    if (submitted) return;

    setSubmitted(true);
    setIsLoading(true);

    try {
      const payload = {
        productName,
        description,
        price,
        images: selectedImages,
      };

      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });
// si le backend répond avec un 200 
      if (res.ok) {
        Alert.alert('Succès', 'Produit modifié avec succès.');
        await removeData(cacheKey);
        router.back();
      } else {
        const text = await res.text();
        console.warn('❌ PATCH produit :', text);
        Alert.alert('Erreur', 'Impossible de modifier ce produit.');
      }
    } catch (err) {
      console.error('❌ Erreur PATCH :', err);
    } finally {
      setIsLoading(false);
      setSubmitted(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageIndexToDelete(index);
    setIsModalVisible(true);
  };

  const confirmRemoveImage = () => {
    if (imageIndexToDelete !== null) {
      setSelectedImages((prev) => prev.filter((_, i) => i !== imageIndexToDelete));
      setImageIndexToDelete(null);
      setIsModalVisible(false);
    }
  };



  // la delete fonction
  const handleDeleteProduct = async () => {
    if (submitted) return;
    setSubmitted(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        await AsyncStorage.removeItem(cacheKey);

        await fetch(`${API_CDN_URL}/delete/product`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.userId,
            productId,
            supplierId,
          }),
        });

        Alert.alert('Produit supprimé', 'Le produit a bien été supprimé.');
        router.replace(`/supplier-details?supplierId=${supplierId}`);
      } else {
        Alert.alert('Erreur', 'Impossible de supprimer ce produit.');
      }
    } catch (err) {
      console.error('❌ Erreur DELETE produit :', err);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    } finally {
      setDeleteModalVisible(false);
      setSubmitted(false);
    }
  };



  // le rendu jsx

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

        {/* Titre haut */}
        <View className="flex-row items-center mt-10 mb-5 gap-12">
          <LeftArrow />
          <Text className="text-lg font-semibold text-gray-400">
            Modify {initialData?.productName || ''}
          </Text>
        </View>

        <LabelForm>
          <LabelInput label="Product name" value={productName} onChangeText={setProductName} />
          <NoteArea
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Add a description about this product"
          />
          <LabelInput label="Price" value={price} onChangeText={setPrice} />
        </LabelForm>

        <ImageViewer images={selectedImages} onTrashPress={handleRemoveImage} />

        <AddPhotoButton
          onImageSelected={(uri) => setSelectedImages((prev) => [...prev, uri])}
          currentCount={selectedImages.length}
        />

        <AddSupplierButton
          label="Modify"
          onPress={handleUpdateProduct}
          disabled={!hasChanges() || isLoading}
          loading={isLoading}
        />

        {/* Modal suppression produit */}
        <Modal visible={deleteModalVisible} transparent animationType="fade">
          <BlurView intensity={50} tint="dark" className="flex-1 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Delete this product ?</Text>
              <Text className="text-gray-600 mb-6">
                This action is irreversible. All related data and images will be deleted.
              </Text>
              <View className="flex-row justify-end gap-6">
                <Pressable onPress={() => setDeleteModalVisible(false)} className="bg-gray-200 px-4 py-2 rounded-md">
                  <Text className="text-gray-700">Cancel</Text>
                </Pressable>
                <Pressable onPress={handleDeleteProduct} className="bg-red-500 px-4 py-2 rounded-md">
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
          <Text className="text-white text-xl text-center font-semibold">Delete this product</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

