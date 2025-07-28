import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createStackNavigator();

const Tabs = createBottomTabNavigator();

import { AuthContext } from "./src/context/authContext";
import ScreenLogin from "./src/screen/login/ScreenLogin";
import ScreenCrearCuenta from "./src/screen//login/ScreenCrearCuenta";

import ScreenHome from "./src/screen/home/ScreenHome";
import GestionMembresias from "./src/screen/GestionMembresias";
import GestionMiembros from "./src/screen/GestionMiembros";
import Perfil from "./src/screen/Perfil";

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CrearCuenta" component={ScreenCrearCuenta} />
      <Stack.Screen name="Login" component={ScreenLogin} />
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
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 60,
          position: "absolute",
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
      <Tabs.Screen name="Membresias" component={GestionMembresias} />
      <Tabs.Screen name="Clientes" component={GestionMiembros} />
      <Tabs.Screen name="Perfil" component={Perfil} />
    </Tabs.Navigator>
  );
}

import { ThemeProvider, useTheme } from "./src/context/ThemeContext"; //importacion de context donde se almacena el tema oscuro y claro
import { useContext } from "react";

function NavigationContent() {
  const { colors } = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function Navegacion() {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) return null;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <Stack.Screen name="MainTabs" component={MyTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={ScreenLogin} />
          <Stack.Screen name="CrearCuenta" component={ScreenCrearCuenta} />
        </>
      )}
    </Stack.Navigator>
  );
}
