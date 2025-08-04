import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/AuthScreens/WelcomeScreen';
import UserTypeScreen from '../screens/AuthScreens/UserTypeScreen';
import RegisterScreen from '../screens/AuthScreens/RegisterScreen';
import LoginScreen from '../screens/AuthScreens/LoginScreen';

import AlumnoTabs from './AlumnoTabs';
import EmpresaTabs from './EmpresaTabs';

import DetallesVacantes from '../screens/HomeScreen/alumno/DetallesVacantes';
import MisSolicitudes from '../screens/HomeScreen/alumno/MisSolicitudes';
import ChatScreen from '../screens/HomeScreen/common/MensajesScreen';

import InfoBasica from '../screens/HomeScreen/alumno/Perfil/InfoBasica';
import Educacion from '../screens/HomeScreen/alumno/Perfil/Educacion';
import Habilidades from '../screens/HomeScreen/alumno/Perfil/Habilidades';
import Reconocimientos from '../screens/HomeScreen/alumno/Perfil/Reconocimientos';

const Stack = createStackNavigator();

const headerStyleCommon = {
  backgroundColor: '#007AFF',
  paddingTop: 50,
  paddingBottom: 20,
  paddingHorizontal: 20,
};

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserType" component={UserTypeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

      <Stack.Screen name="AlumnoInicio" component={AlumnoTabs} options={{ headerShown: false }} />
      <Stack.Screen name="EmpresaInicio" component={EmpresaTabs} options={{ headerShown: false }} />

      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="DetallesVacante"
        component={DetallesVacantes}
        options={{
          headerShown: false,
          presentation: 'modal',
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
        }}
      />

      <Stack.Screen
        name="MisSolicitudes"
        component={MisSolicitudes}
        options={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
        }}
      />

      {['InfoBasica', 'Educacion', 'Habilidades', 'Reconocimientos'].map((screenName) => (
        <Stack.Screen
          key={screenName}
          name={screenName}
          component={
            {
              InfoBasica,
              Educacion,
              Habilidades,
              Reconocimientos,
            }[screenName]
          }
          options={{
            title:
              screenName === 'InfoBasica'
                ? 'Información Básica'
                : screenName === 'Educacion'
                ? 'Educación'
                : screenName === 'Habilidades'
                ? 'Habilidades'
                : 'Reconocimientos',
            headerStyle: headerStyleCommon,
            headerBackTitleStyle: { color: '#fff' },
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
          }}
        />
      ))}
    </Stack.Navigator>
  );
}