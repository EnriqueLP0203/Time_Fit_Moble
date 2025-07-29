import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/authContext';
import { useTheme } from '../context/ThemeContext';

export default function ScreenCrearMembresia({ navigation }) {
  const { colors } = useTheme();
  const { userToken, activeGym, refreshUserData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracion: '',
    color: '#FF6B00',
    status: 'activo'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    if (!formData.precio || isNaN(Number(formData.precio)) || Number(formData.precio) <= 0) {
      Alert.alert('Error', 'El precio debe ser un número válido mayor a 0');
      return false;
    }
    if (!formData.duracion || isNaN(Number(formData.duracion)) || Number(formData.duracion) <= 0) {
      Alert.alert('Error', 'La duración debe ser un número válido mayor a 0');
      return false;
    }
    return true;
  };

  const handleCreateMembership = async () => {
    if (!validateForm()) return;

    if (!activeGym) {
      Alert.alert('Error', 'No hay un gimnasio activo seleccionado');
      return;
    }

    setLoading(true);
    try {
      const membershipData = {
        ...formData,
        gym_id: activeGym._id,
        precio: Number(formData.precio),
        duracion: Number(formData.duracion)
      };

      const res = await fetch('http://192.168.137.1:3000/api/membership/crear', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(membershipData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Éxito', 'Membresía creada correctamente', [
          {
            text: 'OK',
            onPress: async () => {
              // Recargar datos del usuario para actualizar las membresías
              await refreshUserData();
              navigation.goBack();
            }
          }
        ]);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al crear la membresía');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Crear Membresía</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Información de la Membresía</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre de la membresía</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Ej: Membresía Mensual"
              placeholderTextColor={colors.textSecondary}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Descripción (opcional)</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Describe los beneficios de esta membresía"
              placeholderTextColor={colors.textSecondary}
              value={formData.descripcion}
              onChangeText={(value) => handleInputChange('descripcion', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Precio</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="$0.00"
                placeholderTextColor={colors.textSecondary}
                value={formData.precio}
                onChangeText={(value) => handleInputChange('precio', value)}
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Duración (días)</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="30"
                placeholderTextColor={colors.textSecondary}
                value={formData.duracion}
                onChangeText={(value) => handleInputChange('duracion', value)}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleCreateMembership}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Creando...' : 'Crear Membresía'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 