
// app/_layout.js

import { Tabs } from 'expo-router';
import {
  HomeIcon,
  BuildingOffice2Icon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';

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
        name="suppliers"
        options={{
          tabBarLabel: 'Usines',
          tabBarIcon: ({ color, size }) => (
            <BuildingOffice2Icon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <UserCircleIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
