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

export default function ScreenEditarCliente({ navigation, route }) {
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
    end_date: '',
    status: 'active'
  });

  const { customer } = route.params;

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        lastname: customer.lastname || '',
        email: customer.email || '',
        phone_number: customer.phone_number || '',
        birth_date: customer.birth_date ? new Date(customer.birth_date).toISOString().split('T')[0] : '',
        emergency_contact_name: customer.emergency_contact?.name || '',
        emergency_contact_phone: customer.emergency_contact?.phone || '',
        membership_id: customer.membership_id?._id || '',
        start_date: customer.start_date ? new Date(customer.start_date).toISOString().split('T')[0] : '',
        end_date: customer.end_date ? new Date(customer.end_date).toISOString().split('T')[0] : '',
        status: customer.status || 'active'
      });
    }
    loadMemberships();
  }, [customer]);

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
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
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

  const handleUpdateCustomer = async () => {
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

      console.log('📤 Datos del cliente a actualizar:', customerData);

      const res = await fetch(`http://192.168.137.1:3000/api/customer/${customer._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(customerData),
      });

      const data = await res.json();
      console.log('📥 Respuesta del servidor:', data);

      if (res.ok) {
        Alert.alert('Éxito', 'Cliente actualizado correctamente', [
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
      console.error('❌ Error al actualizar cliente:', error);
      Alert.alert('Error', 'Error al actualizar el cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const res = await fetch(`http://192.168.137.1:3000/api/customer/${customer._id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              });

              const data = await res.json();

              if (res.ok) {
                Alert.alert('Éxito', 'Cliente eliminado correctamente', [
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
              console.error('❌ Error al eliminar cliente:', error);
              Alert.alert('Error', 'Error al eliminar el cliente');
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
          <Text style={[styles.title, { color: colors.text }]}>Editar Cliente</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Personal Information */}
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
                placeholder="Nombre"
                placeholderTextColor={colors.textSecondary}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
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
                placeholder="Apellido"
                placeholderTextColor={colors.textSecondary}
                value={formData.lastname}
                onChangeText={(value) => handleInputChange('lastname', value)}
                autoCapitalize="words"
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
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Seleccionar membresía</Text>
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
                returnKeyType="next"
              />
            </View>
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
                formData.status === 'active' && { backgroundColor: colors.success }
              ]}
              onPress={() => handleInputChange('status', 'active')}
            >
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={formData.status === 'active' ? '#FFFFFF' : colors.textSecondary} 
              />
              <Text style={[
                styles.statusText,
                { color: formData.status === 'active' ? '#FFFFFF' : colors.text }
              ]}>
                Activo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                { backgroundColor: colors.inputBackground },
                formData.status === 'inactive' && { backgroundColor: colors.error }
              ]}
              onPress={() => handleInputChange('status', 'inactive')}
            >
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={formData.status === 'inactive' ? '#FFFFFF' : colors.textSecondary} 
              />
              <Text style={[
                styles.statusText,
                { color: formData.status === 'inactive' ? '#FFFFFF' : colors.text }
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
            onPress={handleUpdateCustomer}
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
            onPress={handleDeleteCustomer}
            disabled={loading}
          >
            <Text style={styles.deleteButtonText}>Eliminar Cliente</Text>
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
  membershipContainer: {
    marginTop: 10,
  },
  membershipOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  membershipOptionSelected: {
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  membershipInfo: {
    flex: 1,
  },
  membershipName: {
    fontSize: 16,
    fontWeight: '600',
  },
  membershipPrice: {
    fontSize: 14,
    marginTop: 2,
  },
  membershipTextSelected: {
    color: '#FF6B00',
  },
  noMembershipsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noMembershipsText: {
    fontSize: 16,
    marginTop: 10,
  },
  noMembershipsSubtext: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
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