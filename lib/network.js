/**
 * 📁 File : network.js
 * 🛤️  Path  : ~/developpement /snapshot/lib/network.js
 * 📅 Created at : 2025-04-08
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



// 📁 File : lib/network.js
// 🛤️  Path  : ~/developpement/snapshot/lib/network.js

import * as Network from 'expo-network';
import { API_BASE_URL } from './api';

export const isAppOnline = async () => {
  try {
    const state = await Network.getNetworkStateAsync();
    const isConnected = state.isConnected && state.isInternetReachable;

    // Optionnel : ping backend ou CDN si tu veux aller plus loin
    if (!isConnected) return false;

    const ping = await fetch(`${API_BASE_URL}/api/ping`);
    return ping.ok;
  } catch (error) {
    console.warn('🌐 Erreur vérif online:', error);
    return false;
  }
};
