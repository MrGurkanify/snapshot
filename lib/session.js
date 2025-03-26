import { useState , useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import decodeJWT from './decodeJWT';
import useRouter from 'expo-router';



export default function useUserSession() {

    const [user, setUser] = useState(null);
    // user = nul tant qu’on n’a pas lu SecureStore et décodé le token
    // isloading est initialisé à true dans useUserSession() et basculera à false une fois que le token aura été lu et décodé
    // Affiche un petit spinner tant qu’on ne sait pas encore si l’utilisateur est connecté ou non
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                setIsLoading(false);
                router.replace('Login');
                return;
            }


            const decode = decodeJWT(token);
            setUser({
                token,
                userId: decode.userId,
                //username: decode.username,
                email: decode.email,
                //avatar: decode.avatar,
                
            });
            // Remise à l'échelle de la date d’expiration du token
            // on convertie la date d’expiration du token en millisecondes 
            // par defaut il est en secondes et date.now() est en millisecondes
            const exp = decode.exp * 1000 ;
            // Vérification de la date d’expiration du token
            // si la date courante est supérieure à la date d’expiration du token, on supprime le token obsolète
            //  et on redirige l’utilisateur vers l’écran de connexion
            if (Date.now() > exp) {
                console.log('Token expiré');
                await SecureStore.deleteItemAsync('userToken');
                setUser(null);
                setIsLoading(false);
                router.replace('/Login');
                return;
            }


            // isLoading passe à false une fois qu’on a lu SecureStore et décodé le token
            //
            setIsLoading(false);

        }; // fin de la fonction loadUser

        loadUser();
    }, []);

    return { user, isLoading };

}

/* 
l'usage se fait de cette manière :

import { useUserSession } from '@/hooks/useUserSession';

const { user, isLoading } = useUserSession();

*/