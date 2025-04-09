/**
 * 📁 File : api.js
 * 🛤️  Path  : ~/developpement /snapshot/lib/api.js
 * 📅 Created at : 2025-04-04
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */


// export const API_BASE_URL = 'https://snapshot-nextjs-backend.vercel.app';

// export const API_BASE_URL = 'https://snapshotfa.st';
export const API_BASE_URL = 'http://192.168.0.22:3000';
export const API_CDN_URL = 'https://cdn.snapshotfa.st';

// export const API_BASE_URL = 'http://192.168.0.22:3000';


// à utiliser de cette manière :

/* 

import { API_BASE_URL } from '../lib/api';

fetch(`${API_BASE_URL}/api/login`, { ... }); 

*/


/* 

on avait cette version aussi 

var = ApiEndPoint = "https://api.paymento.io/payment/request";
var apiKLey = "YOUR_API_KEY";
usage : 

fetch(`${ApiEndPoint}?api_key=${apiKLey}`, { ... });

// perform post request to paymento gateway

fetch(apiEndPoint, {
    method: 'POST',
    'content-type': 'application/json',
    'Api-Key': apiKey,
    body: JSON.stringify({
        amount: 1000,
        currency: 'USD',
        card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2022,
            cvc: 123
        }
    })
        ou 

    body: JSON.stringify(paymentData)
}

)

*/