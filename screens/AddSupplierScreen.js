
/**
 * 📁 File : AddSupplierScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/AddSupplierScreen.js
 * 📅 Created at : 2025-03-30
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableOpacity,
    Modal,
    Pressable
  } from 'react-native';
  import { useRouter } from 'expo-router';
  import { useState , useEffect } from 'react';
  import { TrashIcon } from 'react-native-heroicons/solid';
  import { BlurView } from 'expo-blur';
  import * as Network from 'expo-network';
  


  
  
  // Custom components
  import LeftArrow from '../components/home/LeftArrow';
  import LabelForm from '../components/home/LabelForm';
  import LabelInput from '../components/home/LabelInput';
  import NoteArea from '../components/home/NoteArea';
  import AddPhotoButton from '../components/home/AddPhotoButton';
  import AddSupplierButton from '../components/home/AddSupplierButton';
  import ImageViewer from '../components/home/ImageViewer';
  import FreemiumNotice from '../ui/FreemiumNotice';

  import { API_BASE_URL, API_CDN_URL } from '../lib/api';
  import { saveData , loadData, removeData, clearAllData } from '../lib/dataOps';
  import { userSession } from '../lib/userSession';
  import { downloadToLocal } from '../lib/fileUtils';
  import {
    saveSupplierDataOffline,
    saveSupplierImageOffline,
  } from '../lib/offline';

  
  export default function AddSupplierScreen() {
    // State variables pour les champs du formulaire
    const [supplierName, setSupplierName] = useState('');
    const [contactName, setContactName] = useState('');
    const [telephone, setTelephone] = useState('');
    const [supplierEmail, setSupplierEmail] = useState('');
    const [selectedImages , setSelectedImages] = useState([]);
    const [note, setNote] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [isDisabled , setIsDisabled ] = useState(true);
    const [user , setUser ] = useState(null);
    const [isLoading , setIsLoading] = useState(false);
    const [labelButton , setLabelButton ] = useState('create');
    const [isModalVisible , setIsModalVisible ] = useState(false);
    const [selectedImageIndex , setSelectedImageIndex ] = useState(null);
    
    
    
    
    
    const router = useRouter();

    
 
    // on place un useEffect pour vérifier si on a une session utilisateur

    useEffect(() => { 
      console.log('\n------@@@@@xxxxx démarrage du useffect de session  xxxxx@@@@@@------\n');

      const checkSession = async () => { 
          // userSession nous donne le token , et le token décodé , et un flag valid 
          const session = await userSession();
          
          if(!session.valid) {
            console.log('Session invalid, redirecting to login');
            router.replace('/login');
            return;
          }

          // si on a une session valide , on chope le token et le token decode
          const { token , decoded } = session;
// on passe à la state var user , un object js buildé avec le token et le decoded
          setUser({
            token,
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.userName,
            isFullAccess: decoded.isFullAccess,

          });

          console.log('\n\n\n');
          console.log('user: ', user)
          console.log('\n\n\n');
          console.log('decoded: ',decoded);
          console.log('\n\n\n');
          console.log(' ***** 🔍 AddSupplierScreen.js ***** → user.isFullAccess: ', user.isFullAccess);
          
      }
      
      checkSession();
// ce useEffect s'éxécute une fois à la première mount du composant 
// il ne s'éxecutera pas à chaque fois que le composant est re-rendu
    }, []);

    // on place un useEffect pour vérifier si on a une session utilisateur
    // ce useEffect est un indicateur de session qui est adossé au dépendance user
    // il s'éxecute à chaque fois que user change
    useEffect(() => {
      console.log('\n------@@@@@xxxxx démarrage du useffect de user presence  xxxxx@@@@@@------\n');
      if (user) {
        console.log('✅ Session utilisateur chargée :', user);
      }
    }, [user]);
    
    
    
 // Save data to AsyncStorage dès que le composant est monté
 // ce use effect est configuré pour s'éxecuter si les dépendances suivantes changent 
 // contactName, telephone, supplierEmail, selectedImages, note
      // il sert à sauvegarder supplierData même parteillement 
      // à chaque fois que l'un de ces champs change
      // il sauvegarde les données dans le local asyncstorage
      // Dès que le champ supplierName contient un texte non vide (même seul),
      // les valeurs actuelles de tous les champs sont sauvegardées.
      // Tu continues à surveiller tous les champs ([] de dépendances), 
      // donc si l’utilisateur revient modifier un champ, 
      // les changements sont à nouveau persistés.
      
      // on build the current supplierData object à sauvegarder
      useEffect(() => {
        const currentSupplierData = {
          supplierName,
          contactName,
          telephone,
          supplierEmail,
          selectedImages,
          note,
        };
      
        // Si au moins un champ est rempli OU des images sont sélectionnées, on sauvegarde
        // c'est une façon de demandé si un champ a une présence , a une valeur
        const hasContent = supplierName?.trim().length > 0 
                        || contactName?.trim().length > 0
                        || telephone?.trim().length > 0
                        || supplierEmail?.trim().length > 0
                        || note?.trim().length > 0
                        || selectedImages.length > 0;
      // hasContent est true si au moins un des champs a une valeur
        if (hasContent) {
          
              saveData('@snapshot_supplier_cache', currentSupplierData);

        } // ce useEffect s'éxecute à chaque fois que l'un des champs ci dessous change
      }, [supplierName , contactName, telephone, supplierEmail, selectedImages, note]);
      






    // au mount du composant on load les données
    // et on load et met dans le state
    useEffect(() => {
      console.log('\n------@@@@@ démarrage du useffect loadData @@@@@------\n');
      
      const loadingData = async () => { 

        const data = await loadData('@snapshot_supplier_cache');
        console.log('\nmes data dans le useEffect et récupéré du asyncstorage \n ',data);
        if (data) {
          // si on a des données dans le cache 
          // on les met dans le state correspondant aux inputs des champs du formulaire
            setSupplierName(data.supplierName);
            setContactName(data.contactName);
            setTelephone(data.telephone);
            setSupplierEmail(data.supplierEmail);
            setSelectedImages(data.selectedImages);
            setNote(data.note);

            // 🧠 Vérifie ici si supplierName est rempli, active le bouton si oui
            if (data.supplierName?.trim().length > 0) {
              setIsDisabled(false);
            }
          }
        
            
      }
      loadingData(); 
      
    }, []);

    
    
    const handleSubmitCreateSupplier = async () => {

      if (submitted) return; // 🔒 Bloque les clics répétés , pas d'appuie 2 fois accidentel
      // balise de marqueur pour  piéger le runtime au re-render du composant
      setSubmitted(true);
    
      try {
        // on rend obligatoire le champ supplierName pour submit le formulaire
        // si le champ supplierName est vide , on affiche une alerte
        // et on ne soumet pas le formulaire
        if (!supplierName.trim()) {
          return alert('Please enter a supplier name');
        }
    
        // à droite c'est les state vars réaffectées dans de nouvelles vars
        const trimmedSupplierName = supplierName.trim();
        const trimmedTelephone = telephone.trim();
        const trimmedSupplierEmail = supplierEmail.trim();
    
        // on active le spinner visuel
        setIsLoading(true);
        // notre array d'images finales déclaré 
        const finalImageUris = [];
    
        // 🧠 Étape 1 : vérifie si le réseau est dispo , c'est la mesure far de l'app
        const networkState = await Network.getNetworkStateAsync();
        const isConnected = networkState.isConnected && networkState.isInternetReachable;
        console.log(' ***** 🔍 AddSupplierScreen.js ***** appuie sur button crearte et état du réseaux → isConnected: ', isConnected);
    
        if (!isConnected) {
          // 🔴 MODE OFFLINE : on sauvegarde tout localement
          console.log(' ***** 🔍 AddSupplierScreen.js ***** → passage en mode offline: ', isConnected);
          
          await saveSupplierDataOffline({
            supplierName: trimmedSupplierName,
            contactName,
            telephone: trimmedTelephone,
            supplierEmail: trimmedSupplierEmail,
            selectedImages,
            note,
          });
    
          for (const localUri of selectedImages) {
            await saveSupplierImageOffline(localUri); // tu peux copier les images dans FileSystem.documentDirectory
          }
    
          alert('📴 Pas de connexion : le fournisseur a été sauvegardé localement.');
        } else {
          // 🟢 MODE ONLINE : envoi data → puis upload images → puis patch
          const createRes = await fetch(`${API_BASE_URL}/api/suppliers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              supplierName: trimmedSupplierName,
              contactName,
              telephone: trimmedTelephone,
              supplierEmail: trimmedSupplierEmail,
              selectedImages: [], // ← images ajoutées après
              note,
              createdBy: user.userId,
            }),
          });
    
          const created = await createRes.json();
          const supplierId = created?.supplier?._id;
    
          console.log('✅ Supplier créé (ID) :', supplierId);
    
          if (!supplierId) {
            throw new Error("Aucun supplierId reçu après création");
          }
    
          // ensuite on fait l'upload des images avec userId + supplierId
          for (const localUri of selectedImages) {
            try {
              const formData = new FormData();
              const uniqueName = `${Date.now()}-${supplierId}.jpg`;
    
              formData.append('userId', user.userId); // 🔥 indispensable maintenant
              formData.append('supplierId', supplierId); // nouveau champ requis
              formData.append('image', {
                uri: localUri,
                name: uniqueName,
                type: 'image/jpeg',
              });
    
              const res = await fetch(`${API_CDN_URL}/upload/supplier`, {
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                body: formData,
              });
    
              if (!res.ok) {
                const errorText = await res.text();
                console.warn('❌ Upload échoué (non JSON)', errorText);
                finalImageUris.push(localUri);
                continue; // skip au suivant
              }
    
              const data = await res.json();
              finalImageUris.push(data.success ? data.fileUrl : localUri);
            } catch (err) {
              console.warn('❌ Upload échoué, fallback local :', err);
              finalImageUris.push(localUri);
            }
          }
    
          // PATCH du supplier pour lui ajouter les images
          const patchRes = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ selectedImages: finalImageUris }),
          });
    
          const patchJson = await patchRes.json();
          console.log('📎 PATCH des images :', patchJson);
    
          alert('✅ Fournisseur enregistré avec succès (backend + images)');
        }
    
        // 🧹 Reset des champs
        setSupplierName('');
        setContactName('');
        setTelephone('');
        setSupplierEmail('');
        setSelectedImages([]);
        setNote('');
        setIsDisabled(true);
    
        // supprime données temporaires de AsyncStorage init du cache 
        await removeData('@snapshot_supplier_cache'); // ✅
    
      } catch (error) {
        console.error('❌ Erreur création supplier :', error);
      } finally {
        setIsLoading(false);
        setSubmitted(false);
      }
    };
    
     // fin de la fonction handleSubmitCreateSupplier
    
    

    
    
     
    


    const handleImageSelect = async ( remoteUri ) => { 
      
      
      const localUri = await downloadToLocal(remoteUri);

      if (localUri && selectedImages.length < 3) {
        setSelectedImages((prev) => [...prev, localUri]);
      }
    
      console.log('✅ Image locale ajoutée :', localUri);
        
    }
// on appelle le modal ici pour confirmer la suppression de l'image
// et on passe l'index de l'image à supprimer
    const handleRemoveImage = (index) => {
      setSelectedImageIndex(index);
      setIsModalVisible(true);
    }
    
    
    const confirmRemoveImage =  () => { 
      if (selectedImageIndex !== null) {
        setSelectedImages((prev) => prev.filter((_, index) => index !== selectedImageIndex));
        setSelectedImageIndex(null);
        setIsModalVisible(false);
      }
    }
    
    
    
    console.log('les useEffect sont executés seulement quand le composant est totalement monté, valeur de selectedImages = ', selectedImages);
    
    

  
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >

          <Modal
            transparent={true}
            animationType="fade"
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            {/* <View className="flex-1 justify-center items-center bg-black bg-opacity-200 px-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}> */}
            <BlurView intensity={50} tint="dark" className="flex-1 justify-center items-center px-4">
              <View className="bg-white rounded-2xl p-6 w-full max-w-md">
                
                <Text className="text-lg font-semibold text-gray-800 mb-4">Confirm deletion</Text>
                
                <Text className="text-gray-600 mb-6">Are you sure you want to delete this image?</Text>
                
                <View className="flex-row justify-end space-x-4 gap-10">
                  <Pressable
                    onPress={() => setIsModalVisible(false)}
                    className="px-4 py-2 rounded-md bg-green-200"
                  >
                    <Text className="text-green-800">Cancel</Text>
                  </Pressable>

                  <Pressable
                    onPress={confirmRemoveImage}
                    className="px-4 py-2 rounded-md bg-red-500"
                  >
                    <Text className="text-white">Delete</Text>
                  </Pressable>

                </View>
              </View>
            </BlurView> 
            {/* </View> */}
          </Modal>
          
        <ScrollView
          className="px-4"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >


          {/* Header */}
          <View className="flex-row items-center mt-10 mb-5 gap-12">
            <LeftArrow />
            <Text className="text-lg font-semibold text-gray-400">
              Add new supplier
            </Text>
          </View>
  
          {/* Form */}
          <LabelForm>
            <LabelInput
              label="Name"
              value={supplierName}
              onChangeText={(text) => {
                          setSupplierName(text);
                          
                          if (text.trim().length === 0) {
                            setIsDisabled(true);
                          }
                          else  {
                            setIsDisabled(false);
                          }
                           } }
              // color={'#ffe8cc'}
            />
            <LabelInput
              label="Contact name"
              value={contactName}
              onChangeText={setContactName}
              // color={'#ffe8cc'}
            />
            <LabelInput
              label="Telephone"
              value={telephone}
              onChangeText={setTelephone}
              // color={'#ffe8cc'}
              keyboardType="numeric"
            />
            <LabelInput
              label="Email"
              value={supplierEmail}
              onChangeText={setSupplierEmail}
              // color={'#ffe8cc'}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <NoteArea
              label="Note"
              value={note}
              onChangeText={setNote}
              // color={'#dcfce7'}
              autoCapitalize="none"
              placeholder="Add a note about this supplier"
              
            />
          </LabelForm>


            {/* Add photo if selected */}

            {selectedImages?.length > 0 && (
              <View className="flex-row justify-between items-center mt-5 gap-6 px-4 rounded-xl">
                  
                  {
                    selectedImages.map((uri, index) => (
                    <View key={index} className="relative">
                      {/* Bouton Poubelle */}
                      <TouchableOpacity
                        onPress={() => handleRemoveImage(index)}
                        className="absolute -top-4 -right-4 z-10 bg-orange-200 rounded-full p-1"
                      >
                        <TrashIcon size={20} color="#EF4444" />
                      </TouchableOpacity>

                      {/* Image affichée */}
                      <Image
                        source={{ uri }}
                        className="w-24 h-24 rounded-xl border border-gray-600"
                      />
                    </View>

                    ))
                  }
              </View>
        )}

           


            {/* Add Photo Button */}
            <AddPhotoButton onImageSelected={handleImageSelect}
                            currentCount={selectedImages.length}
             />

            {/* Image Viewer */}
            <ImageViewer images={selectedImages} />



            {/* Add Supplier Button */}
            <AddSupplierButton onPress={() => handleSubmitCreateSupplier() } disabled={isDisabled} loading={isLoading} label={labelButton}/>

            {/* Message avertissement freemium   */}
            {user && !user.isFullAccess && (
              <FreemiumNotice/>
          )}


        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  

  /* Résumé en 3 étapes clés :
1. Vérifie le réseau
L'app teste si tu es connecté à Internet avec expo-network.

2. Upload les images (si connecté)
Pour chaque image de selectedImages :

Si tu es connecté, elle est envoyée au CDN via fetch vers https://cdn.snapshotfa.st/upload.

Si l’upload réussit, l’URL CDN est conservée.

Sinon, on garde le localUri (le chemin sur le téléphone).

Si tu es hors ligne, on garde directement le localUri.

3. Envoie les données au backend
Un POST est envoyé à https://snapshotfa.st/api/suppliers avec :

supplierName, contactName, telephone, supplierEmail, note

et un tableau selectedImages (mélange de localUris et d’URLs CDN selon la connectivité)

createdBy est l’userId de la session

4. Nettoyage
Si tout se passe bien :

Les champs du formulaire sont remis à zéro.

Les données temporaires dans AsyncStorage sont supprimées avec removeData(). */