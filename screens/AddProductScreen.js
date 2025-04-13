/**
 * 📁 File : AddProductScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/AddProductScreen.js
 * 📅 Created at : 2025-04-09
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

/**
 * 📁 File : AddProductScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/AddProductScreen.js
 * 📅 Updated : 2025-04-10
 * 👤 Author  : William Balikel
 */

import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView,
  Platform, Alert, Modal, Pressable, Image, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TrashIcon } from 'react-native-heroicons/solid';
import { BlurView } from 'expo-blur';

import LeftArrow from '../components/home/LeftArrow';
import LabelForm from '../components/home/LabelForm';
import LabelInput from '../components/home/LabelInput';
import NoteArea from '../components/home/NoteArea';
import AddPhotoButton from '../components/home/AddPhotoButton';
import AddSupplierButton from '../components/home/AddSupplierButton';
import ImageViewer from '../components/home/ImageViewer';
import FreemiumNotice from '../ui/FreemiumNotice';


import { API_BASE_URL, API_CDN_URL } from '../lib/api';
import { userSession } from '../lib/userSession';
import { saveData, loadData, removeData } from '../lib/dataOps';

export default function AddProductScreen() {
  const router = useRouter();
  const { supplierId } = useLocalSearchParams();

  const [supplierName, setSupplierName] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageIndexToDelete, setImageIndexToDelete] = useState(null);

  const [user, setUser] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cacheKey = `@product_cache_${supplierId}`;

  useEffect(() => {
    const loadSession = async () => {
      const session = await userSession();
      if (!session.valid) {
        router.replace('/login');
        return;
      }
      setUser({
        token: session.token,
        userId: session.decoded.userId,
        isFullAccess: session.decoded.isFullAccess,
      });
    };
    loadSession();
  }, []);



  useEffect(() => {
    if (productName.trim().length === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [productName]);



  useEffect(() => {
    const loadCached = async () => {
      const data = await loadData(cacheKey);
      if (data) {
        setProductName(data.productName || '');
        setDescription(data.description || '');
        setPrice(data.price || '');
        setSelectedImages(data.selectedImages || []);
      }
    };
    loadCached();
  }, []);




  useEffect(() => {
    const currentData = { productName, description, price, selectedImages };
    saveData( cacheKey , currentData);
    
  }, [productName, description, price, selectedImages]);


  useEffect(() => {
    const fetchSupplierName = async () => {
      try {
        if (!supplierId || !user?.token) return;
  
        const res = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
  
        if (res.ok) {
          const data = await res.json();
          setSupplierName(data.supplierName);
        } else {
          console.warn('❌ Impossible de récupérer le nom du fournisseur');
        }
      } catch (err) {
        console.error('❌ Erreur fetch supplierName :', err);
      }
    };
  
    fetchSupplierName();
  }, [supplierId, user]);



  const handleImageSelect = (uri) => {
    if (selectedImages.length >= 3) {
      Alert.alert('Limite atteinte', 'Vous ne pouvez ajouter que 3 images.');
      return;
    }
    if (selectedImages.includes(uri)) {
      Alert.alert('Image déjà ajoutée.');
      return;
    }
    setSelectedImages(prev => [...prev, uri]);
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

  const handleCreateProduct = async () => {
    if (submitted) return;
    setSubmitted(true);

    try {
      if (!productName.trim()) {
        Alert.alert('Erreur', 'Le nom du produit est requis.');
        return;
      }

      if (selectedImages.length === 0) {
        Alert.alert('Erreur', 'Vous devez ajouter au moins une image.');
        return;
      }

      setIsLoading(true);

      const uploadedImageUrls = [];

      for (const localUri of selectedImages) {
        const ext = localUri.split('.').pop();
        const uniqueName = `product-${Date.now()}.${ext}`;
        const formData = new FormData();

        formData.append('userId', user.userId);
        formData.append('supplierId', supplierId);
        formData.append('image', {
          uri: localUri,
          name: uniqueName,
          type: `image/${ext}`,
        });

        const res = await fetch(`${API_CDN_URL}/upload/product`, {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.success) {
          uploadedImageUrls.push(data.fileUrl);
        } else {
          uploadedImageUrls.push(localUri); // fallback local
        }
      }

      const backendRes = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          productName: productName.trim(),
          description: description.trim(),
          price: price.trim(),
          supplierId,
          images: uploadedImageUrls,
        }),
      });

      if (backendRes.ok) {
        Alert.alert('Succès', 'Produit créé avec succès.');
        await removeData(cacheKey);
        router.back();
      } else {
        const text = await backendRes.text();
        console.warn('❌ Erreur POST backend :', text);
        Alert.alert('Erreur', 'Impossible de créer le produit.');
      }

    } catch (err) {
      console.error('❌ Erreur création produit :', err);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    } finally {
      setSubmitted(false);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">

        {/* Modal Trash Confirmation */}
        <Modal visible={isModalVisible} transparent animationType="fade">
          <BlurView intensity={50} tint="dark" className="flex-1 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Delete the image ?</Text>
              <Text className="text-gray-600 mb-6">Do you want to delete this image ?</Text>
              <View className="flex-row justify-end space-x-4 gap-10">
                <Pressable onPress={() => setIsModalVisible(false)} className="px-4 py-2 rounded-md bg-green-200">
                  <Text className="text-green-800">Cancel</Text>
                </Pressable>
                <Pressable onPress={confirmRemoveImage} className="px-4 py-2 rounded-md bg-red-500">
                  <Text className="text-white">Delete</Text>
                </Pressable>
              </View>
            </View>
          </BlurView>
        </Modal>

        <View className="flex-row items-center mt-10 mb-5 gap-12">
          <LeftArrow />
          <Text className="text-lg font-semibold text-gray-400">Add new product for {supplierName}</Text>
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
          onImageSelected={handleImageSelect}
          currentCount={selectedImages.length}
        />

        <AddSupplierButton
          label="Create"
          onPress={handleCreateProduct}
          disabled={isDisabled}
          loading={isLoading}
        />

        {/* Message avertissement freemium   */}
          {user && !user.isFullAccess && (
                      <FreemiumNotice/>
          )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

