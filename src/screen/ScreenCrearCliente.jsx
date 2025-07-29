import React, { useState, useContext, useEffect } from 'react';
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

export default function ScreenCrearCliente({ navigation }) {
  const { colors } = useTheme();
  const { userToken, activeGym, refreshUserData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone_number: '',
    birth_date: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    membership_id: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadMemberships();
  }, []);

  useEffect(() => {
    if (activeGym) {
      loadMemberships();
    }
  }, [activeGym]);

  const loadMemberships = async () => {
    try {
      console.log('🔄 Cargando membresías...');
      console.log('Gym activo:', activeGym ? activeGym._id : 'No hay gym activo');
      
      if (!activeGym) {
        console.log('❌ No hay gym activo, no se pueden cargar membresías');
        setMemberships([]);
        return;
      }

      const res = await fetch(`http://192.168.137.1:3000/api/membership/gym/${activeGym._id}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      const data = await res.json();
      console.log('📡 Respuesta del servidor:', data);
      
      if (res.ok) {
        setMemberships(Array.isArray(data) ? data : []);
        console.log('✅ Membresías cargadas:', Array.isArray(data) ? data.length : 0);
      } else {
        console.error('❌ Error loading memberships:', data.message);
        setMemberships([]);
      }
    } catch (error) {
      console.error('❌ Error loading memberships:', error);
      setMemberships([]);
    }
  };

  const formatDateInput = (text) => {
    const numbers = text.replace(/\D/g, '');
    
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return numbers.slice(0, 4) + '-' + numbers.slice(4);
    } else {
      return numbers.slice(0, 4) + '-' + numbers.slice(4, 6) + '-' + numbers.slice(6, 8);
    }
  };

  const handleDateInputChange = (field, value) => {
    const formattedValue = formatDateInput(value);
    
    if (formattedValue.length <= 10) {
      setFormData(prev => ({
        ...prev,
        [field]: formattedValue
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Si se selecciona una membresía, calcular automáticamente la fecha de fin
    if (field === 'membership_id') {
      const membership = memberships.find(m => m._id === value);
      if (membership && formData.start_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + membership.duracion);
        
        setFormData(prev => ({
          ...prev,
          membership_id: value,
          end_date: endDate.toISOString().split('T')[0]
        }));
      }
    }

    // Si se cambia la fecha de inicio y hay una membresía seleccionada, calcular la fecha de fin
    if (field === 'start_date' && formData.membership_id) {
      const membership = memberships.find(m => m._id === formData.membership_id);
      if (membership && validateDateInput(value)) {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + membership.duracion);
        
        setFormData(prev => ({
          ...prev,
          start_date: value,
          end_date: endDate.toISOString().split('T')[0]
        }));
      }
    }
  };

  const validateDateInput = (dateString) => {
    if (!dateString || dateString.length !== 10) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const validateForm = () => {
    const { name, lastname, email, phone_number, birth_date, emergency_contact_name, emergency_contact_phone, membership_id, start_date, end_date } = formData;
    
    if (!name || !lastname || !email || !phone_number || !birth_date || !emergency_contact_name || !emergency_contact_phone || !membership_id || !start_date || !end_date) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }
    
    const age = validateAge(birth_date);
    if (age < 18) {
      Alert.alert('Error', 'El cliente debe tener al menos 18 años');
      return false;
    }
    
    if (!membership_id) {
      Alert.alert('Error', 'Debes seleccionar una membresía');
      return false;
    }
    if (!start_date || !validateDateInput(start_date)) {
      Alert.alert('Error', 'La fecha de inicio debe tener el formato YYYY-MM-DD');
      return false;
    }
    if (!end_date || !validateDateInput(end_date)) {
      Alert.alert('Error', 'La fecha de fin debe tener el formato YYYY-MM-DD');
      return false;
    }

    return true;
  };

  const handleCreateCustomer = async () => {
    if (!validateForm()) return;

    if (!activeGym) {
      Alert.alert('Error', 'No hay un gimnasio activo seleccionado');
      return;
    }

    setLoading(true);
    try {
      const customerData = {
        ...formData,
        gym_id: activeGym._id,
        emergency_contact: {
          name: formData.emergency_contact_name,
          phone: formData.emergency_contact_phone
        }
      };

      // Eliminar los campos individuales ya que ahora están en emergency_contact
      delete customerData.emergency_contact_name;
      delete customerData.emergency_contact_phone;

      console.log('📤 Datos del cliente a enviar:', customerData);

      const res = await fetch('http://192.168.137.1:3000/api/customer/crear', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(customerData),
      });

      const data = await res.json();
      console.log('📥 Respuesta del servidor:', data);

      if (res.ok) {
        Alert.alert('Éxito', 'Cliente creado correctamente', [
          {
            text: 'OK',
            onPress: async () => {
              // Recargar datos del usuario para actualizar los clientes
              await refreshUserData();
              navigation.goBack();
            }
          }
        ]);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('❌ Error al crear cliente:', error);
      Alert.alert('Error', 'Error al crear el cliente');
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
          <Text style={[styles.title, { color: colors.text }]}>Crear Cliente</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Información Personal</Text>
          
          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Nombre del cliente"
                placeholderTextColor={colors.textSecondary}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Apellido</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Apellido del cliente"
                placeholderTextColor={colors.textSecondary}
                value={formData.lastname}
                onChangeText={(value) => handleInputChange('lastname', value)}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="email@ejemplo.com"
                placeholderTextColor={colors.textSecondary}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Teléfono</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="+1 234 567 8900"
                placeholderTextColor={colors.textSecondary}
                value={formData.phone_number}
                onChangeText={(value) => handleInputChange('phone_number', value)}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Fecha de nacimiento</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
              value={formData.birth_date}
              onChangeText={(value) => handleDateInputChange('birth_date', value)}
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contacto de Emergencia</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre del contacto</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Nombre del contacto de emergencia"
              placeholderTextColor={colors.textSecondary}
              value={formData.emergency_contact_name}
              onChangeText={(value) => handleInputChange('emergency_contact_name', value)}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Teléfono del contacto</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="+1 234 567 8900"
              placeholderTextColor={colors.textSecondary}
              value={formData.emergency_contact_phone}
              onChangeText={(value) => handleInputChange('emergency_contact_phone', value)}
              keyboardType="phone-pad"
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Membership */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Membresía</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.membershipHeader}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Seleccionar membresía</Text>
              <TouchableOpacity
                style={[styles.refreshButton, { backgroundColor: colors.primary }]}
                onPress={loadMemberships}
              >
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.membershipContainer}>
              {memberships && memberships.length > 0 ? (
                memberships.map((membership) => (
                  <TouchableOpacity
                    key={membership._id}
                    style={[
                      styles.membershipOption,
                      { backgroundColor: colors.inputBackground },
                      formData.membership_id === membership._id && styles.membershipOptionSelected
                    ]}
                    onPress={() => handleInputChange('membership_id', membership._id)}
                  >
                    <View style={styles.membershipInfo}>
                      <Text style={[
                        styles.membershipName,
                        { color: colors.text },
                        formData.membership_id === membership._id && styles.membershipTextSelected
                      ]}>
                        {membership.nombre}
                      </Text>
                      <Text style={[
                        styles.membershipPrice,
                        { color: colors.textSecondary },
                        formData.membership_id === membership._id && styles.membershipTextSelected
                      ]}>
                        ${membership.precio} - {membership.duracion} días
                      </Text>
                    </View>
                    {formData.membership_id === membership._id && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noMembershipsContainer}>
                  <Ionicons name="card-outline" size={32} color={colors.textSecondary} />
                  <Text style={[styles.noMembershipsText, { color: colors.textSecondary }]}>
                    No hay membresías disponibles
                  </Text>
                  <Text style={[styles.noMembershipsSubtext, { color: colors.textSecondary }]}>
                    Primero debes crear una membresía
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Fecha de inicio</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
                value={formData.start_date}
                onChangeText={(value) => handleDateInputChange('start_date', value)}
                keyboardType="numeric"
                maxLength={10}
                returnKeyType="next"
              />
            </View>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Fecha de fin</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
                value={formData.end_date}
                onChangeText={(value) => handleDateInputChange('end_date', value)}
                keyboardType="numeric"
                maxLength={10}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleCreateCustomer}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Creando...' : 'Crear Cliente'}
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
  membershipContainer: {
    marginBottom: 20,
  },
  membershipOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  membershipOptionSelected: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFF3E0',
  },
  membershipInfo: {
    flex: 1,
  },
  membershipName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  membershipPrice: {
    fontSize: 14,
  },
  membershipTextSelected: {
    color: '#FF6B00',
  },
  noMembershipsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noMembershipsText: {
    fontSize: 16,
    marginTop: 10,
  },
  noMembershipsSubtext: {
    fontSize: 14,
    marginTop: 5,
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
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
  },
}); 