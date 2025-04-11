/**
 * 📁 File : dataOps.js
 * 🛤️  Path  : ~/developpement /snapshot/lib/dataOps.js
 * 📅 Created at : 2025-04-02
 * 👤 Author  : William Balikel
 * ✍️  Description : Mise en place d'un cache système pour la gestion des données avec AsyncStorage
 *     avec AsyncStorage (multi-écran supporté)
 *     permet de conserver les données entre les switche d'écran
 */


import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Enregistre des données dans le cache pour une clé donnée
export const saveData = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`✅ Données sauvegardées [${key}]`, data);
  } catch (e) {
    console.error(`❌ Erreur sauvegarde [${key}] :`, e);
  }
};

// ✅ Charge les données d'une clé spécifique
export const loadData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      console.log(`📦 Données récupérées [${key}]`, JSON.parse(jsonValue));
      return JSON.parse(jsonValue);
    } else {
      console.log(`📭 Aucun cache trouvé pour [${key}]`);
      return null;
    }
  } catch (e) {
    console.error(`❌ Erreur lecture [${key}] :`, e);
  }
};

// ✅ Supprime une entrée spécifique
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`🗑️ Cache supprimé pour [${key}]`);
  } catch (e) {
    console.error(`❌ Erreur suppression [${key}] :`, e);
  }
};

// ⚠️ Efface tout le cache de l'app (utile uniquement en cas de reset complet)
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('🧹 Tous les caches ont été supprimés');
  } catch (e) {
    console.error('❌ Erreur clearAllData :', e);
  }
};

export const saveProductDataToCache = async (data) => {
    try {
      const key = '@snapshot_product_cache';
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
      console.log('✅ Données produit sauvegardées en cache :', jsonValue);
    } catch (e) {
      console.error(`❌ Erreur sauvegarde ${JSON.stringify(data)} :`, e);
    }
  };
  

  export const loadProductDataFromCache = async () => {
    try {
      const key = '@snapshot_product_cache';
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue !== null) {
        console.log('📦 Données produit chargées depuis le cache');
        return JSON.parse(jsonValue);
      } else {
        return null;
      }
    } catch (e) {
      console.error('❌ Erreur chargement cache produit :', e);
      return null;
    }
  };


  export const removeProductDataFromCache = async () => {
    try {
      await AsyncStorage.removeItem('@snapshot_product_cache');
      console.log('🧹 Cache produit supprimé');
    } catch (e) {
      console.error('❌ Erreur suppression cache produit :', e);
    }
  };
  
  