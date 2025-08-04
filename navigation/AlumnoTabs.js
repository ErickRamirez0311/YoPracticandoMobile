// navigation/AlumnoTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext'; // Usa tu hook de tema

import InicioScreen from '../screens/HomeScreen/alumno/InicioScreen';
import MensajesScreen from '../screens/HomeScreen/common/MensajesScreen';
import FavoritosScreen from '../screens/HomeScreen/alumno/FavoritosScreen';
import PerfilScreen from '../screens/HomeScreen/alumno/Perfil/PerfilScreen';

const Tab = createBottomTabNavigator();

const AlumnoTabs = () => {
  const { colors } = useTheme(); // Obtiene los colores del tema actual

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary || 'gray',
        tabBarStyle: {
          backgroundColor: colors.tabBackground || colors.background,
          borderTopColor: 'transparent',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Inicio':
              iconName = 'home-outline';
              break;
            case 'Mensajes':
              iconName = 'chatbubbles-outline';
              break;
            case 'Favoritos':
              iconName = 'heart-outline';
              break;
            case 'Perfil':
              iconName = 'person-outline';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Mensajes" component={MensajesScreen} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
};

export default AlumnoTabs;