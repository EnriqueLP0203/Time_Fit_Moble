import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './src/context/authContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Import screens
import ScreenLogin from './src/screen/login/ScreenLogin';
import ScreenCrearCuenta from './src/screen/login/ScreenCrearCuenta';
import ScreenCrearGym from './src/screen/ScreenCrearGym';
import ScreenCrearMembresia from './src/screen/ScreenCrearMembresia';
import ScreenCrearCliente from './src/screen/ScreenCrearCliente';
import ScreenEditarMembresia from './src/screen/ScreenEditarMembresia';
import ScreenEditarCliente from './src/screen/ScreenEditarCliente';
import ScreenHome from './src/screen/home/ScreenHome';
import Perfil from './src/screen/Perfil';
import EditarPerfil from './src/screen/EditarPerfil';
import EditarGym from './src/screen/EditarGym';
import GestionMembresias from './src/screen/GestionMembresias';
import GestionMiembros from './src/screen/GestionMiembros';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CrearCuenta" component={ScreenCrearCuenta} />
      <Stack.Screen name="Login" component={ScreenLogin} />
      <Stack.Screen name="CrearGym" component={ScreenCrearGym} />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PerfilMain" component={Perfil} />
      <Stack.Screen name="CrearGym" component={ScreenCrearGym} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
      <Stack.Screen name="EditarGym" component={EditarGym} />
    </Stack.Navigator>
  );
}

function MyTabs() {
  const { colors } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;

            case "Membresias":
              iconName = focused ? "card" : "card-outline";
              break;
            case "Clientes":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Perfil":
              iconName = focused ? "person-circle-sharp" : "person-circle-outline";
              break;


            default:
              iconName = "alert-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        tabBarLabelStyle: {
          marginBottom: 5,
          fontSize: 12,
        },
      })}
    >
      <Tabs.Screen name="Home" component={ScreenHome} />
      <Tabs.Screen name="Membresias" component={MembresiasStack} />
      <Tabs.Screen name="Clientes" component={ClientesStack} />
      <Tabs.Screen name="Perfil" component={PerfilStack} />
    </Tabs.Navigator>
  );
}

function MembresiasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GestionMembresias" component={GestionMembresias} />
      <Stack.Screen name="EditarMembresia" component={ScreenEditarMembresia} />
    </Stack.Navigator>
  );
}

function ClientesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GestionMiembros" component={GestionMiembros} />
      <Stack.Screen name="EditarCliente" component={ScreenEditarCliente} />
    </Stack.Navigator>
  );
}

export default function Navegacion() {
  const { userToken, loading, needsGym } = useContext(AuthContext);

  console.log('🧭 Navegación - userToken:', userToken ? 'Presente' : 'Ausente');
  console.log('🧭 Navegación - loading:', loading);
  console.log('🧭 Navegación - needsGym:', needsGym);

  if (loading) {
    console.log('⏳ Navegación - Mostrando loading...');
    return null;
  }
  
  console.log('🎯 Navegación - Renderizando navegación principal');
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <>
          <Stack.Screen name="MainTabs" component={MyTabs} />
          <Stack.Screen name="CrearGym" component={ScreenCrearGym} />
          <Stack.Screen name="CrearMembresia" component={ScreenCrearMembresia} />
          <Stack.Screen name="CrearCliente" component={ScreenCrearCliente} />
          <Stack.Screen name="Login" component={ScreenLogin} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={ScreenLogin} />
          <Stack.Screen name="CrearCuenta" component={ScreenCrearCuenta} />
        </>
      )}
    </Stack.Navigator>
  );
}
