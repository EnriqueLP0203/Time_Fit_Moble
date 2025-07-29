import React, { useState, useContext } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {AuthContext} from '../../context/authContext'

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
  
  const { register } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  console.log('🔍 Contexto de autenticación:', register ? 'Disponible' : 'No disponible');
  console.log('🧭 Navegación disponible:', navigation ? 'Sí' : 'No');


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    console.log('🔍 Validando formulario...');
    console.log('📝 Datos a validar:', formData);
    
    if (!formData.nombre || !formData.apellido || !formData.nombreUsuario || !formData.correo || !formData.contrasena || !formData.confirmarContrasena) {
      console.log('❌ Campos vacíos detectados');
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      console.log('❌ Contraseñas no coinciden');
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    if (formData.contrasena.length < 6) {
      console.log('❌ Contraseña muy corta');
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    console.log('✅ Validación exitosa');
    return true;
  };

  const handleRegister = async() => {
    console.log('🔄 Botón de registro presionado');
    console.log('📝 Datos del formulario:', formData);
    console.log('🧭 Navegación disponible:', navigation ? 'Sí' : 'No');
    
    if (!validateForm()) {
      console.log('❌ Validación falló');
      return;
    }

    console.log('✅ Validación exitosa, iniciando registro...');
    setLoading(true);
    try{
      console.log('📤 Llamando función register...');
      await register(formData.nombre, formData.apellido, formData.nombreUsuario, formData.correo, formData.contrasena);
      console.log('✅ Registro exitoso, navegando al home...');
      
      // Navegar directamente al home después del registro exitoso
      console.log('🧭 Intentando navegar a MainTabs...');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
      console.log('✅ Navegación ejecutada');
      
    }catch(error){
      console.log('❌ Error en registro:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      console.log('🏁 Finalizando handleRegister');
      setLoading(false);
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
                returnKeyType="next"
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
                returnKeyType="next"
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
                returnKeyType="next"
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
                returnKeyType="next"
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
                returnKeyType="next"
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
                returnKeyType="done"
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
            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
              onPress={() => {
                console.log('👆 Botón presionado');
                handleRegister();
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Crear cuenta</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginSection}>
              <Text style={styles.loginQuestion}>¿Ya tienes cuenta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Iniciar sesión</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40, // Add more padding at the bottom for better spacing
  },
  keyboardContainer: {
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
  registerButtonDisabled: {
    opacity: 0.7,
  },
});

export default ScreenCrearCuenta;


