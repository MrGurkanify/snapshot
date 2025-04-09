
// app/_layout.js

import { Tabs } from 'expo-router';
import {
  HomeIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';
import Toast from 'react-native-toast-message';


import './../../global.css';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0EA5E9',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, size }) => (
            <DocumentTextIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <UserCircleIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
