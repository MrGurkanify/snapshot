
ajout automatique d'un avatar via dicebear dès que le user est create un avatar lui est attribué
il obtient l'avatar dès qu'il a eu son token officiel du backend dans la home screen 
en gros le code avatar mouline à la phase signup , le programma a déjà catché un dicebear avatar
et le user vois son avatar quand il a son token offciel et qu'il arrive sur sa homescreen

il y aura à mettre un isloading dans SearchBarInput.js pour mettre un spinner pour attendre les resultats de filtrage du crud renvoyé
par le backend 

il me faut aussi une alternative de stockage local au cas ou le cloud ou le backend n'est pas accesible 
une gestion hors-ligne , si il a un token valide , il reste dans l'app et Les écrans qui ne font pas de fetch() fonctionneront.
Mode offline intelligent :
offline fallback


textbuttonlink dans la signup page Can't connect ? Contact support . routage vers screen à part 

textbuttonlink dans la signup screen pour dire en red qu'il faut minimum 6 chars pour le password
mettre un texte informatif

textbuttonlink dans la loginscreen mot de passe oublié routage vers screen à part 

textbuttonlink dans la login screen pour dire en red que le user n'existe pas 

c'est technique cet feature pas obligatoire
le middleware coté next.js pour checker le crédentials comme l'app cosmo si le backend dit ok le user que tu as tapé existe alors on dégrise le button 





    {/* l'astuce est de wrapper le light dans une nouvelle <View> nous sert de  wrapper  , un peu comme les layers des soft de design  */ }
    {/* <View> c'est une manière de dire que je veux un nouveau layer */ }
    {/* mettre la classe absolute dans la <View> signifie que tu vas rester en backgroud et que les composants enfants seront devant */ }
    
    