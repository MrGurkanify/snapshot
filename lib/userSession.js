/**
 * 📁 File : userSession.js
 * 🛤️  Path  : ~/developpement /snapshot/lib/userSession.js
 * 📅 Created at : 2025-04-02
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */

// avec ce file importé à utiliser dans tous les code parent avec des useEffect où c'est 
// nécessaire pour vérifier le token 
// il faut insérer le setUser dans le useEffect de chaque page où on importe userSession()
// il faut aussi setter le useRouter pour la redirection si le token est absent ou expiré

import * as SecureStore from 'expo-secure-store';
import { decodeJWT } from '../lib/decodeJWT';

export const userSession = async () => {
  try {
    const token = await SecureStore.getItemAsync('userToken');

    // serie de verif 
    if (!token) {
      console.log('No user session found here ');
      return { valid: false };
    }

    // préparation pour vérifier le token date expiration
    const decode = decodeJWT(token);

    // si pas de token décodé ou pas de date d'expiration
    // on sort de la fonction et on renvoie un message d'erreur
    if (!decode || !decode.exp) {
      console.log('Token mal formé');
      return { valid: false };
    }
// on check si le token est expiré
    const exp = decode.exp * 1000;

    if (Date.now() > exp) {
      console.log('Token expired,');
      await SecureStore.deleteItemAsync('userToken');
      return { valid: false };
    }

    // si on passe les validations if(s) , on renvoie un object js 
    return {
      valid: true,
      token,
      decoded: decode,
    };

  } catch (e) {
    console.error('Error checking user session: ', e);
    return { valid: false };
  }
};

// userSession() renverra true si il y a token  ou false via valid si pas de token ou token expiré 
// à traiter avec un if() dans le code parent du genre if(session.valid) { ... }

// grace à l'object renvoyé par userSession on peut employer 
// avec session.valid , session.token et session.decoded
/* return {
    valid: true,
    token,
    decoded: decode
}; */

// si il faut faire des opérations sur le token
// 
// on set la var state user avec l'objet     
/* setUser({
    token,
    userId: decode.userId,
    email: decode.email,
    username: decode.userName,
  }); */

// const session = await userSession('/your-page');

/* 
const { token, decoded } = session;
setUser({
    token,
    userId: decoded.userId,
    email: decoded.email,
    username: decoded.userName,
}); */
