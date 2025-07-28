// Navegacion.js
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from './src/context/ThemeContext'; // Se mantiene la ruta según tu estructura

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

// Importaciones de pantallas existentes según tu estructura
import ScreenHome from "./src/screen/home/ScreenHome";
import ScreenCrearCuenta from "./src/screen/login/ScreenCrearCuenta"; // Corregida la ruta si tenía doble barra
import ScreenLogin from "./src/screen/login/ScreenLogin";
import ScreenCrearColaborador from "./src/screen/login/ScreenCrearColaborador"; // Nueva pantalla

import Colaboradores from "./src/screen/Colaboradores";
import GestionMembresias from "./src/screen/GestionMembresias";
import GestionMiembros from "./src/screen/GestionMiembros";
import GestionVentas from "./src/screen/GestionVentas";

// ¡NUEVA IMPORTACIÓN DE PANTALLA! La ruta se basa en la que acordamos
import ScreenInfo from "./src/screen/info/ScreenInfo";

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
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}>
        <Stack.Screen
          name="MainTabs"
          component={MyTabs}
          options={{ headerShown: false }} // Oculta el header de este Stack cuando se muestran los Tabs
        />
        <Stack.Screen
          name="CrearCuenta"
          component={ScreenCrearCuenta}
          options={{ headerShown: false }} // Agregado headerShown: false para que no tengan header por defecto si ya manejas el tuyo
        />
        <Stack.Screen
          name="Login"
          component={ScreenLogin}
          options={{ headerShown: false }} // Agregado headerShown: false
        />
        <Stack.Screen
          name="CrearColaborador"
          component={ScreenCrearColaborador}
          options={{
            title: 'Crear Colaborador',
            headerBackTitleVisible: false,
          }}
        />
        {/* ¡NUEVA PANTALLA 'Info' AÑADIDA AQUÍ! */}
        <Stack.Screen
          name="Info" // Este es el nombre que usarás en navigation.navigate('Info', ...)
          component={ScreenInfo}
          options={{
            title: 'Detalles del Miembro', // Título que aparecerá en el header de esta pantalla
            headerBackTitleVisible: false, // Opcional: oculta el texto "Back" en iOS
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function Navegacion() {
  return <NavigationContent />;
}