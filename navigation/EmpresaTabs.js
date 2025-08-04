// navigation/EmpresaTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext'; // Tu contexto de tema

import InicioScreen from '../screens/HomeScreen/empresa/InicioScreen';
import MensajesScreen from '../screens/HomeScreen/common/MensajesScreen';
import MiEmpresaScreen from '../screens/HomeScreen/empresa/MiEmpresaScreen';
import VacantesScreen from '../screens/HomeScreen/empresa/VacantesScreen';

const Tab = createBottomTabNavigator();

const EmpresaTabs = () => {
  const { colors } = useTheme(); // Obtiene colores del tema actual

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
            case 'Mi Empresa':
              iconName = 'business-outline';
              break;
            case 'Vacantes':
              iconName = 'briefcase-outline';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Mensajes" component={MensajesScreen} />
      <Tab.Screen name="Mi Empresa" component={MiEmpresaScreen} />
      <Tab.Screen name="Vacantes" component={VacantesScreen} />
    </Tab.Navigator>
  );
};

export default EmpresaTabs;