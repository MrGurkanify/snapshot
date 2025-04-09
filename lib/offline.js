/**
 * 📁 File : offline.js
 * 🛤️  Path  : ~/developpement /snapshot/lib/offline.js
 * 📅 Created at : 2025-04-05
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */


// 📁 lib/offline.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const saveSupplierDataOffline = async (supplierData) => {
  try {
    const id = uuid.v4(); // générer un id unique offline
    // voila aussi comment on génère un object js à la volée
    const newSupplier = { id, ...supplierData, synced: false };

    const existing = await AsyncStorage.getItem('offlineSuppliers');
    const suppliers = existing ? JSON.parse(existing) : [];

    suppliers.push(newSupplier);
    await AsyncStorage.setItem('offlineSuppliers', JSON.stringify(suppliers));

    console.log('✅ Supplier offline sauvegardé');
  } catch (err) {
    console.error('❌ Erreur saveSupplierDataOffline :', err);
  }
};



export const saveSupplierImageOffline = async (localUri) => {
    try {
      const existing = await AsyncStorage.getItem('offlineImages');
      const images = existing ? JSON.parse(existing) : [];
  
      if (!images.includes(localUri)) {
        images.push(localUri);
        await AsyncStorage.setItem('offlineImages', JSON.stringify(images));
        console.log('✅ Image locale enregistrée offline :', localUri);
      }
    } catch (err) {
      console.error('❌ Erreur saveSupplierImageOffline :', err);
    }
  };

  

  export const syncUnsyncedData = async (userToken, userId) => {
    try {
      const raw = await AsyncStorage.getItem('offlineSuppliers');
      const suppliers = raw ? JSON.parse(raw) : [];
  
      const syncedSuppliers = [];
  
      for (const supplier of suppliers) {
        if (supplier.synced) continue;
  
        const res = await fetch(`${API_BASE_URL}/api/suppliers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            ...supplier,
            createdBy: userId,
          }),
        });
  
        if (res.ok) {
          console.log('✅ Sync réussi pour :', supplier.supplierName);
          syncedSuppliers.push({ ...supplier, synced: true });
        } else {
          console.warn('⚠️ Sync échoué pour :', supplier.supplierName);
          syncedSuppliers.push(supplier); // garder en l’état
        }
      }
  
      await AsyncStorage.setItem('offlineSuppliers', JSON.stringify(syncedSuppliers));
    } catch (err) {
      console.error('❌ Erreur syncUnsyncedData :', err);
    }
  };
  