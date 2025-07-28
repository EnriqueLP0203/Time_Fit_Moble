import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import ScreenHome from "./src/screen/home/ScreenHome";
import ScreenCrearCuenta from "./src/screen/login/ScreenCrearCuenta";
import ScreenLogin from "./src/screen/login/ScreenLogin";

import Colaboradores from "./src/screen/Colaboradores";
import GestionMembresias from "./src/screen/membresias/GestionMembresias";
import GestionMiembros from "./src/screen/GestionMiembros";
import GestionVentas from "./src/screen/GestionVentas";
import CrearMembresia from "./src/screen/membresias/CrearMembresia";
import DetalleMembresia from "./src/screen/membresias/DetalleMembresia";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

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
            case "Colaboradores":
              iconName = focused ? "people" : "people-outline";
              break;
            case "Membresias":
              iconName = focused ? "card" : "card-outline";
              break;
            case "Miembros":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Ventas":
              iconName = focused ? "cash" : "cash-outline";
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
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 60,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 15,
          elevation: 5,
          paddingBottom: 10,
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
      <Tabs.Screen name="Colaboradores" component={Colaboradores} />
      <Tabs.Screen name="Membresias" component={GestionMembresias} />
      <Tabs.Screen name="Miembros" component={GestionMiembros} />
      <Tabs.Screen name="Ventas" component={GestionVentas} />
    </Tabs.Navigator>
  );
}

function NavigationContent() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MyTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CrearCuenta" component={ScreenCrearCuenta} />
        <Stack.Screen name="Login" component={ScreenLogin} />
        <Stack.Screen name="CrearMembresia" component={CrearMembresia} />
        <Stack.Screen name="DetalleMembresia" component={DetalleMembresia} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function Navegacion() {
  return (
    <ThemeProvider>
      <NavigationContent />
    </ThemeProvider>
  );
}
