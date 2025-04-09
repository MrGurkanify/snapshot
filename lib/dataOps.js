/**
 * 📁 File : dataOps.js
 * 🛤️  Path  : ~/developpement /snapshot/lib/dataOps.js
 * 📅 Created at : 2025-04-02
 * 👤 Author  : William Balikel
 * ✍️  Description : Mise en place d'un cache système pour la gestion des données avec AsyncStora
 */


import AsyncStorage from '@react-native-async-storage/async-storage';


export const saveData = async (data) => { 
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('supplierDataKey', jsonValue);
        console.log('Data saved successfully');
        console.log('Data saved: ', data);
        console.log('Data saved in AsyncStorage: ', jsonValue);
       
        
    } catch (e) {
        console.error('Error saving data: ', e);
    }
}


export const loadData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('supplierDataKey');
        if (jsonValue !== null) {
            console.log('Data retrieved successfully');
            console.log('Data retrieved: ', jsonValue);
            // il renvoit un objet javascript
            return JSON.parse(jsonValue);
        } else {
            console.log('No data found');
            return null;
        }
    } catch (e) {
        console.error('Error retrieving data: ', e);
    }
}



export const removeData = async () => {
    try {
        await AsyncStorage.removeItem('supplierDataKey');
        console.log('Data removed successfully');
    } catch (e) {
        console.error('Error removing data: ', e);
    }
}


// efface tout le cache de l'application completement
export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        console.log('All data cleared successfully');
    } catch (e) {
        console.error('Error clearing data: ', e);
    }
}