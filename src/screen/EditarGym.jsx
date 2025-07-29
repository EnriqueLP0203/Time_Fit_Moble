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
import { AuthContext } from "../context/authContext";
import { useTheme } from '../context/ThemeContext';

export default function EditarGym({ navigation, route }) {
  const { gym } = route.params;
  const { userToken, loadUserDataWithRetry } = useContext(AuthContext);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: gym?.name || '',
    address: gym?.address || '',
    city: gym?.city || '',
    country: gym?.country || '',
    phone: gym?.phone || '',
    opening_time: gym?.opening_time || '',
    closing_time: gym?.closing_time || '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre del gimnasio es requerido');
      return false;
    }
    if (!formData.opening_time.trim()) {
      Alert.alert('Error', 'La hora de apertura es requerida');
      return false;
    }
    if (!formData.closing_time.trim()) {
      Alert.alert('Error', 'La hora de cierre es requerida');
      return false;
    }
    return true;
  };

  const handleUpdateGym = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://192.168.137.1:3000/api/gym/${gym._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Éxito', 'Gimnasio actualizado correctamente');
        await loadUserDataWithRetry();
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Error al actualizar el gimnasio');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar el gimnasio');
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
          <Text style={[styles.title, { color: colors.text }]}>Editar Gimnasio</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Información del Gimnasio</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre del Gimnasio</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Nombre del gimnasio"
              placeholderTextColor={colors.textSecondary}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Dirección</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Dirección del gimnasio"
              placeholderTextColor={colors.textSecondary}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Ciudad</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Ciudad"
                placeholderTextColor={colors.textSecondary}
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>País</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="País"
                placeholderTextColor={colors.textSecondary}
                value={formData.country}
                onChangeText={(value) => handleInputChange('country', value)}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Teléfono</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Teléfono del gimnasio"
              placeholderTextColor={colors.textSecondary}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Hora de Apertura</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="08:00"
                placeholderTextColor={colors.textSecondary}
                value={formData.opening_time}
                onChangeText={(value) => handleInputChange('opening_time', value)}
                returnKeyType="next"
              />
            </View>

            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Hora de Cierre</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="22:00"
                placeholderTextColor={colors.textSecondary}
                value={formData.closing_time}
                onChangeText={(value) => handleInputChange('closing_time', value)}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleUpdateGym}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
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
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 