
/**
 * 📁 File : AddSupplierScreen.js
 * 🛤️  Path  : ~/developpement /snapshot/screens/AddSupplierScreen.js
 * 📅 Created at : 2025-03-30
 * 👤 Author  : William Balikel
 * ✍️  Description : Description rapide du fichier
 */


import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useState } from 'react';

// Custom components

import LeftArrow from '../components/home/LeftArrow';
import LabelForm from '../components/home/LabelForm';
import LabelInput from '../components/home/LabelInput';

export default function AddSupplierScreen() {

  const [supplierName, setSupplierName] = useState(''); 
  const [contactName, setContactName] = useState(''); 
  const [telephone, setTelephone] = useState(undefined); 

  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-4">
        {/* Bouton retour */}
      <View className="flex-row items-center mt-10 mb-5 gap-12 ">
        <LeftArrow />
        <Text className="text-lg font-semibold text-gray-400">Add new supplier</Text>
      </View>  
        

        {/* Contenu formulaire*/}
        
        <LabelForm>
            
            <LabelInput label="Supplier name" placeholder="Supplier name" value={supplierName} onChangeText={setSupplierName}/>
            <LabelInput label="Contact name" placeholder="Contact name" value={contactName} onChangeText={setContactName}/>
            <LabelInput label="Telephone" placeholder="Telephone" value={telephone} onChangeText={setTelephone}/>

        </LabelForm>
        
    </View>
  );
}
