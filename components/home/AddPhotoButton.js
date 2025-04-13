/**
 * 📁 File : AddSupplierPhotoButton.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/AddSupplierPhotoButton.js
 * 📅 Created at : 2025-03-30
 * 👤 Author  : William Balikel
 * ✍️  Description : 
 * 
 * 
 */


import { View, Text, TouchableOpacity } from 'react-native';
import { PlusIcon, CameraIcon } from 'react-native-heroicons/outline';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import * as Linking from 'expo-linking';
import Toast from 'react-native-toast-message';

export default function AddPhotoButton({ onImageSelected, currentCount = 0 }) {
  const [image, setImage] = useState(null);
  const maxReached = currentCount >= 3;

  const showLimitToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Limit reached',
      text2: 'You can only add up to 3 photos',
      position: 'bottom',
      visibilityTime: 2500,
    });
  };

  const takePhotoAsync = async () => {
    if (maxReached) return showLimitToast();

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      if (!permissionResult.canAskAgain) {
        alert('Camera access has been denied. Please enable it manually in your phone settings.');
        Linking.openSettings();
      } else {
        alert('Permission to access camera is required!');
      }
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImage(uri);
      onImageSelected && onImageSelected(uri);
      console.log('📸 Photo prise :', uri);
    } else {
      console.log('📷 Prise de photo annulée');
    }
  };

  const pickImageAsync = async () => {
    if (maxReached) return showLimitToast();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImage(uri);
      console.log('🖼️ Image sélectionnée :', uri);
      onImageSelected && onImageSelected(uri);
    } else {
      alert('You did not select an image, please select a photo');
    }
  };

  return (
    <View className="flex-row justify-around items-center my-20">
      {/* Add from gallery */}
      <View className="items-center">
        <TouchableOpacity
          onPress={pickImageAsync}
          className={`w-14 h-14 rounded-full items-center justify-center border-dashed border-2 ${
            maxReached ? 'bg-gray-200 border-gray-300' : 'bg-white border-blue-400'
          }`}
        >
          <PlusIcon size={32} color={maxReached ? '#A1A1AA' : '#0EA5E9'} />
        </TouchableOpacity>
        <Text className={`text-sm mt-2 ${maxReached ? 'text-gray-400' : 'text-red-300'}`}>
          Add 3 photos max.
        </Text>
      </View>

      {/* Take photo */}
      <View className="items-center">
        <TouchableOpacity
          onPress={takePhotoAsync}
          className={`w-14 h-14 rounded-full items-center justify-center border-dashed border-2 ${
            maxReached ? 'bg-gray-200 border-gray-300' : 'bg-white border-blue-400'
          }`}
        >
          <CameraIcon size={32} color={maxReached ? '#A1A1AA' : '#0EA5E9'} />
        </TouchableOpacity>
        <Text className={`text-sm mt-2 ${maxReached ? 'text-gray-400' : 'text-red-300'}`}>
          Take 3 photos max.
        </Text>
      </View>
    </View>
  );
}
