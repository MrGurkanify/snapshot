0. N'oublie dans les stores c'est une aplli gratuite . Donc limiter les ressources 

1 photo supplier 
max de 5 suppliers
5 produits par suppliers
3 photo par product

insertion limitation à insérer en bdd faire des flags hasPaid= false || true , hasFullAccess 
c'est les route du backend qui checke le token pour reconnaitre le user et c'est les 
route du backend qui imposent les limitations à ce user 

0. on load le profil par défault à l'arrivée sur la homescreen (photo avatar)
via un useEffect il load via le hard du smartphone via async ou bien expo filesystem

le forgot password a faire


1. ajout automatique d'un avatar fallback astronaute dès que le user est create un avatar par défaut lui est attribué jusqu'à qu'il change dans le profil.
il obtient l'avatar dès qu'il a eu son token officiel du backend dans la home screen 
en gros le code avatar mouline à la phase signup , le programme a déjà catché un 
et le user vois son avatar quand il a son token offciel et qu'il arrive sur sa homescreen

2. tester le spinner du offline , tester tous les features en offline comme la 
searchbar , la creation , la modif

3. il me faut aussi une alternative de stockage local au cas ou le cloud ou le backend n'est pas accesible , une solution off-line
une gestion hors-ligne , si il a un token valide , il reste dans l'app et Les écrans qui ne font pas de fetch() fonctionneront.
Mode offline intelligent :
offline fallback


4. textbuttonlink dans la signup page Can't connect ? Contact support . routage vers screen à part 

5. textbuttonlink dans la signup screen pour dire en red qu'il faut minimum 6 chars pour le password
mettre un texte informatif

6. textbuttonlink dans la loginscreen mot de passe oublié routage vers screen à part 

7. textbuttonlink dans la login screen pour dire en red que le user n'existe pas 

8. Attention au token , j'ai mis l'expiration pour 30 min pour le dev test 
 il faudra mettre à 30 days en prod.

9. comme les state var sont juste des emplacement mémoire de la durée de vie d'un rendu , comme chaque value de form input sont stocké dans des states var , dès l'instant ou les inputs sont remplis il faut immédiatement les stocké dans async storage pour les reloader entre un switch entre 2 écrans et donc 2 rendus.
Dès qu'on push dans mongodb on peut eraser full le form 

10. pour l'écran hybride supplier & products , il faut un image viewer 

11. n'oublie  pas les message dans les signup et login screen quand y a pas de compte càd quand le compte n'existe pas je pense !

c'est technique cet feature pas obligatoire
le middleware coté next.js pour checker le crédentials comme l'app cosmo si le backend dit ok le user que tu as tapé existe alors on dégrise le button 


12. il y a une grosse verif à faire avant d'ajouter une entrée supplier dans la bdd 

13. mettre un useEffect boilerplate pour checker le token meme dans tous les autres screens , userSession 

14. mettre en place un bearer pour le crud des suppliers et products je veux pas qu'on spouf le bdd 

15. il faut un client feeback button à la marc lou pour récupérer les feedbacks des clients || le forgot password à faire fait gaffe à resend

16. le cdn devra avoir des repertoire au nom du user qui upload dans le repertoire images , il faut verifier le token avant d'uploader dans le cdn .Il peut uploader si le session.token === valid

17. il faut anticiper l'état premier de l'app quand au départ il n'y a pas de supplier 
 Affichage conditionnel s’il n’y a aucun fournisseur ("Aucun fournisseur trouvé")
 Prévoir le ScrollView ou ajuster la hauteur dynamique si tu veux scroller sur petit écran

 18. dans le homescreen il y a un useEffect à ajouter dans la headerbar pour loader le profil du user , son avatar si présent sinon le fallback astronaute 

 19. le cdn comme c'est un placeholder de stockage , il doit être structuré de la façon suivante :
 /projectName_AppName_Repo/user_repo/fileXYZ
 /snapshot/william/

 20. tester le sync en mode offline


 21. pour les test de l'app avant la prod 
        + vérifier avec 2 usersdifférent logués un dans le simulateur et l'autre sur l'iphone 16 pro . Créer le meme supplier pour chacun .
        + teste l'app offline , je recherche des bugs et erreurs .
        + Reset du cdn 

22. pour les test chasse au bug , le token est placé à 30min , en prod faut le mettre à 45 jours

    {/* l'astuce est de wrapper le light dans une nouvelle <View> nous sert de  wrapper  , un peu comme les layers des soft de design  */ }
    {/* <View> c'est une manière de dire que je veux un nouveau layer */ }
    {/* mettre la classe absolute dans la <View> signifie que tu vas rester en backgroud et que les composants enfants seront devant */ }
    

Les npms :
-----------

npm install react-native-heroicons
npm install react-native-keyboard-aware-scroll-view
npx expo install expo-image-picker
npx expo install @react-native-async-storage/async-storage
npx expo install expo-blur
npm install react-native-toast-message
npx expo install expo-fast-image
npx expo install expo-file-system
npx expo install expo-crypto
npx expo install expo-network
npx expo install expo-sqlite
npm install react-native-uuid
npx expo install @react-native-community/datetimepicker
npx expo install react-native-date-picker
npm install date-fns



npm install -g eas-cli


eas build --profile development --platform ios
eas build --profile development --platform android




##################@

comportement de snapshot :

quand il est offline , et que le user n'a pas de token alors le user ne peut pas se connecter , il ne peut pas se loger .
Ce comportement arrive parceque le token est à 30 min , au moindre porblème avec le token snapshot ramène vers la loginscreen.

