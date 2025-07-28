import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/authContext';
import { ThemeProvider } from './src/context/ThemeContext'; // 👈 aquí
import Navigation from './Navegacion';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider> {/* 👈 Asegúrate que esté aquí */}
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
