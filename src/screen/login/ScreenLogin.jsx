import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/authContext';

const ScreenLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  console.log('🧭 Login - Navegación disponible:', navigation ? 'Sí' : 'No');
  console.log('🔍 Login - Contexto disponible:', login ? 'Sí' : 'No');

  const handleLogin = async () => {
    console.log('🔄 Botón de login presionado');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password ? '***' : 'Vacío');
    console.log('🧭 Navegación disponible:', navigation ? 'Sí' : 'No');
    
    if (!email || !password) {
      console.log('❌ Campos vacíos');
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    console.log('✅ Validación exitosa, iniciando login...');
    try {
      console.log('📤 Llamando función login...');
      await login(email, password);
      console.log('✅ Login exitoso, navegando al home...');
      
      // Navegar directamente al home después del login exitoso
      console.log('🧭 Intentando navegar a MainTabs...');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
      console.log('✅ Navegación ejecutada');
      
    } catch (err) {
      console.log('❌ Error en login:', err.message);
      Alert.alert('Login fallido', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="barbell" size={32} color="#FF6B00" />
              <Text style={styles.logoText}>TIME FIT</Text>
            </View>
            <Text style={styles.subtitle}>Tu Tiempo, Tu Fuerza</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Acceder a tu cuenta</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerSection}>
              <Text style={styles.registerQuestion}>¿Aún no tienes cuenta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CrearCuenta')}>
                <Text style={styles.registerLink}>Registrarte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20, // Add some padding at the bottom for the register link
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subtitle: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '300',
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333333',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  googleButtonText: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  googleButtonLabel: {
    color: '#333333',
    fontSize: 14,
  },
  registerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerQuestion: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 8,
  },
  registerLink: {
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#FF6B00',
    borderRadius: 8,
    paddingHorizontal: 40,
    paddingVertical: 12,
    textAlign: 'center',
  },
});

export default ScreenLogin;