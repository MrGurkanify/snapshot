/**
 * 📁 File : AvatarButton.js
 * 🛤️  Path  : ~/developpement /snapshot/components/home/AvatarButton.js
 * 📅 Created at : 2025-04-05
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */



import { View , Image , TouchableOpacity } from 'react-native'
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';




export default function AvatarButton({avatarUri , onAvatarChange}) {

  const handleImage = (uri) => {
    console.log("✅ Avatar URI :", uri);
    
    onAvatarChange(uri); // 🟢 on remonte l'image vers ProfilScreen
  };

  const openImageOptions = () => {
    Alert.alert('Add an image', 'Choose an option', [
      
      {
        text: '📷 Take a photo',
        onPress: () => takePhoto(),
      },
      {
        text: '🖼️ Choose from gallery',
        onPress: () => pickImage(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };


  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted === false) {
      alert("L'accès à la caméra est requis.");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
      cameraType: ImagePicker.CameraType.front, // ou .back
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      handleImage(uri); // ta logique actuelle
    }
  };
  
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted === false) {
      alert("L'accès à la galerie est requis.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.6,
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      handleImage(uri); // ta logique actuelle
    }
  };

  



  return (
    // on fait un wrapper container view circulaire pour le bouton avatar et pareil pour l'image
    <View className=" w-36 h-36 bg-gray-700 rounded-full flex-col items-center justify-center mt-3 ">
        <TouchableOpacity className=""
                          onPress={openImageOptions}
        >
            <Image
            source={{ uri: avatarUri || 'https://cdn.snapshotfa.st/images/astronaute_canard.png' }}
            resizeMode="cover"
            className="w-36 h-36 rounded-full "
            />
        </TouchableOpacity>
      
    </View>
  )
}