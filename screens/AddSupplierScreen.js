
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
          
          const session = await userSession();
          
          if(!session.valid) {
            console.log('Session invalid, redirecting to login');
            router.replace('/login');
            return;
          }

          // si on a une session valide , on chope le token et le token decode
          const { token , decoded } = session;

          setUser({
            token,
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.userName, 

          });

          console.log('\n\n\n');
          console.log('user: ', user)
          console.log('\n\n\n');
          console.log('decoded: ',decoded);
          console.log('\n\n\n');
          
          
      }
      
      checkSession();

    }, []);

    // on place un useEffect pour vérifier si on a une session utilisateur

    useEffect(() => {
      console.log('\n------@@@@@xxxxx démarrage du useffect de user presence  xxxxx@@@@@@------\n');
      if (user) {
        console.log('✅ Session utilisateur chargée :', user);
      }
    }, [user]);
    
    
    
 // Save data to AsyncStorage dès que le composant est monté
 // ce use effect est configuré pour s'éxecuter  , contactName, telephone, supplierEmail, selectedImages, note
      // il sert sauvegarder supplierData même parteillement 
      // à chaque fois que l'un de ces champs change
      // il sauvegarde les données dans le local storage
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
        const hasContent = supplierName?.trim().length > 0 
                        || contactName?.trim().length > 0
                        || telephone?.trim().length > 0
                        || supplierEmail?.trim().length > 0
                        || note?.trim().length > 0
                        || selectedImages.length > 0;
      
        if (hasContent) {
          
              saveData('@snapshot_supplier_cache', currentSupplierData);

        }
      }, [supplierName , contactName, telephone, supplierEmail, selectedImages, note]);
      

    // au mount du composant on load les données
    // et on load et met dans le state
    useEffect(() => {
      console.log('\n------@@@@@ démarrage du useffect loadData @@@@@------\n');
      
      const loadingData = async () => { 

        const data = await loadData();
        console.log('\nmes data dans le useEffect et récupéré du asyncstorage \n ',data);
        if (data) {
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

      if (submitted) return; // 🔒 Bloque les clics répétés
      
      setSubmitted(true);

      try {
        if (!supplierName.trim()) {
          return alert('Please enter a supplier name');
        }
    
        const trimmedSupplierName = supplierName.trim();
        const trimmedTelephone = telephone.trim();
        const trimmedSupplierEmail = supplierEmail.trim();
    
        setIsLoading(true);
        // notre array d'images finales
        const finalImageUris = [];
    
        // 🧠 Étape 1 : vérifie si le réseau est dispo
        const networkState = await Network.getNetworkStateAsync();
        const isConnected = networkState.isConnected && networkState.isInternetReachable;
    
        if (!isConnected) {
          // 🔴 MODE OFFLINE : on sauvegarde tout localement
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
          // 🟢 MODE ONLINE : envoi images + data au backend 
    
          for (const localUri of selectedImages) {
            try {
              const formData = new FormData();
              const uniqueName = `${Date.now()}-${user.userId}.jpg`;

              // on récupère l'userId de la session
              
              const userId = user?.userId;
              
              formData.append('userId', userId); // 🔥 indispensable maintenant
    
              formData.append('image', {
                uri: localUri,
                name: uniqueName,
                type: 'image/jpeg',
              });
    
              const res = await fetch(`${API_CDN_URL}/upload`, {
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
    
          // Envoi vers backend
          const res = await fetch(`${API_BASE_URL}/api/suppliers`, {
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
              selectedImages: finalImageUris,
              note,
              createdBy: user.userId,
            }),
          });
          const responseJson = await res.json();

          console.log('✅ Réponse du backend :', responseJson);
          console.log('📥 HTTP Status:', res.status);

          if (res.status === 201) {
            console.log('✅ Fournisseur créé :', responseJson);
            alert('✅ Fournisseur enregistré avec succès (backend)');
          } else if (res.status === 409) {
            console.warn('⚠️ Doublon détecté :', responseJson.message);
            alert('⚠️ Ce fournisseur existe déjà dans votre liste.');
          } else {
            console.error('❌ Erreur inconnue :', responseJson);
            alert('❌ Une erreur est survenue lors de la création.');
}


        }
    
        // 🧹 Reset
        setSupplierName('');
        setContactName('');
        setTelephone('');
        setSupplierEmail('');
        setSelectedImages([]);
        setNote('');
        setIsDisabled(true);

    // supprime données temporaires de AsyncStorage
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