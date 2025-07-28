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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/authContext';

const ScreenLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await login(email, password); 
    } catch (err) {
      Alert.alert('Login fallido', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

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
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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