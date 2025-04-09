/**
 * 📁 File : SupplierCard.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/SupplierCard.js
 * 📅 Created at : 2025-04-04
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

// 📁 components/home/SupplierCard.js
import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { API_BASE_URL } from '../../lib/api';
import { getCachedImagePath } from '../../lib/fileUtils';


export default function SupplierCard({ supplier, user }) {

  const router = useRouter();
  const [productCount, setProductCount] = useState(0);
  const [localImageUri, setLocalImageUri] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/count?supplierId=${supplier._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const text = await res.text(); // on lit la réponse brute
        console.log(`🧪 Réponse brute de count pour ${supplier.supplierName} :`, text);

        const data = JSON.parse(text); // on parse ensuite
        setProductCount(data.count || 0);
      } catch (err) {
        console.error(`❌ Erreur fetch product count pour ${supplier.supplierName}`, err);
      }
    };

    fetchCount();
  }, []);


  useEffect(() => {
    const loadImage = async () => {
      const remoteUrl = supplier.selectedImages?.[0];
      if (!remoteUrl) return;
      const localPath = await getCachedImagePath(remoteUrl);
      console.log('📁 Image téléchargée ou récupérée depuis cache :', localPath);
      setLocalImageUri(localPath);
    };

    loadImage();
  }, [supplier]);

  const imageSource = localImageUri && localImageUri.startsWith('file://')
  ? { uri: localImageUri }
  : { uri: supplier.selectedImages?.[0] || 'https://cdn.snapshotfa.st/images/astronaute_canard.png' };

  // const imageUrl = supplier.selectedImages?.[0] || 'https://cdn.snapshotfa.st/images/astronaute_canard.png';
  console.log('🧩 Affichage card pour :', supplier.supplierName);
  console.log('✅ Image locale utilisée :', localImageUri)

  return (
    <TouchableOpacity onPress={() => router.push({
      pathname: '/supplier-detail',
      params: {
        supplierId: supplier._id,
        supplierName: supplier.supplierName,
      }
    })}>
      <View className="flex-row items-center gap-5 bg-gray-100 rounded-xl mb-4 p-4 shadow-sm border border-blue-200">
        <Image
          source={imageSource}
          // cacheKey={supplier._id}
          className="w-16 h-16 rounded-lg border border-gray-300"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{supplier.supplierName}</Text>
          <Text className="text-sm text-gray-500">{productCount} produit{productCount > 1 ? 's' : ''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
