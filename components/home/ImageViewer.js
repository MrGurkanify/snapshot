/**
 * 📁 File : ImageViewer.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/ImageViewer.js
 * 📅 Updated at : 2025-04-10
 * 👤 Author  : William Balikel
 * ✍️  Description : Affiche un carousel d’images avec navigation et icône de suppression.
 */

import React, { useRef, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from 'react-native-heroicons/solid';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width;

export default function ImageViewer({ images = [], onTrashPress }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index) => {
    if (index >= 0 && index < images.length) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  return (
    <View className="relative items-center my-6">
      {/* Arrows */}
      {images.length > 1 && (
        <>
          <TouchableOpacity
            onPress={() => scrollToIndex(currentIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-2 z-10"
          >
            <ChevronLeftIcon size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => scrollToIndex(currentIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-2 z-10"
          >
            <ChevronRightIcon size={24} color="white" />
          </TouchableOpacity>
        </>
      )}

      <FlatList
        data={images}
        ref={flatListRef}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: 'center' }}>
            <Image
              source={{ uri: item }}
              style={{
                width: IMAGE_WIDTH,
                height: 250,
                borderRadius: 15,
                resizeMode: 'cover',
              }}
            />

            {/* Trash icon (si onTrashPress est fourni) */}
            {onTrashPress && (
              <TouchableOpacity
                onPress={() => onTrashPress(currentIndex)}
                className="absolute top-3 right-8 bg-white/80 p-2 rounded-full"
              >
                <TrashIcon size={22} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <Text className="text-sm text-gray-400 mt-2">
        {currentIndex + 1} / {images.length}
      </Text>
    </View>
  );
}
