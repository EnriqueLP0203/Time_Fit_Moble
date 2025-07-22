import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createStackNavigator();

const Tabs = createBottomTabNavigator();

import ScreenHome from "./src/screen/home/ScreenHome";
import ScreenCrearCuenta from "./src/screen//login/ScreenCrearCuenta";
import ScreenLogin from "./src/screen/login/ScreenLogin";

import Colaboradores from "./src/screen/Colaboradores";
import GestionMembresias from "./src/screen/GestionMembresias";
import GestionMiembros from "./src/screen/GestionMiembros";
import GestionVentas from "./src/screen/GestionVentas";

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
          elevation: 0,
          height: 60,
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

import { ThemeProvider, useTheme } from './src/context/ThemeContext';

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
        }}>
        <Stack.Screen 
          name="MainTabs" 
          component={MyTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CrearCuenta" 
          component={ScreenCrearCuenta}
        />
        <Stack.Screen 
          name="Login" 
          component={ScreenLogin}
        />
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
