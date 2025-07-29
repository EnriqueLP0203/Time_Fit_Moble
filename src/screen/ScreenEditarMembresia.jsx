import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/authContext';
import { useTheme } from '../context/ThemeContext';

export default function ScreenEditarMembresia({ navigation, route }) {
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

  const { membership } = route.params;

  useEffect(() => {
    if (membership) {
      setFormData({
        nombre: membership.nombre || '',
        descripcion: membership.descripcion || '',
        precio: membership.precio ? membership.precio.toString() : '',
        duracion: membership.duracion ? membership.duracion.toString() : '',
        color: membership.color || '#FF6B00',
        status: membership.status || 'activo'
      });
    }
  }, [membership]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { nombre, descripcion, precio, duracion } = formData;
    
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    if (!precio || isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) {
      Alert.alert('Error', 'El precio debe ser un número válido mayor a 0');
      return false;
    }
    if (!duracion || isNaN(parseInt(duracion)) || parseInt(duracion) <= 0) {
      Alert.alert('Error', 'La duración debe ser un número válido mayor a 0');
      return false;
    }

    return true;
  };

  const handleUpdateMembership = async () => {
    if (!validateForm()) return;

    if (!activeGym) {
      Alert.alert('Error', 'No hay un gimnasio activo seleccionado');
      return;
    }

    setLoading(true);
    try {
      const membershipData = {
        ...formData,
        precio: parseFloat(formData.precio),
        duracion: parseInt(formData.duracion),
        gym_id: activeGym._id
      };

      console.log('📤 Datos de membresía a actualizar:', membershipData);

      const res = await fetch(`http://192.168.137.1:3000/api/membership/${membership._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(membershipData),
      });

      const data = await res.json();
      console.log('📥 Respuesta del servidor:', data);

      if (res.ok) {
        Alert.alert('Éxito', 'Membresía actualizada correctamente', [
          {
            text: 'OK',
            onPress: async () => {
              await refreshUserData();
              navigation.goBack();
            }
          }
        ]);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('❌ Error al actualizar membresía:', error);
      Alert.alert('Error', 'Error al actualizar la membresía');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMembership = async () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta membresía? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const res = await fetch(`http://192.168.137.1:3000/api/membership/${membership._id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });

              const data = await res.json();

              if (res.ok) {
                Alert.alert('Éxito', 'Membresía eliminada correctamente', [
                  {
                    text: 'OK',
                    onPress: async () => {
                      await refreshUserData();
                      navigation.goBack();
                    }
                  }
                ]);
              } else {
                Alert.alert('Error', data.message);
              }
            } catch (error) {
              console.error('❌ Error al eliminar membresía:', error);
              Alert.alert('Error', 'Error al eliminar la membresía');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
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
          <Text style={[styles.title, { color: colors.text }]}>Editar Membresía</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Información de la Membresía</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Nombre de la membresía"
              placeholderTextColor={colors.textSecondary}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Descripción</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Descripción de la membresía"
              placeholderTextColor={colors.textSecondary}
              value={formData.descripcion}
              onChangeText={(value) => handleInputChange('descripcion', value)}
              multiline
              numberOfLines={3}
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
                placeholder="0.00"
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
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Color</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="#FF6B00"
              placeholderTextColor={colors.textSecondary}
              value={formData.color}
              onChangeText={(value) => handleInputChange('color', value)}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Status */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Estado</Text>
          
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                { backgroundColor: colors.inputBackground },
                formData.status === 'activo' && { backgroundColor: colors.success }
              ]}
              onPress={() => handleInputChange('status', 'activo')}
            >
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={formData.status === 'activo' ? '#FFFFFF' : colors.textSecondary} 
              />
              <Text style={[
                styles.statusText,
                { color: formData.status === 'activo' ? '#FFFFFF' : colors.text }
              ]}>
                Activo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                { backgroundColor: colors.inputBackground },
                formData.status === 'inactivo' && { backgroundColor: colors.error }
              ]}
              onPress={() => handleInputChange('status', 'inactivo')}
            >
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={formData.status === 'inactivo' ? '#FFFFFF' : colors.textSecondary} 
              />
              <Text style={[
                styles.statusText,
                { color: formData.status === 'inactivo' ? '#FFFFFF' : colors.text }
              ]}>
                Inactivo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleUpdateMembership}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={handleDeleteMembership}
            disabled={loading}
          >
            <Text style={styles.deleteButtonText}>Eliminar Membresía</Text>
          </TouchableOpacity>
        </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
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
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtons: {
    marginTop: 20,
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 