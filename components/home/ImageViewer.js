import React, { useRef, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Text, Dimensions, Modal } from 'react-native';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon, XMarkIcon } from 'react-native-heroicons/solid';

const { width, height } = Dimensions.get('window');
const IMAGE_WIDTH = width;

export default function ImageViewer({ images = [], onTrashPress }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const scrollToIndex = (index) => {
    if (index >= 0 && index < images.length) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalVisible(true);
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

      {/* Image slider */}
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
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => openModal(index)}
            activeOpacity={0.9}
            style={{ width, alignItems: 'center' }}
          >
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
                <TrashIcon size={32} color="#EF4444" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Indicator */}
      <Text className="text-sm text-gray-400 mt-2">
        {currentIndex + 1} / {images.length}
      </Text>

      {/* Modal plein écran */}
      <Modal visible={modalVisible} transparent={true}>
  <View className="flex-1 bg-black justify-center items-center ">
    <TouchableOpacity
      className="absolute top-12 mt-20 right-12 z-20 border-2 border-white rounded-full p-1"
      onPress={() => setModalVisible(false)}
    >
      <XMarkIcon size={30} color="white" />
    </TouchableOpacity>

    <FlatList
      data={images}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={currentIndex}
      getItemLayout={(data, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      }}
      renderItem={({ item }) => (
        <View
          style={{
            width: width,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: item }}
            style={{
              width: width,
              height: height,
              resizeMode: 'cover',
              marginTop: 40,
              marginBottom: 20,
              borderRadius: 15,
            }}
          />
        </View>
      )}
    />
  </View>
</Modal>

    </View>
  );
}
