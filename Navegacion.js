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
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
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

export default function Navegacion() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
