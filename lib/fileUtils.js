/**
 * 📁 File : fileUtils.js
 * 🛤️  Path  : ~/developpement /snapshot/lib/fileUtils.js
 * 📅 Created at : 2025-04-04
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

// 📁 lib/fileUtils.js

import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';

export async function downloadToLocal(remoteUri) {
    try {
      const filename = remoteUri.split('/').pop();
      const newLocalUri = `${FileSystem.documentDirectory}${Date.now()}-${filename}`;
  
      if (remoteUri.startsWith('file://')) {
        // ✅ Cas d'une image locale (photo prise par caméra ou choisie depuis galerie)
        await FileSystem.copyAsync({
          from: remoteUri,
          to: newLocalUri,
        });
        return newLocalUri;
      }
  
      // Sinon, c'est une image distante à télécharger
      const downloadResumable = FileSystem.createDownloadResumable(
        remoteUri,
        newLocalUri
      );
  
      const { uri } = await downloadResumable.downloadAsync();
      return uri;
    } catch (error) {
      console.error('❌ Erreur téléchargement image :', error);
      return null;
    }
  }
  





export async function getCachedImagePath(remoteUri) {

    // 💡 Ne rien faire si c’est déjà un fichier local
  if (remoteUri.startsWith('file://')) {
    return remoteUri;
  }

  // On génère un nom unique basé sur le hash de l'URL
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    remoteUri
  );

  const fileUri = `${FileSystem.cacheDirectory}${hash}.jpg`;

  // Si le fichier existe déjà → on le retourne
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists) {
    return fileUri;
  }

  // Sinon on le télécharge
  try {
    const downloadResult = await FileSystem.downloadAsync(remoteUri, fileUri);
    return downloadResult.uri;
  } catch (err) {
    console.error('❌ Erreur de téléchargement image :', err);
    return remoteUri; // fallback : retourne l’URL distante
  }
}
