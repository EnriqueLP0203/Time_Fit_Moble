import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const ScreenCrearCuenta = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const rutas = useNavigation();
  

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { nombre, apellido, nombreUsuario, correo, contrasena, confirmarContrasena } = formData;

    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    if (!apellido.trim()) {
      Alert.alert('Error', 'El apellido es requerido');
      return false;
    }
    if (!nombreUsuario.trim()) {
      Alert.alert('Error', 'El nombre de usuario es requerido');
      return false;
    }
    if (!correo.trim()) {
      Alert.alert('Error', 'El correo es requerido');
      return false;
    }
    if (!contrasena) {
      Alert.alert('Error', 'La contraseña es requerida');
      return false;
    }
    if (contrasena !== confirmarContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    // Validación de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      Alert.alert('Error', 'Por favor ingresa un correo válido');
      return false;
    }

    // Validación de contraseña (mínimo 6 caracteres)
    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    // Aquí iría tu lógica de registro
    console.log('Register attempt:', formData);
    Alert.alert('Éxito', 'Cuenta creada exitosamente');
  };

  const handleGoogleRegister = () => {
    // Aquí iría tu lógica de registro con Google
    console.log('Google register attempt');
  };

  const handleBackToLogin = () => {
    // Navegar de vuelta al login
    // navigation.goBack();
    console.log('Navigate back to login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      


      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="barbell" size={28} color="#FF6B00" />
            <Text style={styles.logoText}>TIME FIT</Text>
          </View>
          <Text style={styles.subtitle}>Tu Tiempo, Tu Fuerza</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Crear tu cuenta</Text>

          {/* Nombre Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#999"
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Apellido Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#999"
              value={formData.apellido}
              onChangeText={(value) => handleInputChange('apellido', value)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Nombre de Usuario Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor="#999"
              value={formData.nombreUsuario}
              onChangeText={(value) => handleInputChange('nombreUsuario', value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={formData.correo}
              onChangeText={(value) => handleInputChange('correo', value)}
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
              value={formData.contrasena}
              onChangeText={(value) => handleInputChange('contrasena', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#999"
              value={formData.confirmarContrasena}
              onChangeText={(value) => handleInputChange('confirmarContrasena', value)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          {/* Google Register Button */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleRegister}>
            <Text style={styles.googleButtonText}>G</Text>
            <Text style={styles.googleButtonLabel}>Registrarte con Google</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginSection}>
            <Text style={styles.loginQuestion}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={()=> rutas.replace("Login")}>
              <Text style={styles.loginLink}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subtitle: {
    color: '#CCCCCC',
    fontSize: 13,
    fontWeight: '300',
  },
  formSection: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 14,
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
  registerButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  registerButtonText: {
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
    marginBottom: 30,
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
  loginSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  loginQuestion: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 8,
  },
  loginLink: {
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#FF6B00',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 12,
    textAlign: 'center',
  },
});

export default ScreenCrearCuenta;


